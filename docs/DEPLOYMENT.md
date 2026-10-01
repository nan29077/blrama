# AWS 및 Android·iOS 후속 배포

## 현재 준비된 항목

공통 PostgreSQL 스키마·`pg` 어댑터, 운영 모드 차단 장치, Dockerfile, PostgreSQL 개발 컨테이너, PWA 매니페스트, Capacitor 구성 및 플랫폼 패키지. AWS 인프라 생성·결제사 연동·실제 모바일 빌드와 배포는 아직 실행하지 않았습니다.

## 권장 AWS 구성

CloudFront/ALB(ACM TLS) → ECS Fargate Node.js 앱 → RDS PostgreSQL. 프런트 정적 파일과 API는 같은 공개 도메인을 사용하여 현재 HttpOnly 쿠키 구조를 유지합니다. 최소 초기 구성은 단일 인스턴스와 영속 볼륨을 사용합니다. 여러 인스턴스로 확장하기 전 업로드 저장소와 rate limit을 공유해야 합니다.

- DB: RDS PostgreSQL, private subnet, 연결 TLS 검증, Secrets Manager의 DATABASE_URL.
- 영상: 추후 private S3 multipart 업로드 → MediaConvert HLS → CloudFront signed cookie/URL. 현재 구현은 로컬 MP4이므로 이 저장소·트랜스코딩 어댑터 구현이 필요합니다. 현재 MP4 서버를 대규모 스트리밍으로 간주하지 마세요.
- 업로드 영속성: Dockerfile은 `UPLOAD_DIR=/app/uploads/bellama`, `DATA_DIR=/app/data`와 볼륨(`/app/uploads`, `/app/data`)을 선언합니다. 실행 환경에서 이 두 경로를 영속 저장소(EFS 등)에 연결하세요. Fargate 임시 디스크만 사용하면 재배포 시 잃습니다. 운영 확장 전 S3 전환 권장.
- 정적 파일: 빌드 산출물(`/assets`)은 1년 캐시 + 미리 압축한 brotli/gzip으로, API JSON은 2KB 이상이면 gzip으로 보냅니다. 앞단(CloudFront)에서도 압축을 켜도 됩니다.
- 합성 worker 분리: 웹 서버를 `COMPOSE_WORKER=external`로 띄우고 같은 `DATABASE_URL`·`UPLOAD_DIR`로 `node server/worker.mjs`를 따로 실행합니다(`docker compose --profile app up`이 이 구성을 재현합니다). 여러 대를 띄워도 살아 있는 worker의 합성은 가로채지 않습니다(2분 생존 표시).
- 관측: CloudWatch 로그·지표, RDS 백업/PITR, 알림, 에러 추적.
- 다중 인스턴스 요청 제한: 현재 메모리 rate limit을 Redis 등 공유 저장소로 교체.
- ALB 뒤에서는 실제 프록시 구성을 확인하고 `TRUST_PROXY_HOPS=1` 지정. 무조건 모든 프록시를 신뢰하지 않습니다.

```dotenv
NODE_ENV=production
HOST=0.0.0.0
PORT=3036
APP_ORIGIN=https://your-confirmed-domain.example
DATABASE_URL=postgresql://...confirmed-production-connection...
ENABLE_DEMO=false
UPLOAD_DIR=/app/uploads/bellama
DATA_DIR=/app/data
TRUST_PROXY_HOPS=1
ANDROID_STORE_URL=
IOS_STORE_URL=
# 필수: 32자 이상. 없거나 짧으면 운영 서버가 시작하지 않습니다(계좌번호·AI 키·발송 비밀값 암호화). 바꾸면 저장된 키를 다시 입력해야 함
AI_SECRET_KEY=...32자-이상-임의-문자열...
# 선택: 비우면 DB에 한 번 만들어 모든 서버가 함께 씁니다
MEDIA_TOKEN_SECRET=
# 선택: 합성을 별도 worker로 돌릴 때
COMPOSE_WORKER=external
```

운영 도메인·비밀키는 실제 값 확정 후 비밀 관리 서비스로 주입하세요. `.env`를 Git에 올리지 않습니다. `DATABASE_URL`만 설정한다고 기존 SQLite 데이터가 자동 이전되지는 않습니다. 마이그레이션은 외래키 순서에 맞춘 별도 데이터 이관 및 검증이 필요합니다.

## 링크 공유 카드

