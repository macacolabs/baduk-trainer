const http = require("node:http");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT || 8765);
const defaultKatagoDir = process.env.KATAGO_DIR || "C:\\katago";
const defaultVisits = Number(process.env.KATAGO_VISITS || 96);

let engine = null;
let nextId = 1;
const pending = new Map();

function firstExisting(candidates) {
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || "";
}

function newestFile(dir, pattern) {
  try {
    return fs.readdirSync(dir)
      .filter((name) => pattern.test(name))
      .map((name) => {
        const fullPath = path.join(dir, name);
        return { fullPath, mtime: fs.statSync(fullPath).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime)[0]?.fullPath || "";
  } catch {
    return "";
  }
}

function katagoPaths() {
  return {
    katagoPath: firstExisting([
      process.env.KATAGO_PATH,
      path.join(defaultKatagoDir, "katago.exe"),
      path.join(defaultKatagoDir, "katago"),
    ]),
    modelPath: firstExisting([
      process.env.KATAGO_MODEL,
      newestFile(defaultKatagoDir, /\.bin\.gz$/i),
    ]),
    configPath: firstExisting([
      process.env.KATAGO_CONFIG,
      path.join(defaultKatagoDir, "analysis.cfg"),
      path.join(defaultKatagoDir, "analysis_example.cfg"),
      path.join(defaultKatagoDir, "default_gtp.cfg"),
    ]),
  };
}

function cors(res) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-allow-private-network", "true");
}

function configured() {
  const { katagoPath, modelPath, configPath } = katagoPaths();
  return Boolean(katagoPath && modelPath && configPath &&
    fs.existsSync(katagoPath) && fs.existsSync(modelPath) && fs.existsSync(configPath));
}

function setupMessage() {
  const paths = katagoPaths();
  return [
    "KataGo setup needed.",
    `Auto-detected katago: ${paths.katagoPath || "missing"}`,
    `Auto-detected model: ${paths.modelPath || "missing"}`,
    `Auto-detected config: ${paths.configPath || "missing"}`,
    "Set KATAGO_PATH to katago.exe.",
    "Set KATAGO_MODEL to a KataGo .bin.gz model.",
    "Set KATAGO_CONFIG to analysis config.",
    "Example PowerShell:",
    "$env:KATAGO_PATH='C:\\katago\\katago.exe'",
    "$env:KATAGO_MODEL='C:\\katago\\kata1-b18c384nbt.bin.gz'",
    "$env:KATAGO_CONFIG='C:\\katago\\analysis.cfg'",
    "node local-katago-server.cjs",
  ].join("\n");
}

function startEngine() {
  if (engine) return engine;
  if (!configured()) throw new Error(setupMessage());
  const { katagoPath, modelPath, configPath } = katagoPaths();

  engine = spawn(katagoPath, ["analysis", "-model", modelPath, "-config", configPath], {
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });

  let stdoutBuffer = "";
  engine.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk.toString("utf8");
    const lines = stdoutBuffer.split(/\r?\n/);
    stdoutBuffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.trim()) continue;
      let data;
      try {
        data = JSON.parse(line);
      } catch {
        continue;
      }
      const waiter = pending.get(data.id);
      if (!waiter) continue;
      pending.delete(data.id);
      waiter.resolve(data);
    }
  });

  engine.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  engine.on("exit", () => {
    for (const waiter of pending.values()) waiter.reject(new Error("KataGo process exited."));
    pending.clear();
    engine = null;
  });

  return engine;
}

function analyze(payload) {
  const id = payload.id || `baduk-${nextId++}`;
  const query = {
    id,
    rules: payload.rules || "chinese",
    komi: Number(payload.komi ?? 6.5),
    boardXSize: Number(payload.boardSize || 19),
    boardYSize: Number(payload.boardSize || 19),
    moves: Array.isArray(payload.moves) ? payload.moves : [],
    initialPlayer: payload.initialPlayer || "B",
    maxVisits: Number(payload.maxVisits || defaultVisits),
  };

  const proc = startEngine();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error("KataGo analysis timed out."));
    }, Number(process.env.KATAGO_TIMEOUT_MS || 45000));
    pending.set(id, {
      resolve: (data) => {
        clearTimeout(timeout);
        resolve(data);
      },
      reject: (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });
    proc.stdin.write(`${JSON.stringify(query)}\n`);
  });
}

function summarize(data) {
  const infos = Array.isArray(data.moveInfos) ? data.moveInfos.slice(0, 5) : [];
  const best = infos[0] || {};
  return {
    ok: true,
    source: "katago",
    bestMove: best.move || "pass",
    winrate: typeof best.winrate === "number" ? best.winrate : 0,
    scoreLead: typeof best.scoreLead === "number" ? best.scoreLead : 0,
    candidates: infos.map((info) => ({
      move: info.move,
      visits: info.visits,
      winrate: info.winrate,
      scoreLead: info.scoreLead,
      pv: info.pv || [],
    })),
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/health") {
    const paths = katagoPaths();
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      ok: true,
      configured: configured(),
      paths,
      message: configured() ? "ready" : setupMessage(),
    }));
    return;
  }

  if (req.method !== "POST" || url.pathname !== "/analyze") {
    res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: "Use POST /analyze." }));
    return;
  }

  try {
    const payload = JSON.parse(await readBody(req) || "{}");
    const result = await analyze(payload);
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(summarize(result)));
  } catch (error) {
    res.writeHead(configured() ? 500 : 503, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: error.message }));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`KataGo local server: http://127.0.0.1:${port}`);
  if (!configured()) console.log(setupMessage());
});
