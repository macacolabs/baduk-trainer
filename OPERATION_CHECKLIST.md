# 큰돌 운영 체크리스트

광고 수익을 목표로 하더라도 우선순위는 학습 품질, 모바일 안정성, 검색 신뢰도입니다.

## 배포 전

- `git status --short --branch`로 의도하지 않은 변경이 없는지 확인
- `node scripts/preflight.cjs`로 문법, sitemap, 콘텐츠 품질, 링크, 성능 예산 확인
- 새 HTML 페이지를 추가했다면 `learn.html` 또는 관련 글에서 연결
- 새 공개 페이지를 추가했다면 `sitemap.xml`에 URL 추가
- 모바일 폭에서 바둑판, 오목판, 주요 버튼이 겹치지 않는지 확인

## 매주

- `node scripts/preflight.cjs --live`로 GitHub Pages live URL 접속 확인
- GitHub Actions의 `Weekly Service Health` 결과 확인
- 배우기 문제 5개 이상 직접 풀이
- 바둑 AI 대국 1판, 오목 AI 대국 1판 테스트
- 모바일에서 착수 위치와 버튼 클릭 확인
- 새 GitHub 이슈를 버그, 콘텐츠 요청, 운영 점검으로 분류
- Search Console 색인 상태와 검색어 확인
- `node scripts/content-report.cjs`로 짧거나 내부 링크가 약한 글 확인
- 유입이 있는 글 1개를 더 자세히 보강
- `CONTENT_PLAN.md`에서 다음 작성 후보 1개를 고르기

## 매월

- `node scripts/monetization-report.cjs`로 내부 준비 상태와 외부 계정 작업 분리 확인
- 개인정보처리방침과 이용약관이 현재 기능과 맞는지 확인
- AdSense 정책 변경 여부 확인
- 광고가 붙어 있다면 오클릭 위험 영역 확인
- 오래된 글의 설명, 제목, 내부 링크 보강
- 새 학습 글 또는 문제 세트 1개 이상 추가
- 발행한 글을 `CONTENT_PLAN.md` 완료 기록에 추가

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

## Search Console 확인 순서

1. `https://macacolabs.github.io/baduk-trainer/` URL 접두어 속성 확인
2. `https://macacolabs.github.io/baduk-trainer/sitemap.xml` 제출
3. `learn.html`과 주요 학습 글 색인 요청
4. 검색어가 생기면 해당 글의 제목, 첫 문단, 내부 링크 보강
5. 외부 계정 진행 상태는 `EXTERNAL_ACCOUNT_CHECKLIST.md`에 표시

## AdSense 신청 전 최종 확인

- 검색 유입용 학습 글 10개 이상
- `privacy.html`, `terms.html`, `adsense-checklist.html` 연결
- 실제 광고 스크립트 미삽입
- `ad-slot`은 조작 UI와 충분히 분리
- 모바일에서 첫 화면이 잘리지 않음
- sitemap과 robots가 현재 URL 구조와 일치
