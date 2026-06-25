# 외부 계정 등록 체크리스트

이 문서는 GitHub Pages 배포 이후 Search Console과 AdSense에서 직접 진행해야 하는 작업을 추적합니다.

## 현재 사이트 정보

- 사이트 URL: `https://macacolabs.github.io/baduk-trainer/`
- sitemap URL: `https://macacolabs.github.io/baduk-trainer/sitemap.xml`
- Search Console 안내 페이지: `https://macacolabs.github.io/baduk-trainer/search-console.html`
- AdSense 신청 전 체크리스트: `https://macacolabs.github.io/baduk-trainer/adsense-checklist.html`
- 제출 패킷: `SUBMISSION_PACKET.md`

## 진행 기록 방법

외부 계정 화면에서 작업을 끝낸 뒤 아래 명령으로 해당 항목을 완료 표시합니다.

```powershell
node scripts/mark-external-task.cjs "Search Console" "URL 접두어"
node scripts/external-account-status.cjs
```

섹션명과 항목 검색어가 하나의 체크 항목에만 맞을 때만 변경됩니다. 여러 항목이 맞으면 더 구체적인 검색어를 넣습니다.

## Search Console

- [ ] `SUBMISSION_PACKET.md`의 기본 정보 확인
- [ ] URL 접두어 속성으로 사이트 등록
- [ ] HTML meta verification 태그 발급
- [ ] `SEARCH_CONSOLE_META` 값으로 `node scripts/apply-search-console-meta.cjs` 실행
- [ ] 변경사항 배포
- [ ] Search Console에서 소유권 확인 완료
- [ ] `sitemap.xml` 제출
- [ ] 메인 페이지 색인 요청
- [ ] `learn.html` 색인 요청
- [ ] `faq.html` 색인 요청
- [ ] 주요 학습 글 3개 이상 색인 요청

## AdSense 신청 전

- [ ] `node scripts/monetization-report.cjs`에서 내부 blocker가 없는지 확인
- [ ] Search Console 소유권 확인 완료
- [ ] sitemap 제출 완료
- [ ] 주요 학습 글 접근 확인
- [ ] `privacy.html` 접근 확인
- [ ] `terms.html` 접근 확인
- [ ] 실제 광고 스크립트가 아직 없는지 확인
- [ ] `node scripts/check-service-readiness.cjs` 통과
- [ ] `node scripts/check-links.cjs` 통과
- [ ] `node scripts/check-performance-budget.cjs` 통과

## AdSense 신청

- [ ] `SUBMISSION_PACKET.md`의 AdSense 신청 전 실행 명령 완료
- [ ] AdSense 계정 생성 또는 로그인
- [ ] 사이트 URL 등록
- [ ] AdSense 심사용 코드 또는 안내 사항 확인
- [ ] 필요한 경우 `ads.txt` 안내 문구 확인
- [ ] 승인 대기 중에는 광고 코드를 임의로 추가하지 않음

## AdSense 승인 후

- [ ] `ADSENSE_AFTER_APPROVAL.md` 순서 확인
- [ ] 필요한 경우 `ads.txt` 추가
- [ ] 개인정보처리방침 광고/쿠키 문구 최신화
- [ ] 약관 광고/외부 서비스 문구 최신화
- [ ] 학습 글 하단 `ad-slot`부터 광고 적용
- [ ] 게임판과 조작 버튼 주변에는 광고 미배치
- [ ] 모바일에서 오클릭 위험 확인
- [ ] 직접 광고 클릭 금지

## 매주 확인

- [ ] Search Console 노출/클릭 검색어 확인
- [ ] 색인 제외 페이지 확인
- [ ] 유입 있는 글 1개 보강
- [ ] `CONTENT_PLAN.md`에서 다음 글 후보 확인
