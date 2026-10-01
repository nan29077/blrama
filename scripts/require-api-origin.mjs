// npm run mobile:sync 전에: 앱은 운영 서버 주소(VITE_API_ORIGIN)가 없으면 https://localhost/api로 요청해 조용히 실패합니다.
// 환경변수나 .env.production · .env 파일에 https:// 주소가 없으면 빌드를 멈춥니다.
import { existsSync, readFileSync } from 'node:fs';

const fromFile = (file) => {
  if (!existsSync(file)) return '';
  const m = /^\s*VITE_API_ORIGIN\s*=\s*(.+?)\s*$/m.exec(readFileSync(file, 'utf8'));
  return m ? m[1].replace(/^['"]|['"]$/g, '') : '';
};
const origin = process.env.VITE_API_ORIGIN || fromFile('.env.production') || fromFile('.env');
if (!/^https:\/\/[^/]+/.test(origin)) {
  console.error('VITE_API_ORIGIN에 운영 서버 주소(https://…)를 넣어 주세요. 예) VITE_API_ORIGIN=https://your-bellama-domain.example npm run mobile:sync');
  process.exit(1);
}
console.log('앱이 연결할 서버:', origin);
