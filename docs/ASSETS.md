# 이미지 및 브랜드 에셋

B엘라마 화면에 쓰는 이미지 목록입니다. 브랜드 색상·로고 기준은 [BELLAMA-BRAND.md](BELLAMA-BRAND.md)를 봅니다. 숏핑 시절 이미지(남녀 커플 포스터, 마스코트 '핑이', 홈 여백 테마 5종)는 2026-09-30에 모두 삭제했습니다.

## 작품 포스터·배경

| 파일 | 용도 |
| --- | --- |
| `public/images/bellama-midnight.webp` | 대표 포스터, 데모 티저 원본, 홈 배경 |
| `public/images/bellama-spring.webp` | '너를 다시 만난 봄' 등 청춘 작품 |
| `public/images/bellama-moon.webp` | 사극 판타지 작품, 방송국 기본 이미지 |
| `public/images/bellama-shadow.webp` | 미스터리 작품 |
| `public/images/bellama-office.webp` | 오피스 작품 |
| `public/images/bellama-summer.webp` | 여름 작품 |
| `public/images/bellama-desktop.webp` | PC 좌우 여백 배경 (홈 기본 배경) |
| `public/images/share-bellama.jpg` | Open Graph 공유 카드 |

생성 프롬프트 요약은 BELLAMA-BRAND.md에 있습니다. 등장인물은 모두 성인 남성입니다. 서버 AI 목(mock) 공급자도 이 `bellama-*` 이미지만 사용합니다.

## 방송국 배너 (3:1, 1800×600)

| 파일 | 출처 |
| --- | --- |
| `channel-romance.webp` | `bellama-desktop.webp`에서 잘라 만든 완성본 (2026-09-30) |
| `channel-fantasy.webp` | `bellama-moon.webp`에서 잘라 만든 완성본 (2026-09-30) |
| `channel-neon.webp`, `channel-noir.webp`, `channel-atelier.webp` | 인물 없는 배경 생성 이미지. 원본 `assets/source/channel-*-original.png`, `scripts/prepare-channel-banners.mjs`로 재생성 |

## 프로필 아바타

`public/avatars/block-01.webp`~`block-30.webp`는 특정 완구 브랜드를 복제하지 않은 3D 블록 토이 프로필 30종입니다. 원본 시트 `assets/source/bellama-block-avatars-sheet.png`, 분리 스크립트 `scripts/prepare-avatars.mjs`.

## 시연 영상

`public/demo/preview.mp4`는 `bellama-midnight.webp`에서 FFmpeg로 만든 12초 무음 패닝 티저입니다(2026-09-30 재생성). 실제 드라마나 생성형 동영상이 아닙니다. `node scripts/prepare-assets.mjs`로 PWA 아이콘과 함께 다시 만들 수 있습니다.

## 글꼴·아이콘

`@fontsource-variable/noto-sans-kr`, `@fontsource-variable/noto-serif-kr` 로컬 웹폰트(SIL OFL), Lucide 아이콘(ISC). 로고 `public/icon.svg`와 192/512px PWA 아이콘은 B엘라마 심볼입니다.
