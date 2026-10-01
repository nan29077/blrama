// 빌드 후 dist/assets의 JS·CSS·SVG를 미리 gzip·brotli로 압축해 둡니다.
// 서버는 브라우저가 받을 수 있으면 이 파일을 그대로 보내므로, 요청마다 압축하는 비용이 없습니다.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

const dir = path.resolve('dist/assets');
let files = 0,
  before = 0,
  after = 0;
for (const name of readdirSync(dir)) {
  if (!/\.(js|css|svg|json)$/.test(name)) continue;
  const file = path.join(dir, name);
  const raw = readFileSync(file);
  if (raw.length < 1024) continue;
  const br = brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: raw.length } });
  writeFileSync(file + '.br', br);
  writeFileSync(file + '.gz', gzipSync(raw, { level: 9 }));
  files++;
  before += raw.length;
  after += br.length;
}
console.log(`압축 완료: ${files}개 파일 ${(before / 1024).toFixed(0)}KB → brotli ${(after / 1024).toFixed(0)}KB`);

