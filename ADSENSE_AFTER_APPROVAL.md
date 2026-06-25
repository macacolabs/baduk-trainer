# AdSense 승인 후 적용 절차

승인 전에는 실제 광고 스크립트를 넣지 않습니다. 승인 후에도 게임판과 조작 버튼 주변에는 광고를 두지 않습니다.

## 필요한 값

- AdSense publisher ID: `ca-pub-...`
- 광고 단위 slot ID
- 필요한 경우 `ads.txt`에 넣을 Google 안내 문자열: `google.com, pub-..., DIRECT, f08c47fec0942fa0`

## 적용 순서

1. AdSense에서 사이트 승인을 확인합니다.
2. AdSense가 안내하는 `ads.txt` 문자열이 있으면 루트에 `ads.txt`를 추가합니다.
3. `privacy.html`의 광고와 쿠키 문구가 현재 사용 방식과 맞는지 확인합니다.
4. `terms.html`의 광고/외부 서비스 문구가 현재 사용 방식과 맞는지 확인합니다.
5. 학습 글 하단의 `ad-slot ad-slot-article` 위치부터 광고 코드를 적용합니다.
6. 메인 페이지는 게임판 아래 `ad-slot ad-slot-home` 위치에만 광고를 적용합니다.
7. 모바일에서 바둑판, 착수 버튼, 다음/정답 보기 버튼 근처에 광고가 붙지 않는지 확인합니다.
8. 배포 후 직접 클릭하지 말고 노출 위치만 확인합니다.

## 광고를 넣으면 안 되는 위치

- 바둑판 바로 옆
- 오목판 바로 옆
- 착수 지점 위나 아래
- `다음`, `정답 보기`, `되돌리기`, `새 대국` 버튼 근처
- 사용자가 실수로 누를 수 있는 모바일 고정 하단 영역

## 적용 후 확인 명령

```powershell
node --check app.js
$env:ADSENSE_STATUS='approved'
node scripts/check-service-readiness.cjs
node scripts/monetization-report.cjs
node scripts/check-ad-placement.cjs
node scripts/check-ads-txt.cjs
node scripts/check-links.cjs
node scripts/check-performance-budget.cjs
```

publisher ID까지 확인하려면 아래처럼 실행합니다.

```powershell
$env:ADSENSE_STATUS='approved'
$env:ADSENSE_PUBLISHER_ID='pub-1234567890123456'
node scripts/check-ads-txt.cjs
```

주의: 기본 검사 모드는 승인 전 상태입니다. 승인 후 실제 광고를 적용한 브랜치나 커밋을 확인할 때만 `ADSENSE_STATUS=approved`를 켭니다.

## 승인 후 별도 작업으로 바꿀 것

- `ads.txt` 추가 여부 점검
- 광고 위치가 `ad-slot` 안에만 있는지 점검
- 개인정보처리방침의 광고 쿠키 문구 최신화
- AdSense 정책 위반 가능성이 있는 위치 제거
- 승인 후에는 `ADSENSE_STATUS=approved` 상태에서 `node scripts/check-ad-placement.cjs`가 통과해야 배포
