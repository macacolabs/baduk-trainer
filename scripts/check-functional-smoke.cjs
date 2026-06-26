const childProcess = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const requestedUrl = valueArg("--url");
const headed = args.includes("--headed");
const outDir = path.join(root, ".gstack", "qa-reports", "screenshots");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function valueArg(name) {
  const raw = args.find((arg) => arg.startsWith(`${name}=`));
  return raw ? raw.slice(name.length + 1) : null;
}

function fail(message) {
  console.error(`Functional smoke failed: ${message}`);
  process.exitCode = 1;
}

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopProcess(processHandle) {
  if (!processHandle || processHandle.killed) return;
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 2000);
    processHandle.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
    processHandle.kill();
  });
}

function removeDirWithRetry(dir) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 4) throw error;
    }
  }
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

function safeJoin(base, requestPath) {
  const cleanPath = decodeURIComponent(requestPath.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const fullPath = path.resolve(base, cleanPath);
  if (!fullPath.startsWith(base)) return null;
  return fullPath;
}

async function startStaticServer() {
  const port = await getFreePort();
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const fullPath = safeJoin(root, url.pathname);
    if (!fullPath || !fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "cache-control": "no-store",
      "content-type": mimeTypes[path.extname(fullPath)] || "application/octet-stream",
    });
    fs.createReadStream(fullPath).pipe(res);
  });

  await new Promise((resolve, reject) => {
    server.listen(port, "127.0.0.1", resolve);
    server.on("error", reject);
  });

  return {
    baseUrl: `http://127.0.0.1:${port}/`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function requestJson(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function waitForChrome(debugPort) {
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try {
      const version = await requestJson(`http://127.0.0.1:${debugPort}/json/version`);
      if (version.webSocketDebuggerUrl) {
        try {
          const page = await requestJson(`http://127.0.0.1:${debugPort}/json/new?about:blank`, "PUT");
          if (page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
        } catch (_) {
          const pages = await requestJson(`http://127.0.0.1:${debugPort}/json/list`);
          const page = pages.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
          if (page) return page.webSocketDebuggerUrl;
        }
      }
    } catch (_) {
      await sleep(250);
    }
  }
  throw new Error("Chrome remote debugging endpoint did not become ready.");
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
      this.ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.id && this.pending.has(message.id)) {
          const { resolve, reject } = this.pending.get(message.id);
          this.pending.delete(message.id);
          if (message.error) reject(new Error(message.error.message));
          else resolve(message.result || {});
          return;
        }
        if (message.method) this.events.push(message);
      });
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async eval(expression, awaitPromise = false) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails) {
      const text = result.exceptionDetails.text || "evaluation failed";
      throw new Error(text);
    }
    return result.result?.value;
  }

  async clickAt(x, y) {
    await this.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
    await this.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  }

  async screenshot(fileName) {
    const result = await this.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(result.data, "base64"));
    return filePath;
  }

  close() {
    this.ws.close();
  }
}

