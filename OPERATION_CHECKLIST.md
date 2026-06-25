# 큰돌 운영 체크리스트

광고 수익을 목표로 하더라도 우선순위는 학습 품질, 모바일 안정성, 검색 신뢰도입니다.

## 배포 전

- `git status --short --branch`로 의도하지 않은 변경이 없는지 확인
- `node scripts/preflight.cjs`로 문법, sitemap, 콘텐츠 품질, 링크, 제출 패킷, 성능 예산 확인
- `node scripts/build-pages-artifact.cjs --check`로 공개 배포 파일 목록 확인
- `node scripts/check-seo-metadata.cjs`로 title, description, canonical, sitemap 일치 확인
- 새 HTML 페이지를 추가했다면 `learn.html` 또는 관련 글에서 연결
- 새 공개 페이지를 추가했다면 `scripts/site-content.cjs`에 등록하고 `node scripts/sync-sitemap.cjs --write` 실행
- 새 학습 글을 추가했다면 `node scripts/sync-feed.cjs --write` 실행
- 새 학습 글을 추가했다면 `node scripts/sync-learn-itemlist.cjs --write` 실행
- 모바일 폭에서 바둑판, 오목판, 주요 버튼이 겹치지 않는지 확인

## 배포 후

- 새 글이나 sitemap 변경을 push했다면 `node scripts/wait-live-deploy.cjs --fast`로 live sitemap이 로컬 sitemap과 같아졌는지 확인
- GitHub Actions의 `Deploy GitHub Pages` 마지막 단계가 `Wait for live deploy`로 통과했는지 확인
- live 반영이 늦으면 같은 명령을 다시 실행하고, 계속 실패하면 GitHub Pages 배포 상태를 먼저 확인

## 매주

- `node scripts/weekly-maintenance.cjs`로 live 배포, 수익화 준비, 콘텐츠 깊이, 외부 계정 진행 상태를 한 번에 확인
- `node scripts/preflight.cjs --live`로 GitHub Pages live URL과 sitemap 전체 페이지 접속 확인
- GitHub Pages 배포 artifact가 `dist` 기준인지 확인
- `scripts`, `.github`, 운영 문서 URL이 live에서 404인지 확인
- GitHub Actions의 `Weekly Service Health` 결과 확인
- 배우기 문제 5개 이상 직접 풀이
- 바둑 AI 대국 1판, 오목 AI 대국 1판 테스트
- 모바일에서 착수 위치와 버튼 클릭 확인
- 새 GitHub 이슈를 버그, 콘텐츠 요청, 운영 점검으로 분류
- Search Console 색인 상태와 검색어 확인
- 색인 요청 전 `node scripts/indexing-priority.cjs`로 우선 요청 URL 확인
- Search Console 검색어 CSV가 있으면 `node scripts/search-console-query-report.cjs search-console-queries.csv`로 보강 후보 확인
- `node scripts/content-report.cjs`로 짧거나 내부 링크가 약한 글 확인
- `node scripts/content-queue.cjs`로 다음 작성 후보 확인
- 새 검색어가 후보 표에 없다면 `node scripts/add-content-candidate.cjs --title "제목" --intent "검색 의도" --links file1.html,file2.html --priority 중간`으로 추가
- 유입이 있는 글 1개를 더 자세히 보강
- `CONTENT_PLAN.md`에서 다음 작성 후보 1개를 고르기

## 매월

- `node scripts/create-operations-review.cjs`로 이번 달 운영 리뷰 파일 생성. 이때 수익화 대시보드, 다음 외부 작업, 콘텐츠 상태가 자동 기록됨
- `node scripts/monetization-report.cjs`로 내부 준비 상태와 외부 계정 작업 분리 확인
- `node scripts/external-account-status.cjs`로 Search Console과 AdSense 진행률 확인
- `node scripts/external-next-action.cjs`로 다음 외부 계정 작업과 복사할 값을 확인
- 개인정보처리방침과 이용약관이 현재 기능과 맞는지 확인
- AdSense 정책 변경 여부 확인
- 광고가 붙어 있다면 오클릭 위험 영역 확인
- 오래된 글의 설명, 제목, 내부 링크 보강
- 새 학습 글 또는 문제 세트 1개 이상 추가
- 발행한 글을 `CONTENT_PLAN.md` 완료 기록에 추가
- 월간 리뷰에 Search Console 검색어, 보강한 글, 다음 달 작업 3개 기록