홈과 공개 작품·방송국의 공유 주소에는 카카오톡 등에서 읽는 Open Graph 제목·설명·이미지가 서버에서 제공됩니다. 운영 환경의 `APP_ORIGIN`은 외부에서 접근 가능한 실제 HTTPS 도메인으로 지정하고, `/images/share-bellama.jpg`가 로그인 없이 열리는지 확인하세요. `localhost` 링크는 다른 사람의 기기나 카카오 서버에서 접근할 수 없습니다. 작품·방송국 공유 버튼은 각각 `/share/drama/{id}`, `/share/channel/{id}` 주소를 사용하며, 방문자는 기존 웹앱의 해당 화면으로 이동합니다. 비공개 작품과 방송국은 공유 카드가 나오지 않습니다.

공개 후 이미지나 문구를 변경했는데 카카오톡 카드가 예전 내용으로 보이면 [카카오디벨로퍼스의 OG 캐시 초기화 도구](https://developers.kakao.com/tool)에서 해당 공개 URL의 캐시를 지우고 다시 확인하세요.

```bash
docker build -t bellama .
# 실제 환경변수·영속 볼륨·TLS reverse proxy를 준비한 뒤 컨테이너 실행
```

운영 최초 관리자는 일반 이메일 회원가입을 완료한 계정을, DB에 접근 가능한 운영자가 다음 명령으로 승격합니다. 스크립트는 없는 계정을 생성하거나 비밀번호를 출력하지 않습니다.

```bash
node --env-file=.env scripts/promote-admin.mjs confirmed-admin@example.com
```

개발 PostgreSQL은 `docker compose up -d db`로 시작하고 `.env`의 `DATABASE_URL`을 B엘라마 전용 DB로 연결합니다(호스트 포트 5433). 이때도 실제 개인정보나 운영 데이터를 사용하지 않습니다.

## 외부 로그인·결제

- 카카오·네이버·구글: 앱 등록, 클라이언트 식별자·시크릿, 허용 redirect URI, 서버 state/PKCE 검증, 신규/기존 계정 연결 정책, 탈퇴 흐름. 버튼은 현재 안내 기능입니다.
- 이메일·문자: 비밀번호 재설정 메일과 휴대폰 인증 문자는 구현돼 있고, 관리자 '이메일 · 문자 발송'에서 웹훅(중계 서버 → SES·문자 업체)을 설정하면 실제로 나갑니다. 운영에서는 '기록만 남기기'를 쓸 수 없습니다.
- 웹 결제: 계약한 PG사의 서버 승인 및 서명 검증 webhook을 연결하고 실제 주문 상태 머신·취소/환불/구독 자동 갱신을 구현합니다. 현재 checkout은 운영에서 503이며 테스트 주문만 생성합니다.
- 정책·사업자 정보·콘텐츠 이용 권한·연령 정책은 정식 공개 전 확정. 현재 약관 모달은 확정된 법적 문서가 아닙니다.

## 모바일

Capacitor 앱 ID `com.bellama.app`, 앱 이름 `B엘라마`, 웹 산출물 `dist`가 준비되어 있습니다.

```bash
npm run mobile:android
npm run mobile:sync
npx cap open android
```

iOS는 macOS·Xcode·Apple 개발자 서명이 필요한 후속 단계입니다.

```bash
npm run mobile:ios
npm run mobile:sync
npx cap open ios
```

앱은 `VITE_API_ORIGIN`(운영 서버 주소)으로 API를 부르고 Bearer 토큰·미디어 토큰(`?mt=`)으로 인증합니다(README '모바일 앱 연결' 참고). `npm run mobile:sync`는 이 값이 없으면 멈춥니다. 남은 일: 로그인 토큰을 Keychain/Keystore 기반 보안 저장소 플러그인으로 옮기기(현재 앱 안 localStorage), 상태바 플러그인, App Links/Universal Links 파일 배포.

스토어 출시 전에는 플랫폼 로그인, 딥링크, 앱 아이콘·스플래시, 안전 영역, 푸시, 복원 가능한 인앱 구매 영수증 검증, 구독 복원, 개인정보 안내, 실제 기기 재생 검증이 필요합니다. 디지털 콘텐츠 결제 방식과 로그인·심사 요구사항은 출시 시점의 공식 정책을 다시 확인해야 합니다. 네이티브 인앱 결제 및 서명 패키지는 이번 로컬 개발 범위에 포함하지 않습니다.

## 참고 문서

- Vite: https://vite.dev/guide/
- Capacitor: https://capacitorjs.com/docs
- PostgreSQL driver: https://node-postgres.com/
- Node SQLite: https://nodejs.org/api/sqlite.html
