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
| 완료 | 오목 양방향 공격은 어떻게 막을까 | 상대가 두 곳을 동시에 위협할 때 막는 기준을 알고 싶은 사용자 | `omok-double-threat.html`, `omok-blocking-point.html`, `omok-attack-defense-priority.html`, `omok-open-three.html` |
| 완료 | 오목 고수 난이도에서 계속 지는 이유 | 고수 AI 난이도에서 패배 원인을 찾고 낮출 기준을 알고 싶은 사용자 | `omok-difficulty-choice.html`, `omok-review-mistakes.html`, `omok-attack-defense-priority.html`, `omok-first-10-moves.html` |

## 11차 확장 후보

Search Console 등록 전까지 운영이 멈추지 않도록, 초보자가 자주 검색할 질문형 주제를 보강합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 산 돌과 죽은 돌은 어떻게 구분할까 | 계가 전 내 돌과 상대 돌이 살아 있는지 죽었는지 헷갈리는 사용자 | `baduk-life-and-death.html`, `baduk-false-eye.html`, `baduk-territory-scoring.html`, `baduk-large-group-death.html` |
| 완료 | 바둑 덤은 왜 6.5집일까 | 바둑 덤과 반집 승부의 의미를 알고 싶은 초보자 | `baduk-territory-scoring.html`, `baduk-beginner.html`, `baduk-rank-roadmap.html`, `baduk-endgame.html` |
| 완료 | 바둑 패싸움은 언제 시작해야 할까 | 패 규칙은 알지만 실전 패싸움 시작 기준을 모르는 사용자 | `baduk-ko-rule.html`, `baduk-sente-gote.html`, `baduk-candidate-moves.html`, `baduk-review-note.html` |
| 완료 | 바둑 잡힌 돌은 버려야 할까 살려야 할까 | 작은 돌을 무리하게 살리다 손해 보는 이유를 알고 싶은 사용자 | `baduk-profitable-capture.html`, `baduk-attack-weak-stones.html`, `baduk-candidate-moves.html`, `baduk-large-group-death.html` |
| 완료 | 오목 금수는 실전에서 언제 문제가 될까 | 자유룰과 렌주룰 차이를 실전 장면으로 이해하려는 사용자 | `omok-forbidden-moves.html`, `omok-double-three-four.html`, `omok-first-second.html`, `omok-strategy.html` |

## 12차 확장 후보

Search Console 등록 전에도 검색 의도가 큰 무료 학습/필승법 키워드는 선제 발행합니다. 실제 검색어가 쌓이면 제목과 첫 문단을 Search Console 표현에 맞춰 조정합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 무료로 배우는 순서 | 무료로 바둑을 시작하려는 입문자가 돈을 쓰기 전 학습 순서를 알고 싶은 검색 | `baduk-free-learn.html`, `baduk-9x9-beginner.html`, `baduk-atari.html`, `baduk-ai-review.html` |
| 완료 | 오목 필승법보다 먼저 알아야 할 것 | 오목 필승법을 찾는 사용자가 실제로는 4목 차단과 열린 3, 양방향 위협을 배우려는 검색 | `omok-winning-strategy.html`, `omok-strategy.html`, `omok-open-three.html`, `omok-double-threat.html` |

## Search Console 전 예비 후보

