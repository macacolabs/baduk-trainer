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
| 완료 | 바둑 5급에서 1급으로 가는 공부법 | 1급을 목표로 후보수 비교와 복기 루틴을 알고 싶은 사용자 | `baduk-5k-to-1k.html`, `baduk-10k-to-5k.html`, `baduk-review-note.html`, `baduk-endgame-big-move.html` |
| 완료 | 바둑에서 잡아도 손해인 돌을 구분하는 법 | 초보가 모든 돌을 잡으려다 손해 보는 상황 이해 | `baduk-profitable-capture.html`, `baduk-atari-practice.html`, `baduk-sente-gote.html`, `baduk-opening-corner.html` |
| 완료 | 오목에서 공격과 수비 우선순위 정하기 | 4목 차단, 열린 3, 내 공격 중 무엇이 먼저인지 검색 | `omok-attack-defense-priority.html`, `omok-strategy.html`, `omok-open-three.html`, `omok-threats.html` |
| 완료 | 바둑 복기 노트 쓰는 법 | AI 대국 후 실수를 기록하고 반복 학습하려는 사용자 | `baduk-review-note.html`, `baduk-ai-review.html`, `baduk-glossary.html`, `learn.html` |
| 완료 | 오목 금수와 자유룰 차이 | 자유룰, 렌주룰, 33/44 금수를 구분하고 싶은 초보자 | `omok-forbidden-moves.html`, `omok-strategy.html`, `omok-open-three.html`, `omok-attack-defense-priority.html` |

## 3차 확장 후보

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 19줄 바둑은 언제 시작하면 좋을까? | 9줄 바둑에서 19줄 바둑으로 넘어가는 기준을 알고 싶은 입문자 | `baduk-19x19-start.html`, `baduk-9x9-beginner.html`, `baduk-opening-corner.html`, `baduk-review-note.html` |
| 완료 | 바둑 급수표와 공부 순서 | 급수별로 무엇을 공부해야 하는지 알고 싶은 입문자 | `baduk-rank-roadmap.html`, `baduk-beginner.html`, `baduk-10k-to-5k.html`, `baduk-5k-to-1k.html` |
| 완료 | 바둑 초보가 자주 하는 실수 | 계속 지는 이유와 고칠 실수를 알고 싶은 초보자 | `baduk-beginner-mistakes.html`, `baduk-atari.html`, `baduk-profitable-capture.html`, `baduk-review-note.html` |
| 완료 | 오목 4목은 왜 바로 막아야 할까? | 오목에서 상대 4목을 막는 기준을 알고 싶은 입문자 | `omok-block-four.html`, `omok-open-three.html`, `omok-attack-defense-priority.html`, `omok-ai-difficulty.html` |

## 4차 확장 후보

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 빈삼각은 왜 나쁜 모양일까 | 빈삼각, 좋은 모양, 나쁜 모양을 구분하고 싶은 초보자 | `baduk-shape-empty-triangle.html`, `baduk-liberties.html`, `baduk-profitable-capture.html`, `baduk-sente-gote.html` |
| 완료 | 바둑 끊기와 연결은 언제 선택할까 | 연결만 하거나 무리하게 끊는 초보 실수 개선 | `baduk-cut-connect.html`, `baduk-liberties.html`, `baduk-atari-practice.html`, `baduk-shape-empty-triangle.html` |
| 완료 | 오목 양방향 위협을 만드는 법 | 열린 3 이후 복합 위협을 배우고 싶은 사용자 | `omok-double-threat.html`, `omok-threats.html`, `omok-open-three.html`, `omok-attack-defense-priority.html` |
| 완료 | 바둑 대국 후 10분 복기 루틴 | 짧은 시간에 복기하는 법을 찾는 사용자 | `baduk-review-10-minute.html`, `baduk-review-note.html`, `baduk-ai-review.html`, `baduk-5k-to-1k.html` |

