# 개인용 KataGo 연결 방법

이 앱은 GitHub Pages 정적 배포를 그대로 쓰고, 딥러닝 분석만 내 PC에서 실행하는 구조입니다.

## 1. 필요한 파일

- `katago.exe`
- KataGo 모델 파일: `*.bin.gz`
- KataGo 분석 설정 파일: `analysis.cfg`

KataGo 릴리스와 모델 파일을 내려받아 예를 들어 `C:\katago` 폴더에 둡니다.

## 2. PowerShell에서 환경변수 설정

아래 경로는 본인 PC에 맞게 바꾸세요.

```powershell
$env:KATAGO_PATH='C:\katago\katago.exe'
$env:KATAGO_MODEL='C:\katago\kata1-b18c384nbt.bin.gz'
$env:KATAGO_CONFIG='C:\katago\analysis.cfg'
$env:KATAGO_VISITS='96'
```

## 3. 로컬 서버 실행

프로젝트 폴더에서 실행합니다.

```powershell
node local-katago-server.cjs
```

성공하면 아래 주소가 열립니다.

```txt
http://127.0.0.1:8765
```

상태 확인:

```powershell
Invoke-WebRequest http://127.0.0.1:8765/health
```

## 4. 앱에서 사용

1. 바둑 앱을 엽니다.
2. `AI 대국` 또는 `2인 대국`에서 몇 수 둡니다.
3. `딥러닝 분석` 버튼을 누릅니다.
4. KataGo 추천수, 승률, 예상 집 차이가 실전형 AI 코치 카드에 표시됩니다.

## 참고

- 내 PC에서만 분석하므로 서버비가 들지 않습니다.
- 휴대폰에서 쓰려면 PC와 휴대폰이 같은 Wi-Fi에 있어야 하고, 로컬 서버 주소를 PC IP로 열 수 있게 추가 설정이 필요합니다.
- `KATAGO_VISITS`를 높이면 더 강하지만 느려집니다.
