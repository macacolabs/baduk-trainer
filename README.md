# 큰돌

바둑과 오목을 배우고 연습하는 정적 웹 앱입니다.

- 배포 URL: https://macacolabs.github.io/baduk-trainer/
- 호스팅: GitHub Pages
- 앱 방식: HTML/CSS/JavaScript 정적 페이지

## 주요 기능

- 바둑 배우기 문제와 반복 훈련
- 바둑 2인 대국
- 바둑 AI 대국
- 오목 2인 대국
- 오목 AI 대국
- 급수 진단과 추천 루틴
- 바둑/오목 학습 글
- 바둑/오목 FAQ
- GitHub 이슈 템플릿 기반 피드백 관리
- 개인정보처리방침, 이용약관, sitemap, robots

## 로컬 확인

브라우저에서 `index.html`을 열면 기본 기능을 확인할 수 있습니다.

모바일 기기에서 같은 네트워크로 확인하려면:

```powershell
node serve-mobile.cjs
```

출력되는 로컬 네트워크 주소로 접속합니다.

## 배포 절차

변경 후 아래 순서로 반영합니다.

```powershell
git status --short --branch
node scripts/preflight.cjs
git add -A
git commit -m "변경 내용"
git push origin main
```

GitHub Pages 반영까지는 잠시 시간이 걸릴 수 있습니다.

배포 후 live URL 확인:

```powershell
node scripts/preflight.cjs --live
```

live 점검은 핵심 페이지의 문구와 `sitemap.xml`에 등록된 모든 URL의 200 응답을 함께 확인합니다.

## Search Console

1. Google Search Console에서 URL 접두어 속성으로 등록합니다.
2. 등록 URL은 `https://macacolabs.github.io/baduk-trainer/`입니다.
3. HTML meta verification 태그를 받으면 `index.html`의 `<head>`에 추가합니다.
4. sitemap 제출 주소는 `https://macacolabs.github.io/baduk-trainer/sitemap.xml`입니다.
5. 공개 안내 페이지는 `search-console.html`입니다.

발급받은 meta 태그는 아래처럼 안전하게 넣을 수 있습니다.

```powershell
$env:SEARCH_CONSOLE_META='<meta name="google-site-verification" content="발급값">'
node scripts/apply-search-console-meta.cjs
node scripts/preflight.cjs
```

## AdSense 준비

승인 전에는 실제 광고 스크립트를 넣지 않습니다.

현재 준비된 것:

- `privacy.html`
- `terms.html`
- `ADSENSE_AFTER_APPROVAL.md`
- `EXTERNAL_ACCOUNT_CHECKLIST.md`
- `SUBMISSION_PACKET.md`
- `adsense-checklist.html`
- `robots.txt`
- `sitemap.xml`
- 검색 유입용 학습 글
- 질문형 검색 유입용 `faq.html`
- 콘텐츠 확장 계획 `CONTENT_PLAN.md`
- 광고 예정 영역 `ad-slot`
- 통합 배포 전 점검 스크립트 `scripts/preflight.cjs`
- 배포 전 점검 스크립트 `scripts/check-service-readiness.cjs`
- 콘텐츠 품질 점검 스크립트 `scripts/check-content-quality.cjs`

승인 후 실제 광고 코드를 넣은 상태를 점검할 때는 아래처럼 승인 후 모드로 실행합니다.

```powershell
$env:ADSENSE_STATUS='approved'
node scripts/check-service-readiness.cjs
node scripts/monetization-report.cjs
```
- 콘텐츠 운영 리포트 스크립트 `scripts/content-report.cjs`
- 다음 콘텐츠 후보 리포트 스크립트 `scripts/content-queue.cjs`
- Search Console 검색어 CSV 분석 스크립트 `scripts/search-console-query-report.cjs`
- Search Console 검색어 기반 콘텐츠 후보 추가 스크립트 `scripts/add-content-candidate.cjs`
- Search Console 색인 요청 우선순위 스크립트 `scripts/indexing-priority.cjs`
- 수익화 준비 리포트 스크립트 `scripts/monetization-report.cjs`
- 외부 계정 진행률 리포트 스크립트 `scripts/external-account-status.cjs`
- 외부 계정 다음 작업 안내 스크립트 `scripts/external-next-action.cjs`
- 외부 계정 체크리스트 완료 표시 스크립트 `scripts/mark-external-task.cjs`
- 주간 운영 통합 점검 스크립트 `scripts/weekly-maintenance.cjs`
- 월간 운영 리뷰 생성 스크립트 `scripts/create-operations-review.cjs`
- Search Console meta 태그 삽입 스크립트 `scripts/apply-search-console-meta.cjs`
- 학습 글 구조화 데이터 삽입 스크립트 `scripts/apply-article-schema.cjs`
- 제출 패킷 동기화 점검 스크립트 `scripts/check-submission-packet.cjs`
- 내부 링크 점검 스크립트 `scripts/check-links.cjs`
- 광고 배치 점검 스크립트 `scripts/check-ad-placement.cjs`
- 성능 예산 점검 스크립트 `scripts/check-performance-budget.cjs`
- 배포 후 live URL 점검 스크립트 `scripts/check-live-site.cjs`
- 메인, 학습 허브, 검색 등록 안내의 JSON-LD 구조화 데이터

광고 배치 금지 구역:

- 바둑판 바로 옆
- 착수 지점 근처
- `다음`, `정답 보기`, `되돌리기`, `새 대국` 버튼 근처
- 모바일 하단 네비 바로 위

권장 광고 위치:

- 학습 글 본문 하단
- 학습 글 중간 단락 사이
- 메인 푸터 위쪽

## 운영 루틴

자세한 반복 점검표는 `OPERATION_CHECKLIST.md`를 기준으로 관리합니다.

GitHub Actions의 `Weekly Service Health` 워크플로가 매주 live 상태, 콘텐츠 보강 후보, 수익화 준비 상태를 자동 점검합니다.

로컬에서 같은 흐름을 직접 확인할 때:

```powershell
node scripts/weekly-maintenance.cjs
```

매주:

- 모바일에서 10분 직접 사용
- 깨진 링크 확인
- `node scripts/content-report.cjs`로 다음 보강 글 확인
- `node scripts/indexing-priority.cjs`로 색인 요청 우선순위 확인
- 새 GitHub 이슈 확인
- 새 문제 또는 글 보강
- GitHub Pages 배포 상태 확인

매월:

- Search Console 검색어 확인
- `node scripts/create-operations-review.cjs`로 운영 리뷰 작성
- `node scripts/monetization-report.cjs`로 신청 준비 상태 확인
- 유입 많은 글 보강
- AdSense 정책 변경 확인
- 광고가 있다면 오클릭 위험 확인

## 관련 문서

- `SERVICE_ROADMAP.md`: 서비스와 수익화 운영 계획
- `OPERATION_CHECKLIST.md`: 배포, 검색 등록, 광고 운영 반복 체크리스트
- `CONTENT_PLAN.md`: 검색 유입용 글 후보와 월간 콘텐츠 운영 계획
- `EXTERNAL_ACCOUNT_CHECKLIST.md`: Search Console과 AdSense 외부 계정 작업 체크리스트
- `ADSENSE_AFTER_APPROVAL.md`: AdSense 승인 후 광고 적용 절차
- `search-console.html`: Search Console 등록과 sitemap 제출 안내 페이지
- `KATAGO_LOCAL_SETUP.md`: 로컬 KataGo 분석 서버 설정