## 5차 확장 후보

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 약한 돌을 공격하는 법 | 무리하게 잡으려 하지 않고 상대 약한 돌을 몰아가는 법 | `baduk-attack-weak-stones.html`, `baduk-cut-connect.html`, `baduk-profitable-capture.html`, `baduk-shape-empty-triangle.html` |
| 완료 | 바둑 사활에서 가짜 눈을 구분하는 법 | 두 눈과 가짜 눈을 헷갈리는 초보자 | `baduk-false-eye.html`, `baduk-life-and-death.html`, `baduk-life-and-death-practice.html`, `baduk-glossary.html` |
| 완료 | 오목 수비만 하다 지는 이유 | 막기만 하는 오목 초보가 공격 전환을 배우려는 검색 | `omok-defense-to-attack.html`, `omok-attack-defense-priority.html`, `omok-double-threat.html`, `omok-practice-routine.html` |

## 6차 확장 후보

Search Console 검색어가 쌓이기 전까지는 기초 전술, 행마, 오목 위협 구분처럼 검색 의도가 분명한 주제를 우선 작성합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 축은 어떻게 읽을까 | 단수 이후 축으로 돌을 잡는 원리를 알고 싶은 초보자 | `baduk-ladder.html`, `baduk-atari-practice.html`, `baduk-cut-connect.html`, `baduk-attack-weak-stones.html` |
| 완료 | 바둑 장문은 언제 성립할까 | 축이 안 될 때 장문으로 잡는 모양을 배우려는 사용자 | `baduk-net.html`, `baduk-atari.html`, `baduk-profitable-capture.html`, `baduk-attack-weak-stones.html` |
| 완료 | 바둑 날일자와 한칸뜀은 어떻게 다를까 | 초보 행마와 좋은 모양을 구분하고 싶은 사용자 | `baduk-knight-move.html`, `baduk-shape-empty-triangle.html`, `baduk-liberties.html`, `baduk-cut-connect.html` |
| 완료 | 오목 열린 4와 닫힌 4 차이 | 4목을 언제 반드시 막아야 하는지 헷갈리는 사용자 | `omok-open-four.html`, `omok-block-four.html`, `omok-open-three.html`, `omok-attack-defense-priority.html` |
| 완료 | 오목 중앙을 먼저 잡는 이유 | 오목 첫 수와 초반 위치 선택을 검색하는 입문자 | `omok-center-opening.html`, `omok-strategy.html`, `omok-threats.html`, `omok-double-threat.html` |

## 7차 확장 후보

Search Console 등록 전에는 초보자가 자주 헷갈리는 개념형 검색어를 우선 작성합니다. 등록 후 실제 노출 검색어가 생기면 이 표보다 Search Console 검색어를 우선합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 두터움과 실리는 어떻게 다를까 | 초보자가 두터움, 실리, 세력의 차이를 이해하려는 검색 | `baduk-thickness-territory.html`, `baduk-opening.html`, `baduk-territory-scoring.html`, `baduk-attack-weak-stones.html` |
| 완료 | 바둑 정석은 언제부터 외워야 할까 | 정석 공부를 시작해야 하는 시점과 외우는 범위를 알고 싶은 입문자 | `baduk-joseki-study.html`, `baduk-opening-corner.html`, `baduk-beginner-mistakes.html`, `baduk-10k-to-5k.html` |
| 완료 | 바둑 축머리는 왜 중요할까 | 축이 성립하지 않는 이유와 축머리 개념을 알고 싶은 사용자 | `baduk-ladder-breaker.html`, `baduk-ladder.html`, `baduk-cut-connect.html`, `baduk-attack-weak-stones.html` |
| 완료 | 오목 3-3과 4-4는 왜 위험할까 | 자유룰과 렌주룰 차이를 더 깊게 알고 싶은 오목 입문자 | `omok-double-three-four.html`, `omok-forbidden-moves.html`, `omok-open-three.html`, `omok-open-four.html` |
| 완료 | 오목 선공과 후공은 얼마나 차이날까 | 오목에서 흑이 유리한 이유와 자유룰 한계를 알고 싶은 사용자 | `omok-first-second.html`, `omok-strategy.html`, `omok-center-opening.html`, `omok-forbidden-moves.html` |

## 8차 확장 후보