Search Console 검색어가 아직 없거나 CSV를 받기 전이면 아래 후보로 콘텐츠 큐를 유지합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 규칙 쉽게 배우는 순서 | 바둑 규칙을 처음 검색한 사용자가 착수, 활로, 단수, 패를 순서대로 알고 싶은 검색 | `baduk-rules-order.html`, `baduk-beginner.html`, `baduk-liberties.html`, `baduk-atari.html`, `baduk-ko-rule.html` |
| 완료 | 오목 4목을 놓치지 않는 체크리스트 | 오목에서 바로 지는 4목 차단 실수를 줄이고 싶은 초보자 검색 | `omok-block-four-checklist.html`, `omok-block-four.html`, `omok-blocking-point.html`, `omok-open-four.html`, `omok-defense-to-attack.html` |
| 완료 | 오목 AI와 연습할 때 난이도 올리는 기준 | 오목 AI 난이도를 언제 올려야 하는지 알고 싶은 사용자 검색 | `omok-level-up-timing.html`, `omok-ai-difficulty.html`, `omok-difficulty-choice.html`, `omok-hard-ai-losses.html`, `omok-practice-routine.html` |
| 완료 | 바둑 집 계산 연습을 처음 시작하는 법 | 바둑 계가와 집 계산을 실전 전에 작게 연습하고 싶은 입문자 검색 | `baduk-scoring-practice-guide.html`, `baduk-territory-scoring.html`, `baduk-scoring-practice-start.html`, `baduk-komi-6-5.html`, `baduk-endgame.html` |
| 완료 | 바둑 1급 목표자가 매주 확인할 복기 질문 | 5급 이후 1급을 목표로 대국 복기를 어떻게 해야 하는지 찾는 검색 | `baduk-1k-weekly-review.html`, `baduk-5k-to-1k.html`, `baduk-1k-daily-routine.html`, `baduk-candidate-moves.html`, `baduk-review-note.html` |
| 완료 | 바둑 공배는 언제 메워야 할까 | 끝내기와 계가 직전에 공배를 메워야 하는지 헷갈리는 입문자 검색 | `baduk-neutral-points.html`, `baduk-territory-scoring.html`, `baduk-scoring-practice-guide.html`, `baduk-endgame.html`, `baduk-dead-stones-scoring.html` |
| 완료 | 바둑 빅은 어떻게 구분할까 | 사활에서 서로 잡을 수 없는 빅 모양을 죽은 돌과 구분하려는 검색 | `baduk-seki.html`, `baduk-life-and-death.html`, `baduk-alive-dead-stones.html`, `baduk-false-eye.html`, `baduk-territory-scoring.html` |
| 완료 | 오목 닫힌 3은 언제 막아야 할까 | 열린 3과 닫힌 3의 위험도를 구분하고 막을지 공격할지 고르려는 검색 | `omok-closed-three.html`, `omok-open-three.html`, `omok-three-vs-four.html`, `omok-attack-defense-priority.html`, `omok-when-to-defend.html` |
| 완료 | 오목 후공은 어떻게 반격할까 | 후공으로 계속 막기만 하다 지는 사용자가 반격 흐름을 찾는 검색 | `omok-second-player-counterattack.html`, `omok-first-second.html`, `omok-defense-to-attack.html`, `omok-counterattack-after-block.html`, `omok-blocking-point.html` |
| 완료 | 바둑 9줄에서 19줄로 넘어가는 기준 | 9줄 연습 후 언제 19줄 바둑을 시작할지 알고 싶은 입문자 검색 | `baduk-9x9-to-19x19.html`, `baduk-9x9-beginner.html`, `baduk-19x19-start.html`, `baduk-rank-roadmap.html`, `baduk-ai-review.html` |
| 완료 | 바둑 30급에서 20급으로 가는 공부 순서 | 바둑 입문자가 단수와 활로를 익힌 뒤 20급 수준까지 무엇을 반복해야 하는지 찾는 검색 | `baduk-30k-to-20k.html`, `baduk-beginner.html`, `baduk-liberties.html`, `baduk-atari.html`, `baduk-cut-connect.html`, `baduk-rank-roadmap.html` |
| 완료 | 바둑 초보는 어떤 판부터 복기해야 할까 | 초보자가 9줄과 19줄 대국 중 어떤 판을 먼저 복기해야 하는지 알고 싶은 검색 | `baduk-which-game-to-review.html`, `baduk-review-note.html`, `baduk-ai-review.html`, `baduk-9x9-beginner.html`, `baduk-19x19-start.html` |
| 완료 | 바둑 사활 10분 루틴은 어떻게 만들까 | 사활 문제를 매일 짧게 풀며 실전 감각을 올리고 싶은 사용자 검색 | `baduk-life-death-10-minute-routine.html`, `baduk-life-and-death-practice.html`, `baduk-life-death-vital-point.html`, `baduk-false-eye.html`, `baduk-10k-to-5k.html` |
| 완료 | 오목 초보가 자주 지는 패턴 | 오목 초보가 반복해서 지는 열린 3, 4목, 수비 지연 실수를 알고 싶은 검색 | `omok-beginner-losing-patterns.html`, `omok-strategy.html`, `omok-block-four.html`, `omok-open-three.html`, `omok-review-mistakes.html` |
| 완료 | 오목 선공 첫 수 이후 어디에 둘까 | 오목에서 중앙 첫 수 다음 배치를 어떻게 이어가야 하는지 찾는 입문자 검색 | `omok-after-first-move.html`, `omok-center-opening.html`, `omok-first-10-moves.html`, `omok-two-stones.html`, `omok-threats.html` |
| 완료 | 바둑 AI 난이도는 어떻게 고르면 좋을까 | 바둑 AI 대국을 시작할 때 9줄, 13줄, 19줄과 난이도를 어떻게 고를지 알고 싶은 입문자 검색 | `baduk-ai-difficulty.html`, `baduk-ai-review.html`, `baduk-9x9-beginner.html`, `baduk-19x19-start.html`, `baduk-rank-roadmap.html`, `baduk-review-note.html` |
| 완료 | 바둑 첫 50수는 무엇을 봐야 할까 | 19줄 바둑 초반 50수에서 귀, 변, 중앙, 약한 돌을 어떤 순서로 봐야 하는지 찾는 검색 | `baduk-first-50-moves.html`, `baduk-opening.html`, `baduk-opening-corner.html`, `baduk-side-opening.html`, `baduk-center-opening.html`, `baduk-beginner-mistakes.html` |
| 완료 | 바둑 초보가 돌을 버려도 되는 순간 | 잡힐 돌을 무리하게 살리다가 손해 보는 초보가 버릴 돌 기준을 알고 싶은 검색 | `baduk-sacrifice-moments.html`, `baduk-save-or-sacrifice.html`, `baduk-profitable-capture.html`, `baduk-attack-weak-stones.html`, `baduk-candidate-moves.html` |
| 완료 | 오목 상대가 중앙을 먼저 잡으면 어떻게 할까 | 오목 후공이 상대 중앙 첫 수에 어떻게 대응하고 반격할지 알고 싶은 검색 | `omok-respond-center.html`, `omok-first-second.html`, `omok-center-opening.html`, `omok-second-player-counterattack.html`, `omok-defense-to-attack.html`, `omok-after-first-move.html` |
| 완료 | 바둑 9줄 AI에게 계속 지는 이유 | 9줄 바둑 AI에게 계속 지는 입문자가 반복 실수와 복기 기준을 찾는 검색 | `baduk-9x9-ai-losses.html`, `baduk-9x9-beginner.html`, `baduk-9x9-first-move.html`, `baduk-atari-practice.html`, `baduk-liberties.html`, `baduk-ai-review.html` |
| 완료 | 바둑 19줄에서 초반에 너무 빨리 싸우는 이유 | 19줄 바둑 초반에 작은 전투를 시작했다가 큰 자리를 놓치는 초보자가 원인을 찾는 검색 | `baduk-19x19-early-fight.html`, `baduk-first-50-moves.html`, `baduk-opening.html`, `baduk-attack-weak-stones.html`, `baduk-beginner-mistakes.html` |
| 완료 | 바둑 사활 문제를 풀어도 실전에서 죽는 이유 | 사활 문제는 푸는데 실제 대국에서 큰 돌이 죽는 이유와 복기 기준을 찾는 검색 | `baduk-life-death-real-game.html`, `baduk-life-and-death-practice.html`, `baduk-life-death-vital-point.html`, `baduk-false-eye.html`, `baduk-large-group-death.html` |
| 완료 | 오목 열린 3을 만들었는데 왜 지는 걸까 | 오목에서 열린 3을 만들고도 상대 4목이나 양방향 위협을 놓쳐 지는 이유를 찾는 검색 | `omok-open-three-losing.html`, `omok-open-three.html`, `omok-attack-defense-priority.html`, `omok-double-threat.html`, `omok-review-mistakes.html` |
| 완료 | 오목 AI에게 계속 지는 이유 | 오목 AI 대국에서 반복 패배하는 사용자가 난이도, 복기, 위협 확인 기준을 찾는 검색 | `omok-ai-losing-reasons.html`, `omok-ai-difficulty.html`, `omok-hard-ai-losses.html`, `omok-review-mistakes.html`, `omok-practice-routine.html` |
| 완료 | 바둑 1급 목표자는 AI 복기를 얼마나 해야 할까 | 1급을 목표로 하는 사용자가 AI 복기를 오래 하지 않고 후보수와 약점만 고르는 법을 찾는 검색 | `baduk-1k-ai-review-time.html`, `baduk-5k-to-1k.html`, `baduk-1k-weekly-review.html`, `baduk-ai-review.html`, `baduk-candidate-moves.html` |
| 완료 | 바둑 13줄은 언제 시작하면 좋을까 | 9줄 바둑은 익숙하지만 19줄은 부담스러운 입문자가 13줄 시작 기준을 찾는 검색 | `baduk-13x13-start.html`, `baduk-9x9-to-19x19.html`, `baduk-19x19-start.html`, `baduk-ai-difficulty.html`, `baduk-rank-roadmap.html` |
| 완료 | 바둑 초보는 몇 수까지 읽어야 할까 | 바둑 초보가 단수, 사활, 전투에서 몇 수 앞까지 읽어야 하는지 알고 싶은 검색 | `baduk-reading-depth.html`, `baduk-candidate-moves.html`, `baduk-atari.html`, `baduk-life-death-vital-point.html`, `baduk-10k-to-5k.html` |
| 완료 | 오목 선공은 정말 필승일까 | 오목에서 선공이 얼마나 유리한지, 자유룰과 렌주룰 차이를 알고 싶은 검색 | `omok-first-player-win.html`, `omok-first-second.html`, `omok-center-opening.html`, `omok-forbidden-moves.html`, `omok-second-player-counterattack.html` |
| 완료 | 바둑 계가가 헷갈릴 때 어디부터 세야 할까 | 바둑 계가에서 집, 죽은 돌, 공배를 어떤 순서로 세야 하는지 찾는 검색 | `baduk-scoring-order.html`, `baduk-territory-scoring.html`, `baduk-scoring-practice-guide.html`, `baduk-dead-stones-scoring.html`, `baduk-neutral-points.html` |
| 완료 | 오목 막기만 하다 공격권을 잃는 이유 | 오목에서 계속 막기만 하다가 공격 기회를 놓치는 사용자가 전환 기준을 찾는 검색 | `omok-defense-to-attack.html`, `omok-counterattack-after-block.html`, `omok-attack-timing.html`, `omok-blocking-point.html` |
| 완료 | 바둑 끝내기에서 몇 집짜리부터 커 보일까 | 끝내기에서 어느 수가 큰지 감이 안 오는 초보자가 집 차이 기준을 찾는 검색 | `baduk-endgame-point-size.html`, `baduk-endgame-big-move.html`, `baduk-endgame-sente.html`, `baduk-territory-scoring.html`, `baduk-scoring-order.html` |
| 완료 | 바둑 단수쳐도 손해인 돌은 어떻게 구분할까 | 단수와 포획은 보이지만 잡아도 손해인 작은 돌을 구분하고 싶은 초보 검색 | `baduk-atari-loss.html`, `baduk-profitable-capture.html`, `baduk-atari.html`, `baduk-save-or-sacrifice.html`, `baduk-sacrifice-moments.html` |
| 완료 | 오목 4목을 막았는데도 지는 이유 | 오목에서 4목을 막았는데 다음 위협을 놓쳐 지는 사용자가 수비 후 확인 순서를 찾는 검색 | `omok-after-block-four-loss.html`, `omok-block-four.html`, `omok-blocking-point.html`, `omok-counterattack-after-block.html`, `omok-review-mistakes.html` |
| 완료 | 오목 한쪽만 막으면 왜 늦을까 | 오목 양방향 위협에서 한쪽만 막고도 지는 이유를 알고 싶은 검색 | `omok-one-side-block-late.html`, `omok-defend-double-threat.html`, `omok-double-threat.html`, `omok-attack-defense-priority.html`, `omok-blocking-point.html` |
| 완료 | 바둑 초보는 언제 손빼도 될까 | 상대가 둔 곳에 꼭 받아야 하는지, 큰 곳으로 손빼도 되는지 알고 싶은 입문자 검색 | `baduk-beginner-tenuki.html`, `baduk-tenuki-timing.html`, `baduk-sente-gote.html`, `baduk-opening.html`, `baduk-candidate-moves.html` |
| 완료 | 오목 열린 3을 막았는데도 지는 이유 | 오목에서 열린 3을 막았는데 남은 4목이나 양방향 위협으로 지는 이유를 찾는 검색 | `omok-after-block-open-three-loss.html`, `omok-open-three.html`, `omok-open-three-losing.html`, `omok-after-block-four-loss.html`, `omok-review-mistakes.html` |
| 완료 | 바둑 자충은 왜 위험할까 | 바둑 초보가 자충, 자살수, 활로 부족을 헷갈릴 때 금지되는 수와 위험한 수를 구분하려는 검색 | `baduk-self-atari.html`, `baduk-liberties.html`, `baduk-rules-order.html`, `baduk-atari.html`, `baduk-beginner-mistakes.html`, `baduk-profitable-capture.html` |
| 완료 | 바둑 단수에서 도망가야 할까 잡아야 할까 | 단수를 당했을 때 도망, 연결, 맞단수, 포획 중 무엇을 선택해야 하는지 찾는 검색 | `baduk-atari-response.html`, `baduk-atari.html`, `baduk-atari-practice.html`, `baduk-cut-connect.html`, `baduk-profitable-capture.html`, `baduk-candidate-moves.html` |
| 완료 | 바둑 13줄 초반은 어디부터 둘까 | 13줄 바둑을 시작한 입문자가 귀, 변, 중앙의 초반 순서를 알고 싶은 검색 | `baduk-13x13-opening.html`, `baduk-13x13-start.html`, `baduk-9x9-to-19x19.html`, `baduk-opening.html`, `baduk-opening-corner.html`, `baduk-side-opening.html` |
| 완료 | 오목 4목을 만들었는데 왜 막힐까 | 오목에서 4목을 만들었지만 열린 4가 아니어서 막히는 이유와 다음 위협을 알고 싶은 검색 | `omok-four-blocked.html`, `omok-open-four.html`, `omok-block-four.html`, `omok-three-vs-four.html`, `omok-attack-defense-priority.html`, `omok-double-threat.html` |
| 완료 | 오목 3목을 만들기 전에 무엇을 봐야 할까 | 오목에서 무작정 3목을 만들기 전 상대 4목, 열린 3, 양방향 위협을 확인하려는 검색 | `omok-before-three.html`, `omok-open-three.html`, `omok-open-three-losing.html`, `omok-attack-timing.html`, `omok-attack-defense-priority.html`, `omok-review-mistakes.html` |

