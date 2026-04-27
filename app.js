const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const KOMI = 6.5;
const STORAGE_KEY = "baduk-trainer-progress-v2";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function resetViewportTop() {
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
  window.setTimeout(() => window.scrollTo({ top: 0, left: 0 }), 80);
}

const lessons = [
  {
    title: "바둑판과 교차점",
    concept: "바둑은 칸 안이 아니라 선이 만나는 교차점에 둡니다.",
    text: "표시된 교차점에 흑돌을 놓아보세요. 돌은 선 위에 정확히 올라갑니다.",
    board: [],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "가운데 표시된 교차점을 누르세요.",
    success: "좋습니다. 바둑돌은 칸이 아니라 교차점에 둡니다.",
  },
  {
    title: "흑과 백, 차례",
    concept: "흑이 먼저 두고, 이후 흑과 백이 번갈아 둡니다.",
    text: "흑 차례입니다. 표시된 곳에 두며 차례 개념을 익히세요.",
    board: [[4, 4, WHITE]],
    turn: BLACK,
    targets: [[4, 5]],
    hint: "백돌 오른쪽 표시된 곳을 누르세요.",
    success: "착수했습니다. 실제 대국에서는 다음 차례가 백입니다.",
  },
  {
    title: "활로 찾기",
    concept: "활로는 돌과 상하좌우로 붙은 빈 교차점입니다.",
    text: "표시된 곳에 두어 백돌 활로를 하나 줄이세요.",
    board: [[4, 4, WHITE], [4, 5, BLACK], [5, 4, BLACK]],
    turn: BLACK,
    targets: [[3, 4]],
    hint: "백돌 위쪽 빈 점이 활로입니다.",
    success: "좋아요. 상대 돌 숨구멍을 줄였습니다.",
  },
  {
    title: "대각선은 연결 아님",
    concept: "돌은 상하좌우로 붙을 때만 한 무리입니다. 대각선은 이어진 돌이 아닙니다.",
    text: "백돌의 진짜 활로를 막으세요. 대각선 흑돌은 백돌을 막지 못합니다.",
    board: [[4, 4, WHITE], [3, 3, BLACK], [5, 5, BLACK], [4, 5, BLACK], [5, 4, BLACK]],
    turn: BLACK,
    targets: [[3, 4]],
    hint: "백돌 위쪽 빈 교차점이 실제 활로입니다.",
    success: "정확합니다. 대각선은 연결도, 활로 차단도 아닙니다.",
  },
  {
    title: "붙임",
    concept: "붙임은 상대 돌 바로 옆에 두어 싸움을 거는 수입니다.",
    text: "백돌 옆 표시된 곳에 붙여 활로를 압박하세요.",
    board: [[4, 4, WHITE]],
    turn: BLACK,
    targets: [[4, 5]],
    hint: "상대 돌 상하좌우 바로 옆이 붙임 자리입니다.",
    success: "붙였습니다. 붙임은 접전의 시작입니다.",
  },
  {
    title: "단수 만들기",
    concept: "단수는 상대 무리의 활로가 1개만 남은 상태입니다.",
    text: "백돌 무리가 활로 2개를 갖고 있습니다. 한 수로 활로 1개만 남기세요.",
    board: [[3, 3, WHITE], [3, 4, WHITE], [2, 3, BLACK], [2, 4, BLACK], [3, 2, BLACK], [4, 3, BLACK]],
    turn: BLACK,
    targets: [[3, 5]],
    hint: "오른쪽 끝을 막으면 백돌 둘이 단수입니다.",
    success: "단수입니다. 다음 수에 잡을 수 있습니다.",
  },
  {
    title: "한 돌 잡기",
    concept: "상대 돌의 마지막 활로를 막으면 그 돌은 판에서 들어냅니다.",
    text: "백돌은 활로가 하나뿐입니다. 마지막 활로에 두어 잡으세요.",
    board: [[4, 4, WHITE], [3, 4, BLACK], [4, 3, BLACK], [5, 4, BLACK]],
    turn: BLACK,
    targets: [[4, 5]],
    hint: "백돌 오른쪽 빈 점이 마지막 활로입니다.",
    success: "포획 성공. 단수의 목표는 돌을 잡는 것입니다.",
  },
  {
    title: "무리 잡기",
    concept: "상하좌우로 이어진 돌들은 한 몸처럼 활로를 공유합니다.",
    text: "이어진 백돌 두 개의 마지막 활로를 막으세요.",
    board: [[4, 4, WHITE], [4, 5, WHITE], [3, 4, BLACK], [3, 5, BLACK], [4, 3, BLACK], [5, 4, BLACK], [5, 5, BLACK]],
    turn: BLACK,
    targets: [[4, 6]],
    hint: "오른쪽 끝 빈 점 하나가 백 무리의 마지막 활로입니다.",
    success: "무리 전체를 잡았습니다.",
  },
  {
    title: "잇기",
    concept: "잇기는 끊길 위험이 있는 내 돌을 연결해 힘을 합치는 수입니다.",
    text: "흑돌 둘 사이를 이어 하나의 무리로 만드세요.",
    board: [[4, 3, BLACK], [4, 5, BLACK], [3, 4, WHITE], [5, 4, WHITE]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "두 흑돌 사이의 빈 교차점이 잇는 자리입니다.",
    success: "이었습니다. 연결된 돌은 활로를 함께 씁니다.",
  },
  {
    title: "끊기",
    concept: "끊기는 상대 돌이 연결하지 못하게 사이를 차지하는 수입니다.",
    text: "백돌 둘이 이어지기 전에 사이를 끊으세요.",
    board: [[4, 3, WHITE], [4, 5, WHITE], [3, 4, BLACK], [5, 4, BLACK]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "두 백돌 사이를 차지하면 연결이 끊깁니다.",
    success: "끊었습니다. 끊긴 돌은 따로 살아야 합니다.",
  },
  {
    title: "도망 막기",
    concept: "단수인 돌은 활로 쪽으로 도망갈 수 있습니다. 길을 막으면 잡기 쉬워집니다.",
    text: "백돌이 도망가려는 길을 먼저 막으세요. 두면 바로 단수입니다.",
    board: [[2, 2, WHITE], [2, 3, WHITE], [1, 2, BLACK], [1, 3, BLACK], [2, 1, BLACK], [3, 2, BLACK]],
    turn: BLACK,
    targets: [[2, 4]],
    hint: "오른쪽으로 연결될 길을 막으세요.",
    success: "도망길을 막았습니다. 공격 방향 좋습니다.",
  },
  {
    title: "축의 첫 느낌",
    concept: "축은 계속 단수로 몰아 상대 돌을 계단처럼 잡는 공격입니다.",
    text: "백돌이 도망가도 계속 단수가 되도록 첫 방향을 잡으세요.",
    board: [[3, 3, WHITE], [2, 3, BLACK], [3, 2, BLACK], [4, 2, BLACK]],
    turn: BLACK,
    targets: [[4, 3]],
    hint: "아래쪽을 막으면 백은 오른쪽으로 밀리며 계속 쫓깁니다.",
    success: "축의 출발입니다. 초보 단계에서는 '계속 단수' 느낌만 기억하세요.",
  },
  {
    title: "자충 피하기",
    concept: "자충은 내 돌의 활로를 스스로 줄여 위험해지는 수입니다.",
    text: "내 흑돌을 살리는 쪽으로 두세요. 상대를 공격하기 전에 내 활로를 봅니다.",
    board: [[4, 4, BLACK], [4, 5, BLACK], [3, 4, WHITE], [3, 5, WHITE], [5, 5, WHITE]],
    turn: BLACK,
    targets: [[5, 4]],
    hint: "아래쪽으로 늘면 흑 무리의 활로가 늘어납니다.",
    success: "살리는 수입니다. 공격보다 내 돌 안전이 먼저일 때가 많습니다.",
  },
  {
    title: "희생수 맛보기",
    concept: "가끔 내 돌 하나를 일부러 위험하게 두어 더 큰 이득을 얻습니다.",
    text: "표시된 곳에 두면 흑 한 점은 위험하지만 백 무리의 활로가 크게 줄어듭니다.",
    board: [[4, 4, WHITE], [4, 5, WHITE], [3, 4, BLACK], [5, 5, BLACK], [4, 6, BLACK]],
    turn: BLACK,
    targets: [[5, 4]],
    hint: "아래쪽에 붙여 백돌 활로를 줄이세요.",
    success: "희생수의 기본 감각입니다. 잡히는 돌도 목적이 있으면 좋은 수입니다.",
  },
  {
    title: "자살수 구분",
    concept: "착수 뒤 내 무리 활로가 0개면 둘 수 없습니다. 단, 상대 돌을 잡으면 합법입니다.",
    text: "표시된 곳에 두면 흑돌을 잡기 때문에 합법입니다.",
    board: [[4, 4, BLACK], [3, 4, WHITE], [4, 3, WHITE], [4, 5, WHITE]],
    turn: WHITE,
    targets: [[5, 4]],
    hint: "아래쪽을 막으면 흑돌을 잡습니다.",
    success: "맞습니다. 잡는 수는 자살수가 아닙니다.",
  },
  {
    title: "패 이해하기",
    concept: "패는 같은 모양을 바로 반복하지 못하게 하는 규칙입니다.",
    text: "가운데 백돌을 잡아 패 모양을 만들어보세요.",
    board: [[3, 4, BLACK], [4, 3, BLACK], [5, 4, BLACK], [4, 5, WHITE], [3, 5, WHITE], [5, 5, WHITE], [4, 6, BLACK]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "가운데 백돌을 잡으면 패가 생깁니다.",
    success: "패를 만들었습니다. 같은 판 모양 즉시 반복은 막힙니다.",
  },
  {
    title: "집의 의미",
    concept: "집은 내 돌로 둘러싸서 상대가 들어오기 어려운 빈 교차점입니다.",
    text: "흑이 빈 곳을 감싸고 있습니다. 표시된 곳을 보며 집 개념을 확인하세요.",
    board: [[3, 3, BLACK], [3, 4, BLACK], [3, 5, BLACK], [4, 3, BLACK], [4, 5, BLACK], [5, 3, BLACK], [5, 4, BLACK], [5, 5, BLACK]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "가운데 빈 점이 흑의 집 후보입니다.",
    success: "집은 마지막 승패 계산의 핵심입니다.",
  },
  {
    title: "귀가 중요한 이유",
    concept: "귀는 두 방향이 판 끝이라 적은 돌로 집을 만들기 쉽습니다.",
    text: "처음 포석에서는 귀를 먼저 차지하는 일이 많습니다. 표시된 화점에 두세요.",
    board: [],
    turn: BLACK,
    targets: [[2, 2]],
    hint: "왼쪽 위 화점입니다.",
    success: "귀를 차지했습니다. 초반에는 귀, 변, 중앙 순서로 집 만들기가 쉽습니다.",
  },
  {
    title: "변으로 넓히기",
    concept: "귀를 잡은 뒤 변으로 벌리면 넓은 집 후보가 생깁니다.",
    text: "왼쪽 위 흑돌에서 변 쪽으로 벌려보세요.",
    board: [[2, 2, BLACK]],
    turn: BLACK,
    targets: [[2, 5]],
    hint: "같은 줄 오른쪽으로 몇 칸 벌린 자리입니다.",
    success: "좋은 벌림입니다. 돌 사이가 너무 좁으면 작고, 너무 넓으면 침입당합니다.",
  },
  {
    title: "중앙은 영향",
    concept: "중앙 돌은 바로 집을 만들기 어렵지만 싸움과 영향력이 큽니다.",
    text: "중앙 화점에 두어 판 전체에 힘을 뻗어보세요.",
    board: [[2, 2, BLACK], [6, 6, WHITE]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "판 가운데 화점입니다.",
    success: "중앙은 집보다 싸움의 방향을 잡는 힘입니다.",
  },
  {
    title: "포석 균형",
    concept: "포석은 초반 큰 자리 배치입니다. 귀와 변을 균형 있게 차지합니다.",
    text: "빈 귀를 차지해 흑의 초반 균형을 맞추세요.",
    board: [[2, 2, BLACK], [6, 6, WHITE], [2, 6, WHITE]],
    turn: BLACK,
    targets: [[6, 2]],
    hint: "왼쪽 아래 화점이 큽니다.",
    success: "포석에서는 한쪽만 보지 말고 판 전체 큰 곳을 봅니다.",
  },
  {
    title: "젖힘",
    concept: "젖힘은 상대 돌 머리를 꺾어 모양을 압박하는 수입니다.",
    text: "백돌 위쪽을 젖혀 흑돌의 힘을 살려보세요.",
    board: [[4, 3, BLACK], [4, 4, WHITE]],
    turn: BLACK,
    targets: [[3, 4]],
    hint: "백돌 위쪽에 붙어 꺾는 자리입니다.",
    success: "젖혔습니다. 젖힘 뒤에는 끊김과 단수를 늘 조심합니다.",
  },
  {
    title: "뻗음",
    concept: "뻗음은 내 돌에서 한 방향으로 이어 나가 활로와 모양을 키우는 수입니다.",
    text: "백돌 압박을 피해 흑돌을 왼쪽으로 뻗어보세요.",
    board: [[4, 4, BLACK], [4, 5, WHITE]],
    turn: BLACK,
    targets: [[4, 3]],
    hint: "내 흑돌 왼쪽 빈 점으로 뻗으세요.",
    success: "뻗었습니다. 뻗음은 단단하고 이해하기 쉬운 좋은 모양입니다.",
  },
  {
    title: "호구",
    concept: "호구는 상대 돌을 호랑이 입처럼 감싸 잡기 쉬운 모양입니다.",
    text: "백돌을 빠져나가지 못하게 마지막 입구를 막으세요.",
    board: [[4, 4, WHITE], [3, 4, BLACK], [4, 3, BLACK], [5, 4, BLACK]],
    turn: BLACK,
    targets: [[4, 5]],
    hint: "오른쪽 입구를 막으면 백돌이 잡힙니다.",
    success: "호구 모양입니다. 초보가 꼭 익혀야 할 잡는 모양입니다.",
  },
  {
    title: "장문",
    concept: "장문은 바로 단수로 때리지 않고 넓게 막아 상대를 가두는 수입니다.",
    text: "백돌이 도망칠 방향을 크게 막아 가두세요.",
    board: [[4, 4, WHITE], [3, 3, BLACK], [5, 3, BLACK], [3, 5, BLACK]],
    turn: BLACK,
    targets: [[5, 5]],
    hint: "오른쪽 아래를 막으면 백돌이 중앙에서 갇힙니다.",
    success: "장문입니다. 항상 단수가 정답은 아닙니다. 가두는 수가 더 강할 때가 있습니다.",
  },
  {
    title: "두 눈",
    concept: "상대가 모두 메울 수 없는 독립된 눈 두 개가 있으면 그 무리는 살아 있습니다.",
    text: "흑 모양 안의 빈 점을 보세요. 표시된 곳에 두며 눈의 위치를 확인하세요.",
    board: [[3, 3, BLACK], [3, 4, BLACK], [3, 5, BLACK], [4, 3, BLACK], [4, 5, BLACK], [5, 3, BLACK], [5, 4, BLACK], [5, 5, BLACK], [4, 7, BLACK], [3, 7, BLACK], [5, 7, BLACK], [3, 8, BLACK], [4, 8, BLACK], [5, 8, BLACK]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "왼쪽 작은 빈 공간이 눈 후보입니다.",
    success: "눈은 삶과 죽음의 핵심입니다. 두 눈이 있으면 잡히지 않습니다.",
  },
  {
    title: "가짜 눈",
    concept: "겉보기엔 눈처럼 보여도 끊기면 상대가 잡을 수 있는 눈은 가짜 눈입니다.",
    text: "흑 연결 약점을 이어 가짜 눈 위험을 줄이세요.",
    board: [[3, 3, BLACK], [3, 4, BLACK], [4, 3, BLACK], [5, 4, BLACK], [5, 5, BLACK], [4, 5, BLACK], [4, 4, WHITE]],
    turn: BLACK,
    targets: [[5, 3]],
    hint: "아래쪽을 이어 모양을 단단하게 만드세요.",
    success: "연결이 튼튼해야 진짜 눈을 만들 수 있습니다.",
  },
  {
    title: "끝내기",
    concept: "끝내기는 대국 후반에 집 경계를 확정하는 수입니다.",
    text: "흑 집 경계를 닫아 백이 들어올 틈을 줄이세요.",
    board: [[3, 3, BLACK], [3, 4, BLACK], [3, 5, BLACK], [4, 3, BLACK], [5, 3, BLACK], [5, 4, BLACK], [5, 5, BLACK], [4, 6, WHITE], [5, 6, WHITE]],
    turn: BLACK,
    targets: [[4, 5]],
    hint: "오른쪽 경계를 막는 자리입니다.",
    success: "끝내기 감각입니다. 후반에는 작은 경계 차이가 승패를 바꿉니다.",
  },
  {
    title: "침입",
    concept: "침입은 상대 영역 안으로 들어가 집을 줄이거나 사는 시도입니다.",
    text: "백의 넓은 틀 안에 들어가 집을 줄이는 첫 수를 둬보세요.",
    board: [[2, 2, WHITE], [2, 6, WHITE], [6, 2, WHITE], [6, 6, WHITE]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "상대 틀 가운데로 들어갑니다.",
    success: "침입했습니다. 들어간 돌은 살 길을 만들어야 합니다.",
  },
  {
    title: "실전 첫 수",
    concept: "실전에서는 단수, 연결, 끊기, 집 만들기를 함께 봅니다.",
    text: "이제 목표 표시 없이 잡아보세요. 백돌 무리의 마지막 활로를 찾으세요.",
    board: [[5, 5, WHITE], [5, 6, WHITE], [4, 5, BLACK], [4, 6, BLACK], [5, 4, BLACK], [6, 5, BLACK], [6, 6, BLACK]],
    turn: BLACK,
    targets: [[5, 7]],
    hideTarget: true,
    hint: "백돌 무리 오른쪽 끝을 보세요.",
    success: "첫 단수 훈련 완료. 이제 2인 또는 AI와 대국하세요.",
  },
];

lessons.push(
  {
    title: "선수와 후수",
    concept: "선수는 상대가 받아야 하는 수, 후수는 상대가 손빼도 되는 수입니다.",
    text: "백돌을 단수로 만들어 백이 반드시 받게 하세요.",
    board: [[4, 4, WHITE], [3, 4, BLACK], [4, 3, BLACK], [5, 4, BLACK]],
    turn: BLACK,
    targets: [[4, 5]],
    hint: "마지막 활로를 막으면 백이 응수해야 합니다.",
    success: "선수 감각입니다. 강한 사람은 상대가 받아야 하는 수를 계속 찾습니다.",
  },
  {
    title: "손빼기",
    concept: "손빼기는 지금 싸움에서 벗어나 더 큰 곳을 두는 판단입니다.",
    text: "작은 접전보다 큰 귀 자리를 차지하세요.",
    board: [[4, 4, BLACK], [4, 5, WHITE]],
    turn: BLACK,
    targets: [[2, 2]],
    hint: "왼쪽 위 큰 자리입니다.",
    success: "좋은 손빼기입니다. 모든 싸움에 바로 대답할 필요는 없습니다.",
  },
  {
    title: "빈삼각 피하기",
    concept: "빈삼각은 활로와 효율이 나쁜 대표적 악형입니다.",
    text: "빈삼각을 만들지 말고 더 효율 좋은 뻗음을 선택하세요.",
    board: [[4, 4, BLACK], [5, 4, BLACK], [4, 5, WHITE]],
    turn: BLACK,
    targets: [[3, 4]],
    hint: "위로 뻗으면 돌 모양이 더 가볍습니다.",
    success: "악형을 피했습니다. 모양이 좋으면 수읽기가 쉬워집니다.",
  },
  {
    title: "마늘모",
    concept: "마늘모는 끊기기 어렵고 탄탄한 연결 모양입니다.",
    text: "두 흑돌을 단단하게 연결하는 마늘모 자리를 두세요.",
    board: [[4, 4, BLACK], [5, 5, BLACK], [4, 5, WHITE]],
    turn: BLACK,
    targets: [[5, 4]],
    hint: "대각선 돌 사이를 튼튼하게 받치는 자리입니다.",
    success: "마늘모입니다. 연결과 집 모양을 동시에 만듭니다.",
  },
  {
    title: "날일자",
    concept: "날일자는 빠르게 달리는 가벼운 모양이지만 끊김 약점이 있습니다.",
    text: "흑돌에서 날일자로 뛰어 중앙으로 나가세요.",
    board: [[5, 3, BLACK], [5, 4, WHITE]],
    turn: BLACK,
    targets: [[4, 5]],
    hint: "말의 행마처럼 한 칸 대각선으로 뜁니다.",
    success: "날일자 행마입니다. 빠르지만 약점을 항상 살펴야 합니다.",
  },
  {
    title: "협공",
    concept: "협공은 상대 접근한 돌을 양쪽에서 압박하는 포석 수단입니다.",
    text: "백돌을 넓게 압박하는 협공 자리에 두세요.",
    board: [[2, 2, BLACK], [3, 4, WHITE]],
    turn: BLACK,
    targets: [[5, 4]],
    hint: "백돌 아래쪽에서 도망길을 제한합니다.",
    success: "협공입니다. 상대 돌을 안정시키지 않고 주도권을 잡습니다.",
  },
  {
    title: "걸침",
    concept: "걸침은 상대 귀 돌에 접근해 귀와 변의 이익을 다투는 수입니다.",
    text: "백의 귀 돌에 걸쳐 초반 싸움을 시작하세요.",
    board: [[2, 2, WHITE]],
    turn: BLACK,
    targets: [[3, 4]],
    hint: "귀 돌에 너무 붙지 않고 접근하는 자리입니다.",
    success: "걸쳤습니다. 정석은 여기서 시작되는 경우가 많습니다.",
  },
  {
    title: "굳힘",
    concept: "굳힘은 내 귀 돌을 안정시키고 집 모양을 만드는 수입니다.",
    text: "흑 귀 돌을 안정시키는 굳힘 자리에 두세요.",
    board: [[2, 2, BLACK], [6, 6, WHITE]],
    turn: BLACK,
    targets: [[3, 4]],
    hint: "귀 돌에서 변 쪽으로 안정감을 줍니다.",
    success: "굳힘입니다. 내 돌을 먼저 안정시키면 공격도 편해집니다.",
  },
  {
    title: "약한 돌 공격",
    concept: "약한 돌은 집도 없고 활로도 부족해 도망가야 하는 돌입니다.",
    text: "백돌을 중앙으로 몰아가며 공격하세요.",
    board: [[4, 4, WHITE], [3, 4, BLACK], [4, 3, BLACK], [6, 6, BLACK]],
    turn: BLACK,
    targets: [[5, 4]],
    hint: "아래쪽에서 압박하면 백이 편히 살기 어렵습니다.",
    success: "공격은 잡는 것만이 아니라 상대를 몰며 이득 보는 것입니다.",
  },
  {
    title: "강한 돌 피하기",
    concept: "상대 강한 돌 가까이에서 싸우면 내 돌만 약해질 수 있습니다.",
    text: "백 강한 무리 옆이 아니라 빈 큰 곳을 차지하세요.",
    board: [[4, 4, WHITE], [4, 5, WHITE], [5, 4, WHITE], [5, 5, WHITE]],
    turn: BLACK,
    targets: [[2, 2]],
    hint: "강한 백돌 주변보다 빈 귀가 큽니다.",
    success: "좋은 방향 판단입니다. 강한 돌은 피하고 약한 돌을 공격합니다.",
  },
  {
    title: "두터움",
    concept: "두터움은 바로 집은 아니지만 주변 싸움에서 강한 배경이 되는 힘입니다.",
    text: "흑돌을 이어 두터운 벽을 만드세요.",
    board: [[3, 3, BLACK], [4, 3, BLACK], [5, 3, BLACK], [4, 4, WHITE]],
    turn: BLACK,
    targets: [[6, 3]],
    hint: "아래로 이어 벽을 길게 만듭니다.",
    success: "두터운 모양입니다. 두터움 근처에서 싸우면 유리합니다.",
  },
  {
    title: "삭감",
    concept: "삭감은 상대 집 안 깊이 들어가지 않고 바깥에서 집을 줄이는 수입니다.",
    text: "백의 넓은 틀을 가볍게 줄이세요.",
    board: [[2, 2, WHITE], [2, 6, WHITE], [6, 2, WHITE], [6, 6, WHITE]],
    turn: BLACK,
    targets: [[3, 4]],
    hint: "너무 깊게 들어가지 않고 위쪽에서 줄입니다.",
    success: "삭감입니다. 침입보다 안전하게 상대 집을 줄입니다.",
  },
  {
    title: "사활: 급소",
    concept: "사활 문제에는 눈 모양을 만들거나 없애는 급소가 있습니다.",
    text: "흑이 사는 급소에 두세요.",
    board: [[3, 3, BLACK], [3, 4, BLACK], [4, 3, BLACK], [5, 4, BLACK], [4, 5, BLACK], [5, 5, BLACK], [2, 4, WHITE], [4, 2, WHITE], [6, 4, WHITE], [4, 6, WHITE]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "가운데가 눈 모양의 급소입니다.",
    success: "급소를 찾았습니다. 사활은 급소 찾기 훈련입니다.",
  },
  {
    title: "사활: 죽이는 급소",
    concept: "상대가 두 눈을 만들기 전에 가운데 급소를 차지하면 죽일 수 있습니다.",
    text: "백 모양의 눈을 없애는 급소에 두세요.",
    board: [[3, 3, WHITE], [3, 4, WHITE], [4, 3, WHITE], [5, 4, WHITE], [4, 5, WHITE], [5, 5, WHITE], [2, 4, BLACK], [4, 2, BLACK], [6, 4, BLACK], [4, 6, BLACK]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "상대 눈 모양 한가운데입니다.",
    success: "죽이는 급소입니다. 내 사는 급소와 상대 죽이는 급소는 자주 같습니다.",
  },
  {
    title: "패싸움 판단",
    concept: "패는 패 자체보다 패를 이기기 위한 팻감 가치 판단이 중요합니다.",
    text: "패를 바로 다시 따낼 수 없으니 다른 큰 단수 팻감을 두세요.",
    board: [[3, 4, BLACK], [4, 3, BLACK], [5, 4, BLACK], [4, 5, WHITE], [3, 5, WHITE], [5, 5, WHITE], [4, 6, BLACK], [7, 7, WHITE], [7, 8, BLACK], [8, 7, BLACK]],
    turn: BLACK,
    targets: [[6, 7]],
    hint: "오른쪽 아래 백돌을 단수로 만드세요.",
    success: "팻감입니다. 상대가 받아야 하면 다음에 패를 다시 둘 수 있습니다.",
  },
  {
    title: "큰 끝내기",
    concept: "끝내기에서도 양쪽 집 차이가 크게 나는 자리를 먼저 둡니다.",
    text: "흑과 백 경계에서 가장 큰 끝내기 자리를 막으세요.",
    board: [[3, 3, BLACK], [4, 3, BLACK], [5, 3, BLACK], [3, 5, WHITE], [4, 5, WHITE], [5, 5, WHITE]],
    turn: BLACK,
    targets: [[4, 4]],
    hint: "양쪽 경계 한가운데입니다.",
    success: "큰 끝내기입니다. 후반에도 큰 자리부터 둡니다.",
  },
  {
    title: "형세판단",
    concept: "형세판단은 누가 앞서는지 집, 약한 돌, 두터움을 함께 보는 습관입니다.",
    text: "흑이 뒤처지지 않게 가장 큰 빈 귀를 차지하세요.",
    board: [[2, 2, WHITE], [2, 6, BLACK], [6, 2, WHITE]],
    turn: BLACK,
    targets: [[6, 6]],
    hint: "남은 빈 귀가 큽니다.",
    success: "형세판단의 첫걸음은 큰 곳을 놓치지 않는 것입니다.",
  },
  {
    title: "수읽기 2수",
    concept: "2수 읽기는 내가 단수, 상대 도망, 내가 다시 추격까지 보는 것입니다.",
    text: "백이 도망가도 계속 압박되는 첫 단수를 두세요.",
    board: [[4, 4, WHITE], [3, 4, BLACK], [4, 3, BLACK]],
    turn: BLACK,
    targets: [[5, 4]],
    hint: "아래쪽에서 몰면 백의 다음 길이 제한됩니다.",
    success: "2수 읽기의 출발입니다. 상대 응수를 항상 같이 봅니다.",
  },
  {
    title: "무리하지 않는 공격",
    concept: "공격 목표는 무조건 잡기보다 이득을 보며 상대를 약하게 만드는 것입니다.",
    text: "백돌을 잡으려 깊게 붙지 말고 바깥을 막아 이득을 보세요.",
    board: [[4, 4, WHITE], [4, 5, WHITE], [3, 3, BLACK], [6, 6, BLACK]],
    turn: BLACK,
    targets: [[3, 5]],
    hint: "위쪽에서 도망길을 제한합니다.",
    success: "좋은 공격입니다. 잡히면 좋고, 도망가도 이득이면 성공입니다.",
  },
  {
    title: "복습: 가장 큰 수",
    concept: "좋은 바둑은 전투, 집, 약한 돌, 큰 자리 중 지금 제일 큰 것을 고르는 게임입니다.",
    text: "작은 접전보다 가장 큰 빈 귀를 고르세요.",
    board: [[4, 4, WHITE], [4, 5, BLACK], [5, 4, BLACK], [2, 2, WHITE]],
    turn: BLACK,
    targets: [[6, 6]],
    hint: "작은 접전보다 큰 빈 귀가 더 큽니다.",
    success: "좋습니다. 이제 단수만 보는 단계에서 판 전체를 보는 단계로 넘어갑니다.",
  }
);

const terms = [
  ["착수", "교차점에 돌을 놓는 것."],
  ["활로", "돌과 상하좌우로 붙은 빈 교차점. 숨구멍."],
  ["단수", "돌이나 무리의 활로가 1개만 남은 상태."],
  ["포획", "마지막 활로를 막아 상대 돌을 들어내는 것."],
  ["무리", "상하좌우로 이어진 같은 색 돌들."],
  ["잇기", "내 돌들을 연결해 하나의 무리로 만드는 수."],
  ["끊기", "상대 돌 사이를 차지해 연결을 막는 수."],
  ["붙임", "상대 돌 바로 옆에 두는 수."],
  ["자충", "내 돌의 활로를 스스로 줄이는 나쁜 모양."],
  ["자살수", "둔 뒤 내 돌 활로가 0개가 되는 금지된 수."],
  ["패", "같은 판 모양을 바로 반복하지 못하게 하는 규칙."],
  ["집", "내 돌로 둘러싼 빈 교차점 영역."],
  ["덤", "흑 선착 이점을 보정하려고 백에게 주는 점수."],
  ["계가", "대국 끝에 집과 돌을 세어 승패를 정하는 것."],
  ["패스", "더 둘 곳이 없다고 판단해 차례를 넘기는 것."],
  ["축", "상대 돌을 계속 단수로 몰아 잡는 계단식 공격."],
  ["귀", "바둑판 모서리 쪽. 적은 돌로 집을 만들기 쉬움."],
  ["변", "바둑판 가장자리 쪽. 귀 다음으로 집 만들기 쉬움."],
  ["중앙", "판 가운데. 집보다 영향력과 싸움이 큼."],
  ["포석", "초반 큰 자리 배치."],
  ["벌림", "내 돌에서 거리를 두고 넓게 자리 잡는 수."],
  ["젖힘", "상대 돌 머리를 꺾어 압박하는 수."],
  ["뻗음", "내 돌에서 한 방향으로 이어 나가는 수."],
  ["호구", "상대 돌을 감싸 잡기 쉬운 모양."],
  ["장문", "상대 돌을 넓게 가두는 수."],
  ["눈", "상대가 쉽게 둘 수 없는 내 집 안의 빈 점."],
  ["두 눈", "두 개의 독립된 눈. 있으면 보통 살아 있음."],
  ["가짜 눈", "끊김 때문에 실제 눈 역할을 못 하는 모양."],
  ["끝내기", "후반에 집 경계를 확정하는 수."],
  ["침입", "상대 영역 안으로 들어가 집을 줄이는 수."],
  ["선수", "상대가 받아야 하는 급한 수."],
  ["후수", "내가 둔 뒤 상대가 다른 큰 곳으로 갈 수 있는 수."],
  ["손빼기", "지금 국면을 떠나 더 큰 곳을 두는 판단."],
  ["악형", "활로와 효율이 나쁜 돌 모양."],
  ["빈삼각", "대표적 악형. 돌 셋이 비효율적으로 뭉친 모양."],
  ["마늘모", "끊기기 어려운 단단한 연결 모양."],
  ["행마", "돌을 움직이고 전개하는 모양과 방향."],
  ["협공", "상대 돌을 멀리서 압박하는 수."],
  ["걸침", "상대 귀 돌에 접근해 귀와 변을 다투는 수."],
  ["굳힘", "내 귀 돌을 안정시키는 수."],
  ["두터움", "집은 아니지만 주변 싸움에 강한 배경이 되는 힘."],
  ["삭감", "상대 집을 깊이 침입하지 않고 바깥에서 줄이는 수."],
  ["사활", "돌이 살 수 있는지 죽는지 따지는 분야."],
  ["급소", "삶과 죽음, 공격과 수비의 핵심 자리."],
  ["팻감", "패싸움에서 상대가 받아야 하는 다른 위협."],
  ["형세판단", "누가 앞서는지 집, 돌의 강약, 두터움을 보는 판단."],
  ["수읽기", "내 수와 상대 응수를 머릿속으로 미리 계산하는 것."],
];

const drillSeeds = [
  {
    id: "capture-one",
    difficulty: "basic",
    category: "capture",
    title: "포획 반복",
    concept: "마지막 활로를 막는 수를 빠르게 찾습니다.",
    text: "백돌의 마지막 활로를 막아 잡으세요.",
    board: [[0, 0, WHITE], [-1, 0, BLACK], [0, -1, BLACK], [1, 0, BLACK]],
    target: [0, 1],
  },
  {
    id: "capture-chain",
    difficulty: "basic",
    category: "capture",
    title: "무리 포획",
    concept: "이어진 돌 전체의 마지막 활로를 봅니다.",
    text: "백 무리의 마지막 활로를 막으세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [-1, 0, BLACK], [-1, 1, BLACK], [0, -1, BLACK], [1, 0, BLACK], [1, 1, BLACK]],
    target: [0, 2],
  },
  {
    id: "connect-basic",
    difficulty: "basic",
    category: "connect",
    title: "잇기 반복",
    concept: "끊기면 약해지는 돌을 연결합니다.",
    text: "흑돌 둘을 이어 하나의 무리로 만드세요.",
    board: [[0, -1, BLACK], [0, 1, BLACK], [-1, 0, WHITE], [1, 0, WHITE]],
    target: [0, 0],
  },
  {
    id: "cut-basic",
    difficulty: "basic",
    category: "connect",
    title: "끊기 반복",
    concept: "상대 연결점을 먼저 차지합니다.",
    text: "백돌 둘 사이를 끊으세요.",
    board: [[0, -1, WHITE], [0, 1, WHITE], [-1, 0, BLACK], [1, 0, BLACK]],
    target: [0, 0],
  },
  {
    id: "shape-table",
    difficulty: "intermediate",
    category: "shape",
    title: "마늘모 반복",
    concept: "대각선 돌을 단단하게 받칩니다.",
    text: "흑돌을 마늘모로 연결하세요.",
    board: [[0, 0, BLACK], [1, 1, BLACK], [0, 1, WHITE]],
    target: [1, 0],
  },
  {
    id: "shape-knight",
    difficulty: "intermediate",
    category: "shape",
    title: "날일자 반복",
    concept: "빠르게 뛰는 행마를 익힙니다.",
    text: "흑돌에서 날일자로 뛰세요.",
    board: [[0, 0, BLACK], [0, 1, WHITE]],
    target: [-1, 2],
  },
  {
    id: "life-live",
    difficulty: "advanced",
    category: "life",
    title: "사는 급소",
    concept: "눈 모양의 핵심 자리를 찾습니다.",
    text: "흑이 사는 급소에 두세요.",
    board: [[-1, -1, BLACK], [-1, 0, BLACK], [0, -1, BLACK], [1, 0, BLACK], [0, 1, BLACK], [1, 1, BLACK], [-2, 0, WHITE], [0, -2, WHITE], [2, 0, WHITE], [0, 2, WHITE]],
    target: [0, 0],
  },
  {
    id: "life-kill",
    difficulty: "advanced",
    category: "life",
    title: "죽이는 급소",
    concept: "상대 눈 모양의 중심을 차지합니다.",
    text: "백의 눈을 없애는 급소에 두세요.",
    board: [[-1, -1, WHITE], [-1, 0, WHITE], [0, -1, WHITE], [1, 0, WHITE], [0, 1, WHITE], [1, 1, WHITE], [-2, 0, BLACK], [0, -2, BLACK], [2, 0, BLACK], [0, 2, BLACK]],
    target: [0, 0],
  },
  {
    id: "opening-corner",
    difficulty: "basic",
    category: "opening",
    title: "큰 귀",
    concept: "초반에는 작은 싸움보다 빈 귀가 큽니다.",
    text: "가장 큰 빈 귀를 차지하세요.",
    board: [[-2, -2, WHITE], [2, -2, BLACK], [-2, 2, WHITE]],
    target: [2, 2],
  },
  {
    id: "opening-extension",
    difficulty: "intermediate",
    category: "opening",
    title: "벌림",
    concept: "귀 돌에서 변으로 벌려 집 후보를 만듭니다.",
    text: "흑돌에서 변으로 벌리세요.",
    board: [[0, -2, BLACK], [2, 2, WHITE]],
    target: [0, 1],
  },
  {
    id: "endgame-boundary",
    difficulty: "intermediate",
    category: "endgame",
    title: "경계 막기",
    concept: "후반에는 집 경계를 닫는 수가 큽니다.",
    text: "흑 집 경계를 닫으세요.",
    board: [[-1, -1, BLACK], [0, -1, BLACK], [1, -1, BLACK], [-1, 1, WHITE], [0, 1, WHITE], [1, 1, WHITE]],
    target: [0, 0],
  },
  {
    id: "endgame-contact",
    difficulty: "intermediate",
    category: "endgame",
    title: "끝내기 접점",
    concept: "양쪽 집이 맞닿은 곳을 먼저 봅니다.",
    text: "경계 한가운데를 두세요.",
    board: [[-1, -2, BLACK], [0, -2, BLACK], [1, -2, BLACK], [-1, 2, WHITE], [0, 2, WHITE], [1, 2, WHITE]],
    target: [0, 0],
  },
  {
    id: "capture-ladder-start",
    difficulty: "intermediate",
    category: "capture",
    title: "축 첫수",
    concept: "계속 단수로 몰 방향을 잡습니다.",
    text: "백돌을 축으로 몰 첫 수를 두세요.",
    board: [[0, 0, WHITE], [-1, 0, BLACK], [0, -1, BLACK], [1, -1, BLACK]],
    target: [1, 0],
  },
  {
    id: "connect-save-atari",
    difficulty: "basic",
    category: "connect",
    title: "단수 돌 살리기",
    concept: "내 돌이 단수면 먼저 활로를 늘립니다.",
    text: "흑돌을 도망가게 하세요.",
    board: [[0, 0, BLACK], [-1, 0, WHITE], [0, -1, WHITE], [1, 0, WHITE]],
    target: [0, 1],
  },
  {
    id: "shape-empty-triangle",
    difficulty: "intermediate",
    category: "shape",
    title: "빈삼각 피하기",
    concept: "악형 대신 뻗어 효율을 높입니다.",
    text: "빈삼각을 만들지 않는 좋은 모양을 고르세요.",
    board: [[0, 0, BLACK], [1, 0, BLACK], [0, 1, WHITE]],
    target: [-1, 0],
  },
  {
    id: "life-eye-point",
    difficulty: "advanced",
    category: "life",
    title: "눈 급소",
    concept: "눈 모양을 만드는 중심점을 찾습니다.",
    text: "흑이 눈을 만드는 급소에 두세요.",
    board: [[-1, -1, BLACK], [-1, 0, BLACK], [-1, 1, BLACK], [0, -1, BLACK], [1, -1, BLACK], [1, 0, BLACK], [1, 1, BLACK], [0, 1, BLACK]],
    target: [0, 0],
  },
  {
    id: "opening-approach",
    difficulty: "intermediate",
    category: "opening",
    title: "걸침 선택",
    concept: "상대 귀 돌에 접근해 큰 자리를 다툽니다.",
    text: "백 귀 돌에 걸치세요.",
    board: [[-2, -2, WHITE]],
    target: [-1, 0],
  },
  {
    id: "endgame-sente",
    difficulty: "advanced",
    category: "endgame",
    title: "선수 끝내기",
    concept: "상대가 받아야 하는 끝내기를 먼저 둡니다.",
    text: "백 경계를 단수로 압박하는 끝내기를 두세요.",
    board: [[0, -1, BLACK], [1, -1, BLACK], [0, 1, WHITE], [1, 1, WHITE], [-1, 1, WHITE]],
    target: [-1, 0],
  },
];

drillSeeds.push(
  {
    id: "capture-net",
    difficulty: "intermediate",
    category: "capture",
    title: "그물로 잡기",
    concept: "축이 안 될 때는 도망갈 길을 넓게 막는 그물을 봅니다.",
    text: "백돌이 빠져나가지 못하게 그물 모양으로 잡으세요.",
    board: [[0, 0, WHITE], [-1, 0, BLACK], [0, -1, BLACK], [1, -1, BLACK], [-1, 1, BLACK]],
    target: [1, 1],
  },
  {
    id: "capture-snapback",
    difficulty: "advanced",
    category: "capture",
    title: "환격",
    concept: "일부러 하나를 내주고 곧바로 더 크게 잡는 수를 읽습니다.",
    text: "백이 잡아도 다시 잡히는 환격의 급소를 찾으세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [-1, 0, BLACK], [-1, 1, BLACK], [1, 0, BLACK], [1, 1, BLACK], [0, -1, BLACK]],
    target: [0, 2],
  },
  {
    id: "connect-bamboo",
    difficulty: "basic",
    category: "connect",
    title: "대나무 마디",
    concept: "대나무 마디는 쉽게 끊기지 않는 강한 연결입니다.",
    text: "두 돌을 대나무 마디로 연결하세요.",
    board: [[0, -1, BLACK], [1, -1, BLACK], [0, 1, BLACK], [1, 1, BLACK], [-1, 0, WHITE]],
    target: [0, 0],
  },
  {
    id: "connect-tiger",
    difficulty: "intermediate",
    category: "connect",
    title: "호구 연결",
    concept: "호구는 끊김을 막으면서 상대 돌을 압박하는 모양입니다.",
    text: "끊김을 막고 백돌을 압박하는 호구 자리를 찾으세요.",
    board: [[0, 0, BLACK], [1, 1, BLACK], [0, 1, WHITE], [1, 0, WHITE]],
    target: [2, 0],
  },
  {
    id: "shape-hane",
    difficulty: "basic",
    category: "shape",
    title: "젖힘",
    concept: "상대 돌 머리를 젖히면 모양과 활로 싸움에서 앞설 수 있습니다.",
    text: "백돌의 머리를 젖히는 자리를 찾으세요.",
    board: [[0, 0, BLACK], [0, 1, WHITE], [0, 2, WHITE]],
    target: [1, 1],
  },
  {
    id: "shape-extend",
    difficulty: "basic",
    category: "shape",
    title: "뻗기",
    concept: "붙은 뒤에는 무리하지 말고 뻗어 힘을 안정시킵니다.",
    text: "붙은 흑돌을 안정시키는 뻗는 수를 두세요.",
    board: [[0, 0, BLACK], [0, 1, WHITE], [-1, 1, WHITE]],
    target: [1, 0],
  },
  {
    id: "life-make-two-eyes",
    difficulty: "advanced",
    category: "life",
    title: "두 눈 만들기",
    concept: "완전히 살려면 상대가 동시에 없앨 수 없는 두 눈이 필요합니다.",
    text: "흑이 두 눈을 만들 수 있는 급소를 찾으세요.",
    board: [[-1, -1, BLACK], [-1, 0, BLACK], [-1, 1, BLACK], [0, -1, BLACK], [1, -1, BLACK], [1, 0, BLACK], [1, 1, BLACK], [0, 2, WHITE], [2, 0, WHITE]],
    target: [0, 1],
  },
  {
    id: "life-false-eye",
    difficulty: "advanced",
    category: "life",
    title: "가짜 눈 깨기",
    concept: "상대 눈처럼 보이는 곳도 연결 약점이 있으면 가짜 눈입니다.",
    text: "백의 가짜 눈을 깨는 급소를 두세요.",
    board: [[-1, -1, WHITE], [-1, 0, WHITE], [0, -1, WHITE], [1, 0, WHITE], [0, 1, WHITE], [1, 1, WHITE], [-2, 0, BLACK], [0, -2, BLACK], [2, 0, BLACK]],
    target: [1, -1],
  },
  {
    id: "opening-enclosure",
    difficulty: "intermediate",
    category: "opening",
    title: "굳힘",
    concept: "귀를 굳히면 안정된 집과 다음 벌림의 기반이 생깁니다.",
    text: "흑 귀를 안정시키는 굳힘 자리를 찾으세요.",
    board: [[-2, -2, BLACK], [2, 2, WHITE]],
    target: [-2, 0],
  },
  {
    id: "opening-invasion",
    difficulty: "advanced",
    category: "opening",
    title: "삼삼 침입",
    concept: "상대 귀 세력이 커지기 전에 삼삼으로 들어가 실리를 줄일 수 있습니다.",
    text: "백의 귀 모양에 침입하는 급소를 찾으세요.",
    board: [[-2, -2, WHITE], [-2, 1, WHITE], [1, -2, WHITE]],
    target: [-3, -3],
  },
  {
    id: "endgame-cut",
    difficulty: "intermediate",
    category: "endgame",
    title: "끝내기 절단",
    concept: "끝내기에서도 끊김이 있으면 단순 경계보다 가치가 큽니다.",
    text: "경계를 좁히면서 백의 연결을 끊는 자리를 찾으세요.",
    board: [[0, -2, BLACK], [0, -1, BLACK], [1, -1, BLACK], [0, 1, WHITE], [1, 1, WHITE], [0, 2, WHITE]],
    target: [1, 0],
  },
  {
    id: "endgame-reverse-sente",
    difficulty: "advanced",
    category: "endgame",
    title: "역선수 끝내기",
    concept: "상대 선수 끝내기를 미리 막으면 집 차이가 크게 줄어듭니다.",
    text: "백의 선수 끝내기를 막는 역선수 자리를 찾으세요.",
    board: [[-1, -1, BLACK], [0, -1, BLACK], [1, -1, BLACK], [-1, 1, WHITE], [0, 1, WHITE], [1, 1, WHITE], [2, 0, WHITE]],
    target: [-2, 0],
  },
  {
    id: "reading-two-step",
    difficulty: "advanced",
    category: "capture",
    title: "2수 수읽기",
    concept: "첫 수만 보지 말고 상대 응수 뒤의 다음 포획까지 계산합니다.",
    text: "백이 빠져도 다음 수가 남는 첫 급소를 찾으세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [-1, 0, BLACK], [1, -1, BLACK], [1, 1, BLACK], [-1, 2, BLACK]],
    target: [0, -1],
  },
  {
    id: "reading-ko-threat",
    difficulty: "advanced",
    category: "life",
    title: "패 맛보기",
    concept: "바로 끝나지 않는 싸움은 패와 팻감을 함께 봐야 합니다.",
    text: "흑이 패 싸움을 시작할 수 있는 급소를 찾으세요.",
    board: [[0, 0, WHITE], [0, 1, BLACK], [1, 0, BLACK], [-1, 0, BLACK], [0, -1, WHITE], [1, -1, WHITE]],
    target: [-1, -1],
  },
  {
    id: "attack-leaning",
    difficulty: "advanced",
    category: "shape",
    title: "기대기 공격",
    concept: "약한 돌을 바로 잡으려 하지 말고 기대며 이득을 얻습니다.",
    text: "백 약점을 압박하면서 흑 모양을 키우는 자리를 찾으세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [2, 0, BLACK], [2, 1, BLACK], [-1, -1, BLACK]],
    target: [1, 0],
  },
  {
    id: "defense-light",
    difficulty: "intermediate",
    category: "shape",
    title: "가볍게 수습",
    concept: "약한 돌은 무겁게 살리기보다 가볍게 뛰어 중앙으로 나옵니다.",
    text: "흑 약한 돌을 가볍게 수습하는 자리를 찾으세요.",
    board: [[0, 0, BLACK], [0, 1, WHITE], [1, 0, WHITE], [-1, 1, WHITE]],
    target: [1, -1],
  },
);

drillSeeds.push(
  {
    id: "capture-throw-in",
    difficulty: "advanced",
    category: "capture",
    title: "치중 던져넣기",
    concept: "상대 모양 안쪽에 던져 넣어 활로를 줄이고 잡는 맥입니다.",
    text: "백 모양 안에 던져 넣어 잡는 급소를 찾으세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [1, 0, WHITE], [-1, 0, BLACK], [0, -1, BLACK], [1, 1, BLACK], [2, 0, BLACK]],
    target: [1, -1],
  },
  {
    id: "capture-loose-ladder",
    difficulty: "advanced",
    category: "capture",
    title: "느슨한 축",
    concept: "직선 축이 아니어도 상대 도망길을 계속 제한하면 잡힙니다.",
    text: "백돌을 느슨한 축으로 모는 첫 수를 찾으세요.",
    board: [[0, 0, WHITE], [-1, 0, BLACK], [0, -1, BLACK], [1, -1, BLACK], [2, 0, BLACK], [-1, 2, BLACK]],
    target: [1, 0],
  },
  {
    id: "capture-shortage-liberty",
    difficulty: "intermediate",
    category: "capture",
    title: "수상전 활로 부족",
    concept: "서로 잡는 싸움은 각 무리의 활로 수를 먼저 비교합니다.",
    text: "백의 활로를 줄여 수상전에서 이기는 자리를 두세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [1, 0, BLACK], [1, 1, BLACK], [-1, 0, BLACK], [0, -1, BLACK]],
    target: [-1, 1],
  },
  {
    id: "capture-connect-under",
    difficulty: "advanced",
    category: "capture",
    title: "밑으로 잇고 잡기",
    concept: "가장자리에서는 밑으로 잇는 수가 활로와 포획을 동시에 만듭니다.",
    text: "흑돌을 연결하면서 백돌을 잡는 자리를 찾으세요.",
    board: [[0, 0, BLACK], [0, 2, BLACK], [0, 1, WHITE], [-1, 1, WHITE], [1, 0, WHITE], [1, 2, WHITE]],
    target: [1, 1],
  },
  {
    id: "connect-peep-answer",
    difficulty: "basic",
    category: "connect",
    title: "엿봄에 응수",
    concept: "상대가 끊겠다고 엿보면 먼저 단단하게 받아야 합니다.",
    text: "백의 엿봄을 막고 흑을 연결하세요.",
    board: [[0, -1, BLACK], [0, 1, BLACK], [-1, 0, WHITE]],
    target: [0, 0],
  },
  {
    id: "connect-cut-counter",
    difficulty: "intermediate",
    category: "connect",
    title: "맞끊기 대응",
    concept: "끊기 싸움에서는 약한 쪽을 살리면서 상대 약점을 봅니다.",
    text: "흑 두 점을 살리며 백의 끊김을 노리는 수를 찾으세요.",
    board: [[0, -1, BLACK], [1, 0, BLACK], [0, 0, WHITE], [1, -1, WHITE], [-1, 0, WHITE]],
    target: [1, 1],
  },
  {
    id: "connect-one-point-jump",
    difficulty: "basic",
    category: "connect",
    title: "한칸뜀",
    concept: "한칸뜀은 가볍고 빠르게 돌을 연결하는 기본 행마입니다.",
    text: "흑돌을 한칸뜀으로 가볍게 연결하세요.",
    board: [[0, 0, BLACK], [0, 2, BLACK], [1, 1, WHITE]],
    target: [0, 1],
  },
  {
    id: "connect-diagonal-weakness",
    difficulty: "intermediate",
    category: "connect",
    title: "맞보기 연결",
    concept: "두 연결점이 맞보기면 상대가 한 곳을 막아도 다른 곳이 남습니다.",
    text: "흑 연결을 맞보기로 만드는 자리를 찾으세요.",
    board: [[0, 0, BLACK], [1, 1, BLACK], [0, 1, WHITE], [2, 0, WHITE]],
    target: [1, 0],
  },
  {
    id: "shape-nobi-before-hane",
    difficulty: "basic",
    category: "shape",
    title: "젖히기 전 뻗기",
    concept: "약한 돌은 먼저 뻗어 힘을 만든 뒤 젖힘을 노립니다.",
    text: "흑이 무리하지 않고 힘을 만드는 뻗는 수를 찾으세요.",
    board: [[0, 0, BLACK], [0, 1, WHITE], [1, 1, WHITE]],
    target: [1, 0],
  },
  {
    id: "shape-avoid-heavy",
    difficulty: "intermediate",
    category: "shape",
    title: "무거운 돌 피하기",
    concept: "잡히기 쉬운 돌을 더 붙이면 무거워집니다. 가볍게 움직입니다.",
    text: "흑돌을 무겁게 만들지 않는 가벼운 행마를 찾으세요.",
    board: [[0, 0, BLACK], [0, 1, WHITE], [1, 0, WHITE], [-1, 1, WHITE]],
    target: [-1, -1],
  },
  {
    id: "shape-shoulder-hit",
    difficulty: "advanced",
    category: "shape",
    title: "어깨짚기",
    concept: "어깨짚기는 상대 세력을 낮추며 내 돌을 중앙으로 전개합니다.",
    text: "백 세력을 눌러 낮추는 어깨짚기 자리를 찾으세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [1, 0, WHITE], [2, 2, BLACK]],
    target: [-1, 0],
  },
  {
    id: "shape-cap",
    difficulty: "intermediate",
    category: "shape",
    title: "모자 씌우기",
    concept: "도망가는 돌 위를 막으면 중앙 진출을 제한합니다.",
    text: "백 약한 돌의 머리를 막는 모자 씌우기를 두세요.",
    board: [[0, 0, WHITE], [1, 0, WHITE], [2, -1, BLACK], [2, 1, BLACK]],
    target: [-1, 0],
  },
  {
    id: "life-belly-point",
    difficulty: "advanced",
    category: "life",
    title: "배꼽 급소",
    concept: "눈 모양 한가운데 배꼽 급소는 삶과 죽음을 가르는 자리입니다.",
    text: "백이 두 눈을 만들지 못하게 배꼽 급소를 두세요.",
    board: [[-1, -1, WHITE], [-1, 0, WHITE], [-1, 1, WHITE], [0, -1, WHITE], [1, -1, WHITE], [1, 0, WHITE], [1, 1, WHITE], [0, 2, BLACK], [2, 0, BLACK]],
    target: [0, 0],
  },
  {
    id: "life-bent-four-start",
    difficulty: "advanced",
    category: "life",
    title: "굽은 사궁 첫수",
    concept: "굽은 사궁은 내부 급소를 먼저 차지해야 죽일 수 있습니다.",
    text: "백 모양을 죽이는 첫 급소를 찾으세요.",
    board: [[-1, -1, WHITE], [-1, 0, WHITE], [0, -1, WHITE], [1, -1, WHITE], [1, 0, WHITE], [1, 1, WHITE], [-2, 0, BLACK], [0, -2, BLACK], [2, 0, BLACK], [0, 2, BLACK]],
    target: [0, 0],
  },
  {
    id: "life-reduce-eye-space",
    difficulty: "intermediate",
    category: "life",
    title: "눈 공간 줄이기",
    concept: "바로 죽이지 못해도 눈 공간을 좁히면 다음 공격이 생깁니다.",
    text: "백의 눈 공간을 가장 크게 줄이는 자리를 두세요.",
    board: [[0, 0, WHITE], [0, 1, WHITE], [1, 0, WHITE], [2, 0, BLACK], [0, -1, BLACK], [-1, 1, BLACK]],
    target: [1, 1],
  },
  {
    id: "life-connect-and-live",
    difficulty: "intermediate",
    category: "life",
    title: "잇고 살기",
    concept: "사활 문제에서도 끊긴 돌을 잇는 수가 가장 큰 삶의 수입니다.",
    text: "흑돌을 이어 살 수 있는 자리를 찾으세요.",
    board: [[0, -1, BLACK], [0, 1, BLACK], [-1, 0, WHITE], [1, 0, WHITE], [0, 2, WHITE]],
    target: [0, 0],
  },
  {
    id: "opening-high-low-balance",
    difficulty: "intermediate",
    category: "opening",
    title: "고저 균형",
    concept: "실리 돌이 많으면 높게, 세력 돌이 많으면 낮게 균형을 잡습니다.",
    text: "흑 포석의 균형을 맞추는 벌림 자리를 찾으세요.",
    board: [[-2, -2, BLACK], [2, -2, BLACK], [-2, 2, WHITE]],
    target: [0, 2],
  },
  {
    id: "opening-reduce-moyo",
    difficulty: "advanced",
    category: "opening",
    title: "모양 삭감",
    concept: "상대 큰 세력은 깊이 들어가기보다 어깨에서 얕게 줄입니다.",
    text: "백 세력을 안전하게 삭감하는 자리를 찾으세요.",
    board: [[-2, -2, WHITE], [-2, 1, WHITE], [1, -2, WHITE], [2, 2, BLACK]],
    target: [0, 0],
  },
  {
    id: "opening-approach-pincer",
    difficulty: "advanced",
    category: "opening",
    title: "협공",
    concept: "상대 걸침 돌이 약하면 협공으로 방향을 정합니다.",
    text: "백 걸침 돌을 압박하는 협공 자리를 찾으세요.",
    board: [[-2, -2, BLACK], [-1, 0, WHITE], [2, 2, BLACK]],
    target: [1, 0],
  },
  {
    id: "opening-split-side",
    difficulty: "intermediate",
    category: "opening",
    title: "변 갈라치기",
    concept: "상대 두 세력 사이가 넓으면 가운데 갈라쳐 양쪽을 견제합니다.",
    text: "백 세력 사이를 갈라치는 자리를 찾으세요.",
    board: [[0, -3, WHITE], [0, 3, WHITE], [-2, -2, BLACK]],
    target: [0, 0],
  },
  {
    id: "endgame-monkey-jump",
    difficulty: "advanced",
    category: "endgame",
    title: "원숭이 뜀",
    concept: "가장자리 끝내기에서는 깊게 뛰어 들어가 상대 집을 크게 줄입니다.",
    text: "백 집을 크게 줄이는 원숭이 뜀 자리를 찾으세요.",
    board: [[0, -2, BLACK], [0, -1, BLACK], [0, 1, WHITE], [0, 2, WHITE], [1, 1, WHITE]],
    target: [1, 0],
  },
  {
    id: "endgame-hane-connect",
    difficulty: "intermediate",
    category: "endgame",
    title: "젖히고 잇기",
    concept: "끝내기는 젖히고 잇는 순서로 집 경계를 단단하게 합니다.",
    text: "흑 경계를 키우는 젖힘 자리를 찾으세요.",
    board: [[0, -1, BLACK], [1, -1, BLACK], [0, 1, WHITE], [1, 1, WHITE]],
    target: [-1, 0],
  },
  {
    id: "endgame-double-sente",
    difficulty: "advanced",
    category: "endgame",
    title: "양선수",
    concept: "서로에게 선수인 끝내기는 매우 커서 먼저 차지해야 합니다.",
    text: "상대가 반드시 받아야 하는 양선수 끝내기를 찾으세요.",
    board: [[-1, -1, BLACK], [0, -1, BLACK], [1, -1, BLACK], [-1, 1, WHITE], [0, 1, WHITE], [1, 1, WHITE]],
    target: [0, 0],
  },
  {
    id: "endgame-ko-threat",
    difficulty: "advanced",
    category: "endgame",
    title: "끝내기 팻감",
    concept: "패가 있을 때는 큰 끝내기가 팻감이 될 수 있습니다.",
    text: "백이 받아야 하는 큰 팻감 자리를 찾으세요.",
    board: [[0, -1, BLACK], [1, -1, BLACK], [0, 1, WHITE], [1, 1, WHITE], [-1, 1, WHITE], [2, 0, BLACK]],
    target: [-1, 0],
  },
);

const drillBank = buildDrillBank();

function buildDrillBank() {
  const centers = [[2, 2], [2, 4], [2, 6], [4, 2], [4, 4], [4, 6], [6, 2], [6, 4], [6, 6]];
  const transforms = [
    ([r, c]) => [r, c],
    ([r, c]) => [c, -r],
    ([r, c]) => [-r, -c],
    ([r, c]) => [-c, r],
  ];
  const bank = [];
  for (const seed of drillSeeds) {
    for (let transformIndex = 0; transformIndex < transforms.length; transformIndex += 1) {
      const transform = transforms[transformIndex];
      for (const center of centers) {
      const board = [];
      let valid = true;
      for (const [dr, dc, color] of seed.board) {
        const [tr, tc] = transform([dr, dc]);
        const r = center[0] + tr;
        const c = center[1] + tc;
        if (!inBounds(r, c, 9)) valid = false;
        board.push([r, c, color]);
      }
      const [targetR, targetC] = transform(seed.target);
      const target = [center[0] + targetR, center[1] + targetC];
      if (!valid || !inBounds(target[0], target[1], 9)) continue;
      const id = `${seed.id}-${transformIndex}-${center[0]}-${center[1]}`;
      bank.push({
        id,
        title: seed.title,
        concept: seed.concept,
        text: seed.text,
        board,
        turn: BLACK,
        targets: [target],
        hint: "표시된 문제 유형의 핵심 자리를 찾으세요.",
        success: "정답입니다. 같은 유형을 반복하면 실전에서 바로 보입니다.",
        category: seed.category,
        difficulty: seed.difficulty,
        isDrill: true,
      });
    }
    }
  }
  return bank;
}

const state = {
  mode: "learn",
  size: 9,
  board: emptyBoard(9),
  turn: BLACK,
  captures: { [BLACK]: 0, [WHITE]: 0 },
  lessonIndex: 0,
  activeDrill: null,
  completedLessons: new Set(),
  mistakes: new Set(),
  wrongNotes: [],
  weaknessStats: {},
  testQueue: [],
  testTotal: 0,
  testCorrect: 0,
  testMode: null,
  promotionBest: 0,
  danBest: 0,
  correctCount: 0,
  attemptCount: 0,
  streak: 0,
  hintLevel: 0,
  softHintTargets: [],
  readingDepth: 0,
  conceptQuiz: null,
  gameLog: [],
  activeMission: null,
  aiLevel: "normal",
  reviewIndex: null,
  coachCandidates: [],
  lastCoachText: "",
  lastCoachTags: [],
  showDanRoadmap: false,
  revealedAnswer: null,
  lastMove: null,
  locked: false,
  history: [],
  passCount: 0,
  gameOver: false,
};

const el = {
  board: document.querySelector("#board"),
  tabs: document.querySelectorAll(".tab"),
  lessonPanel: document.querySelector("#lessonPanel"),
  termsPanel: document.querySelector("#termsPanel"),
  gamePanel: document.querySelector("#gamePanel"),
  lessonStep: document.querySelector("#lessonStep"),
  lessonTitle: document.querySelector("#lessonTitle"),
  lessonProgress: document.querySelector("#lessonProgress"),
  lessonConcept: document.querySelector("#lessonConcept"),
  lessonText: document.querySelector("#lessonText"),
  thinkingSteps: document.querySelector("#thinkingSteps"),
  lessonGoal: document.querySelector("#lessonGoal"),
  answerNote: document.querySelector("#answerNote"),
  termList: document.querySelector("#termList"),
  prevLesson: document.querySelector("#prevLesson"),
  resetLesson: document.querySelector("#resetLesson"),
  nextLesson: document.querySelector("#nextLesson"),
  showAnswer: document.querySelector("#showAnswer"),
  drillCategory: document.querySelector("#drillCategory"),
  drillDifficulty: document.querySelector("#drillDifficulty"),
  randomDrill: document.querySelector("#randomDrill"),
  newGame: document.querySelector("#newGame"),
  undoMove: document.querySelector("#undoMove"),
  passTurn: document.querySelector("#passTurn"),
  boardSize: document.querySelector("#boardSize"),
  turnText: document.querySelector("#turnText"),
  blackCaps: document.querySelector("#blackCaps"),
  whiteCaps: document.querySelector("#whiteCaps"),
  blackScore: document.querySelector("#blackScore"),
  whiteScore: document.querySelector("#whiteScore"),
  statusTitle: document.querySelector("#statusTitle"),
  statusText: document.querySelector("#statusText"),
  boardLabel: document.querySelector("#boardLabel"),
  boardTitle: document.querySelector("#boardTitle"),
  topPlayerName: document.querySelector("#topPlayerName"),
  topPlayerMeta: document.querySelector("#topPlayerMeta"),
  topTimer: document.querySelector("#topTimer"),
  bottomPlayerName: document.querySelector("#bottomPlayerName"),
  bottomPlayerMeta: document.querySelector("#bottomPlayerMeta"),
  bottomTimer: document.querySelector("#bottomTimer"),
  hintButton: document.querySelector("#hintButton"),
};

const learningStages = [
  {
    name: "입문",
    range: [0, 9],
    focus: "교차점, 활로, 단수, 포획",
    promise: "돌이 왜 잡히는지 몸으로 익히는 단계",
  },
  {
    name: "기초 전투",
    range: [10, 24],
    focus: "잇기, 끊기, 축, 자충, 패",
    promise: "한 수 뒤 결과를 읽기 시작하는 단계",
  },
  {
    name: "모양과 사활",
    range: [25, 39],
    focus: "좋은 모양, 눈, 급소, 삶과 죽음",
    promise: "살 수 있는 돌과 죽는 돌을 구분하는 단계",
  },
  {
    name: "판 전체",
    range: [40, 49],
    focus: "포석, 침입, 삭감, 끝내기",
    promise: "부분 전투를 전체 판 판단으로 연결하는 단계",
  },
];

const conceptChecklist = [
  ["활로 세기", "돌마다 숨구멍을 세고 단수인지 확인한다."],
  ["상대 응수 보기", "내가 두면 상대가 반드시 받아야 하는지 본다."],
  ["연결과 절단", "내 돌은 잇고 상대 돌은 끊는 자리를 찾는다."],
  ["좋은 모양", "빈삼각을 피하고 마늘모, 날일자, 젖힘을 비교한다."],
  ["사활 급소", "눈을 만들거나 없애는 중앙 급소를 먼저 본다."],
  ["큰 곳 판단", "당장 잡는 수보다 큰 빈 곳이 더 큰지 비교한다."],
];

const categoryLabels = {
  capture: "포획",
  connect: "연결/끊기",
  shape: "행마/모양",
  life: "사활",
  opening: "포석/판단",
  endgame: "끝내기",
  general: "기초",
};

const rankLadder = [
  { name: "30급 입문", min: 0, goal: "교차점과 활로 이해" },
  { name: "25급 기초", min: 20, goal: "단수와 포획을 안정적으로 찾기" },
  { name: "20급 전투", min: 45, goal: "잇기와 끊기, 자충 구분" },
  { name: "15급 사활", min: 80, goal: "눈과 급소를 보고 살고 죽이기" },
  { name: "10급 실전", min: 125, goal: "큰 곳, 침입, 끝내기 판단" },
  { name: "5급 도전", min: 190, goal: "3수 수읽기와 형세 판단 연결" },
  { name: "3급 입문", min: 280, goal: "전투, 사활, 끝내기 우선순위 판단" },
  { name: "1급 준비", min: 380, goal: "복기 기반 약점 수정과 5수 후보 비교" },
];

const rankPracticePlans = [
  { rank: "30급 입문", max: 19, categories: ["capture", "connect"], difficulty: "basic", count: 20 },
  { rank: "25급 기초", max: 44, categories: ["capture", "connect", "shape"], difficulty: "basic", count: 30 },
  { rank: "20급 전투", max: 79, categories: ["capture", "connect", "shape"], difficulty: "intermediate", count: 40 },
  { rank: "15급 사활", max: 124, categories: ["life", "capture", "shape"], difficulty: "advanced", count: 50 },
  { rank: "10급 실전", max: 189, categories: ["opening", "endgame", "life", "shape"], difficulty: "intermediate", count: 60 },
  { rank: "5급 도전", max: 279, categories: ["capture", "life", "opening", "endgame", "shape"], difficulty: "advanced", count: 80 },
  { rank: "3급 입문", max: 379, categories: ["capture", "life", "endgame", "shape"], difficulty: "advanced", count: 100 },
  { rank: "1급 준비", max: Infinity, categories: ["life", "capture", "endgame", "opening", "shape"], difficulty: "advanced", count: 120 },
];

const rankCurriculum = [
  ["30급", "교차점, 활로, 단수", "9줄에서 정답률 70%, 단수 문제 20개"],
  ["25급", "포획, 연결, 끊기", "연결/끊기 문제 30개, 오답 재출제 5개 해결"],
  ["20급", "축, 장문, 맞단수", "3수 읽기 훈련 20회, 전투 문제 40개"],
  ["15급", "좋은 모양, 나쁜 모양", "빈삼각 회피, 행마 문제 50개"],
  ["10급", "사활, 포석, 끝내기", "사는 수/죽이는 수 구분, 실전 미션 3회"],
  ["5급", "3수 이상 수읽기, 약한 돌 공격", "심화 시험 85점, 복기 태그 실수 3개 이하"],
  ["3급", "전투 선택, 버릴 돌 판단", "5수 읽기 훈련, AI 도전 난이도 복기"],
  ["1급 준비", "후보수 비교, 형세 판단", "대국마다 복기 코치로 실수 유형 정리"],
];

const danRoadmap = [
  ["5급", "3수 읽기", "내 후보-상대 최강 응수-내 다음 수를 말하고 둡니다."],
  ["3급", "전투 선택", "잡기, 살리기, 버리기 중 가장 큰 결과를 비교합니다."],
  ["1급", "복기 수정", "실전 뒤 놓친 단수, 큰 곳, 끝내기를 기록하고 반복합니다."],
];

const practicalMissions = [
  {
    id: "capture-three",
    title: "AI 9줄에서 흑으로 돌 3개 잡기",
    text: "배운 단수와 포획을 실전에서 써 보세요.",
    target: 3,
  },
  {
    id: "finish-compact",
    title: "9줄 대국을 연속 패스로 끝내기",
    text: "끝내기와 패스 타이밍까지 경험해 봅니다.",
    target: 1,
  },
];

function ensureLearningBoostUI() {
  if (document.querySelector("#learningBoost")) return;
  const boost = document.createElement("div");
  boost.id = "learningBoost";
  boost.className = "learning-boost";
  boost.innerHTML = `
    <div class="stage-card">
      <div>
        <span id="stageLabel">입문</span>
        <strong id="stageFocus">교차점, 활로, 단수</strong>
        <p id="stagePromise">첫 단계입니다.</p>
      </div>
      <div class="mastery-ring">
        <b id="masteryPercent">0%</b>
        <small>숙련</small>
      </div>
    </div>
    <div class="coach-row" id="coachRow"></div>
    <div class="study-actions">
      <button type="button" class="ghost" id="coreReview">핵심 복습</button>
      <button type="button" class="ghost" id="weakReview">약점 훈련</button>
      <button type="button" class="ghost" id="retryWrong">오답 재출제</button>
      <button type="button" class="ghost" id="chapterTest">단원 테스트</button>
      <button type="button" class="ghost" id="readingTraining">수읽기</button>
      <button type="button" class="ghost" id="rankCourse">급수별 코스</button>
      <button type="button" class="ghost" id="rankMap">급수표</button>
      <button type="button" class="ghost" id="conceptQuiz">개념 퀴즈</button>
      <button type="button" class="ghost" id="studyRoutine">15분 루틴</button>
      <button type="button" class="ghost" id="nextStepPlan">다음 단계</button>
      <button type="button" class="ghost" id="danChallenge">5급 집중</button>
      <button type="button" class="ghost" id="danRoadmap">5급+ 로드맵</button>
      <button type="button" class="ghost" id="danBenchmark">심화 시험</button>
      <button type="button" class="ghost" id="promotionTest">승급 시험</button>
      <button type="button" class="ghost" id="weaknessReport">약점 진단</button>
      <button type="button" class="ghost" id="levelCheck">레벨 평가</button>
      <button type="button" class="ghost" id="missionStart">실전 미션</button>
      <button type="button" id="todayCourse">오늘 코스</button>
    </div>
    <div class="reading-card hidden" id="readingCard">
      <span>수읽기 루틴</span>
      <ol>
        <li>내 후보수를 고른다.</li>
        <li>상대가 가장 불편하게 받는 수를 예상한다.</li>
        <li>그 뒤에도 내 돌이 안전한지 확인한다.</li>
      </ol>
    </div>
    <div class="lesson-coach-card" id="lessonCoachCard">
      <span>단계 코치</span>
      <strong id="lessonCoachTitle">생각 순서를 잡는 중</strong>
      <p id="lessonCoachText">현재 문제의 핵심을 한 문장으로 정리합니다.</p>
      <div class="lesson-coach-list" id="lessonCoachList"></div>
    </div>
    <div class="quiz-card hidden" id="quizCard">
      <span>개념 퀴즈</span>
      <strong id="quizQuestion">질문</strong>
      <div class="quiz-options" id="quizOptions"></div>
    </div>
    <div class="next-step-card hidden" id="nextStepCard">
      <span>다음 단계 플랜</span>
      <strong id="nextStepTitle">오늘 할 일</strong>
      <p id="nextStepText">현재 수준에서 가장 효율적인 다음 훈련을 추천합니다.</p>
      <div class="next-step-list" id="nextStepList"></div>
    </div>
    <div class="wrong-note-card hidden" id="wrongNoteCard">
      <span>최근 오답</span>
      <strong id="wrongNoteTitle">아직 오답이 없습니다</strong>
      <p id="wrongNoteText">틀린 수가 생기면 정답과 비교해 줍니다.</p>
    </div>
    <div class="weakness-card" id="weaknessCard">
      <span>약점 진단</span>
      <strong id="weaknessTitle">아직 기록이 부족합니다</strong>
      <p id="weaknessText">문제를 풀면 가장 자주 틀리는 유형을 찾아 다음 훈련으로 연결합니다.</p>
    </div>
    <div class="dan-roadmap-card hidden" id="danRoadmapCard">
      <span>5급 이상 루틴</span>
      <strong id="danRoadmapTitle">3수 읽기부터 시작</strong>
      <div class="dan-roadmap-list" id="danRoadmapList"></div>
    </div>
  `;
  el.lessonPanel.querySelector(".learning-aids").after(boost);
  ensureRankCurriculumUI();
  document.querySelector("#coreReview").addEventListener("click", startCoreReview);
  document.querySelector("#weakReview").addEventListener("click", startWeakReview);
  document.querySelector("#retryWrong").addEventListener("click", startWrongRetry);
  document.querySelector("#chapterTest").addEventListener("click", startChapterTest);
  document.querySelector("#readingTraining").addEventListener("click", startReadingTraining);
  document.querySelector("#rankCourse").addEventListener("click", startRankCourse);
  document.querySelector("#rankMap").addEventListener("click", showRankCurriculum);
  document.querySelector("#conceptQuiz").addEventListener("click", startConceptQuiz);
  document.querySelector("#studyRoutine").addEventListener("click", startStudyRoutine);
  document.querySelector("#nextStepPlan").addEventListener("click", showNextStepPlan);
  document.querySelector("#danChallenge").addEventListener("click", startDanChallenge);
  document.querySelector("#danRoadmap").addEventListener("click", startFiveKyuRoadmap);
  document.querySelector("#danBenchmark").addEventListener("click", startDanBenchmark);
  document.querySelector("#promotionTest").addEventListener("click", startPromotionTest);
  document.querySelector("#weaknessReport").addEventListener("click", showWeaknessReport);
  document.querySelector("#levelCheck").addEventListener("click", showLevelCheck);
  document.querySelector("#missionStart").addEventListener("click", startPracticalMission);
  document.querySelector("#todayCourse").addEventListener("click", continueCourse);
}

function currentStage(index = state.lessonIndex) {
  return learningStages.find((stage) => index >= stage.range[0] && index <= stage.range[1]) || learningStages.at(-1);
}

function updateLearningBoost(lesson) {
  ensureLearningBoostUI();
  const stage = currentStage();
  const progress = Math.round((state.completedLessons.size / lessons.length) * 100);
  document.querySelector("#stageLabel").textContent = stage.name;
  document.querySelector("#stageFocus").textContent = stage.focus;
  document.querySelector("#stagePromise").textContent = stage.promise;
  document.querySelector("#masteryPercent").textContent = `${progress}%`;

  const type = lessonType(lesson);
  const rank = currentRank();
  const coachRow = document.querySelector("#coachRow");
  const cards = [
    ["현재 주제", categoryLabels[type] || "기초"],
    ["현재 급수", rank.name],
    ["문제은행", `${drillBank.length}문제`],
    ["승급 최고", `${state.promotionBest}점`],
    ["심화 최고", `${state.danBest}점`],
    ["연속 정답", `${state.streak}회`],
    ["오답 노트", `${state.wrongNotes.length}개`],
  ];
  coachRow.innerHTML = "";
  for (const [label, value] of cards) {
    const card = document.createElement("div");
    card.className = "coach-chip";
    card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    coachRow.append(card);
  }
  updateWrongNoteCard();
  updateWeaknessCard();
  updateDanRoadmapCard();
  updateRankCurriculum();
  updateLessonCoach(lesson);
}

function updateWrongNoteCard() {
  const card = document.querySelector("#wrongNoteCard");
  if (!card) return;
  const dueCount = dueWrongNotes().length;
  const latest = state.wrongNotes.find((note) => note.dueAt && note.dueAt <= Date.now()) || state.wrongNotes.at(-1);
  card.classList.toggle("hidden", !latest);
  if (!latest) return;
  document.querySelector("#wrongNoteTitle").textContent = `${latest.title}${dueCount ? ` · 재출제 ${dueCount}개` : ""}`;
  document.querySelector("#wrongNoteText").textContent = `내 수: ${latest.played} / 정답: ${latest.answer}. ${latest.reason} ${latest.reviewCount ? `${latest.reviewCount}회 복습 중입니다.` : "오답 재출제로 다시 풀 수 있습니다."}`;
}

function updateWeaknessCard() {
  const card = document.querySelector("#weaknessCard");
  if (!card) return;
  const weak = topWeakness();
  const title = document.querySelector("#weaknessTitle");
  const text = document.querySelector("#weaknessText");
  if (!weak) {
    title.textContent = "아직 기록이 부족합니다";
    text.textContent = "문제를 풀면 가장 자주 틀리는 유형을 찾아 다음 훈련으로 연결합니다.";
    return;
  }
  title.textContent = `${categoryLabels[weak.type] || "기초"} 보강 필요`;
  text.textContent = `${weak.wrong}번 틀리고 ${weak.correct}번 맞혔습니다. 약점 훈련은 이 유형을 우선 추천합니다.`;
}

function updateDanRoadmapCard() {
  const card = document.querySelector("#danRoadmapCard");
  if (!card) return;
  const rank = currentRank();
  const unlocked = state.showDanRoadmap || progressScore() >= 125 || state.promotionBest >= 70 || state.danBest > 0;
  card.classList.toggle("hidden", !unlocked);
  if (!unlocked) return;
  document.querySelector("#danRoadmapTitle").textContent =
    `${rank.name} 기준: 심화 최고 ${state.danBest}점, 승급 최고 ${state.promotionBest}점`;
  const list = document.querySelector("#danRoadmapList");
  list.innerHTML = "";
  for (const [level, skill, routine] of danRoadmap) {
    const item = document.createElement("div");
    item.className = "dan-roadmap-item";
    item.innerHTML = `<b>${level}</b><strong>${skill}</strong><span>${routine}</span>`;
    list.append(item);
  }
}

function ensureRankCurriculumUI() {
  if (document.querySelector("#rankCurriculum")) return;
  const panel = document.createElement("div");
  panel.id = "rankCurriculum";
  panel.className = "rank-curriculum hidden";
  panel.innerHTML = `
    <div class="rank-curriculum-head">
      <span>급수별 커리큘럼</span>
      <strong>30급부터 1급 준비까지</strong>
    </div>
    <div class="rank-curriculum-list" id="rankCurriculumList"></div>
  `;
  document.querySelector("#learningBoost").after(panel);
  updateRankCurriculum();
}

function updateRankCurriculum() {
  const list = document.querySelector("#rankCurriculumList");
  if (!list) return;
  const current = currentRank().name;
  list.innerHTML = "";
  for (const [rank, focus, pass] of rankCurriculum) {
    const item = document.createElement("div");
    item.className = "rank-step";
    if (current.includes(rank)) item.classList.add("active");
    item.innerHTML = `<b>${rank}</b><strong>${focus}</strong><span>${pass}</span>`;
    list.append(item);
  }
}

function showRankCurriculum() {
  ensureRankCurriculumUI();
  const panel = document.querySelector("#rankCurriculum");
  panel.classList.toggle("hidden");
  updateRankCurriculum();
  const rank = currentRank();
  setStatus("급수표", `현재 위치는 ${rank.name}입니다. 각 급수의 통과 조건을 보며 오늘 코스와 수읽기 훈련을 진행하세요.`);
}

function lessonCoachDetails(lesson) {
  const type = lessonType(lesson);
  const [r, c] = lesson.targets[0];
  const coord = coordLabel(r, c);
  const byType = {
    capture: {
      title: "활로를 세면 정답이 보입니다",
      text: `${coord}는 상대 돌의 자유를 줄이는 자리입니다. 먼저 잡을 돌을 고르고 활로 숫자를 세세요.`,
      checks: ["잡을 돌의 활로를 손가락으로 센다.", "내 돌이 되잡히는지 확인한다.", "잡는 수와 단수 치는 수를 비교한다."],
    },
    connect: {
      title: "끊기는 곳과 이어야 할 곳을 비교합니다",
      text: `${coord}는 연결 또는 절단의 핵심입니다. 서로 떨어진 돌 사이의 약점을 먼저 보세요.`,
      checks: ["내 돌 두 덩어리가 분리되는지 본다.", "상대가 끊으면 어느 돌이 약해지는지 본다.", "연결하면서 상대를 압박하는지 확인한다."],
    },
    shape: {
      title: "좋은 모양은 다음 수가 편합니다",
      text: `${coord}는 돌을 무겁게 만들지 않고 다음 움직임을 남깁니다. 빈삼각보다 뻗음, 날일자, 마늘모를 우선 보세요.`,
      checks: ["빈삼각이 되는지 확인한다.", "활로가 넓어지는지 본다.", "상대 절단점이 줄어드는지 본다."],
    },
    life: {
      title: "사활은 눈의 중심 급소입니다",
      text: `${coord}는 눈 모양을 만들거나 없애는 자리입니다. 두 눈 가능성과 가짜 눈을 구분하세요.`,
      checks: ["눈 후보가 두 개인지 본다.", "상대가 바로 메울 수 있는지 본다.", "중심 급소를 먼저 둔다."],
    },
    opening: {
      title: "초반은 큰 곳과 약한 돌의 균형입니다",
      text: `${coord}는 판 전체 효율이 큰 자리입니다. 귀, 변, 중앙 순서와 내 돌의 거리감을 보세요.`,
      checks: ["귀와 변 중 더 큰 곳을 본다.", "내 약한 돌이 있는지 본다.", "상대 큰 자리도 같이 비교한다."],
    },
    endgame: {
      title: "끝내기는 집 차이가 나는 경계입니다",
      text: `${coord}는 흑과 백의 경계를 확정합니다. 한 수로 양쪽 집 차이가 얼마나 나는지 비교하세요.`,
      checks: ["내 집이 늘어나는 양을 센다.", "상대 집이 줄어드는 양을 센다.", "상대가 꼭 받아야 하는 선수인지 본다."],
    },
    general: {
      title: "문제 목표와 가장 직접 연결되는 수입니다",
      text: `${coord}가 현재 목표를 가장 빠르게 해결합니다. 후보수를 줄이고 목적에 맞는 수를 고르세요.`,
      checks: ["문제 목표를 한 문장으로 말한다.", "후보수 2개만 남긴다.", "둔 뒤 활로와 연결을 확인한다."],
    },
  };
  return byType[type] || byType.general;
}

function updateLessonCoach(lesson) {
  const card = document.querySelector("#lessonCoachCard");
  if (!card) return;
  const details = lessonCoachDetails(lesson);
  document.querySelector("#lessonCoachTitle").textContent = details.title;
  document.querySelector("#lessonCoachText").textContent = details.text;
  const list = document.querySelector("#lessonCoachList");
  list.innerHTML = "";
  for (const check of details.checks) {
    const item = document.createElement("label");
    item.innerHTML = `<input type="checkbox"> <span>${check}</span>`;
    list.append(item);
  }
}

function conceptQuestionFor(lesson) {
  const type = lessonType(lesson);
  const data = {
    capture: ["단수 문제에서 가장 먼저 볼 것은?", ["상대 돌의 활로", "판 중앙", "돌 색깔"], 0, "활로가 1개 남으면 단수입니다."],
    connect: ["연결 문제에서 좋은 수는?", ["두 돌을 이어 약점을 줄이는 수", "무조건 중앙으로 뛰는 수", "상대 돌 옆에 아무 데나 붙이는 수"], 0, "연결은 끊김을 막고 약한 돌을 안정시킵니다."],
    shape: ["나쁜 모양으로 자주 피해야 하는 것은?", ["빈삼각", "날일자", "마늘모"], 0, "빈삼각은 활로와 효율이 나빠지기 쉽습니다."],
    life: ["사활에서 급소는 보통 어디에 있나요?", ["눈 모양의 중심", "가장 먼 변", "이미 막힌 돌 위"], 0, "눈의 중심을 차지하면 삶과 죽음이 갈립니다."],
    opening: ["초반에 보통 큰 곳 순서는?", ["귀, 변, 중앙", "중앙, 변, 귀", "무조건 상대 옆"], 0, "귀가 가장 집을 만들기 쉽고 다음이 변입니다."],
    endgame: ["끝내기에서 먼저 볼 것은?", ["집 차이가 크게 나는 경계", "이미 산 돌의 안쪽", "무조건 중앙"], 0, "내 집 증가와 상대 집 감소를 같이 봅니다."],
    general: ["문제를 풀 때 후보수는 어떻게 줄이나요?", ["목표와 직접 연결되는 수만 남긴다", "아무 곳이나 둔다", "가장 예쁜 곳을 고른다"], 0, "목표와 연결되지 않는 후보는 먼저 버립니다."],
  };
  const [question, options, answer, explain] = data[type] || data.general;
  return { question, options, answer, explain };
}

function startConceptQuiz() {
  const lesson = state.activeDrill || lessons[state.lessonIndex];
  const quiz = conceptQuestionFor(lesson);
  quiz.answered = false;
  state.conceptQuiz = quiz;
  const card = document.querySelector("#quizCard");
  const question = document.querySelector("#quizQuestion");
  const options = document.querySelector("#quizOptions");
  card.classList.remove("hidden");
  question.textContent = quiz.question;
  options.innerHTML = "";
  quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost";
    button.textContent = option;
    button.addEventListener("click", () => answerConceptQuiz(index));
    options.append(button);
  });
  setStatus("개념 퀴즈", "착수 전에 말로 설명할 수 있는지 확인합니다.");
}

function answerConceptQuiz(index) {
  const quiz = state.conceptQuiz;
  if (!quiz || quiz.answered) return;
  quiz.answered = true;
  const ok = index === quiz.answer;
  document.querySelectorAll("#quizOptions button").forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === quiz.answer) button.classList.add("selected");
  });
  setStatus(ok ? "개념 정답" : "개념 다시 보기", `${ok ? "좋습니다." : "아쉽습니다."} ${quiz.explain}`);
}

function startStudyRoutine() {
  const weak = topWeakness();
  const rank = currentRank();
  const due = dueWrongNotes().length;
  const routine = [
    due ? `오답 재출제 ${due}개` : "핵심 복습 1개",
    "수읽기 버튼 3회",
    weak ? `${categoryLabels[weak.type]} 약점 문제 5개` : "급수별 코스 5개",
    "AI 9줄 대국 1판",
    "복기 분석으로 실수 태그 확인",
  ];
  const card = document.querySelector("#lessonCoachCard");
  document.querySelector("#lessonCoachTitle").textContent = `${rank.name} 오늘 15분 루틴`;
  document.querySelector("#lessonCoachText").textContent = "적은 양을 매일 반복하도록 구성했습니다.";
  const list = document.querySelector("#lessonCoachList");
  list.innerHTML = "";
  for (const itemText of routine) {
    const item = document.createElement("label");
    item.innerHTML = `<input type="checkbox"> <span>${itemText}</span>`;
    list.append(item);
  }
  card?.scrollIntoView({ behavior: "smooth", block: "center" });
  setStatus("15분 루틴", routine.join(" → "));
}

function nextLearningSteps() {
  const rank = currentRank();
  const plan = currentPracticePlan();
  const weak = topWeakness();
  const due = dueWrongNotes().length;
  const accuracy = state.attemptCount ? Math.round((state.correctCount / state.attemptCount) * 100) : 0;
  const nextRank = rankLadder.find((item) => item.min > rank.min);
  const steps = [];

  if (due) {
    steps.push({
      label: "1. 오답 회수",
      title: `오답 재출제 ${due}개`,
      text: "틀린 문제는 바로 넘어가지 말고 하루 뒤 다시 맞혀야 실전 기억으로 바뀝니다.",
    });
  }

  steps.push({
    label: `${steps.length + 1}. 핵심 훈련`,
    title: `${plan.rank} ${plan.count}문제`,
    text: `${plan.categories.map((item) => categoryLabels[item]).join(", ")} 유형을 우선 반복합니다.`,
  });

  steps.push({
    label: `${steps.length + 1}. 수읽기 기준`,
    title: accuracy >= 75 ? "3수 읽기 유지" : "1수-2수 읽기 안정화",
    text: accuracy >= 75 ? "후보수 2개를 비교한 뒤 상대 응수까지 말하고 둡니다." : "정답을 보기 전에 내 수와 상대 응수 하나를 꼭 말합니다.",
  });

  if (weak) {
    steps.push({
      label: `${steps.length + 1}. 약점 보강`,
      title: `${categoryLabels[weak.type] || "기초"} 집중`,
      text: `최근 오답 ${weak.wrong}회입니다. 약점 훈련 버튼으로 같은 유형을 5문제 더 풉니다.`,
    });
  }

  steps.push({
    label: `${steps.length + 1}. 실전 연결`,
    title: "AI 9줄 1판 + 복기",
    text: "문제에서 배운 수를 대국에서 써 보고, 복기 분석으로 실수 태그를 확인합니다.",
  });

  steps.push({
    label: `${steps.length + 1}. 통과 기준`,
    title: nextRank ? `${nextRank.name} 준비` : "1급 준비 반복",
    text: nextRank ? `${nextRank.goal} 기준으로 승급 시험 80점 이상을 노립니다.` : "심화 시험 85점 이상과 실전 복기 습관을 유지합니다.",
  });

  return steps.slice(0, 6);
}

function showNextStepPlan() {
  const rank = currentRank();
  const nextRank = rankLadder.find((item) => item.min > rank.min);
  const steps = nextLearningSteps();
  const card = document.querySelector("#nextStepCard");
  const list = document.querySelector("#nextStepList");
  card.classList.remove("hidden");
  document.querySelector("#nextStepTitle").textContent = nextRank ? `${rank.name}에서 ${nextRank.name}로 가는 길` : `${rank.name} 이후 유지 루틴`;
  document.querySelector("#nextStepText").textContent = "버튼을 많이 누르는 것보다, 아래 순서대로 반복하는 것이 더 빨리 늡니다.";
  list.innerHTML = "";
  for (const step of steps) {
    const item = document.createElement("div");
    item.className = "next-step-item";
    item.innerHTML = `<b>${step.label}</b><strong>${step.title}</strong><span>${step.text}</span>`;
    list.append(item);
  }
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  setStatus("다음 단계", steps.map((step) => step.title).join(" → "));
}

function topWeakness() {
  return Object.entries(state.weaknessStats)
    .map(([type, stat]) => ({ type, correct: stat.correct || 0, wrong: stat.wrong || 0 }))
    .filter((item) => item.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || a.correct - b.correct)[0] || null;
}

function recordWeakness(type, ok) {
  if (!state.weaknessStats[type]) state.weaknessStats[type] = { correct: 0, wrong: 0 };
  state.weaknessStats[type][ok ? "correct" : "wrong"] += 1;
}

function currentRank() {
  const score = progressScore();
  return [...rankLadder].reverse().find((rank) => score >= rank.min) || rankLadder[0];
}

function progressScore() {
  return state.completedLessons.size * 2 + state.correctCount * 0.8 + state.promotionBest * 1.5 + state.danBest * 1.2;
}

function currentPracticePlan() {
  const score = progressScore();
  return rankPracticePlans.find((plan) => score <= plan.max) || rankPracticePlans.at(-1);
}

function saveProgress() {
  const data = {
    lessonIndex: state.lessonIndex,
    completedLessons: [...state.completedLessons],
    mistakes: [...state.mistakes],
    wrongNotes: state.wrongNotes,
    weaknessStats: state.weaknessStats,
    promotionBest: state.promotionBest,
    danBest: state.danBest,
    correctCount: state.correctCount,
    attemptCount: state.attemptCount,
    streak: state.streak,
    aiLevel: state.aiLevel,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    setStatus("저장 실패", "브라우저 저장 공간을 사용할 수 없습니다.");
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.lessonIndex = Math.min(lessons.length - 1, Math.max(0, Number(data.lessonIndex) || 0));
    state.completedLessons = new Set(Array.isArray(data.completedLessons) ? data.completedLessons : []);
    state.mistakes = new Set(Array.isArray(data.mistakes) ? data.mistakes : []);
    state.wrongNotes = Array.isArray(data.wrongNotes) ? data.wrongNotes.slice(-20) : [];
    state.weaknessStats = data.weaknessStats && typeof data.weaknessStats === "object" ? data.weaknessStats : {};
    state.promotionBest = Number(data.promotionBest) || 0;
    state.danBest = Number(data.danBest) || 0;
    state.correctCount = Number(data.correctCount) || 0;
    state.attemptCount = Number(data.attemptCount) || 0;
    state.streak = Number(data.streak) || 0;
    state.aiLevel = typeof data.aiLevel === "string" ? data.aiLevel : "normal";
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function showLevelCheck() {
  const rank = currentRank();
  const plan = currentPracticePlan();
  const next = rankLadder.find((item) => item.min > rank.min);
  const accuracy = state.attemptCount ? Math.round((state.correctCount / state.attemptCount) * 100) : 0;
  const nextText = next ? `다음 목표는 ${next.name}: ${next.goal}.` : "현재 로드맵의 마지막 단계입니다. 실전 미션과 복기를 반복하세요.";
  const danText = state.danBest >= 85 ? "5급 이상 훈련 기준을 통과했습니다." : "5급 이상 목표는 심화 시험 85점 이상과 3수 읽기 안정화입니다.";
  setStatus("레벨 평가", `현재 ${rank.name}입니다. 성장 점수 ${Math.round(progressScore())}, 정답률 ${accuracy}%, 승급 최고 ${state.promotionBest}점, 심화 최고 ${state.danBest}점. 추천 훈련은 ${plan.rank} ${plan.count}문제 코스입니다. ${nextText} ${danText}`);
}

function startReadingTraining() {
  const lesson = state.activeDrill || lessons[state.lessonIndex];
  state.readingDepth = Math.min(5, state.readingDepth + 1);
  state.softHintTargets = readingCandidates(lesson, state.readingDepth);
  updateReadingCard(lesson);
  document.querySelector("#readingCard")?.classList.remove("hidden");
  render();
  const messages = [
    "1수 읽기: 내가 둘 후보를 먼저 고르세요.",
    "2수 읽기: 그 수를 두면 상대가 어디로 받을지 예상하세요.",
    "3수 읽기: 상대 응수 뒤에도 내 돌이 안전하고 이득인지 확인하세요.",
    "4수 읽기: 상대의 반격까지 보고 손해 보는 교환을 피하세요.",
    "5수 읽기: 최종 장면에서 잡는 수, 살리는 수, 큰 곳을 비교하세요.",
  ];
  setStatus("수읽기 훈련", messages[state.readingDepth - 1] || messages.at(-1));
}

function readingCandidates(lesson, depth) {
  const candidates = hintCandidates(lesson);
  if (depth >= 4) {
    for (const [r, c] of lesson.targets) {
      for (const [nr, nc] of neighbors(r, c, state.size)) {
        if (state.board[nr][nc] === EMPTY && !candidates.some(([cr, cc]) => cr === nr && cc === nc)) candidates.push([nr, nc]);
      }
    }
  }
  return candidates.slice(0, depth >= 5 ? 6 : 3);
}

function updateReadingCard(lesson) {
  const card = document.querySelector("#readingCard");
  if (!card) return;
  const type = lessonType(lesson);
  const checklist = [
    "후보수 2개를 먼저 고른다.",
    "내 첫 수 뒤 상대가 가장 불편하게 받는 자리를 예상한다.",
    "상대 응수 뒤 내 돌의 활로와 연결을 다시 센다.",
    "상대 반격, 맞단수, 끊김이 생기는지 확인한다.",
    `${categoryLabels[type] || "기초"} 목표와 최종 이득을 말로 설명한다.`,
  ];
  card.innerHTML = `
    <span>수읽기 ${state.readingDepth}수 루틴</span>
    <strong>${lesson.title}</strong>
    <ol>${checklist.slice(0, state.readingDepth).map((item) => `<li>${item}</li>`).join("")}</ol>
  `;
}

function startPracticalMission() {
  const mission = practicalMissions[Math.floor(Math.random() * practicalMissions.length)];
  state.activeMission = { ...mission, progress: 0 };
  el.boardSize.value = "9";
  switchMode("ai");
  setStatus("실전 미션", `${mission.title}. ${mission.text}`);
}

function ensureAiLevelControl() {
  if (document.querySelector("#aiLevel")) return;
  const field = document.createElement("label");
  field.className = "field ai-level-field";
  field.innerHTML = `
    <span>AI 강도</span>
    <select id="aiLevel">
      <option value="easy">입문</option>
      <option value="normal" selected>기본</option>
      <option value="hard">도전</option>
    </select>
  `;
  el.boardSize.closest(".field").after(field);
  const select = field.querySelector("#aiLevel");
  select.value = state.aiLevel;
  select.addEventListener("change", (event) => {
    state.aiLevel = event.target.value;
    saveProgress();
    setStatus("AI 강도", `AI 강도를 ${event.target.selectedOptions[0].textContent}으로 바꿨습니다. 새 대국부터 체감이 큽니다.`);
  });
}

function startRankCourse() {
  const plan = currentPracticePlan();
  const pool = drillBank.filter((drill) => {
    const categoryOk = plan.categories.includes(drill.category);
    const difficultyOk = plan.difficulty === "advanced" ? true : drill.difficulty === plan.difficulty || drill.difficulty === "basic";
    return categoryOk && difficultyOk;
  });
  if (!pool.length) {
    setStatus("급수별 코스", "현재 급수에 맞는 문제가 없습니다. 전체 랜덤 문제로 전환합니다.");
    startRandomDrill();
    return;
  }
  state.activeDrill = pool[Math.floor(Math.random() * pool.length)];
  setupLesson();
  setStatus("급수별 코스", `${plan.rank}: ${plan.categories.map((item) => categoryLabels[item]).join(", ")} 중심 ${plan.count}문제 루틴입니다.`);
}

function advancedPool() {
  return drillBank.filter((drill) =>
    drill.difficulty === "advanced" &&
    ["capture", "life", "shape", "endgame", "opening"].includes(drill.category)
  );
}

function startDanChallenge() {
  const pool = advancedPool();
  if (!pool.length) {
    setStatus("5급 집중", "고급 문제가 아직 없습니다.");
    return;
  }
  const priority = ["life", "capture", "endgame", "shape", "opening"];
  const targetCategory = priority[state.correctCount % priority.length];
  const focused = pool.filter((drill) => drill.category === targetCategory);
  state.activeDrill = (focused.length ? focused : pool)[Math.floor(Math.random() * (focused.length || pool.length))];
  setupLesson();
  setStatus("5급 집중", `${categoryLabels[targetCategory]} 고급 문제입니다. 정답 전에 3수까지 읽고 두세요.`);
}

function startFiveKyuRoadmap() {
  state.showDanRoadmap = true;
  document.querySelector("#danRoadmapCard")?.classList.remove("hidden");
  const pool = advancedPool();
  if (!pool.length) {
    setStatus("5급+ 로드맵", "고급 문제를 먼저 추가해야 합니다.");
    return;
  }
  const plan = [
    "1. 심화 문제는 정답을 누르기 전 후보수 2개를 비교합니다.",
    "2. 사활/포획은 3수, 끝내기/포석은 집 차이를 말하고 둡니다.",
    "3. AI 대국 뒤 복기 타임라인으로 놓친 단수와 큰 곳을 확인합니다.",
  ];
  const weak = topWeakness();
  const category = weak?.type || ["life", "capture", "endgame", "shape", "opening"][state.correctCount % 5];
  const focused = pool.filter((drill) => drill.category === category);
  state.activeDrill = (focused.length ? focused : pool)[Math.floor(Math.random() * (focused.length || pool.length))];
  state.readingDepth = 3;
  setupLesson();
  setStatus("5급+ 로드맵", `${categoryLabels[category] || "고급"}부터 시작합니다. ${plan.join(" ")}`);
}

function startDanBenchmark() {
  const pool = advancedPool();
  if (pool.length < 20) {
    setStatus("심화 시험", "심화 시험에는 고급 문제가 20개 이상 필요합니다.");
    return;
  }
  const categories = ["capture", "life", "shape", "opening", "endgame"];
  const selected = [];
  for (const category of categories) {
    const slice = pool.filter((drill) => drill.category === category).sort(() => Math.random() - 0.5).slice(0, 4);
    selected.push(...slice);
  }
  state.testQueue = selected.sort(() => Math.random() - 0.5);
  state.testTotal = state.testQueue.length;
  state.testCorrect = 0;
  state.testMode = "dan";
  state.showDanRoadmap = true;
  document.querySelector("#danRoadmapCard")?.classList.remove("hidden");
  loadNextTestQuestion();
}

function startPromotionTest() {
  const pool = advancedPool();
  if (pool.length < 10) {
    setStatus("승급 시험", "승급 시험용 고급 문제가 부족합니다.");
    return;
  }
  const categories = ["capture", "life", "shape", "opening", "endgame"];
  const selected = [];
  for (const category of categories) {
    const slice = pool.filter((drill) => drill.category === category).sort(() => Math.random() - 0.5).slice(0, 2);
    selected.push(...slice);
  }
  state.testQueue = selected.sort(() => Math.random() - 0.5);
  state.testTotal = state.testQueue.length;
  state.testCorrect = 0;
  state.testMode = "promotion";
  loadNextTestQuestion();
}

function ensureGameReviewButton() {
  ensureAiLevelControl();
  ensureGameCoachPanel();
  ensureReviewTimeline();
  ensureGameReportPanel();
  if (document.querySelector("#reviewGame")) return;
  const button = document.createElement("button");
  button.id = "reviewGame";
  button.type = "button";
  button.className = "ghost";
  button.textContent = "복기 분석";
  button.addEventListener("click", reviewCurrentGame);
  el.gamePanel.querySelector(".actions").append(button);

  const deepButton = document.createElement("button");
  deepButton.id = "deepAnalyze";
  deepButton.type = "button";
  deepButton.className = "ghost";
  deepButton.textContent = "딥러닝 분석";
  deepButton.addEventListener("click", analyzeWithKataGo);
  el.gamePanel.querySelector(".actions").append(deepButton);
}

function ensureGameCoachPanel() {
  if (document.querySelector("#gameCoachPanel")) return;
  const panel = document.createElement("div");
  panel.id = "gameCoachPanel";
  panel.className = "game-coach";
  panel.innerHTML = `
    <div class="game-coach-head">
      <span>실전형 AI 코치</span>
      <strong id="gameCoachTitle">대국 중 후보수 비교</strong>
    </div>
    <p id="gameCoachText">착수하면 AI 코치가 좋은 점, 위험한 점, 다음 후보수를 짚어줍니다.</p>
    <div class="coach-tags" id="gameCoachTags"></div>
    <div class="coach-candidates" id="gameCoachCandidates"></div>
  `;
  el.gamePanel.querySelector(".score-row").after(panel);
}

function updateGameCoach(title, text, candidates = [], tags = []) {
  ensureGameCoachPanel();
  state.lastCoachText = text;
  state.lastCoachTags = tags;
  state.coachCandidates = candidates.map((move) => [move.r, move.c]);
  const titleEl = document.querySelector("#gameCoachTitle");
  const textEl = document.querySelector("#gameCoachText");
  const tagEl = document.querySelector("#gameCoachTags");
  const candidateEl = document.querySelector("#gameCoachCandidates");
  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;
  if (tagEl) {
    tagEl.innerHTML = "";
    for (const tag of tags) {
      const item = document.createElement("span");
      item.textContent = tag;
      tagEl.append(item);
    }
  }
  if (candidateEl) {
    candidateEl.innerHTML = "";
    candidates.slice(0, 3).forEach((move, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost";
      button.textContent = `${index + 1}. ${coordLabel(move.r, move.c)} ${move.reason}`;
      button.addEventListener("click", () => {
        state.revealedAnswer = [move.r, move.c];
        render();
        setStatus("후보수 표시", `${coordLabel(move.r, move.c)}: ${move.reason}`);
      });
      candidateEl.append(button);
    });
  }
}

function colorCode(color) {
  return color === BLACK ? "B" : "W";
}

function gtpCoord(r, c, size = state.size) {
  const letters = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
  return `${letters[c]}${size - r}`;
}

function parseGtpCoord(move, size = state.size) {
  if (!move || move.toLowerCase() === "pass") return null;
  const letters = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
  const col = letters.indexOf(move[0].toUpperCase());
  const row = size - Number(move.slice(1));
  if (col < 0 || !Number.isInteger(row) || !inBounds(row, col, size)) return null;
  return [row, col];
}

function katagoRequestPayload() {
  return {
    id: `baduk-${Date.now()}`,
    boardSize: state.size,
    komi: KOMI,
    rules: "chinese",
    maxVisits: 96,
    moves: state.gameLog.map((move) => [colorCode(move.color), gtpCoord(move.r, move.c, state.size)]),
    initialPlayer: colorCode(state.turn),
  };
}

async function analyzeWithKataGo() {
  if (state.mode === "learn") {
    setStatus("딥러닝 분석", "대국 모드에서 몇 수 둔 뒤 분석할 수 있습니다.");
    return;
  }
  updateGameCoach("딥러닝 분석 요청", "내 PC의 KataGo 로컬 서버에 현재 판을 보내는 중입니다.", [], ["KataGo", "localhost"]);
  setStatus("딥러닝 분석", "로컬 서버 http://localhost:8765/analyze 를 호출합니다.");
  try {
    const response = await fetch("http://localhost:8765/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(katagoRequestPayload()),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || data.message || "KataGo 분석 실패");
    applyKataGoAnalysis(data);
  } catch (error) {
    updateGameCoach(
      "KataGo 연결 필요",
      `${error.message}. 정적 페이지와 기본 AI/복기는 계속 동작합니다. 딥러닝 추천수만 쓰려면 PC에서 local-katago-server.cjs를 실행하세요.`,
      [],
      ["선택 기능", "로컬 서버"]
    );
    setStatus("딥러닝 분석", "KataGo가 없어도 앱은 정상 동작합니다. 딥러닝 분석 버튼만 로컬 서버가 필요합니다.");
  }
}

function applyKataGoAnalysis(data) {
  const candidates = (data.candidates || []).map((item) => {
    const point = parseGtpCoord(item.move, state.size);
    return point ? {
      r: point[0],
      c: point[1],
      reason: `${Math.round((item.winrate || 0) * 100)}% · ${Number(item.scoreLead || 0).toFixed(1)}집`,
    } : null;
  }).filter(Boolean);
  const best = data.bestMove || data.candidates?.[0]?.move || "pass";
  const bestPoint = parseGtpCoord(best, state.size);
  const winrate = Number(data.winrate || data.candidates?.[0]?.winrate || 0);
  const scoreLead = Number(data.scoreLead || data.candidates?.[0]?.scoreLead || 0);
  if (bestPoint) state.revealedAnswer = bestPoint;
  const bestText = bestPoint ? coordLabel(...bestPoint) : "패스";
  updateGameCoach(
    "KataGo 딥러닝 분석",
    `추천수 ${bestText}. 승률 ${Math.round(winrate * 100)}%, 예상 집 차이 ${scoreLead.toFixed(1)}집입니다.`,
    candidates,
    ["딥러닝", "승률", "집 차이"]
  );
  setStatus("KataGo 분석", `추천수 ${best}. 후보 ${candidates.length}개를 표시했습니다.`);
  render();
}

function ensureReviewTimeline() {
  if (document.querySelector("#reviewTimeline")) return;
  const panel = document.createElement("div");
  panel.id = "reviewTimeline";
  panel.className = "review-timeline";
  panel.innerHTML = `
    <div class="review-head">
      <span>복기 타임라인</span>
      <strong id="reviewSummary">아직 수순 없음</strong>
    </div>
    <div class="review-controls">
      <button type="button" class="ghost" id="reviewPrev">이전 수</button>
      <button type="button" class="ghost" id="reviewNext">다음 수</button>
      <button type="button" class="ghost" id="reviewLive">현재로</button>
    </div>
    <div class="review-coach" id="reviewCoachText">수순을 선택하면 복기 코치가 좋은 점과 아쉬운 점을 짚어줍니다.</div>
    <div class="review-tags" id="reviewTags"></div>
    <div class="review-moves" id="reviewMoves"></div>
  `;
  el.gamePanel.append(panel);
  panel.querySelector("#reviewPrev").addEventListener("click", () => stepReview(-1));
  panel.querySelector("#reviewNext").addEventListener("click", () => stepReview(1));
  panel.querySelector("#reviewLive").addEventListener("click", exitReviewMode);
}

function ensureGameReportPanel() {
  if (document.querySelector("#gameReportPanel")) return;
  const panel = document.createElement("div");
  panel.id = "gameReportPanel";
  panel.className = "game-report hidden";
  panel.innerHTML = `
    <div class="game-report-head">
      <span>대국 후 학습 리포트</span>
      <strong id="gameReportTitle">복기 분석을 누르면 생성됩니다</strong>
    </div>
    <p id="gameReportSummary">대국 기록을 바탕으로 실수 유형과 다음 훈련을 추천합니다.</p>
    <div class="game-report-grid" id="gameReportGrid"></div>
    <div class="game-report-list" id="gameReportList"></div>
  `;
  const timeline = document.querySelector("#reviewTimeline");
  if (timeline) timeline.before(panel);
  else el.gamePanel.append(panel);
}

function buildGameLearningReport() {
  const score = estimateScore();
  const blackMoves = state.gameLog.filter((move) => move.color === BLACK);
  const whiteMoves = state.gameLog.filter((move) => move.color === WHITE);
  const allTags = state.gameLog.flatMap((move) => move.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const rankedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const dangerMoves = state.gameLog.filter((move) => (move.tags || []).includes("자충 위험"));
  const captureMoves = state.gameLog.filter((move) => move.captured > 0);
  const atariMoves = state.gameLog.filter((move) => (move.tags || []).includes("단수 압박"));
  const winner = score.black > score.white ? "흑" : "백";
  const margin = Math.abs(score.black - score.white).toFixed(1);
  const mainWeakness = dangerMoves.length
    ? "자충 위험"
    : rankedTags[0]?.[0] || "후보수 비교";
  const nextTrainingByWeakness = {
    "자충 위험": "수읽기 버튼으로 내 돌 활로를 먼저 세는 훈련",
    "단수 압박": "포획/단수 문제 5개",
    "포획 성공": "잡은 뒤 연결이 안전한지 확인하는 복기",
    "안정된 모양": "급수별 코스와 9줄 AI 대국 반복",
    "후보수 비교": "다음 단계 플랜에서 후보수 2개 비교 루틴",
  };
  const criticalMoves = [
    ...dangerMoves.slice(0, 2).map((move) => ({
      title: `${move.historyIndex + 1}수 ${coordLabel(move.r, move.c)}`,
      text: "둔 뒤 내 돌이 단수에 가까워졌습니다. 다음에는 먼저 내 활로를 세세요.",
    })),
    ...atariMoves.slice(0, 2).map((move) => ({
      title: `${move.historyIndex + 1}수 ${coordLabel(move.r, move.c)}`,
      text: "상대 약한 돌을 압박했습니다. 바로 잡을지, 더 큰 곳으로 갈지 비교하세요.",
    })),
    ...captureMoves.slice(0, 2).map((move) => ({
      title: `${move.historyIndex + 1}수 ${coordLabel(move.r, move.c)}`,
      text: `${move.captured}개를 잡았습니다. 잡은 뒤 내 돌 연결까지 확인하면 좋습니다.`,
    })),
  ].slice(0, 3);

  if (!criticalMoves.length && state.gameLog.length) {
    criticalMoves.push({
      title: "대표 장면 부족",
      text: "큰 전투보다 잔잔한 흐름입니다. 다음 판에서는 단수와 연결을 의식해서 두세요.",
    });
  }

  return {
    title: `${state.gameLog.length}수 복기: ${winner} ${margin}집 우세`,
    summary: `흑 ${blackMoves.length}수, 백 ${whiteMoves.length}수. 핵심 약점은 ${mainWeakness}입니다.`,
    metrics: [
      ["총 수순", `${state.gameLog.length}수`],
      ["포획 장면", `${captureMoves.length}회`],
      ["단수 압박", `${atariMoves.length}회`],
      ["주의 장면", `${dangerMoves.length}회`],
    ],
    lessons: [
      {
        title: "오늘의 핵심",
        text: nextTrainingByWeakness[mainWeakness] || "후보수 2개를 비교하는 훈련",
      },
      {
        title: "다음 대국 목표",
        text: dangerMoves.length ? "내 돌이 단수인지 확인한 뒤 두기" : "상대 약한 돌을 단수로 몰아가기",
      },
      {
        title: "추천 훈련",
        text: dangerMoves.length ? "약점 훈련 → 수읽기 → AI 9줄 1판" : "급수별 코스 → 실전 미션 → 복기 분석",
      },
      ...criticalMoves,
    ],
  };
}

function updateGameLearningReport() {
  ensureGameReportPanel();
  const panel = document.querySelector("#gameReportPanel");
  const report = buildGameLearningReport();
  panel.classList.remove("hidden");
  document.querySelector("#gameReportTitle").textContent = report.title;
  document.querySelector("#gameReportSummary").textContent = report.summary;
  const grid = document.querySelector("#gameReportGrid");
  grid.innerHTML = "";
  for (const [label, value] of report.metrics) {
    const item = document.createElement("div");
    item.className = "game-report-metric";
    item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    grid.append(item);
  }
  const list = document.querySelector("#gameReportList");
  list.innerHTML = "";
  for (const lesson of report.lessons) {
    const item = document.createElement("div");
    item.className = "game-report-item";
    item.innerHTML = `<strong>${lesson.title}</strong><span>${lesson.text}</span>`;
    list.append(item);
  }
}

function updateMission(playedColor, result) {
  if (!state.activeMission) return;
  if (state.activeMission.id === "finish-compact" && state.gameOver) {
    setStatus("미션 성공", "9줄 대국을 끝까지 마쳤습니다. 이제 복기 분석으로 놓친 곳을 확인하세요.");
    state.activeMission = null;
    return;
  }
  if (playedColor !== BLACK) return;
  if (state.activeMission.id === "capture-three") {
    state.activeMission.progress = state.captures[BLACK];
    if (state.activeMission.progress >= state.activeMission.target) {
      setStatus("미션 성공", "흑으로 돌 3개를 잡았습니다. 단수와 포획을 실전에 연결했습니다.");
      state.activeMission = null;
    }
  }
}

function reviewCurrentGame() {
  if (!state.history.length) {
    setStatus("복기 분석", "아직 복기할 대국 기록이 없습니다.");
    return;
  }
  if (state.gameLog.length) {
    state.reviewIndex = state.gameLog.length - 1;
    updateReviewTimeline();
    updateGameLearningReport();
  }
  const missedCapture = bestTacticalMove(state.turn);
  if (isTacticalMove(missedCapture, state.turn)) {
    const coach = `${stoneName(state.turn)} 차례 추천수는 ${coordLabel(missedCapture.r, missedCapture.c)}입니다. 바로 잡거나 단수를 만드는 전술 가치가 큽니다. 후보수 비교: 잡는 수, 단수 치는 수, 큰 곳 중 강제성이 있는 수를 우선 보세요.`;
    updateReviewCoach(coach);
    setStatus("복기 분석", coach);
    state.revealedAnswer = [missedCapture.r, missedCapture.c];
    render();
    return;
  }
  const opponentAtari = findAtari(state.board, state.turn === BLACK ? WHITE : BLACK);
  const ownAtari = findAtari(state.board, state.turn);
  const score = estimateScore();
  if (ownAtari) {
    const coach = `${stoneName(state.turn)} 돌 중 단수인 무리가 있습니다. 다음 수에는 살리기, 맞단수, 버리기 중 어느 쪽이 큰지 비교하세요.`;
    updateReviewCoach(coach);
    setStatus("복기 분석", coach);
    render();
    return;
  }
  if (opponentAtari) {
    const coach = `${stoneName(opponentAtari.color)} 돌이 단수입니다. 바로 잡는 수가 선수인지, 더 큰 공격이 있는지 확인하세요.`;
    updateReviewCoach(coach);
    setStatus("복기 분석", coach);
    render();
    return;
  }
  const best = bestTacticalMove(state.turn);
  const last = state.gameLog.at(-1);
  const lastText = last ? ` 마지막 수는 ${stoneName(last.color)} ${coordLabel(last.r, last.c)}입니다.` : "";
  const coach = `간이 형세 흑 ${score.black.toFixed(1)} / 백 ${score.white.toFixed(1)}.${lastText} 다음 후보는 ${best ? coordLabel(best.r, best.c) : "패스"}입니다. 단수가 없으면 큰 곳, 약한 돌, 끝내기 경계 순서로 보세요.`;
  updateReviewCoach(coach);
  setStatus("복기 분석", coach);
  if (best) {
    state.revealedAnswer = [best.r, best.c];
    render();
  }
}

function updateReviewTimeline() {
  const panel = document.querySelector("#reviewTimeline");
  if (!panel) return;
  const summary = panel.querySelector("#reviewSummary");
  const moves = panel.querySelector("#reviewMoves");
  const tags = panel.querySelector("#reviewTags");
  const prev = panel.querySelector("#reviewPrev");
  const next = panel.querySelector("#reviewNext");
  const live = panel.querySelector("#reviewLive");
  summary.textContent = state.reviewIndex !== null
    ? `${state.reviewIndex + 1}수 보는 중`
    : state.gameLog.length ? `${state.gameLog.length}수 기록` : "아직 수순 없음";
  moves.innerHTML = "";
  if (tags) {
    const reviewTags = reviewMistakeTags();
    tags.innerHTML = "";
    for (const tag of reviewTags) {
      const item = document.createElement("span");
      item.textContent = tag;
      tags.append(item);
    }
  }
  state.gameLog.forEach((move, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "review-move";
    if (state.reviewIndex === index) button.classList.add("active");
    button.textContent = `${index + 1}. ${stoneName(move.color)} ${coordLabel(move.r, move.c)}`;
    button.addEventListener("click", () => showReviewMove(index));
    moves.append(button);
  });
  const reviewing = state.reviewIndex !== null;
  prev.disabled = !reviewing || state.reviewIndex <= 0;
  next.disabled = !reviewing || state.reviewIndex >= state.gameLog.length - 1;
  live.disabled = !reviewing;
}

function reviewMistakeTags() {
  const allTags = state.gameLog.flatMap((move) => move.tags || []);
  const counts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (!ranked.length) return state.gameLog.length ? ["큰 실수 적음", "후보수 비교 권장"] : ["대국 후 자동 태그 표시"];
  return ranked.map(([tag, count]) => `${tag} ${count}`);
}

function showReviewMove(index) {
  if (!state.gameLog[index]) return;
  state.reviewIndex = index;
  const move = state.gameLog[index];
  state.revealedAnswer = [move.r, move.c];
  const snapshot = state.history[move.historyIndex] || state.history[index + 1] || state.history.at(-1);
  const score = snapshot ? estimateScore(snapshot.board) : estimateScore();
  const captureText = move.captured ? ` ${move.captured}개를 잡은 수입니다.` : "";
  const coach = reviewCoachForMove(move, snapshot?.board || state.board, score);
  updateReviewCoach(coach);
  setStatus("복기 타임라인", `${index + 1}수 ${stoneName(move.color)} ${coordLabel(move.r, move.c)}.${captureText} 이 장면 형세는 흑 ${score.black.toFixed(1)} / 백 ${score.white.toFixed(1)}입니다. ${coach}`);
  updateReviewTimeline();
  render();
}

function updateReviewCoach(text) {
  const coach = document.querySelector("#reviewCoachText");
  if (coach) coach.textContent = text;
}

function reviewCoachForMove(move, board, score) {
  const color = move.color;
  const opponent = color === BLACK ? WHITE : BLACK;
  const group = board[move.r]?.[move.c] === color ? groupAt(board, move.r, move.c) : null;
  const liberties = group?.liberties.size || 0;
  const opponentAtari = countAtariGroups(board, opponent);
  const ownAtari = countAtariGroups(board, color);
  const lead = color === BLACK ? score.black - score.white : score.white - score.black;
  if (move.captured > 0) return `좋은 점: 포획으로 확실한 실리를 얻었습니다. 다음 확인: 잡은 뒤 내 돌 활로 ${liberties}개라 연결 약점이 없는지 보세요.`;
  if (opponentAtari > 0) return `좋은 점: 상대 약한 돌을 단수로 몰았습니다. 다음 수에는 바로 잡는 수와 더 큰 공격을 비교하세요.`;
  if (ownAtari > 0 || liberties <= 1) return `주의: 둔 뒤 내 돌이 단수에 가깝습니다. 이런 수는 잡는 이득이 없으면 위험합니다.`;
  if (liberties >= 4 && lead >= -5) return `좋은 점: 활로 ${liberties}개로 돌이 가볍고 안정적입니다. 다음은 주변 약한 돌을 공격으로 연결하세요.`;
  if (Math.abs(lead) >= 12) return `형세 포인트: 이 장면은 ${stoneName(color)} 기준 ${lead > 0 ? "앞서는" : "밀리는"} 흐름입니다. 큰 곳과 끝내기 우선순위를 다시 보세요.`;
  return `복기 포인트: 포획은 없지만 모양을 정돈한 수입니다. 후보수 2개를 비교해 더 큰 자리였는지 확인하세요.`;
}

function stepReview(delta) {
  if (!state.gameLog.length) return;
  const current = state.reviewIndex ?? state.gameLog.length - 1;
  showReviewMove(Math.max(0, Math.min(state.gameLog.length - 1, current + delta)));
}

function exitReviewMode() {
  state.reviewIndex = null;
  state.revealedAnswer = null;
  updateReviewTimeline();
  setStatus("복기 종료", `${stoneName(state.turn)} 차례로 돌아왔습니다.`);
  render();
}

function renderConceptChecklist() {
  if (document.querySelector("#conceptChecklist")) return;
  const panel = document.createElement("details");
  panel.className = "panel checklist-panel";
  panel.id = "conceptChecklist";
  panel.open = true;
  panel.innerHTML = `
    <summary>
      <span>학습 체크리스트</span>
      <strong>아마추어 입문 루틴</strong>
    </summary>
    <div class="checklist-grid"></div>
  `;
  el.termsPanel.before(panel);
  const grid = panel.querySelector(".checklist-grid");
  for (const [title, desc] of conceptChecklist) {
    const item = document.createElement("div");
    item.className = "check-item";
    item.innerHTML = `<strong>${title}</strong><span>${desc}</span>`;
    grid.append(item);
  }
}

function startCoreReview() {
  const stage = currentStage();
  const [from, to] = stage.range;
  const next = Math.min(to, Math.max(from, state.lessonIndex));
  state.activeDrill = null;
  state.lessonIndex = next;
  setStatus("핵심 복습", `${stage.name} 단계의 핵심 개념부터 다시 확인합니다.`);
  setupLesson();
}

function startWeakReview() {
  if (dueWrongNotes().length) {
    startWrongRetry();
    return;
  }
  const weak = topWeakness();
  if (weak) {
    el.drillCategory.value = weak.type;
    el.drillDifficulty.value = "all";
    startRandomDrill();
    setStatus("약점 훈련", `${categoryLabels[weak.type]} 유형을 우선 복습합니다. 최근 오답이 가장 많습니다.`);
    return;
  }
  if (state.mistakes.size) {
    el.drillDifficulty.value = "mistake";
    startRandomDrill();
    return;
  }
  el.drillDifficulty.value = "basic";
  startRandomDrill();
  setStatus("약점 훈련", "아직 오답이 없어 기초 반복 문제부터 시작합니다.");
}

function dueWrongNotes() {
  const now = Date.now();
  return state.wrongNotes.filter((note) => !note.mastered && (!note.dueAt || note.dueAt <= now));
}

function findLessonForWrongNote(note) {
  if (note.lessonKind === "lesson" && Number.isInteger(note.lessonIndex)) return lessons[note.lessonIndex];
  if (note.lessonId) return drillBank.find((drill) => drill.id === note.lessonId);
  return drillBank.find((drill) => drill.title === note.title) || lessons.find((lesson) => lesson.title === note.title);
}

function scheduleWrongNote(note, ok) {
  note.reviewCount = (note.reviewCount || 0) + 1;
  note.lastReviewedAt = Date.now();
  if (ok) {
    note.mastered = note.reviewCount >= 2;
    note.dueAt = Date.now() + (note.mastered ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 5);
  } else {
    note.mastered = false;
    note.dueAt = Date.now();
  }
}

function startWrongRetry() {
  const due = dueWrongNotes();
  if (!due.length) {
    setStatus("오답 재출제", "지금 다시 풀 오답이 없습니다. 새 문제를 풀면 자동으로 오답 큐에 들어갑니다.");
    updateWrongNoteCard();
    return;
  }
  const note = due.sort((a, b) => (a.dueAt || 0) - (b.dueAt || 0))[0];
  note.id = note.id || note.lessonId || `wrong-${note.title}-${note.answer || ""}`;
  const lesson = findLessonForWrongNote(note);
  if (!lesson) {
    note.mastered = true;
    saveProgress();
    setStatus("오답 재출제", "이전 오답 문제를 찾을 수 없어 큐에서 제외했습니다.");
    updateWrongNoteCard();
    return;
  }
  state.activeDrill = {
    ...lesson,
    id: lesson.id || note.lessonId,
    title: `오답 재출제: ${lesson.title}`,
    retryNoteId: note.id,
  };
  setupLesson();
  setStatus("오답 재출제", `${note.reason} 같은 실수를 고치기 위해 다시 출제했습니다. 정답 전 후보수 2개를 비교하세요.`);
}

function showWeaknessReport() {
  const weak = topWeakness();
  if (!weak) {
    setStatus("약점 진단", "아직 오답 기록이 부족합니다. 랜덤 문제나 급수별 코스를 몇 문제 풀어보세요.");
    return;
  }
  const accuracy = weak.correct + weak.wrong ? Math.round((weak.correct / (weak.correct + weak.wrong)) * 100) : 0;
  setStatus("약점 진단", `${categoryLabels[weak.type]} 정확도 ${accuracy}%. 오답 ${weak.wrong}회입니다. 약점 훈련 버튼을 누르면 이 유형부터 반복합니다.`);
}

function continueCourse() {
  state.activeDrill = null;
  state.testQueue = [];
  state.testTotal = 0;
  state.testCorrect = 0;
  state.testMode = null;
  state.lessonIndex = Math.min(lessons.length - 1, state.lessonIndex + 1);
  saveProgress();
  setupLesson();
}

function startChapterTest() {
  const stage = currentStage();
  const [from, to] = stage.range;
  const indexes = [];
  for (let i = from; i <= Math.min(to, lessons.length - 1); i += 1) indexes.push(i);
  state.testQueue = indexes.sort(() => Math.random() - 0.5).slice(0, 5);
  state.testTotal = state.testQueue.length;
  state.testCorrect = 0;
  state.testMode = "chapter";
  loadNextTestQuestion();
}

function loadNextTestQuestion() {
  const nextItem = state.testQueue.shift();
  if (nextItem === undefined) {
    const score = state.testTotal ? Math.round((state.testCorrect / state.testTotal) * 100) : 0;
    if (state.testMode === "promotion") state.promotionBest = Math.max(state.promotionBest, score);
    if (state.testMode === "dan") state.danBest = Math.max(state.danBest, score);
    state.activeDrill = null;
    const label = state.testMode === "promotion" ? "승급 시험 완료" : state.testMode === "dan" ? "심화 시험 완료" : "단원 테스트 완료";
    const passLine = state.testMode === "dan" ? 85 : 80;
    const guide = score >= passLine ? "다음 단계로 올라갈 준비가 됐습니다." : "부족한 유형은 약점 훈련과 5급 집중으로 반복하세요.";
    state.testMode = null;
    saveProgress();
    setupLesson();
    setStatus(label, `${state.testCorrect}/${state.testTotal} 정답, ${score}점입니다. ${guide}`);
    return;
  }
  const base = typeof nextItem === "number" ? lessons[nextItem] : nextItem;
  state.activeDrill = {
    ...base,
    title: `테스트: ${base.title}`,
    isChapterTest: true,
    sourceLessonIndex: typeof nextItem === "number" ? nextItem : null,
  };
  setupLesson();
  const label = state.testMode === "promotion" ? "승급 시험" : state.testMode === "dan" ? "심화 시험" : "단원 테스트";
  const stageName = typeof nextItem === "number" ? currentStage(nextItem).name : "고급 실전";
  setStatus(label, `${stageName} ${state.testCorrect}/${state.testTotal} 진행 중입니다.`);
}

function coordLabel(r, c) {
  return `${r + 1}행 ${c + 1}열`;
}

function addWrongNote(lesson, r, c) {
  const [ar, ac] = lesson.targets[0];
  const type = lessonType(lesson);
  const existingId = lesson.retryNoteId || lesson.id || `lesson-${state.lessonIndex}`;
  const reason = {
    capture: "활로를 더 줄이는 자리를 먼저 찾아야 합니다.",
    connect: "연결점과 절단점을 다시 비교해 보세요.",
    shape: "모양의 효율이 더 좋은 후보가 있습니다.",
    life: "눈 모양의 급소를 먼저 봐야 합니다.",
    opening: "부분 전투보다 판 전체의 큰 곳을 봐야 합니다.",
    endgame: "경계에서 집 차이가 가장 크게 나는 곳을 봐야 합니다.",
    general: "문제의 목표와 가장 직접 연결되는 수를 찾아야 합니다.",
  };
  const existing = state.wrongNotes.find((note) => note.id === existingId);
  const note = existing || {
    id: existingId,
    lessonId: lesson.id || null,
    lessonKind: lesson.id ? "drill" : "lesson",
    lessonIndex: lesson.id ? null : state.lessonIndex,
    title: lesson.title,
    category: type,
    reviewCount: 0,
  };
  note.played = coordLabel(r, c);
  note.answer = coordLabel(ar, ac);
  note.reason = reason[type] || reason.general;
  note.mastered = false;
  note.dueAt = Date.now();
  note.lastWrongAt = Date.now();
  if (!existing) state.wrongNotes.push(note);
  state.wrongNotes = state.wrongNotes.slice(-20);
}

function hintCandidates(lesson) {
  const [r, c] = lesson.targets[0];
  const candidates = [[r, c]];
  for (const [nr, nc] of neighbors(r, c, state.size)) {
    if (state.board[nr][nc] === EMPTY) candidates.push([nr, nc]);
    if (candidates.length >= 3) break;
  }
  return candidates;
}

function emptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(EMPTY));
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function boardKey(board) {
  return board.map((row) => row.join("")).join("/");
}

function inBounds(r, c, size = state.size) {
  return r >= 0 && r < size && c >= 0 && c < size;
}

function neighbors(r, c, size = state.size) {
  return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([nr, nc]) => inBounds(nr, nc, size));
}

function groupAt(board, r, c) {
  const color = board[r][c];
  const stones = [];
  const liberties = new Set();
  const seen = new Set([`${r},${c}`]);
  const stack = [[r, c]];
  const size = board.length;

  while (stack.length) {
    const [cr, cc] = stack.pop();
    stones.push([cr, cc]);
    for (const [nr, nc] of neighbors(cr, cc, size)) {
      if (board[nr][nc] === EMPTY) liberties.add(`${nr},${nc}`);
      if (board[nr][nc] === color && !seen.has(`${nr},${nc}`)) {
        seen.add(`${nr},${nc}`);
        stack.push([nr, nc]);
      }
    }
  }

  return { stones, liberties };
}

function playMove(board, r, c, color, options = {}) {
  if (!inBounds(r, c, board.length) || board[r][c] !== EMPTY) return { ok: false, reason: "이미 돌이 있습니다." };

  const next = cloneBoard(board);
  const opponent = color === BLACK ? WHITE : BLACK;
  const captured = [];
  next[r][c] = color;

  for (const [nr, nc] of neighbors(r, c, board.length)) {
    if (next[nr][nc] !== opponent) continue;
    const group = groupAt(next, nr, nc);
    if (group.liberties.size === 0) {
      for (const [sr, sc] of group.stones) {
        next[sr][sc] = EMPTY;
        captured.push([sr, sc]);
      }
    }
  }

  const own = groupAt(next, r, c);
  if (own.liberties.size === 0) return { ok: false, reason: "자살수입니다." };

  const key = boardKey(next);
  if (options.previousKey && key === options.previousKey) {
    return { ok: false, reason: "패입니다. 바로 같은 모양으로 되돌릴 수 없습니다." };
  }

  return { ok: true, board: next, captured, key };
}

function legalMoves(color) {
  const previousKey = state.history.at(-2)?.key;
  const moves = [];
  for (let r = 0; r < state.size; r += 1) {
    for (let c = 0; c < state.size; c += 1) {
      const result = playMove(state.board, r, c, color, { previousKey });
      if (result.ok) moves.push({ r, c, result });
    }
  }
  return moves;
}

function saveHistory() {
  state.history.push({
    key: boardKey(state.board),
    board: cloneBoard(state.board),
    turn: state.turn,
    captures: { ...state.captures },
    lastMove: state.lastMove ? [...state.lastMove] : null,
    passCount: state.passCount,
    gameOver: state.gameOver,
  });
}

function restoreSnapshot(snapshot) {
  state.board = cloneBoard(snapshot.board);
  state.turn = snapshot.turn;
  state.captures = { ...snapshot.captures };
  state.lastMove = snapshot.lastMove ? [...snapshot.lastMove] : null;
  state.passCount = snapshot.passCount;
  state.gameOver = snapshot.gameOver;
}

function setStatus(title, text) {
  el.statusTitle.textContent = title;
  el.statusText.textContent = text;
}

function ensureMobileNav() {
  if (document.querySelector("#mobileNav")) return;
  const nav = document.createElement("nav");
  nav.id = "mobileNav";
  nav.className = "mobile-nav";
  nav.setAttribute("aria-label", "빠른 이동");
  nav.innerHTML = `
    <button type="button" data-mobile-mode="learn">학습</button>
    <button type="button" data-mobile-mode="ai">AI</button>
    <button type="button" data-mobile-mode="local">2인</button>
    <button type="button" data-mobile-action="review">복기</button>
  `;
  nav.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const mode = button.dataset.mobileMode;
    if (mode) {
      switchMode(mode);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (button.dataset.mobileAction === "review") {
      if (state.mode === "learn" || !state.gameLog.length) {
        setStatus("복기", "대국을 몇 수 진행한 뒤 복기를 열 수 있습니다.");
        return;
      }
      reviewCurrentGame();
      document.querySelector("#reviewTimeline")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  document.body.append(nav);
  nav.querySelector("[data-mobile-mode='learn']")?.classList.add("active");
}

function stoneName(color) {
  return color === BLACK ? "흑" : "백";
}

function lessonType(lesson) {
  const text = `${lesson.title} ${lesson.concept} ${lesson.text}`;
  if (text.includes("사활") || text.includes("눈") || text.includes("사는") || text.includes("죽이는")) return "life";
  if (text.includes("포석") || text.includes("귀") || text.includes("변") || text.includes("중앙") || text.includes("큰")) return "opening";
  if (text.includes("끝내기") || text.includes("경계")) return "endgame";
  if (text.includes("잇") || text.includes("끊") || text.includes("연결")) return "connect";
  if (text.includes("모양") || text.includes("행마") || text.includes("날일자") || text.includes("마늘모")) return "shape";
  if (text.includes("단수") || text.includes("잡") || text.includes("포획") || text.includes("활로")) return "capture";
  return "general";
}

function thinkingStepsFor(lesson) {
  const common = ["상대 돌과 내 돌의 위치를 본다.", "빈 교차점 중 의미 있는 곳만 후보로 남긴다.", "둔 뒤 활로와 연결이 좋아지는지 확인한다."];
  const byType = {
    capture: ["잡을 돌의 활로를 센다.", "마지막 활로 또는 단수 자리를 찾는다.", "내 돌이 잡히는 수인지 확인하고 둔다."],
    connect: ["끊기면 약해지는 돌을 찾는다.", "두 돌 사이의 연결점을 본다.", "연결과 상대 압박을 동시에 하는지 확인한다."],
    shape: ["내 돌 모양이 무겁지 않은지 본다.", "빈삼각을 피하고 뻗음/마늘모/날일자를 비교한다.", "상대가 끊을 약점이 있는지 확인한다."],
    life: ["눈 후보가 어디인지 찾는다.", "두 눈을 만들거나 상대 눈을 없애는 급소를 본다.", "상대가 바로 잡을 수 있는지 확인한다."],
    opening: ["귀, 변, 중앙 순서로 큰 곳을 본다.", "약한 돌보다 큰 빈 자리가 더 큰지 비교한다.", "내 돌과 거리 균형이 좋은 곳을 둔다."],
    endgame: ["흑과 백 집 경계를 찾는다.", "양쪽 집 차이가 가장 많이 나는 곳을 본다.", "선수로 상대가 받아야 하는지 확인한다."],
    general: common,
  };
  return byType[lessonType(lesson)] || common;
}

function goalFor(lesson) {
  const type = lessonType(lesson);
  const goals = {
    capture: "활로를 세고, 상대 돌을 단수 또는 포획으로 몰기.",
    connect: "내 돌은 잇고, 상대 돌은 끊는 자리 구분하기.",
    shape: "나쁜 모양을 피하고 효율 좋은 행마 선택하기.",
    life: "사는 급소와 죽이는 급소를 찾기.",
    opening: "작은 접전보다 큰 자리와 방향 판단하기.",
    endgame: "집 경계를 닫고 큰 끝내기부터 두기.",
    general: "문제 의도를 읽고 가장 효율 좋은 한 수 찾기.",
  };
  return goals[type] || goals.general;
}

function answerExplanation(lesson) {
  const [r, c] = lesson.targets[0];
  const coord = `${r + 1}행 ${c + 1}열`;
  const type = lessonType(lesson);
  const board = emptyBoard(9);
  for (const [sr, sc, color] of lesson.board) board[sr][sc] = color;
  const diagnostics = lessonDiagnostics(lesson, r, c, board);
  const why = {
    capture: "그 자리는 상대 활로를 줄이거나 마지막 활로를 막습니다.",
    connect: "그 자리는 내 돌의 연결을 지키거나 상대 연결을 끊습니다.",
    shape: "그 자리는 돌 모양을 가볍고 단단하게 만듭니다.",
    life: "그 자리는 눈 모양의 중심이라 삶과 죽음을 가릅니다.",
    opening: "그 자리는 판 전체에서 큰 자리라 초반 효율이 좋습니다.",
    endgame: "그 자리는 집 경계를 확정해 실점과 득점을 동시에 만듭니다.",
    general: "그 자리는 현재 문제의 핵심 목적을 가장 직접 해결합니다.",
  };
  return `정답은 ${coord}입니다. ${why[type] || why.general} ${diagnostics}`;
}

function lessonDiagnostics(lesson, r, c, board = state.board) {
  const opponent = lesson.turn === BLACK ? WHITE : BLACK;
  const beforeAtari = countAtariGroups(board, opponent);
  const result = playMove(board, r, c, lesson.turn);
  if (!result.ok) return "이 수는 문제 조건에서만 의미를 확인하세요.";
  const afterAtari = countAtariGroups(result.board, opponent);
  const group = groupAt(result.board, r, c);
  const captured = result.captured.length;
  const captureText = captured ? `상대 돌 ${captured}개를 잡습니다.` : "";
  const atariText = afterAtari > beforeAtari ? `상대 단수 무리가 ${afterAtari - beforeAtari}개 늘어납니다.` : "";
  const libertyText = `둔 뒤 내 돌 활로는 ${group.liberties.size}개입니다.`;
  return [captureText, atariText, libertyText].filter(Boolean).join(" ");
}

function mistakeExplanation(lesson, r, c) {
  const [ar, ac] = lesson.targets[0];
  const type = lessonType(lesson);
  const advice = {
    capture: "틀린 수는 상대 활로를 충분히 줄이지 못했습니다. 마지막 활로부터 다시 세어보세요.",
    connect: "틀린 수는 연결점 또는 절단점을 직접 해결하지 못했습니다. 두 돌 사이 빈 곳을 먼저 보세요.",
    shape: "틀린 수는 모양 효율이 낮습니다. 빈삼각이 되는지, 활로가 좁아지는지 확인하세요.",
    life: "틀린 수는 눈의 중심 급소를 놓쳤습니다. 두 눈을 만들거나 없애는 중심점을 찾으세요.",
    opening: "틀린 수는 판 전체에서 작은 자리일 수 있습니다. 귀와 변의 큰 곳을 다시 비교하세요.",
    endgame: "틀린 수는 집 차이가 작습니다. 내 집 증가와 상대 집 감소가 동시에 있는 경계를 보세요.",
    general: "틀린 수는 문제 목표와 직접 연결되지 않았습니다. 후보수 2개로 줄여 다시 비교하세요.",
  };
  return `내 수 ${coordLabel(r, c)} / 정답 ${coordLabel(ar, ac)}. ${advice[type] || advice.general}`;
}

function renderLearningAids(lesson) {
  el.thinkingSteps.innerHTML = "";
  for (const step of thinkingStepsFor(lesson)) {
    const li = document.createElement("li");
    li.textContent = step;
    el.thinkingSteps.append(li);
  }
  el.lessonGoal.textContent = goalFor(lesson);
  el.answerNote.classList.add("hidden");
  el.answerNote.textContent = "";
}

function renderTerms() {
  el.termList.innerHTML = "";
  for (const [name, description] of terms) {
    const item = document.createElement("div");
    item.className = "term";
    item.innerHTML = `<strong>${name}</strong><span>${description}</span>`;
    el.termList.append(item);
  }
  renderConceptChecklist();
}

function updateTrainingCounts() {
  const summary = el.termsPanel.querySelector("summary strong");
  if (summary) summary.textContent = `${terms.length}개 + ${drillBank.length}문제`;
}

function setupLesson() {
  const lesson = state.activeDrill || lessons[state.lessonIndex];
  state.mode = "learn";
  state.size = 9;
  el.board.classList.remove("full-board");
  state.board = emptyBoard(9);
  state.turn = lesson.turn;
  state.lastMove = null;
  state.locked = false;
  state.revealedAnswer = null;
  state.hintLevel = 0;
  state.softHintTargets = [];
  state.coachCandidates = [];
  state.readingDepth = 0;
  state.conceptQuiz = null;
  state.gameOver = false;
  state.history = [];
  state.passCount = 0;
  state.captures = { [BLACK]: 0, [WHITE]: 0 };
  for (const [r, c, color] of lesson.board) state.board[r][c] = color;
  saveHistory();
  el.lessonStep.textContent = lesson.isChapterTest ? `단원 테스트 ${state.testCorrect}/${state.testTotal}` : state.activeDrill ? `훈련 ${drillBank.length}문제 중 랜덤` : `${state.lessonIndex + 1} / ${lessons.length}`;
  el.lessonTitle.textContent = lesson.title;
  el.lessonProgress.style.width = `${((state.lessonIndex + 1) / lessons.length) * 100}%`;
  el.lessonConcept.textContent = lesson.concept;
  el.lessonText.textContent = lesson.text;
  renderLearningAids(lesson);
  updateLearningBoost(lesson);
  document.querySelector("#readingCard")?.classList.add("hidden");
  document.querySelector("#quizCard")?.classList.add("hidden");
  document.querySelector("#nextStepCard")?.classList.add("hidden");
  el.boardLabel.textContent = "입문 훈련";
  el.boardTitle.textContent = lesson.title;
  el.topPlayerName.textContent = "학습 목표";
  el.topPlayerMeta.textContent = lessonType(lesson);
  el.topTimer.textContent = lesson.isChapterTest ? `${state.testCorrect}/${state.testTotal}` : `${state.lessonIndex + 1}/${lessons.length}`;
  el.bottomPlayerName.textContent = "나";
  el.bottomPlayerMeta.textContent = "정답을 찾는 중";
  el.bottomTimer.textContent = lesson.isChapterTest ? "TEST" : state.activeDrill ? "DRILL" : "LESSON";
  el.prevLesson.disabled = state.lessonIndex === 0;
  el.nextLesson.textContent = lesson.isChapterTest ? "다음 테스트" : state.activeDrill ? "코스로" : state.lessonIndex === lessons.length - 1 ? "처음으로" : "다음";
  setStatus("연습", "설명을 읽고 표시된 좋은 수를 찾아 두세요.");
  render();
}

function startGame(mode) {
  ensureGameReviewButton();
  state.mode = mode;
  state.size = Number(el.boardSize.value);
  el.board.classList.toggle("full-board", state.size === 19);
  state.board = emptyBoard(state.size);
  state.turn = BLACK;
  state.captures = { [BLACK]: 0, [WHITE]: 0 };
  state.lastMove = null;
  state.locked = false;
  state.revealedAnswer = null;
  state.gameOver = false;
  state.passCount = 0;
  state.history = [];
  state.gameLog = [];
  state.reviewIndex = null;
  state.coachCandidates = [];
  state.lastCoachText = "";
  state.lastCoachTags = [];
  saveHistory();
  el.boardLabel.textContent = mode === "ai" ? "AI 대국" : "2인 대국";
  el.boardTitle.textContent = mode === "ai" ? "흑으로 AI와 두기" : "서로 번갈아 두기";
  el.topPlayerName.textContent = mode === "ai" ? "AI 백" : "백";
  el.topPlayerMeta.textContent = "상대 · 6.5 덤";
  el.topTimer.textContent = "10:00";
  el.bottomPlayerName.textContent = mode === "ai" ? "플레이어 흑" : "흑";
  el.bottomPlayerMeta.textContent = "선착";
  el.bottomTimer.textContent = "10:00";
  updateGameCoach("대국 코치 준비", mode === "ai" ? "흑으로 착수하면 AI 코치가 후보수와 위험 요소를 비교합니다." : "착수마다 후보수, 포획, 단수, 자충 위험을 기록합니다.", [], ["후보수", "복기 태그"]);
  setStatus("새 대국", mode === "ai" ? "당신은 흑입니다. AI는 백입니다." : "흑부터 시작합니다.");
  render();
}

function switchMode(mode) {
  el.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.mode === mode));
  document.querySelectorAll("[data-mobile-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mobileMode === mode));
  el.lessonPanel.classList.toggle("hidden", mode !== "learn");
  el.termsPanel.classList.toggle("hidden", mode !== "learn");
  el.gamePanel.classList.toggle("hidden", mode === "learn");
  if (mode === "learn") {
    state.activeDrill = null;
    setupLesson();
  }
  else startGame(mode);
}

function handlePoint(r, c) {
  if (state.locked || state.gameOver) return;
  if (state.reviewIndex !== null) {
    setStatus("복기 중", "현재로 돌아온 뒤 착수하세요.");
    return;
  }
  if (state.mode === "learn") return handleLessonMove(r, c);
  if (state.mode === "ai" && state.turn === WHITE) return;
  handleGameMove(r, c);
}

function handleLessonMove(r, c) {
  const lesson = state.activeDrill || lessons[state.lessonIndex];
  const type = lessonType(lesson);
  state.attemptCount += 1;
  const ok = lesson.targets.some(([tr, tc]) => tr === r && tc === c);
  if (!ok) {
    if (state.activeDrill?.id) state.mistakes.add(state.activeDrill.id);
    recordWeakness(type, false);
    addWrongNote(lesson, r, c);
    state.streak = 0;
    updateLearningBoost(lesson);
    saveProgress();
    const steps = thinkingStepsFor(lesson);
    el.answerNote.textContent = mistakeExplanation(lesson, r, c);
    el.answerNote.classList.remove("hidden");
    setStatus("다시 보기", `${steps[0]} ${steps[1]}`);
    return;
  }
  const result = playMove(state.board, r, c, state.turn);
  if (!result.ok) {
    setStatus("둘 수 없음", result.reason);
    return;
  }
  state.board = result.board;
  state.lastMove = [r, c];
  state.captures[state.turn] += result.captured.length;
  state.locked = true;
  state.revealedAnswer = null;
  if (lesson.retryNoteId) {
    const note = state.wrongNotes.find((item) => item.id === lesson.retryNoteId);
    if (note) scheduleWrongNote(note, true);
  }
  if (state.activeDrill?.id) state.mistakes.delete(state.activeDrill.id);
  if (lesson.isChapterTest) {
    state.testCorrect += 1;
    if (Number.isInteger(lesson.sourceLessonIndex)) state.completedLessons.add(lesson.sourceLessonIndex);
  } else if (!state.activeDrill) state.completedLessons.add(state.lessonIndex);
  recordWeakness(type, true);
  state.correctCount += 1;
  state.streak += 1;
  setStatus("성공", lesson.success);
  el.answerNote.textContent = answerExplanation(lesson);
  el.answerNote.classList.remove("hidden");
  updateLearningBoost(lesson);
  saveProgress();
  render();
}

function showCurrentAnswer() {
  const lesson = state.activeDrill || lessons[state.lessonIndex];
  state.hintLevel = 3;
  state.softHintTargets = [];
  el.answerNote.textContent = answerExplanation(lesson);
  el.answerNote.classList.remove("hidden");
  const [r, c] = lesson.targets[0];
  state.revealedAnswer = [r, c];
  render();
  setStatus("정답 보기", "정답 위치를 표시했습니다. 왜 그 자리인지 해설을 읽고 다시 풀어보세요.");
}

function startRandomDrill() {
  const category = el.drillCategory.value;
  const difficulty = el.drillDifficulty.value;
  let pool = category === "all" ? drillBank : drillBank.filter((drill) => drill.category === category);
  if (difficulty === "mistake") {
    pool = pool.filter((drill) => state.mistakes.has(drill.id));
  } else if (difficulty !== "all") {
    pool = pool.filter((drill) => drill.difficulty === difficulty);
  }
  if (!pool.length) {
    setStatus("문제 없음", difficulty === "mistake" ? "아직 오답 기록이 없습니다." : "해당 조건의 문제가 없습니다.");
    return;
  }
  state.activeDrill = pool[Math.floor(Math.random() * pool.length)];
  setupLesson();
  setStatus("반복 훈련", `${state.activeDrill.title} 유형입니다.`);
}

function handleGameMove(r, c) {
  const previousKey = state.history.at(-2)?.key;
  const result = playMove(state.board, r, c, state.turn, { previousKey });
  if (!result.ok) {
    setStatus("둘 수 없음", result.reason);
    return;
  }

  const playedColor = state.turn;
  const candidates = state.mode === "learn" ? [] : topMoveCandidates(playedColor);
  const coach = state.mode === "learn" ? null : coachTextForMove(playedColor, r, c, result, candidates);
  state.board = result.board;
  state.lastMove = [r, c];
  state.captures[playedColor] += result.captured.length;
  const logEntry = { color: playedColor, r, c, captured: result.captured.length, historyIndex: null, tags: coach?.tags || [] };
  state.gameLog.push(logEntry);
  state.turn = playedColor === BLACK ? WHITE : BLACK;
  state.passCount = 0;
  saveHistory();
  logEntry.historyIndex = state.history.length - 1;
  updateReviewTimeline();

  const capturedText = result.captured.length ? ` ${result.captured.length}개 잡았습니다.` : "";
  setStatus("착수", `${stoneName(state.turn)} 차례입니다.${capturedText}`);
  updateMission(playedColor, result);
  if (coach) {
    const title = state.mode === "ai" && playedColor === WHITE ? "AI 수 설명" : "내 수 코치";
    updateGameCoach(title, coach.text, candidates, coach.tags);
  }
  render();

  if (state.mode === "ai" && state.turn === WHITE) {
    state.locked = true;
    window.setTimeout(aiMove, 360);
  }
}

function passTurn() {
  if (state.locked || state.gameOver) return;
  if (state.reviewIndex !== null) {
    setStatus("복기 중", "현재로 돌아온 뒤 패스하세요.");
    return;
  }
  state.turn = state.turn === BLACK ? WHITE : BLACK;
  state.passCount += 1;
  saveHistory();
  if (state.passCount >= 2) {
    finishGame();
    return;
  }
  setStatus("패스", `${stoneName(state.turn)} 차례입니다. 양쪽이 연속 패스하면 종국입니다.`);
  render();
  if (state.mode === "ai" && state.turn === WHITE) {
    state.locked = true;
    window.setTimeout(aiMove, 360);
  }
}

function undoMove() {
  if (state.mode === "learn" || state.history.length <= 1) return;
  state.history.pop();
  if (state.mode === "ai") {
    while (state.history.length > 1 && state.history.at(-1).turn !== BLACK) state.history.pop();
  }
  restoreSnapshot(state.history.at(-1));
  state.gameLog = state.gameLog.filter((move) => move.historyIndex < state.history.length);
  state.reviewIndex = null;
  state.locked = false;
  setStatus("되돌림", `${stoneName(state.turn)} 차례로 돌아갔습니다.`);
  updateReviewTimeline();
  render();
}

function aiMove() {
  if (state.gameOver) return;
  const move = chooseAiMove();
  if (!move) {
    state.locked = false;
    passTurn();
    return;
  }
  state.locked = false;
  handleGameMove(move.r, move.c);
}

function chooseAiMove() {
  const moves = legalMoves(WHITE);
  if (!moves.length) return null;

  for (const move of moves) {
    move.score = scoreMove(move, WHITE);
  }

  moves.sort((a, b) => b.score - a.score);
  if (state.aiLevel === "easy") return moves[Math.min(moves.length - 1, Math.floor(Math.random() * Math.min(8, moves.length)))];
  if (state.aiLevel === "hard") return moves[0];
  return moves[Math.min(moves.length - 1, Math.floor(Math.random() * Math.min(3, moves.length)))];
}

function scoreMove(move, color) {
  const { r, c, result } = move;
  const opponent = color === BLACK ? WHITE : BLACK;
  const after = result.board;
  const own = groupAt(after, r, c);
  const opponentAtari = countAtariGroups(after, opponent);
  const ownAtari = countAtariGroups(after, color);
  const territory = estimateScore(after);
  const territorySwing = color === BLACK ? territory.black - territory.white : territory.white - territory.black;
  const center = Math.abs(r - (state.size - 1) / 2) + Math.abs(c - (state.size - 1) / 2);
  const neighborBonus = neighbors(r, c, state.size).filter(([nr, nc]) => state.board[nr][nc] !== EMPTY).length;
  const starBonus = starPoints(state.size).some(([sr, sc]) => sr === r && sc === c) ? 7 : 0;

  return (
    result.captured.length * 145 +
    opponentAtari * 26 -
    ownAtari * 38 +
    own.liberties.size * 5 +
    territorySwing +
    neighborBonus * 2 +
    starBonus -
    center * 0.28 +
    Math.random() * 2
  );
}

function topMoveCandidates(color) {
  const moves = legalMoves(color);
  for (const move of moves) {
    move.score = scoreMove(move, color);
    move.reason = moveReason(move, color);
  }
  return moves.sort((a, b) => b.score - a.score).slice(0, 3);
}

function moveReason(move, color) {
  const opponent = color === BLACK ? WHITE : BLACK;
  const own = groupAt(move.result.board, move.r, move.c);
  if (move.result.captured.length) return `${move.result.captured.length}개 포획`;
  if (countAtariGroups(move.result.board, opponent) > 0) return "상대 단수";
  if (countAtariGroups(move.result.board, color) > 0 || own.liberties.size <= 1) return "위험 확인";
  if (starPoints(state.size).some(([sr, sc]) => sr === move.r && sc === move.c)) return "큰 자리";
  if (own.liberties.size >= 4) return "활로 안정";
  return "모양 정리";
}

function coachTagsForMove(move, color) {
  const opponent = color === BLACK ? WHITE : BLACK;
  const tags = [];
  const own = groupAt(move.result.board, move.r, move.c);
  if (move.result.captured.length) tags.push("포획 성공");
  if (countAtariGroups(move.result.board, opponent) > 0) tags.push("단수 압박");
  if (countAtariGroups(move.result.board, color) > 0 || own.liberties.size <= 1) tags.push("자충 위험");
  if (!tags.length && own.liberties.size >= 4) tags.push("안정된 모양");
  if (!tags.length) tags.push("후보수 비교");
  return tags;
}

function coachTextForMove(color, r, c, result, candidates) {
  const played = candidates.find((move) => move.r === r && move.c === c);
  const best = candidates[0];
  const tags = coachTagsForMove({ r, c, result, score: played?.score || 0 }, color);
  const bestText = best ? `추천 후보는 ${coordLabel(best.r, best.c)}(${best.reason})입니다.` : "추천 후보가 없습니다.";
  const playedText = played ? `${coordLabel(r, c)} 수는 후보 ${candidates.indexOf(played) + 1}순위입니다.` : `${coordLabel(r, c)} 수는 AI 상위 후보 밖입니다.`;
  const captureText = result.captured.length ? ` ${result.captured.length}개를 잡아 실리가 큽니다.` : "";
  const warning = tags.includes("자충 위험") ? " 둔 뒤 내 돌 활로가 좁아 다음 수 반격을 꼭 확인하세요." : "";
  return { text: `${stoneName(color)} ${playedText}${captureText} ${bestText}${warning}`, tags };
}

function bestTacticalMove(color) {
  const moves = legalMoves(color);
  if (!moves.length) return null;
  for (const move of moves) move.score = scoreMove(move, color);
  moves.sort((a, b) => b.score - a.score);
  return moves[0];
}

function isTacticalMove(move, color) {
  if (!move) return false;
  const opponent = color === BLACK ? WHITE : BLACK;
  return move.result.captured.length > 0 || countAtariGroups(move.result.board, opponent) > 0;
}

function countAtariGroups(board, color) {
  const seen = new Set();
  let count = 0;
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board.length; c += 1) {
      if (board[r][c] !== color || seen.has(`${r},${c}`)) continue;
      const group = groupAt(board, r, c);
      group.stones.forEach(([sr, sc]) => seen.add(`${sr},${sc}`));
      if (group.liberties.size === 1) count += 1;
    }
  }
  return count;
}

function estimateScore(board = state.board) {
  const seen = new Set();
  const score = { black: 0, white: KOMI };

  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board.length; c += 1) {
      if (board[r][c] === BLACK) score.black += 1;
      if (board[r][c] === WHITE) score.white += 1;
      if (board[r][c] !== EMPTY || seen.has(`${r},${c}`)) continue;

      const region = [];
      const borders = new Set();
      const stack = [[r, c]];
      seen.add(`${r},${c}`);

      while (stack.length) {
        const [cr, cc] = stack.pop();
        region.push([cr, cc]);
        for (const [nr, nc] of neighbors(cr, cc, board.length)) {
          if (board[nr][nc] === EMPTY && !seen.has(`${nr},${nc}`)) {
            seen.add(`${nr},${nc}`);
            stack.push([nr, nc]);
          } else if (board[nr][nc] !== EMPTY) {
            borders.add(board[nr][nc]);
          }
        }
      }

      if (borders.size === 1 && borders.has(BLACK)) score.black += region.length;
      if (borders.size === 1 && borders.has(WHITE)) score.white += region.length;
    }
  }

  return score;
}

function finishGame() {
  state.gameOver = true;
  const score = estimateScore();
  const winner = score.black > score.white ? "흑" : "백";
  const margin = Math.abs(score.black - score.white).toFixed(1);
  setStatus("종국", `중국식 간이 계가: 흑 ${score.black.toFixed(1)} / 백 ${score.white.toFixed(1)}. ${winner} ${margin}집 승.`);
  updateMission(state.turn === BLACK ? WHITE : BLACK, { captured: [] });
  render();
}

function findAtari(board, color) {
  const seen = new Set();
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board.length; c += 1) {
      if (board[r][c] !== color || seen.has(`${r},${c}`)) continue;
      const group = groupAt(board, r, c);
      group.stones.forEach(([sr, sc]) => seen.add(`${sr},${sc}`));
      if (group.liberties.size === 1) return { color, liberty: [...group.liberties][0] };
    }
  }
  return null;
}

function showHint() {
  if (state.mode === "learn") {
    const lesson = state.activeDrill || lessons[state.lessonIndex];
    state.hintLevel = Math.min(3, state.hintLevel + 1);
    if (state.hintLevel === 1) {
      setStatus("힌트 1단계", lesson.hint);
      return;
    }
    if (state.hintLevel === 2) {
      state.softHintTargets = hintCandidates(lesson);
      render();
      setStatus("힌트 2단계", "후보 지점을 표시했습니다. 표시된 곳 중 문제 목표와 가장 직접 맞는 수를 골라보세요.");
      return;
    }
    showCurrentAnswer();
    return;
  }
  const target = findAtari(state.board, state.turn === BLACK ? WHITE : BLACK);
  if (target) {
    setStatus("힌트", `${stoneName(target.color)}돌이 단수입니다. 표시된 마지막 활로를 막아보세요.`);
    return;
  }
  const ownDanger = findAtari(state.board, state.turn);
  if (ownDanger) {
    setStatus("힌트", `내 ${stoneName(state.turn)}돌이 단수입니다. 늘거나 잡아서 살리세요.`);
    return;
  }
  setStatus("힌트", "상대 돌 옆에 붙여 활로를 줄이거나, 내 돌을 연결해 활로를 늘리세요.");
}

function starPoints(size) {
  if (size === 9) return [[2, 2], [2, 6], [4, 4], [6, 2], [6, 6]];
  if (size === 13) return [[3, 3], [3, 9], [6, 6], [9, 3], [9, 9]];
  return [[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]];
}

function coordStyle(r, c) {
  const spread = 88;
  return {
    left: `${6 + (c / (state.size - 1)) * spread}%`,
    top: `${6 + (r / (state.size - 1)) * spread}%`,
  };
}

function drawGrid() {
  for (let i = 0; i < state.size; i += 1) {
    const pos = 6 + (i / (state.size - 1)) * 88;
    const v = document.createElement("span");
    v.className = "line vertical";
    v.style.left = `${pos}%`;
    const h = document.createElement("span");
    h.className = "line horizontal";
    h.style.top = `${pos}%`;
    el.board.append(v, h);
  }

  for (const [r, c] of starPoints(state.size)) {
    const star = document.createElement("span");
    star.className = "star";
    const pos = coordStyle(r, c);
    star.style.left = pos.left;
    star.style.top = pos.top;
    el.board.append(star);
  }
}

function render() {
  el.board.innerHTML = "";
  const pointSize = state.size >= 19 ? 6.2 : state.size >= 13 ? 8 : Math.min(12.5, Math.max(6.2, 86 / state.size));
  el.board.style.setProperty("--point-size", `${pointSize}%`);
  drawGrid();

  const lesson = state.activeDrill || lessons[state.lessonIndex];
  const reviewMove = state.reviewIndex !== null ? state.gameLog[state.reviewIndex] : null;
  const reviewSnapshot = reviewMove ? state.history[reviewMove.historyIndex] || state.history[state.reviewIndex + 1] : null;
  const displayBoard = reviewSnapshot ? reviewSnapshot.board : state.board;
  const displayLastMove = reviewSnapshot?.lastMove || state.lastMove;
  const displayCaptures = reviewSnapshot?.captures || state.captures;
  const targets = state.mode === "learn" && !lesson.hideTarget && !state.locked ? lesson.targets : [];
  const atari = state.mode !== "learn" ? findAtari(displayBoard, state.turn === BLACK ? WHITE : BLACK) : null;
  const score = estimateScore(displayBoard);

  for (let r = 0; r < state.size; r += 1) {
    for (let c = 0; c < state.size; c += 1) {
      const point = document.createElement("button");
      point.className = "point";
      const pos = coordStyle(r, c);
      point.style.left = pos.left;
      point.style.top = pos.top;
      point.setAttribute("aria-label", `${r + 1}행 ${c + 1}열`);
      point.addEventListener("click", () => handlePoint(r, c));
      if (displayBoard[r][c] === EMPTY && !state.locked && !state.gameOver && state.reviewIndex === null) point.classList.add("playable");
      if (targets.some(([tr, tc]) => tr === r && tc === c)) point.classList.add("target");
      if (state.revealedAnswer?.[0] === r && state.revealedAnswer?.[1] === c) point.classList.add("answer");
      if (state.softHintTargets.some(([hr, hc]) => hr === r && hc === c)) point.classList.add("hint-candidate");
      if (state.coachCandidates.some(([hr, hc]) => hr === r && hc === c)) point.classList.add("coach-candidate");
      if (atari?.liberty === `${r},${c}`) point.classList.add("hint");
      if (displayLastMove?.[0] === r && displayLastMove?.[1] === c) point.classList.add("last");
      if (displayBoard[r][c] !== EMPTY) {
        const stone = document.createElement("span");
        stone.className = `stone ${displayBoard[r][c] === BLACK ? "black" : "white"}`;
        point.append(stone);
      }
      el.board.append(point);
    }
  }

  el.turnText.textContent = stoneName(state.turn);
  el.blackCaps.textContent = displayCaptures[BLACK];
  el.whiteCaps.textContent = displayCaptures[WHITE];
  el.blackScore.textContent = score.black.toFixed(1);
  el.whiteScore.textContent = score.white.toFixed(1);
  el.undoMove.disabled = state.mode === "learn" || state.history.length <= 1;
  updateReviewTimeline();
}

el.tabs.forEach((tab) => tab.addEventListener("click", () => switchMode(tab.dataset.mode)));
el.prevLesson.addEventListener("click", () => {
  state.lessonIndex = Math.max(0, state.lessonIndex - 1);
  saveProgress();
  setupLesson();
});
el.resetLesson.addEventListener("click", setupLesson);
el.nextLesson.addEventListener("click", () => {
  if (state.activeDrill?.isChapterTest) {
    loadNextTestQuestion();
    return;
  }
  if (state.activeDrill) {
    state.activeDrill = null;
    setupLesson();
    return;
  }
  state.lessonIndex = (state.lessonIndex + 1) % lessons.length;
  saveProgress();
  setupLesson();
});
el.randomDrill.addEventListener("click", startRandomDrill);
el.showAnswer.addEventListener("click", showCurrentAnswer);
el.newGame.addEventListener("click", () => startGame(state.mode));
el.undoMove.addEventListener("click", undoMove);
el.passTurn.addEventListener("click", passTurn);
el.boardSize.addEventListener("change", () => {
  if (state.mode !== "learn") startGame(state.mode);
});
el.hintButton.addEventListener("click", showHint);

loadProgress();
ensureMobileNav();
renderTerms();
updateTrainingCounts();
setupLesson();
resetViewportTop();
window.addEventListener("load", resetViewportTop);
window.addEventListener("pageshow", resetViewportTop);
setStatus("학습 준비", "진도와 약점 기록을 이 브라우저에 자동 저장합니다.");