Search Console 등록 전 마지막 예비 큐입니다. 등록 후에는 실제 노출 검색어를 우선하고, 검색어가 아직 없으면 아래 순서로 작성합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 사활 급소는 어떻게 찾을까 | 사활 문제에서 첫 수 후보를 못 찾는 입문자 | `baduk-life-death-vital-point.html`, `baduk-life-and-death.html`, `baduk-life-and-death-practice.html`, `baduk-false-eye.html` |
| 완료 | 바둑 포석에서 변은 언제 두면 좋을까 | 귀 다음 변과 중앙 선택 기준을 알고 싶은 초보자 | `baduk-side-opening.html`, `baduk-opening.html`, `baduk-opening-corner.html`, `baduk-thickness-territory.html` |
| 완료 | 오목 첫 10수는 무엇을 봐야 할까 | 오목 초반 운영과 중앙 이후 배치를 알고 싶은 사용자 | `omok-first-10-moves.html`, `omok-center-opening.html`, `omok-first-second.html`, `omok-strategy.html` |
| 완료 | 오목 막기 좋은 자리는 어떻게 고를까 | 열린 3이나 4목을 어느 쪽에서 막을지 헷갈리는 사용자 | `omok-blocking-point.html`, `omok-open-three.html`, `omok-open-four.html`, `omok-attack-defense-priority.html` |

## 9차 확장 후보

Search Console 등록이 늦어질 때도 서비스 성장을 멈추지 않기 위한 예비 큐입니다. 실제 검색어가 생기면 이 표보다 검색어 기반 보강을 우선합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 오목 난이도는 어떻게 고르면 좋을까 | 오목 AI 난이도 선택과 본인 실력에 맞는 연습법을 알고 싶은 사용자 | `omok-ai-difficulty.html`, `omok-practice-routine.html`, `omok-strategy.html`, `omok-first-10-moves.html` |
| 완료 | 바둑 1급 목표 하루 루틴 | 1급까지 가기 위한 매일 훈련 순서와 분량을 찾는 사용자 | `baduk-5k-to-1k.html`, `baduk-review-10-minute.html`, `baduk-life-death-vital-point.html`, `baduk-endgame-big-move.html` |
| 완료 | 바둑 후보수는 몇 개를 비교해야 할까 | 한 수를 둘 때 후보수를 고르고 비교하는 법을 배우려는 사용자 | `baduk-5k-to-1k.html`, `baduk-ai-review.html`, `baduk-review-note.html`, `baduk-attack-weak-stones.html` |
| 완료 | 오목에서 3목과 4목 중 무엇이 먼저일까 | 공격과 방어 우선순위를 더 구체적으로 알고 싶은 사용자 | `omok-attack-defense-priority.html`, `omok-open-three.html`, `omok-open-four.html`, `omok-block-four.html` |
| 완료 | 바둑 초반에 중앙은 언제 갈까 | 귀와 변 이후 중앙 진출 기준을 알고 싶은 초보자 | `baduk-opening.html`, `baduk-side-opening.html`, `baduk-thickness-territory.html`, `baduk-attack-weak-stones.html` |
| 완료 | 오목 실수 복기는 어떻게 할까 | 진 판을 보고 다음 대국에서 고칠 점을 찾고 싶은 사용자 | `omok-practice-routine.html`, `omok-ai-difficulty.html`, `omok-defense-to-attack.html`, `omok-blocking-point.html` |

## 10차 확장 후보

Search Console 등록 전까지 큐가 비지 않도록 유지하는 예비 후보입니다. 등록 후에는 실제 검색어를 우선합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 끝내기 실수는 어떻게 줄일까 | 후반에 이기던 판을 뒤집히는 이유와 끝내기 복기 기준을 알고 싶은 사용자 | `baduk-endgame.html`, `baduk-endgame-big-move.html`, `baduk-sente-gote.html`, `baduk-review-10-minute.html` |
| 완료 | 바둑 대마는 왜 죽을까 | 큰 돌이 갑자기 죽는 이유와 약한 돌 관리법을 배우려는 사용자 | `baduk-life-and-death.html`, `baduk-attack-weak-stones.html`, `baduk-false-eye.html`, `baduk-candidate-moves.html` |
| 낮음 | 오목 양방향 공격은 어떻게 막을까 | 상대가 두 곳을 동시에 위협할 때 막는 기준을 알고 싶은 사용자 | `omok-double-threat.html`, `omok-blocking-point.html`, `omok-attack-defense-priority.html`, `omok-open-three.html` |
| 낮음 | 오목 고수 난이도에서 계속 지는 이유 | 고수 AI 난이도에서 패배 원인을 찾고 낮출 기준을 알고 싶은 사용자 | `omok-difficulty-choice.html`, `omok-review-mistakes.html`, `omok-attack-defense-priority.html`, `omok-first-10-moves.html` |