## Search Console 전 13차 예비 후보

Search Console 등록 전까지도 학습 허브가 멈추지 않도록, 1급 목표와 실전 판단형 검색어를 이어서 보강합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 형세판단은 언제부터 연습해야 할까 | 중급자가 집 차이와 공격 판단을 어느 시점부터 봐야 하는지 찾는 검색 | `baduk-position-judgment-start.html`, `baduk-territory-scoring.html`, `baduk-thickness-territory.html`, `baduk-candidate-moves.html`, `baduk-5k-to-1k.html` |
| 완료 | 바둑 손빼기는 언제 해도 될까 | 상대 수에 바로 받지 않고 큰 곳으로 가도 되는 기준을 알고 싶은 검색 | `baduk-tenuki-timing.html`, `baduk-sente-gote.html`, `baduk-candidate-moves.html`, `baduk-opening-corner.html`, `baduk-endgame-big-move.html` |
| 완료 | 바둑 침입과 삭감은 어떻게 다를까 | 상대 집 안으로 들어갈지 바깥에서 줄일지 헷갈리는 중급자 검색 | `baduk-invasion-reduction.html`, `baduk-thickness-territory.html`, `baduk-attack-weak-stones.html`, `baduk-candidate-moves.html`, `baduk-opening.html` |
| 완료 | 오목 수읽기는 몇 수까지 해야 할까 | 열린 3, 4목, 양방향 위협을 몇 수 앞까지 봐야 하는지 찾는 검색 | `omok-reading-depth.html`, `omok-threats.html`, `omok-double-threat.html`, `omok-open-three.html`, `omok-attack-defense-priority.html` |
| 완료 | 오목에서 공격을 포기하고 막아야 하는 순간 | 내 공격보다 상대 위협을 먼저 막아야 하는 기준을 찾는 검색 | `omok-when-to-defend.html`, `omok-attack-defense-priority.html`, `omok-block-four.html`, `omok-open-four.html`, `omok-defense-to-attack.html` |

