# 큰돌 콘텐츠 운영 계획

검색 유입을 늘리기 위한 글은 초보자가 실제로 막히는 질문에서 출발합니다. 글을 추가할 때마다 `learn.html`, `sitemap.xml`, 관련 글 링크를 함께 갱신합니다.

## 작성 원칙

- 제목은 사용자가 검색할 만한 질문이나 개념으로 작성
- 첫 문단에서 답을 먼저 말하고, 뒤에서 예시를 설명
- 앱 안에서 바로 연습할 수 있는 행동을 마지막에 제안
- 광고보다 학습 흐름이 먼저 보이게 구성
- 새 글은 최소 2개 이상의 관련 글로 연결
- `node scripts/check-content-quality.cjs`에서 너무 짧은 글, h1/lead/h2, 관련 링크, 광고 자리 누락을 확인

## 1차 확장 후보

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 단수 연습을 잘하는 법 | 단수 문제를 풀어도 실전에서 놓치는 이유 | `baduk-atari-practice.html`, `baduk-atari.html`, `baduk-liberties.html` |
| 완료 | 바둑 사활 문제를 처음 푸는 법 | 두 눈, 급소, 가짜 눈을 구분하고 싶은 초보자 | `baduk-life-and-death-practice.html`, `baduk-life-and-death.html`, `baduk-glossary.html` |
| 완료 | 오목에서 열린 3을 막아야 하는 이유 | 오목 초보가 자주 지는 패턴 이해 | `omok-open-three.html`, `omok-strategy.html`, `omok-threats.html` |
| 완료 | 9줄 바둑으로 입문하는 이유 | 19줄이 너무 어려운 초보자 | `baduk-9x9-beginner.html`, `baduk-beginner.html`, `learn.html` |
| 완료 | 바둑 끝내기에서 큰 수를 찾는 법 | 후반에 집 차이를 줄이는 방법 | `baduk-endgame-big-move.html`, `baduk-endgame.html`, `baduk-sente-gote.html` |
| 완료 | 바둑 포석에서 귀를 먼저 두는 이유 | 초반 큰 자리와 귀/변/중앙 이해 | `baduk-opening-corner.html`, `baduk-opening.html`, `baduk-beginner.html` |
| 완료 | 바둑 AI와 두고 복기하는 법 | 앱 사용법과 학습 루틴 이해 | `baduk-ai-review.html`, `learn.html`, `faq.html` |
| 완료 | 오목 AI 난이도 선택법 | 오목 AI 난이도 검색 유입과 앱 사용법 | `omok-ai-difficulty.html` |

## 2차 확장 후보

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 오목 난이도별 연습 루틴 | 오목 AI 난이도를 고른 뒤 어떻게 연습할지 알고 싶은 사용자 | `omok-practice-routine.html`, `omok-ai-difficulty.html`, `omok-open-three.html`, `omok-threats.html` |
| 완료 | 바둑 10급에서 5급으로 가는 공부 순서 | 기초 이후 중급으로 올라가는 학습 경로 검색 | `baduk-10k-to-5k.html`, `baduk-life-and-death-practice.html`, `baduk-endgame-big-move.html`, `baduk-ai-review.html` |
| 완료 | 바둑에서 잡아도 손해인 돌을 구분하는 법 | 초보가 모든 돌을 잡으려다 손해 보는 상황 이해 | `baduk-profitable-capture.html`, `baduk-atari-practice.html`, `baduk-sente-gote.html`, `baduk-opening-corner.html` |
| 완료 | 오목에서 공격과 수비 우선순위 정하기 | 4목 차단, 열린 3, 내 공격 중 무엇이 먼저인지 검색 | `omok-attack-defense-priority.html`, `omok-strategy.html`, `omok-open-three.html`, `omok-threats.html` |
| 완료 | 바둑 복기 노트 쓰는 법 | AI 대국 후 실수를 기록하고 반복 학습하려는 사용자 | `baduk-review-note.html`, `baduk-ai-review.html`, `baduk-glossary.html`, `learn.html` |

## 월간 운영 루틴

1. Search Console에서 노출 또는 클릭이 생긴 검색어를 확인합니다.
2. 기존 글로 답할 수 있으면 해당 글의 첫 문단과 관련 링크를 보강합니다.
3. 기존 글로 답하기 어렵다면 위 후보 중 하나를 새 글로 만듭니다.
4. 새 글을 `learn.html`에 추가합니다.
5. 새 글을 `sitemap.xml`에 추가합니다.
6. 새 글과 기존 글 사이에 `related-learning` 링크를 연결합니다.
7. 아래 명령으로 배포 전 점검을 실행합니다.
8. 아래 명령으로 다음 보강 후보를 확인합니다.

```powershell
node scripts/preflight.cjs
node scripts/content-report.cjs
node scripts/content-queue.cjs
```

## 글 발행 완료 기록

| 날짜 | 글 | 목적 |
| --- | --- | --- |
| 2026-06-21 | `baduk-beginner.html` | 바둑 입문 검색 유입 |
| 2026-06-25 | `baduk-9x9-beginner.html` | 9줄 바둑 입문 검색 유입 |
| 2026-06-21 | `baduk-atari.html` | 단수 개념 검색 유입 |
| 2026-06-24 | `baduk-atari-practice.html` | 단수 연습법 검색 유입 |
| 2026-06-25 | `baduk-profitable-capture.html` | 잡을 돌과 버릴 돌 판단 검색 유입 |
| 2026-06-21 | `baduk-liberties.html` | 활로 개념 검색 유입 |
| 2026-06-21 | `omok-strategy.html` | 오목 기본 전략 검색 유입 |
| 2026-06-21 | `baduk-glossary.html` | 용어 사전형 유입 |
| 2026-06-21 | `baduk-opening.html` | 포석 기초 검색 유입 |
| 2026-06-25 | `baduk-opening-corner.html` | 포석 귀 우선순위 검색 유입 |
| 2026-06-25 | `baduk-ai-review.html` | 바둑 AI 복기 사용법 검색 유입 |
| 2026-06-25 | `baduk-review-note.html` | 바둑 복기 노트 검색 유입 |
| 2026-06-21 | `baduk-life-and-death.html` | 사활 기초 검색 유입 |
| 2026-06-24 | `baduk-life-and-death-practice.html` | 사활 문제 풀이 검색 유입 |
| 2026-06-25 | `baduk-10k-to-5k.html` | 바둑 10급에서 5급 학습 순서 검색 유입 |
| 2026-06-21 | `baduk-endgame.html` | 끝내기 기초 검색 유입 |
| 2026-06-25 | `baduk-endgame-big-move.html` | 끝내기 큰 수 검색 유입 |
| 2026-06-21 | `baduk-sente-gote.html` | 선수/후수 개념 검색 유입 |
| 2026-06-21 | `omok-threats.html` | 오목 위협 검색 유입 |
| 2026-06-25 | `omok-attack-defense-priority.html` | 오목 공격과 수비 우선순위 검색 유입 |
| 2026-06-25 | `omok-open-three.html` | 오목 열린 3 수비 검색 유입 |
| 2026-06-24 | `omok-ai-difficulty.html` | 오목 AI 난이도 검색 유입 |
| 2026-06-25 | `omok-practice-routine.html` | 오목 난이도별 연습 루틴 검색 유입 |
| 2026-06-21 | `faq.html` | 질문형 검색 유입 |