## 월간 운영 루틴

1. Search Console에서 노출 또는 클릭이 생긴 검색어를 확인합니다.
2. 기존 글로 답할 수 있으면 해당 글의 첫 문단과 관련 링크를 보강합니다.
3. 기존 글로 답하기 어렵다면 위 후보 중 하나를 새 글로 만듭니다.
4. 새 글을 `learn.html`에 추가합니다.
5. 새 글을 `scripts/site-content.cjs`에 등록합니다.
6. `node scripts/sync-sitemap.cjs --write`와 `node scripts/sync-feed.cjs --write`를 실행합니다.
7. 새 글과 기존 글 사이에 `related-learning` 링크를 연결합니다.
7. 아래 명령으로 배포 전 점검을 실행합니다.
8. 아래 명령으로 다음 보강 후보를 확인합니다.

```powershell
node scripts/preflight.cjs
node scripts/content-report.cjs
node scripts/content-queue.cjs
node scripts/service-next-action.cjs
```

Search Console에서 새 검색어를 발견했지만 아직 후보 표에 없다면 아래 명령으로 후보를 추가합니다.

```powershell
node scripts/add-content-candidate.cjs --title "검색어에서 나온 글 제목" --intent "검색 의도" --links baduk-beginner.html,baduk-atari.html --priority 중간
```

관련 글은 최소 2개 이상이어야 하며, 실제 존재하는 `.html` 파일만 넣습니다.

## 글 발행 완료 기록