## Search Console 전 14차 예비 후보

Search Console 검색어가 아직 없을 때도 운영 큐가 비지 않도록, 계가/패감/끝내기/오목 초반처럼 반복 검색 가능한 주제를 보강합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 계가에서 죽은 돌은 어떻게 처리할까 | 집 계산 중 죽은 돌을 빼야 하는지 헷갈리는 입문자 검색 | `baduk-dead-stones-scoring.html`, `baduk-territory-scoring.html`, `baduk-alive-dead-stones.html`, `baduk-scoring-practice-guide.html`, `baduk-life-and-death.html` |
| 완료 | 바둑 패감은 어떻게 찾을까 | 패싸움은 알지만 어떤 수가 패감인지 모르는 사용자 검색 | `baduk-ko-threats.html`, `baduk-ko-rule.html`, `baduk-ko-fight-timing.html`, `baduk-sente-gote.html`, `baduk-candidate-moves.html` |
| 완료 | 바둑 끝내기 선수는 어떻게 계산할까 | 끝내기에서 먼저 둬야 하는 수와 후수를 구분하려는 검색 | `baduk-endgame-sente.html`, `baduk-endgame.html`, `baduk-endgame-big-move.html`, `baduk-sente-gote.html`, `baduk-endgame-mistakes.html` |
| 완료 | 오목 2목은 언제 의미가 있을까 | 초반 2목이 공격 준비인지 빈 수인지 헷갈리는 입문자 검색 | `omok-two-stones.html`, `omok-center-opening.html`, `omok-first-10-moves.html`, `omok-threats.html`, `omok-reading-depth.html` |
| 완료 | 오목 막은 뒤 반격은 어디에 둘까 | 수비 후 다시 공격으로 넘어가는 구체적 후보를 찾는 검색 | `omok-counterattack-after-block.html`, `omok-defense-to-attack.html`, `omok-when-to-defend.html`, `omok-double-threat.html`, `omok-blocking-point.html` |

