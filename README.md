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
node --check app.js
git add -A
git commit -m "변경 내용"
git push origin main
```

GitHub Pages 반영까지는 잠시 시간이 걸릴 수 있습니다.

## Search Console

1. Google Search Console에서 URL 접두어 속성으로 등록합니다.
2. 등록 URL은 `https://macacolabs.github.io/baduk-trainer/`입니다.
3. HTML meta verification 태그를 받으면 `index.html`의 `<head>`에 추가합니다.
4. sitemap 제출 주소는 `https://macacolabs.github.io/baduk-trainer/sitemap.xml`입니다.

## AdSense 준비

승인 전에는 실제 광고 스크립트를 넣지 않습니다.

현재 준비된 것:

- `privacy.html`
- `terms.html`
- `adsense-checklist.html`
- `robots.txt`
- `sitemap.xml`
- 검색 유입용 학습 글
- 광고 예정 영역 `ad-slot`

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

매주:

- 모바일에서 10분 직접 사용
- 깨진 링크 확인
- 새 문제 또는 글 보강
- GitHub Pages 배포 상태 확인

매월:

- Search Console 검색어 확인
- 유입 많은 글 보강
- AdSense 정책 변경 확인
- 광고가 있다면 오클릭 위험 확인

## 관련 문서

- `SERVICE_ROADMAP.md`: 서비스와 수익화 운영 계획
- `OPERATION_CHECKLIST.md`: 배포, 검색 등록, 광고 운영 반복 체크리스트
- `KATAGO_LOCAL_SETUP.md`: 로컬 KataGo 분석 서버 설정
