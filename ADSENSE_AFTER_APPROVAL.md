# AdSense 승인 후 적용 절차

승인 전에는 실제 광고 스크립트를 넣지 않습니다. 승인 후에도 게임판과 조작 버튼 주변에는 광고를 두지 않습니다.

## 필요한 값

- AdSense publisher ID: `ca-pub-...`
- 광고 단위 slot ID: 숫자로 된 display ad slot ID
- 필요한 경우 `ads.txt`에 넣을 Google 안내 문자열: `google.com, pub-..., DIRECT, f08c47fec0942fa0`

## 적용 순서

1. AdSense에서 사이트 승인을 확인합니다.
2. AdSense가 안내하는 `ads.txt` 문자열이 있으면 아래 도구로 검증한 뒤 루트에 `ads.txt`를 추가합니다.
3. `privacy.html`의 광고와 쿠키 문구가 현재 사용 방식과 맞는지 확인합니다.
4. `terms.html`의 광고/외부 서비스 문구가 현재 사용 방식과 맞는지 확인합니다.
5. GitHub 저장소 Actions Variables에 승인 후 값을 설정합니다.
6. Pages 배포가 `dist`를 만들 때 `ad-slot` 안에만 광고 코드를 자동 주입합니다.
7. 모바일에서 바둑판, 착수 버튼, 다음/정답 보기 버튼 근처에 광고가 붙지 않는지 확인합니다.
8. 배포 후 직접 클릭하지 말고 노출 위치만 확인합니다.

## ads.txt 준비 명령

Google이 안내한 한 줄을 그대로 넣습니다. 승인 전에는 실행하지 않습니다.

```powershell
$env:ADS_TXT_LINE='google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0'
node scripts/prepare-ads-txt.cjs --check
node scripts/prepare-ads-txt.cjs --write
```

이미 `ads.txt`가 있고 Google 안내값과 다르면 먼저 파일을 확인합니다. 정말 교체해야 할 때만 `--force`를 붙입니다.

GitHub Pages 배포 검사도 승인 후 모드로 바꿔야 합니다. GitHub 저장소의 Settings > Secrets and variables > Actions > Variables에 아래 값을 추가합니다.

- `ADSENSE_STATUS`: `approved`
- `ADSENSE_PUBLISHER_ID`: `pub-1234567890123456`
- `ADSENSE_AD_SLOT_ID`: `1234567890`

이 값이 없으면 기본 배포 검사는 승인 전 모드로 동작하고, `ads.txt`가 공개되는 것을 실패로 봅니다. 승인 후 모드에서는 원본 HTML이 아니라 GitHub Pages 공개 산출물 `dist`에만 광고 코드가 들어갑니다.

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
$env:ADSENSE_PUBLISHER_ID='pub-1234567890123456'
$env:ADSENSE_AD_SLOT_ID='1234567890'
node scripts/build-pages-artifact.cjs
node scripts/check-adsense-config.cjs --dir dist
node scripts/check-ad-placement.cjs --dir dist
node scripts/check-service-readiness.cjs
node scripts/monetization-report.cjs
node scripts/check-ads-txt.cjs
node scripts/check-links.cjs
node scripts/check-performance-budget.cjs
```

승인 후 공개 산출물에 광고가 들어갔는지는 아래처럼 확인합니다.

```powershell
$env:ADSENSE_STATUS='approved'
$env:ADSENSE_PUBLISHER_ID='pub-1234567890123456'
$env:ADSENSE_AD_SLOT_ID='1234567890'
node scripts/build-pages-artifact.cjs
node scripts/check-adsense-config.cjs --dir dist
node scripts/check-ad-placement.cjs --dir dist
Select-String -Path dist\index.html -Pattern "adsbygoogle|ca-pub-|data-ad-slot"
```

주의: 기본 검사 모드는 승인 전 상태입니다. 승인 후 광고는 `scripts/inject-adsense.cjs`가 공개 산출물에만 넣습니다. 원본 HTML에 직접 AdSense 코드를 붙이지 않습니다. `scripts/check-adsense-config.cjs --dir dist`는 승인 후 publisher ID, slot ID, `dist` 광고 코드, `ads.txt` 일치 여부를 함께 점검합니다.

## 승인 후 별도 작업으로 바꿀 것

- `ads.txt` 추가 여부 점검
- 광고 위치가 `ad-slot` 안에만 들어가는지 `dist`에서 점검
- 개인정보처리방침의 광고 쿠키 문구 최신화
- AdSense 정책 위반 가능성이 있는 위치 제거
- 승인 후에는 `ADSENSE_STATUS=approved`, `ADSENSE_PUBLISHER_ID`, `ADSENSE_AD_SLOT_ID`가 모두 있어야 광고 산출물 빌드가 통과