## Search Console 전 15차 예비 후보

Search Console 검색어가 아직 없을 때도 9줄 입문처럼 반복 검색 가능한 기초 주제를 보강합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 9줄 바둑 첫 수는 어디에 둘까 | 9줄 바둑을 처음 둘 때 중앙, 귀, 변 중 어디에 첫 수를 둘지 알고 싶은 입문자 검색 | `baduk-9x9-first-move.html`, `baduk-9x9-beginner.html`, `baduk-beginner.html`, `baduk-opening-corner.html`, `baduk-9x9-to-19x19.html` |

## Search Console 전 16차 예비 후보

Search Console 등록 전에도 문제 풀이, 정답률, 방어 연습처럼 앱 안에서 바로 체류로 이어지는 검색 의도를 보강합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 문제는 어떤 순서로 풀면 좋을까 | 바둑 문제를 많이 풀어도 실전에 이어지지 않는 초보자가 단수, 연결, 사활, 끝내기 순서를 찾는 검색 | `baduk-problem-solving-order.html`, `baduk-atari-practice.html`, `baduk-life-and-death-practice.html`, `baduk-10k-to-5k.html`, `baduk-rank-roadmap.html` |
| 완료 | 바둑 초보 정답률은 몇 퍼센트면 좋을까 | 문제 정답률이 낮거나 너무 쉬운 문제만 푸는 초보자가 다음 난이도 기준을 찾는 검색 | `baduk-beginner-accuracy-rate.html`, `baduk-problem-solving-order.html`, `baduk-rank-roadmap.html`, `baduk-30k-to-20k.html`, `baduk-10k-to-5k.html` |
| 완료 | 오목 방어 연습은 어떻게 해야 할까 | 오목에서 공격만 하다 4목을 놓치는 사용자가 방어 훈련 순서를 찾는 검색 | `omok-defense-practice.html`, `omok-block-four-checklist.html`, `omok-blocking-point.html`, `omok-when-to-defend.html`, `omok-practice-routine.html` |
| 완료 | 바둑 같은 실수를 반복하지 않으려면 어떻게 할까 | 대국마다 같은 실수를 하는 사용자가 오답과 복기 노트를 연결하는 법을 찾는 검색 | `baduk-repeat-mistakes.html`, `baduk-review-note.html`, `baduk-problem-solving-order.html`, `baduk-1k-weekly-review.html`, `baduk-ai-review.html` |
| 완료 | 오목 공격 타이밍은 어떻게 잡을까 | 막기와 공격 사이에서 언제 열린 3이나 4목을 만들지 알고 싶은 검색 | `omok-attack-timing.html`, `omok-attack-defense-priority.html`, `omok-defense-to-attack.html`, `omok-open-three.html`, `omok-double-threat.html` |

## Search Console 전 17차 예비 후보

Search Console 등록 전에도 독학, AI 대국 반복, 하루 공부량처럼 검색 의도가 큰 운영형 키워드를 보강합니다.

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 바둑 독학은 어떤 순서로 하면 좋을까 | 혼자 바둑을 공부하는 입문자가 9줄 대국, 문제 풀이, AI 복기 순서를 알고 싶은 검색 | `baduk-self-study.html`, `baduk-free-learn.html`, `baduk-rank-roadmap.html`, `baduk-problem-solving-order.html`, `baduk-ai-review.html`, `baduk-review-note.html` |
| 완료 | 바둑 AI 대국만 해도 늘까 | AI와 많이 두지만 실력이 늘지 않는 사용자가 복기와 문제 풀이 연결법을 찾는 검색 | `baduk-ai-games-only.html`, `baduk-ai-review.html`, `baduk-which-game-to-review.html`, `baduk-repeat-mistakes.html`, `baduk-problem-solving-order.html`, `baduk-review-note.html` |
| 완료 | 바둑 하루 공부량은 어느 정도가 좋을까 | 매일 바둑을 얼마나 두고 문제를 몇 개 풀어야 하는지 찾는 입문자 검색 | `baduk-daily-study-time.html`, `baduk-1k-daily-routine.html`, `baduk-problem-solving-order.html`, `baduk-review-10-minute.html`, `baduk-life-death-10-minute-routine.html`, `baduk-rank-roadmap.html` |
| 중간 | 오목 혼자 연습은 어떻게 하면 좋을까 | 혼자 오목을 연습하는 사용자가 AI 대국, 방어 문제, 복기 순서를 찾는 검색 | `omok-practice-routine.html`, `omok-ai-difficulty.html`, `omok-defense-practice.html`, `omok-review-mistakes.html`, `omok-before-three.html` |
| 중간 | 오목 AI 대국만 반복하면 왜 늘지 않을까 | 오목 AI와 많이 두지만 반복 패배하는 사용자가 복기와 약점 훈련을 찾는 검색 | `omok-ai-losing-reasons.html`, `omok-review-mistakes.html`, `omok-practice-routine.html`, `omok-defense-practice.html`, `omok-attack-defense-priority.html` |

