# B엘라마 검증 기록

숏핑에서 분리한 뒤의 검증 기록만 남깁니다. 숏핑 시절 검수 보고서는 2026-09-30에 이 저장소에서 삭제했습니다(숏핑 저장소에 원본이 있습니다).

## 2026-09-30 · 숏핑 흔적 정리 및 분리

- 로그인 쿠키 `sp_session` → `bl_session`. 같은 localhost에서 숏핑(3034)과 동시에 써도 세션이 섞이지 않음.
- 세션 저장소 키 `sp:thumb:`·`sp:autoplay` → `bellama.thumb:`·`bellama.autoplay`. PostgreSQL 테스트 DB 접두사 `sp_test_` → `bl_test_`.
- 숏핑 이미지 삭제: hero·moon·spring·shadow·desktop-cinema·mascot·home-* 5종과 원본, `scripts/prepare-home-themes.mjs`, 마스코트 CSS.
- 남녀 커플이 나오던 방송국 배너 romance·fantasy를 B엘라마 포스터로 교체. 데모 티저를 B엘라마 포스터로 재생성.
- AI 목 공급자의 샘플 이미지를 `bellama-*`로 교체.
- 숏핑 문서(검수 보고서 6종) 삭제, 나머지 문서의 '숏핑' 표기를 B엘라마로 변경.
- 로컬 전용 파일 정리: `data/shortping.sqlite*`, 숏핑 소스 압축본, 감사·시뮬레이션 폴더, 옛 로그, `uploads/` 루트의 숏핑 업로드.

## 검증 원칙

- `npm run build`: TypeScript 검사 + Vite 빌드.
- `npm test`: 실행마다 `data/tests/<runId>/`에 새 DB를 만들어 로컬 데모 DB를 건드리지 않음. `TEST_PG_ADMIN_URL`을 주고 `npm run test:pg`를 실행하면 PostgreSQL로 같은 테스트를 실행(값이 없으면 멈춤). CI(GitHub Actions)는 SQLite와 PostgreSQL 17에서 모두 실행.
- 실결제·OAuth·네이티브 앱·운영 인프라는 아직 검증 범위가 아닙니다.
