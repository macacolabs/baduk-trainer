# 큰돌 제출 패킷

Search Console과 AdSense 신청 때 복사해서 쓰는 정보입니다.

## 기본 정보

- 사이트 이름: `큰돌`
- 사이트 URL: `https://macacolabs.github.io/baduk-trainer/`
- sitemap URL: `https://macacolabs.github.io/baduk-trainer/sitemap.xml`
- 서비스 소개: `https://macacolabs.github.io/baduk-trainer/about.html`
- 개인정보처리방침: `https://macacolabs.github.io/baduk-trainer/privacy.html`
- 이용약관: `https://macacolabs.github.io/baduk-trainer/terms.html`
- AdSense 신청 전 체크리스트: `https://macacolabs.github.io/baduk-trainer/adsense-checklist.html`

## Search Console 입력값

- 속성 유형: URL 접두어
- 입력 URL: `https://macacolabs.github.io/baduk-trainer/`
- sitemap 제출값: `https://macacolabs.github.io/baduk-trainer/sitemap.xml`

HTML meta verification 태그를 받으면 아래 명령으로 넣습니다.

```powershell
$env:SEARCH_CONSOLE_META='<meta name="google-site-verification" content="발급값">'
node scripts/apply-search-console-meta.cjs
node scripts/preflight.cjs
git add -A
git commit -m "Add Search Console verification"
git push origin main
```

## 먼저 색인 요청할 URL

아래 기본 목록을 먼저 쓰고, 최신 우선순위는 `node scripts/indexing-priority.cjs`로 확인합니다.

1. `https://macacolabs.github.io/baduk-trainer/`
2. `https://macacolabs.github.io/baduk-trainer/learn.html`
3. `https://macacolabs.github.io/baduk-trainer/faq.html`
4. `https://macacolabs.github.io/baduk-trainer/baduk-beginner.html`
5. `https://macacolabs.github.io/baduk-trainer/baduk-atari.html`
6. `https://macacolabs.github.io/baduk-trainer/baduk-liberties.html`
7. `https://macacolabs.github.io/baduk-trainer/omok-strategy.html`
8. `https://macacolabs.github.io/baduk-trainer/omok-ai-difficulty.html`

## AdSense 신청 전 실행

```powershell
node scripts/monetization-report.cjs
node scripts/preflight.cjs --live
```

`monetization-report`에서 `Internal blockers: none`이면 코드와 공개 페이지 기준의 내부 준비는 완료된 상태입니다.

## AdSense 신청 시 확인할 것

- 사이트 URL은 `https://macacolabs.github.io/baduk-trainer/`로 입력합니다.
- 승인 전에는 실제 광고 스크립트를 넣지 않습니다.
- 심사 중에는 콘텐츠와 정책 페이지를 삭제하거나 URL을 바꾸지 않습니다.
- 승인 후 광고 적용은 `ADSENSE_AFTER_APPROVAL.md` 순서로 진행합니다.

## 외부 계정에서 직접 해야 하는 일

- Search Console 소유권 확인
- sitemap 제출
- 주요 URL 색인 요청
- AdSense 사이트 등록
- AdSense 심사 결과 확인