async function waitFor(client, expression, label, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const ok = await client.eval(`Boolean(${expression})`);
    if (ok) return;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}.`);
}

function script(fn) {
  return `(${fn.toString()})()`;
}

function seriousConsoleEvents(events) {
  return events.filter((event) => {
    if (event.method === "Runtime.exceptionThrown") return true;
    if (event.method === "Log.entryAdded") return event.params?.entry?.level === "error";
    if (event.method === "Runtime.consoleAPICalled") return event.params?.type === "error";
    return false;
  });
}

function describeConsoleEvent(event) {
  if (event.method === "Runtime.exceptionThrown") {
    return event.params?.exceptionDetails?.exception?.description || event.params?.exceptionDetails?.text || "Runtime exception";
  }
  if (event.method === "Log.entryAdded") {
    const entry = event.params?.entry || {};
    return `${entry.level || "log"}: ${entry.text || entry.url || "Log entry"}`;
  }
  if (event.method === "Runtime.consoleAPICalled") {
    const args = event.params?.args || [];
    const text = args.map((arg) => arg.value || arg.description || "").filter(Boolean).join(" ");
    return `${event.params?.type || "console"}: ${text || "Console call"}`;
  }
  return event.method;
}

async function runChecks(client, url) {
  const checks = [];
  const pass = (message) => checks.push(message);

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send("Page.navigate", { url });
  await waitFor(client, "document.readyState === 'complete'", "document load");
  await waitFor(client, "document.querySelectorAll('.point').length > 0", "board render");
  await sleep(300);

  const landing = await client.eval(script(() => ({
    title: document.querySelector("h1")?.textContent.trim(),
    lessonStep: document.querySelector("#lessonStep")?.textContent.trim(),
    pointCount: document.querySelectorAll(".point").length,
    targetCount: document.querySelectorAll(".point.target").length,
    terms: document.querySelector("#termsPanel summary strong")?.textContent.trim(),
    consoleWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  })));
  check(landing.title === "큰돌", "홈 제목이 큰돌이 아닙니다.");
  check(landing.pointCount === 81, `배우기 기본 보드가 9줄이 아닙니다: ${landing.pointCount}`);
  check(landing.targetCount > 0, "배우기 정답 후보 표시가 없습니다.");
  check(/\d+개 \+ \d+문제/.test(landing.terms || ""), "용어/문제 수 요약이 보이지 않습니다.");
  check(landing.consoleWidth <= landing.viewportWidth + 2, "데스크톱 첫 화면에 가로 스크롤이 있습니다.");
  pass("배우기 첫 화면, 문제 보드, 정답 후보, 용어 요약 로드");

  await client.eval("document.querySelector('#showAnswer').click()");
  await waitFor(client, "!document.querySelector('#answerNote').classList.contains('hidden')", "answer note");
  const answerState = await client.eval(script(() => ({
    answerText: document.querySelector("#answerNote")?.textContent.trim(),
    answerMarks: document.querySelectorAll(".point.answer").length,
  })));
  check(answerState.answerText.length > 10, "정답 설명이 충분히 표시되지 않습니다.");
  check(answerState.answerMarks > 0, "정답 위치 표시가 없습니다.");
  pass("정답 보기 버튼과 정답 위치 표시");

  const beforeLesson = landing.lessonStep;
  await client.eval("document.querySelector('#nextLesson').click()");
  await sleep(150);
  const afterLesson = await client.eval("document.querySelector('#lessonStep').textContent.trim()");
  check(beforeLesson !== afterLesson, "다음 문제 버튼이 진도를 바꾸지 못했습니다.");
  pass("다음 문제 이동");

  await client.eval("document.querySelector('[data-mode=\"local\"]').click()");
  await waitFor(client, "!document.querySelector('#gamePanel').classList.contains('hidden')", "local game panel");
  await waitFor(client, "document.querySelectorAll('.point').length === 361", "local 19x19 board");
  const localFirst = await pointCenter(client, "10행 10열");
  await client.clickAt(localFirst.x, localFirst.y);
  await sleep(150);
  const localSecond = await pointCenter(client, "10행 11열");
  await client.clickAt(localSecond.x, localSecond.y);
  await sleep(150);
  const localMove = await client.eval(script(() => ({
    stones: document.querySelectorAll(".stone").length,
    black: document.querySelectorAll(".stone.black").length,
    white: document.querySelectorAll(".stone.white").length,
    undoDisabled: document.querySelector("#undoMove")?.disabled,
    boardLabel: document.querySelector("#boardLabel")?.textContent.trim(),
  })));
  check(localMove.stones === 2, `2인 대국에서 두 수가 정확히 올라가지 않았습니다: 돌 ${localMove.stones}개`);
  check(localMove.black === 1 && localMove.white === 1, `2인 대국 흑/백 교대가 맞지 않습니다: 흑 ${localMove.black}, 백 ${localMove.white}`);
  check(!localMove.undoDisabled, "2인 대국 후 되돌리기 버튼이 비활성입니다.");
  check(localMove.boardLabel.includes("2인"), "2인 대국 라벨이 표시되지 않습니다.");
  pass("바둑 2인 대국 착수, 흑백 교대, 되돌리기 활성");

  await client.eval("document.querySelector('[data-mode=\"ai\"]').click()");
  await waitFor(client, "!document.querySelector('#gamePanel').classList.contains('hidden')", "AI game panel");
  await waitFor(client, "document.querySelectorAll('.point').length === 361", "19x19 board");
  const badukAlignment = await boardAlignment(client);
  check(badukAlignment.maxDiff <= 1.5, `19줄 보드 격자와 착수점 중심 차이가 큽니다: ${badukAlignment.maxDiff.toFixed(2)}px`);
  pass("바둑 AI 대국 19줄 보드와 격자/착수점 정렬");

  const badukPoint = await pointCenter(client, "10행 10열");
  await client.clickAt(badukPoint.x, badukPoint.y);
  await sleep(850);
  const badukMove = await client.eval(script(() => ({
    stones: document.querySelectorAll(".stone").length,
    turn: document.querySelector("#turnText")?.textContent.trim(),
    status: document.querySelector("#statusTitle")?.textContent.trim(),
    undoDisabled: document.querySelector("#undoMove")?.disabled,
  })));
  check(badukMove.stones >= 2, `바둑 AI 응수가 보이지 않습니다: 돌 ${badukMove.stones}개`);
  check(badukMove.turn === "흑", "AI 응수 후 흑 차례로 돌아오지 않았습니다.");
  check(!badukMove.undoDisabled, "대국 후 되돌리기 버튼이 비활성입니다.");
  pass("바둑 AI 착수, AI 응수, 차례 복귀");

  await client.eval("document.querySelector('#undoMove').click()");
  await sleep(150);
  const afterUndo = await client.eval("document.querySelectorAll('.stone').length");
  check(afterUndo < badukMove.stones, "되돌리기가 돌 수를 줄이지 못했습니다.");
  pass("되돌리기");

  await client.eval("document.querySelector('[data-game-type=\"omok\"]').click()");
  await waitFor(client, "document.querySelectorAll('.point').length === 225", "15x15 omok board");
  const omokUi = await client.eval(script(() => ({
    help: document.querySelector("#gameTypeHelp")?.textContent.trim(),
    rule: document.querySelector("#ruleTitle")?.textContent.trim(),
    levelCards: document.querySelectorAll(".omok-ai-card").length,
    boardSize: document.querySelector("#boardSize")?.value,
  })));
  check(omokUi.help.includes("오목"), "오목 설명이 표시되지 않습니다.");
  check(omokUi.rule.includes("오목"), "오목 룰 제목이 표시되지 않습니다.");
  check(omokUi.levelCards === 4, `오목 난이도 카드 수가 맞지 않습니다: ${omokUi.levelCards}`);
  check(omokUi.boardSize === "15", `오목 기본 판 크기가 15줄이 아닙니다: ${omokUi.boardSize}`);
  const omokAlignment = await boardAlignment(client);
  check(omokAlignment.maxDiff <= 1.5, `15줄 오목 보드 격자와 착수점 중심 차이가 큽니다: ${omokAlignment.maxDiff.toFixed(2)}px`);
  pass("오목 전환, 15줄 기본판, 난이도 카드, 정렬");

  const omokPoint = await pointCenter(client, "8행 8열");
  await client.clickAt(omokPoint.x, omokPoint.y);
  await sleep(850);
  const omokMove = await client.eval(script(() => ({
    stones: document.querySelectorAll(".stone").length,
    black: document.querySelector("#blackCaps")?.textContent.trim(),
    white: document.querySelector("#whiteCaps")?.textContent.trim(),
    turn: document.querySelector("#turnText")?.textContent.trim(),
  })));
  check(omokMove.stones >= 2, `오목 AI 응수가 보이지 않습니다: 돌 ${omokMove.stones}개`);
  check(Number(omokMove.black) >= 1 && Number(omokMove.white) >= 1, "오목 돌 개수 표시가 갱신되지 않습니다.");
  check(omokMove.turn === "흑", "오목 AI 응수 후 흑 차례로 돌아오지 않았습니다.");
  pass("오목 AI 착수, AI 응수, 돌 개수 표시");

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await client.send("Page.navigate", { url });
  await waitFor(client, "document.readyState === 'complete'", "mobile load");
  await waitFor(client, "document.querySelectorAll('.point').length > 0", "mobile board render");
  await sleep(300);
  const mobile = await client.eval(script(() => {
    const board = document.querySelector("#board").getBoundingClientRect();
    const nav = document.querySelector("#mobileNav").getBoundingClientRect();
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      boardWidth: board.width,
      boardLeft: board.left,
      boardRight: board.right,
      mobileNavVisible: nav.width > 0 && nav.height > 0,
    };
  }));
  check(mobile.scrollWidth <= mobile.viewportWidth + 2, `모바일 가로 스크롤이 있습니다: ${mobile.scrollWidth}/${mobile.viewportWidth}`);
  check(mobile.boardLeft >= -1 && mobile.boardRight <= mobile.viewportWidth + 1, "모바일 보드가 화면 밖으로 나갑니다.");
  check(mobile.mobileNavVisible, "모바일 빠른 이동 바가 보이지 않습니다.");
  pass("모바일 폭에서 가로 스크롤 없음, 보드 화면 안 배치, 모바일 내비 표시");

  const desktopShot = await client.screenshot("functional-smoke-mobile.png");
  const consoleErrors = seriousConsoleEvents(client.events);
  check(consoleErrors.length === 0, `콘솔 오류가 있습니다: ${consoleErrors.map(describeConsoleEvent).join(" | ")}`);
  pass("콘솔 오류 없음");

  return { checks, screenshots: [desktopShot] };
}

async function pointCenter(client, label) {
  const point = await client.eval(`(() => {
    const point = [...document.querySelectorAll('.point')].find((item) => item.getAttribute('aria-label') === ${JSON.stringify(label)});
    if (!point) return null;
    const rect = point.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  check(point, `착수점 ${label}을 찾을 수 없습니다.`);
  return point;
}

async function boardAlignment(client) {
  return client.eval(script(() => {
    const verticals = [...document.querySelectorAll(".line.vertical")];
    const horizontals = [...document.querySelectorAll(".line.horizontal")];
    const points = [...document.querySelectorAll(".point")];
    const size = Math.sqrt(points.length);
    const byLabel = new Map(points.map((point) => [point.getAttribute("aria-label"), point]));
    let maxDiff = 0;
    const rows = [0, Math.floor(size / 2), size - 1];
    const cols = [0, Math.floor(size / 2), size - 1];

    for (let c = 0; c < size; c += 1) {
      const lineRect = verticals[c].getBoundingClientRect();
      const lineX = lineRect.left + lineRect.width / 2;
      for (const r of rows) {
        const point = byLabel.get(`${r + 1}행 ${c + 1}열`);
        const rect = point.getBoundingClientRect();
        const pointX = rect.left + rect.width / 2;
        maxDiff = Math.max(maxDiff, Math.abs(lineX - pointX));
      }
    }

    for (let r = 0; r < size; r += 1) {
      const lineRect = horizontals[r].getBoundingClientRect();
      const lineY = lineRect.top + lineRect.height / 2;
      for (const c of cols) {
        const point = byLabel.get(`${r + 1}행 ${c + 1}열`);
        const rect = point.getBoundingClientRect();
        const pointY = rect.top + rect.height / 2;
        maxDiff = Math.max(maxDiff, Math.abs(lineY - pointY));
      }
    }

    return { size, maxDiff };
  }));
}

async function main() {
  if (typeof WebSocket === "undefined") {
    throw new Error("This script needs Node.js with global WebSocket support.");
  }

  const chrome = chromePath();
  if (!chrome) throw new Error("Chrome or Edge executable was not found. Set CHROME_PATH to run functional smoke tests.");

  const localServer = requestedUrl ? null : await startStaticServer();
  const url = requestedUrl || localServer.baseUrl;
  const debugPort = await getFreePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "baduk-functional-smoke-"));
  const chromeArgs = [
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-sync",
    "--disable-gpu",
    "--window-size=1280,900",
  ];
  if (!headed) chromeArgs.push("--headless=new");

  const browser = childProcess.spawn(chrome, chromeArgs, { stdio: "ignore" });
  let client;
  try {
    const wsUrl = await waitForChrome(debugPort);
    client = new CdpClient(wsUrl);
    await client.open();
    const result = await runChecks(client, url);

    console.log("Functional smoke check");
    console.log(`URL: ${url}`);
    console.log("");
    for (const item of result.checks) console.log(`OK: ${item}`);
    for (const screenshot of result.screenshots) console.log(`Screenshot: ${screenshot}`);
    console.log("");
    console.log("OK: core app functionality smoke checks passed.");
  } finally {
    try {
      client?.close();
    } catch (_) {}
    await stopProcess(browser);
    if (localServer) await localServer.close();
    removeDirWithRetry(profile);
  }
}

main().catch((error) => {
  fail(error.message);
});
