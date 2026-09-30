import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
// romance·fantasy 배너는 B엘라마 포스터(bellama-desktop·bellama-moon)에서 잘라 만든 완성본이라 원본 PNG가 없습니다.
const themes = ['neon', 'noir', 'atelier'];

await mkdir(path.join(root, 'public', 'images'), { recursive: true });

for (const theme of themes) {
  await sharp(path.join(root, 'assets', 'source', `channel-${theme}-original.png`))
    .resize(1800, 600, { fit: 'cover', position: 'centre' })
    .webp({ quality: 86, effort: 6 })
    .toFile(path.join(root, 'public', 'images', `channel-${theme}.webp`));
}

console.log(`Prepared ${themes.length} channel banner themes.`);
