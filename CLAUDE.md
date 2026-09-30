# B엘라마 작업 규칙

- 이 폴더(`E:\프로젝트\B엘라마`)만 작업합니다. 숏핑 폴더·DB·저장소는 읽기·수정·push 모두 하지 않습니다.
- 저장소: https://github.com/nan29077/blrama (main)
- 개발 서버: http://localhost:3036 (`npm run dev`, HMR 3037). 다른 포트로 바꾸지 않습니다.
- DB: 로컬 `data/bellama.sqlite`, PostgreSQL은 `bellama` 전용 DB만 사용.
- 쿠키·스토리지 키·캐시 이름은 `bl_`/`bellama.` 접두사를 씁니다. `sp_`·`sp:`·shortping 이름을 새로 만들지 않습니다.
- BL 장르 전문 서비스입니다. 이미지·예시 문구의 인물은 성인 남성 커플 기준으로 만듭니다.
- 숏핑과의 분리 기준은 README.md의 '숏핑과의 분리' 표를 따릅니다.
- 커밋·푸시: 이 세션 환경에는 GitHub 로그인이 없으므로 로컬 커밋까지만 하고, 푸시는 사용자가 `B엘라마-커밋푸시.bat`(Claude·Codex 변경 전체 add → commit → pull --rebase → push)을 실행합니다.
