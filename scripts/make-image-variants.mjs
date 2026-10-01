// 기본 포스터(public/images/bellama-*.webp, 800×1200)의 작은 크기(320·480px)를 만듭니다.
// 화면의 작은 카드에서는 작은 파일을 받아 데이터와 로딩 시간을 줄여요(srcset). 포스터를 바꾸면 다시 실행하세요.
// 실행: node scripts/make-image-variants.mjs
import { readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/images');
for (const name of readdirSync(dir)) {
  const m = /^(bellama-(?!desktop)[a-z0-9-]+?)\.webp$/.exec(name);
  if (!m || /-(320|480)$/.test(m[1])) continue;
  for (const w of [320, 480]) {
    const out = path.join(dir, `${m[1]}-${w}.webp`);
    await sharp(path.join(dir, name)).resize({ width: w }).webp({ quality: 78 }).toFile(out);
    console.log('만듦:', path.basename(out));
  }
}
