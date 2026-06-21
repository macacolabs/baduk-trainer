# 큰돌 서비스/수익화 운영 계획

## 현재 판단

큰돌은 GitHub Pages에서 정적 서비스로 운영할 수 있고, 바둑/오목 학습 기능도 기본 사용은 가능합니다. 다만 광고 수익을 기대하려면 단순히 광고 코드를 붙이는 것보다 먼저 검색 유입, 체류 시간, 정책 신뢰 요소를 만들어야 합니다.

## 광고 신청 전 필수 개선

1. 고유 콘텐츠 강화
   - 바둑 입문, 단수, 활로, 사활, 오목 전략을 설명하는 읽을거리 페이지를 추가합니다.
   - 현재 앱 내부 문제는 좋지만, 검색엔진과 광고 심사자가 평가할 수 있는 설명형 콘텐츠가 더 필요합니다.
   - 1차 완료: `baduk-beginner.html`, `baduk-atari.html`, `baduk-liberties.html`, `omok-strategy.html`, `baduk-glossary.html`을 추가했습니다.
   - 2차 완료: 글을 묶는 학습 허브 `learn.html`을 추가했습니다.

2. 정책 페이지 유지
   - `privacy.html`, `terms.html`을 유지합니다.
   - 광고 또는 분석 도구를 붙이는 순간 쿠키/광고 관련 문구를 갱신합니다.

3. 광고 배치 원칙
   - 바둑판 바로 옆, 착수 버튼 근처, 되돌리기/다음 버튼 근처에는 광고를 두지 않습니다.
   - 모바일에서는 상단 고정 광고보다 학습 단락 사이 또는 화면 하단의 명확히 분리된 영역이 안전합니다.
   - 광고 라벨은 `광고` 또는 `Sponsored Links`처럼 명확해야 합니다.
   - 승인 전 준비 완료: 메인 하단과 학습 글 하단에 `ad-slot` 구조만 추가했습니다. 실제 광고 스크립트는 아직 넣지 않습니다.
   - 신청 전 점검용 `adsense-checklist.html`을 추가했습니다.

4. SEO 기본
   - `robots.txt`, `sitemap.xml`, canonical, description 메타를 유지합니다.
   - 검색 유입용 페이지 예: `바둑 입문`, `단수 연습`, `오목 기본 전략`, `바둑 용어 사전`.
   - 운영 보강 완료: `404.html`, `manifest.webmanifest`, `README.md`를 추가했습니다.

5. 성능
   - 첫 화면에서 빠르게 열려야 합니다.
   - `app.js`가 커지고 있으니 다음 단계에서는 학습 데이터와 게임 로직 분리를 검토합니다.

## 운영 루틴

### 매주

- 실제 모바일에서 10분 사용하며 클릭 오류, 판 위치, 글자 겹침 확인
- GitHub Pages 배포 상태 확인
- Search Console 색인/검색어 확인
- 사용자 입장에서 새 문제 5개 이상 추가

### 매월

- 인기 학습 주제 1개를 별도 글 페이지로 제작
- AdSense 정책 변경 확인
- 광고가 붙었다면 위치별 클릭률보다 이탈률과 오클릭 위험을 먼저 확인
- 앱 로딩 속도와 모바일 레이아웃 점검

## 수익화 순서

1. 기능 안정화
2. 정책 페이지/SEO 파일 정리
3. 검색 유입용 설명 페이지 5-10개 추가
4. Google Search Console 등록
5. AdSense 신청
6. 승인 후 광고를 게임판과 조작 버튼에서 떨어진 위치에만 배치
7. 체류 시간과 재방문을 늘리는 학습 루틴 강화

## 다음 개발 우선순위

1. 오목 난이도 선택
2. 검색 유입용 학습 글 페이지 추가 확장
3. 바둑/오목 문제 즐겨찾기와 이어풀기
4. 모바일 하단 광고가 들어갈 수 있는 안전 영역 설계
5. 로컬 학습 기록 백업/복원

## 참고한 공식 기준

- AdSense eligibility requirements: https://support.google.com/adsense/answer/9724
- AdSense ad placement policies: https://support.google.com/adsense/answer/1346295
- Google Search Central Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