## 월간 운영 루틴

1. Search Console에서 노출 또는 클릭이 생긴 검색어를 확인합니다.
2. 기존 글로 답할 수 있으면 해당 글의 첫 문단과 관련 링크를 보강합니다.
3. 기존 글로 답하기 어렵다면 위 후보 중 하나를 새 글로 만듭니다.
4. 새 글을 `learn.html`에 추가합니다.
5. 새 글을 `scripts/site-content.cjs`에 등록합니다.
6. `node scripts/sync-sitemap.cjs --write`와 `node scripts/sync-feed.cjs --write`를 실행합니다. `sitemap.xml`은 모든 공개 URL을 담고, `feed.xml`은 성능 예산을 위해 최신 50개 글만 담습니다.
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
| 2026-06-26 | `baduk-rules-order.html` | 바둑 규칙 순서 검색 유입 |
| 2026-06-26 | `baduk-free-learn.html` | 바둑 무료 학습 검색 유입 |
| 2026-06-26 | `baduk-self-study.html` | 바둑 독학 순서 검색 유입 |
| 2026-06-26 | `baduk-ai-games-only.html` | 바둑 AI 대국 반복 검색 유입 |
| 2026-06-26 | `baduk-daily-study-time.html` | 바둑 하루 공부량 검색 유입 |
| 2026-06-25 | `baduk-9x9-beginner.html` | 9줄 바둑 입문 검색 유입 |
| 2026-06-26 | `baduk-9x9-to-19x19.html` | 바둑 9줄에서 19줄 전환 기준 검색 유입 |
| 2026-06-26 | `baduk-13x13-start.html` | 바둑 13줄 시작 기준 검색 유입 |
| 2026-06-26 | `baduk-13x13-opening.html` | 바둑 13줄 초반 위치 선택 검색 유입 |
| 2026-06-26 | `baduk-reading-depth.html` | 바둑 초보 수읽기 깊이 검색 유입 |
| 2026-06-26 | `baduk-scoring-order.html` | 바둑 계가 순서 검색 유입 |
| 2026-06-26 | `baduk-endgame-point-size.html` | 바둑 끝내기 크기 판단 검색 유입 |
| 2026-06-26 | `baduk-atari-loss.html` | 바둑 단수 후 포획 손익 판단 검색 유입 |
| 2026-06-26 | `baduk-beginner-tenuki.html` | 바둑 초보 손빼기 판단 검색 유입 |
| 2026-06-26 | `baduk-self-atari.html` | 바둑 자충과 자살수 구분 검색 유입 |
| 2026-06-26 | `baduk-atari-response.html` | 바둑 단수 대응 판단 검색 유입 |
| 2026-06-26 | `omok-after-block-four-loss.html` | 오목 4목 차단 후 후속 위협 검색 유입 |
| 2026-06-26 | `omok-after-block-open-three-loss.html` | 오목 열린 3 차단 후 후속 위협 검색 유입 |
| 2026-06-26 | `omok-one-side-block-late.html` | 오목 양방향 위협 수비 검색 유입 |
| 2026-06-26 | `omok-first-player-win.html` | 오목 선공 필승과 자유룰 검색 유입 |
| 2026-06-26 | `omok-defense-to-attack.html` | 오목 막기만 하다 공격권 상실 검색 유입 |
| 2026-06-25 | `baduk-19x19-start.html` | 19줄 바둑 시작 기준 검색 유입 |
| 2026-06-25 | `baduk-rank-roadmap.html` | 바둑 급수표와 공부 순서 검색 유입 |
| 2026-06-26 | `baduk-30k-to-20k.html` | 바둑 30급에서 20급 학습 순서 검색 유입 |
| 2026-06-25 | `baduk-beginner-mistakes.html` | 바둑 초보 실수 검색 유입 |
| 2026-06-21 | `baduk-atari.html` | 단수 개념 검색 유입 |
| 2026-06-24 | `baduk-atari-practice.html` | 단수 연습법 검색 유입 |
| 2026-06-26 | `baduk-problem-solving-order.html` | 바둑 문제 풀이 순서 검색 유입 |
| 2026-06-26 | `baduk-beginner-accuracy-rate.html` | 바둑 초보 문제 정답률 기준 검색 유입 |
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
| 2026-06-26 | `omok-winning-strategy.html` | 오목 필승법 검색 의도 전환 |
| 2026-06-25 | `omok-center-opening.html` | 오목 첫 수와 중앙 선점 검색 유입 |
| 2026-06-25 | `omok-first-second.html` | 오목 선공과 후공 검색 유입 |
| 2026-06-25 | `omok-first-10-moves.html` | 오목 첫 10수 초반 운영 검색 유입 |
| 2026-06-26 | `omok-two-stones.html` | 오목 2목 의미와 초반 공격 씨앗 검색 유입 |
| 2026-06-25 | `omok-blocking-point.html` | 오목 막기 좋은 자리 검색 유입 |
| 2026-06-25 | `omok-double-three-four.html` | 오목 3-3과 4-4 금수 검색 유입 |
| 2026-06-26 | `omok-forbidden-real-game.html` | 오목 실전 금수 판단 검색 유입 |
| 2026-06-26 | `omok-six-in-a-row.html` | 오목 6목과 장목 금수 검색 유입 |
| 2026-06-21 | `baduk-glossary.html` | 용어 사전형 유입 |
| 2026-06-21 | `baduk-opening.html` | 포석 기초 검색 유입 |
| 2026-06-26 | `baduk-first-50-moves.html` | 바둑 첫 50수 판단 검색 유입 |
| 2026-06-26 | `baduk-19x19-early-fight.html` | 바둑 19줄 초반 전투 실수 검색 유입 |
| 2026-06-25 | `baduk-opening-corner.html` | 포석 귀 우선순위 검색 유입 |
| 2026-06-25 | `baduk-side-opening.html` | 포석 변 선택 기준 검색 유입 |
| 2026-06-25 | `baduk-center-opening.html` | 초반 중앙 진출 기준 검색 유입 |
| 2026-06-25 | `baduk-thickness-territory.html` | 바둑 두터움과 실리 검색 유입 |
| 2026-06-26 | `baduk-position-judgment-start.html` | 바둑 형세판단 시작 기준 검색 유입 |
| 2026-06-25 | `baduk-joseki-study.html` | 바둑 정석 공부 시작 시점 검색 유입 |
| 2026-06-25 | `baduk-ai-review.html` | 바둑 AI 복기 사용법 검색 유입 |
| 2026-06-26 | `baduk-ai-difficulty.html` | 바둑 AI 난이도 선택 검색 유입 |
| 2026-06-26 | `baduk-which-game-to-review.html` | 바둑 초보 복기 판 선택 검색 유입 |
| 2026-06-25 | `baduk-review-note.html` | 바둑 복기 노트 검색 유입 |
| 2026-06-26 | `baduk-repeat-mistakes.html` | 바둑 반복 실수 교정 검색 유입 |
| 2026-06-25 | `baduk-review-10-minute.html` | 짧은 복기 루틴 검색 유입 |
| 2026-06-21 | `baduk-life-and-death.html` | 사활 기초 검색 유입 |
| 2026-06-25 | `baduk-large-group-death.html` | 대마 생사와 약한 돌 관리 검색 유입 |
| 2026-06-25 | `baduk-alive-dead-stones.html` | 산 돌과 죽은 돌 구분 검색 유입 |
| 2026-06-25 | `baduk-komi-6-5.html` | 바둑 덤과 반집 승부 검색 유입 |
| 2026-06-25 | `baduk-ko-fight-timing.html` | 바둑 패싸움 시작 기준 검색 유입 |
| 2026-06-26 | `baduk-ko-threats.html` | 바둑 패감 찾기 검색 유입 |
| 2026-06-26 | `baduk-save-or-sacrifice.html` | 바둑 살릴 돌과 버릴 돌 판단 검색 유입 |
| 2026-06-26 | `baduk-sacrifice-moments.html` | 바둑 초보 버릴 돌 판단 검색 유입 |
| 2026-06-26 | `baduk-dead-stones-scoring.html` | 바둑 계가 죽은 돌 처리 검색 유입 |
| 2026-06-26 | `baduk-neutral-points.html` | 바둑 공배와 계가 전 정리 검색 유입 |
| 2026-06-26 | `baduk-seki.html` | 바둑 빅과 죽은 돌 구분 검색 유입 |
| 2026-06-26 | `omok-closed-three.html` | 오목 닫힌 3과 열린 3 구분 검색 유입 |
| 2026-06-26 | `omok-second-player-counterattack.html` | 오목 후공 반격 검색 유입 |
| 2026-06-26 | `baduk-scoring-practice-start.html` | 바둑 계가 연습 시작 시점 검색 유입 |
| 2026-06-26 | `baduk-scoring-practice-guide.html` | 바둑 집 계산 실전 연습 검색 유입 |
| 2026-06-26 | `baduk-10k-losing-reasons.html` | 바둑 10급 정체 원인 검색 유입 |
| 2026-06-26 | `omok-renju-black-disadvantage.html` | 오목 렌주룰과 흑 금수 검색 유입 |
| 2026-06-25 | `omok-defend-double-threat.html` | 오목 양방향 공격 방어 검색 유입 |
| 2026-06-25 | `omok-hard-ai-losses.html` | 오목 고수 난이도 패배 원인 검색 유입 |
| 2026-06-24 | `baduk-life-and-death-practice.html` | 사활 문제 풀이 검색 유입 |
| 2026-06-26 | `baduk-life-death-real-game.html` | 바둑 사활 문제와 실전 대마 생사 연결 검색 유입 |
| 2026-06-26 | `baduk-life-death-10-minute-routine.html` | 바둑 사활 10분 루틴 검색 유입 |
| 2026-06-25 | `baduk-life-death-vital-point.html` | 바둑 사활 급소 검색 유입 |
| 2026-06-26 | `baduk-9x9-first-move.html` | 9줄 바둑 첫 수 위치 검색 유입 |
| 2026-06-26 | `baduk-9x9-ai-losses.html` | 바둑 9줄 AI 패배 원인 검색 유입 |
| 2026-06-25 | `baduk-false-eye.html` | 가짜 눈 구분 검색 유입 |
| 2026-06-25 | `baduk-10k-to-5k.html` | 바둑 10급에서 5급 학습 순서 검색 유입 |
| 2026-06-25 | `baduk-5k-to-1k.html` | 바둑 5급에서 1급 학습 순서 검색 유입 |
| 2026-06-26 | `baduk-1k-weekly-review.html` | 바둑 1급 목표 주간 복기 검색 유입 |
| 2026-06-26 | `baduk-1k-ai-review-time.html` | 바둑 1급 목표 AI 복기 시간 검색 유입 |
| 2026-06-21 | `baduk-endgame.html` | 끝내기 기초 검색 유입 |
| 2026-06-25 | `baduk-endgame-big-move.html` | 끝내기 큰 수 검색 유입 |
| 2026-06-26 | `baduk-endgame-sente.html` | 끝내기 선수 계산 검색 유입 |
| 2026-06-25 | `baduk-endgame-mistakes.html` | 끝내기 실수 복기 검색 유입 |
| 2026-06-21 | `baduk-sente-gote.html` | 선수/후수 개념 검색 유입 |
| 2026-06-26 | `baduk-tenuki-timing.html` | 바둑 손빼기 판단 검색 유입 |
| 2026-06-26 | `baduk-invasion-reduction.html` | 바둑 침입과 삭감 판단 검색 유입 |
| 2026-06-21 | `omok-threats.html` | 오목 위협 검색 유입 |
| 2026-06-26 | `omok-reading-depth.html` | 오목 수읽기 깊이 검색 유입 |
| 2026-06-25 | `omok-double-threat.html` | 오목 양방향 위협 검색 유입 |
| 2026-06-25 | `omok-attack-defense-priority.html` | 오목 공격과 수비 우선순위 검색 유입 |
| 2026-06-26 | `omok-attack-timing.html` | 오목 공격 타이밍 검색 유입 |
| 2026-06-26 | `omok-when-to-defend.html` | 오목 공격 포기와 수비 전환 판단 검색 유입 |
| 2026-06-25 | `omok-defense-to-attack.html` | 오목 수비 후 공격 전환 검색 유입 |
| 2026-06-26 | `omok-counterattack-after-block.html` | 오목 막은 뒤 반격 후보 검색 유입 |
| 2026-06-25 | `omok-block-four.html` | 오목 4목 막기 검색 유입 |
| 2026-06-26 | `omok-four-blocked.html` | 오목 4목이 막히는 이유 검색 유입 |
| 2026-06-26 | `omok-block-four-checklist.html` | 오목 4목 차단 실수 검색 유입 |
| 2026-06-26 | `omok-defense-practice.html` | 오목 방어 연습 루틴 검색 유입 |
| 2026-06-25 | `omok-open-four.html` | 오목 열린 4와 닫힌 4 검색 유입 |
| 2026-06-25 | `omok-open-three.html` | 오목 열린 3 수비 검색 유입 |
| 2026-06-26 | `omok-before-three.html` | 오목 3목 전 체크 검색 유입 |
| 2026-06-26 | `omok-open-three-losing.html` | 오목 열린 3 공격 후 패배 원인 검색 유입 |
| 2026-06-24 | `omok-ai-difficulty.html` | 오목 AI 난이도 검색 유입 |
| 2026-06-26 | `omok-ai-losing-reasons.html` | 오목 AI 반복 패배 원인 검색 유입 |
| 2026-06-25 | `omok-practice-routine.html` | 오목 난이도별 연습 루틴 검색 유입 |
| 2026-06-26 | `omok-level-up-timing.html` | 오목 AI 난이도 상승 기준 검색 유입 |
| 2026-06-25 | `omok-review-mistakes.html` | 오목 실수 복기 검색 유입 |
| 2026-06-26 | `omok-beginner-losing-patterns.html` | 오목 초보 패배 패턴 검색 유입 |
| 2026-06-26 | `omok-after-first-move.html` | 오목 선공 첫 수 이후 배치 검색 유입 |
| 2026-06-26 | `omok-respond-center.html` | 오목 상대 중앙 첫 수 대응 검색 유입 |
| 2026-06-25 | `omok-forbidden-moves.html` | 오목 금수와 자유룰 검색 유입 |
| 2026-06-21 | `faq.html` | 질문형 검색 유입 |