| 날짜 | 글 | 목적 |
| --- | --- | --- |
| 2026-06-21 | `baduk-beginner.html` | 바둑 입문 검색 유입 |
| 2026-06-25 | `baduk-9x9-beginner.html` | 9줄 바둑 입문 검색 유입 |
| 2026-06-25 | `baduk-19x19-start.html` | 19줄 바둑 시작 기준 검색 유입 |
| 2026-06-25 | `baduk-rank-roadmap.html` | 바둑 급수표와 공부 순서 검색 유입 |
| 2026-06-25 | `baduk-beginner-mistakes.html` | 바둑 초보 실수 검색 유입 |
| 2026-06-21 | `baduk-atari.html` | 단수 개념 검색 유입 |
| 2026-06-24 | `baduk-atari-practice.html` | 단수 연습법 검색 유입 |
| 2026-06-25 | `baduk-ladder.html` | 축 읽기와 축머리 검색 유입 |
| 2026-06-25 | `baduk-ladder-breaker.html` | 축머리와 축 깨짐 검색 유입 |
| 2026-06-25 | `baduk-net.html` | 장문 성립 조건 검색 유입 |
| 2026-06-25 | `baduk-cut-connect.html` | 끊기와 연결 판단 검색 유입 |
| 2026-06-25 | `baduk-attack-weak-stones.html` | 약한 돌 공격 검색 유입 |
| 2026-06-25 | `baduk-profitable-capture.html` | 잡을 돌과 버릴 돌 판단 검색 유입 |
| 2026-06-21 | `baduk-liberties.html` | 활로 개념 검색 유입 |
| 2026-06-25 | `baduk-shape-empty-triangle.html` | 빈삼각과 좋은 모양 검색 유입 |
| 2026-06-25 | `baduk-knight-move.html` | 날일자와 한칸뜀 행마 검색 유입 |
| 2026-06-21 | `omok-strategy.html` | 오목 기본 전략 검색 유입 |
| 2026-06-25 | `omok-center-opening.html` | 오목 첫 수와 중앙 선점 검색 유입 |
| 2026-06-25 | `omok-first-second.html` | 오목 선공과 후공 검색 유입 |
| 2026-06-25 | `omok-first-10-moves.html` | 오목 첫 10수 초반 운영 검색 유입 |
| 2026-06-25 | `omok-blocking-point.html` | 오목 막기 좋은 자리 검색 유입 |
| 2026-06-25 | `omok-double-three-four.html` | 오목 3-3과 4-4 금수 검색 유입 |
| 2026-06-21 | `baduk-glossary.html` | 용어 사전형 유입 |
| 2026-06-21 | `baduk-opening.html` | 포석 기초 검색 유입 |
| 2026-06-25 | `baduk-opening-corner.html` | 포석 귀 우선순위 검색 유입 |
| 2026-06-25 | `baduk-side-opening.html` | 포석 변 선택 기준 검색 유입 |
| 2026-06-25 | `baduk-center-opening.html` | 초반 중앙 진출 기준 검색 유입 |
| 2026-06-25 | `baduk-thickness-territory.html` | 바둑 두터움과 실리 검색 유입 |
| 2026-06-25 | `baduk-joseki-study.html` | 바둑 정석 공부 시작 시점 검색 유입 |
| 2026-06-25 | `baduk-ai-review.html` | 바둑 AI 복기 사용법 검색 유입 |
| 2026-06-25 | `baduk-review-note.html` | 바둑 복기 노트 검색 유입 |
| 2026-06-25 | `baduk-review-10-minute.html` | 짧은 복기 루틴 검색 유입 |
| 2026-06-21 | `baduk-life-and-death.html` | 사활 기초 검색 유입 |
| 2026-06-25 | `baduk-large-group-death.html` | 대마 생사와 약한 돌 관리 검색 유입 |
| 2026-06-24 | `baduk-life-and-death-practice.html` | 사활 문제 풀이 검색 유입 |
| 2026-06-25 | `baduk-life-death-vital-point.html` | 바둑 사활 급소 검색 유입 |
| 2026-06-25 | `baduk-false-eye.html` | 가짜 눈 구분 검색 유입 |
| 2026-06-25 | `baduk-10k-to-5k.html` | 바둑 10급에서 5급 학습 순서 검색 유입 |
| 2026-06-25 | `baduk-5k-to-1k.html` | 바둑 5급에서 1급 학습 순서 검색 유입 |
| 2026-06-21 | `baduk-endgame.html` | 끝내기 기초 검색 유입 |
| 2026-06-25 | `baduk-endgame-big-move.html` | 끝내기 큰 수 검색 유입 |
| 2026-06-25 | `baduk-endgame-mistakes.html` | 끝내기 실수 복기 검색 유입 |
| 2026-06-21 | `baduk-sente-gote.html` | 선수/후수 개념 검색 유입 |
| 2026-06-21 | `omok-threats.html` | 오목 위협 검색 유입 |
| 2026-06-25 | `omok-double-threat.html` | 오목 양방향 위협 검색 유입 |
| 2026-06-25 | `omok-attack-defense-priority.html` | 오목 공격과 수비 우선순위 검색 유입 |
| 2026-06-25 | `omok-defense-to-attack.html` | 오목 수비 후 공격 전환 검색 유입 |
| 2026-06-25 | `omok-block-four.html` | 오목 4목 막기 검색 유입 |
| 2026-06-25 | `omok-open-four.html` | 오목 열린 4와 닫힌 4 검색 유입 |
| 2026-06-25 | `omok-open-three.html` | 오목 열린 3 수비 검색 유입 |
| 2026-06-24 | `omok-ai-difficulty.html` | 오목 AI 난이도 검색 유입 |
| 2026-06-25 | `omok-practice-routine.html` | 오목 난이도별 연습 루틴 검색 유입 |
| 2026-06-25 | `omok-review-mistakes.html` | 오목 실수 복기 검색 유입 |
| 2026-06-25 | `omok-forbidden-moves.html` | 오목 금수와 자유룰 검색 유입 |
| 2026-06-21 | `faq.html` | 질문형 검색 유입 |

## 2026-06-25 추가 발행 메모

- `baduk-ko-rule.html`: 바둑 초보자가 자주 검색하는 패 규칙, 패감, 패싸움 기초를 설명합니다.
- 연결 글: `baduk-glossary.html`, `baduk-atari.html`, `baduk-liberties.html`, `baduk-ai-review.html`
- 목적: 규칙 이해형 검색 유입을 늘리고, 앱에서 패 상황을 만났을 때 읽을 수 있는 보조 설명을 제공합니다.
- `baduk-territory-scoring.html`: 집 계산, 계가, 덤, 미정 영역을 초보자 순서로 설명합니다.
- 연결 글: `baduk-endgame.html`, `baduk-endgame-big-move.html`, `baduk-sente-gote.html`, `baduk-glossary.html`
- 목적: 끝내기와 계가 검색 유입을 늘리고, 대국 뒤 형세판단 학습으로 이어지게 합니다.