## 피드백 관리

- 버그 신고는 `.github/ISSUE_TEMPLATE/bug_report.yml` 양식으로 받기
- 새 글이나 문제 요청은 `.github/ISSUE_TEMPLATE/content_request.yml` 양식으로 받기
- Search Console, AdSense, 배포 점검은 `.github/ISSUE_TEMPLATE/operations_check.yml` 양식으로 기록하기
- 사용자 재현 정보가 부족한 버그는 기기, 브라우저, 재현 순서부터 확인하기

## 광고 운영 원칙

- 바둑판 바로 옆에는 광고를 두지 않음
- 착수, 다음, 정답 보기, 되돌리기, 새 대국 버튼 근처에는 광고를 두지 않음
- 광고 라벨은 명확하게 표시
- 클릭을 유도하거나 보상처럼 보이는 문구 금지
- 수익보다 이탈률, 오클릭 위험, 학습 흐름을 먼저 확인
- 승인 후 실제 광고 적용은 `ADSENSE_AFTER_APPROVAL.md` 순서로 진행
- 승인 후 광고 코드가 들어간 상태는 `ADSENSE_STATUS=approved` 모드로 검사
- 광고 적용 후 `node scripts/check-ad-placement.cjs`로 광고 단위가 `ad-slot` 안에만 있는지 확인
- `ads.txt`를 추가해야 한다면 `node scripts/prepare-ads-txt.cjs --check`로 Google 안내 문자열을 먼저 검증
- `ads.txt`를 추가했다면 `node scripts/check-ads-txt.cjs`로 형식을 확인

## Search Console 확인 순서

1. `https://macacolabs.github.io/baduk-trainer/` URL 접두어 속성 확인
2. 등록 전 `node scripts/prepare-search-console-registration.cjs --live`로 제출값과 live URL 확인
3. `https://macacolabs.github.io/baduk-trainer/sitemap.xml` 제출
4. `node scripts/indexing-priority.cjs --checklist`에서 상위 URL과 완료 기록 명령 확인
5. `learn.html`과 주요 학습 글 색인 요청
6. 검색어가 생기면 해당 글의 제목, 첫 문단, 내부 링크 보강
7. 외부 계정 진행 상태는 `EXTERNAL_ACCOUNT_CHECKLIST.md`에 표시
8. 완료한 외부 계정 항목은 `node scripts/mark-external-task.cjs "섹션명" "항목 검색어" --note "완료 근거"`로 체크
9. 다음에 할 계정 작업이 헷갈리면 `node scripts/external-next-action.cjs`를 실행

## 운영 명령 빠른 실행

```powershell
node scripts/weekly-maintenance.cjs
```

이 명령은 live 페이지, sitemap URL, 내부 링크, 성능 예산, 콘텐츠 깊이, 수익화 준비 상태, 외부 계정 진행률을 한 번에 확인합니다. 실패가 나오면 먼저 해당 항목을 고치고, 통과하면 Search Console과 AdSense 계정 화면에서 남은 작업을 진행합니다.

## AdSense 신청 전 최종 확인

- 검색 유입용 학습 글 10개 이상
- `privacy.html`, `terms.html`, `adsense-checklist.html` 연결
- 실제 광고 스크립트 미삽입
- `ad-slot`은 조작 UI와 충분히 분리
- 모바일에서 첫 화면이 잘리지 않음
- sitemap과 robots가 현재 URL 구조와 일치