## 2026-06-25 추가 발행 메모

- `baduk-ko-rule.html`: 바둑 초보자가 자주 검색하는 패 규칙, 패감, 패싸움 기초를 설명합니다.
- 연결 글: `baduk-glossary.html`, `baduk-atari.html`, `baduk-liberties.html`, `baduk-ai-review.html`
- 목적: 규칙 이해형 검색 유입을 늘리고, 앱에서 패 상황을 만났을 때 읽을 수 있는 보조 설명을 제공합니다.
- `baduk-territory-scoring.html`: 집 계산, 계가, 덤, 미정 영역을 초보자 순서로 설명합니다.
- 연결 글: `baduk-endgame.html`, `baduk-endgame-big-move.html`, `baduk-sente-gote.html`, `baduk-glossary.html`
- 목적: 끝내기와 계가 검색 유입을 늘리고, 대국 뒤 형세판단 학습으로 이어지게 합니다.

## Search Console 발견 후보

| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |
| --- | --- | --- | --- |
| 완료 | 오목 6목은 이기는 걸까 | 오목에서 5개를 넘게 이었을 때 승리인지 금수인지 헷갈리는 사용자 | `omok-forbidden-moves.html`, `omok-strategy.html`, `omok-first-second.html`, `omok-open-four.html` |
| 완료 | 바둑 계가는 언제부터 연습해야 할까 | 집 계산과 승패 확인이 어려워 계가 시작 시점을 알고 싶은 입문자 | `baduk-territory-scoring.html`, `baduk-endgame.html`, `baduk-komi-6-5.html`, `baduk-review-note.html` |
| 완료 | 바둑 10급이 자주 지는 이유 | 10급 전후에서 정체된 사용자가 반복 패배 원인을 찾는 검색 | `baduk-10k-losing-reasons.html`, `baduk-10k-to-5k.html`, `baduk-beginner-mistakes.html`, `baduk-review-10-minute.html`, `baduk-candidate-moves.html` |
| 완료 | 오목 렌주룰은 왜 흑에게 불리할까 | 렌주룰과 자유룰의 차이, 흑 금수 이유를 알고 싶은 사용자 | `omok-renju-black-disadvantage.html`, `omok-forbidden-moves.html`, `omok-double-three-four.html`, `omok-forbidden-real-game.html`, `omok-first-second.html` |
