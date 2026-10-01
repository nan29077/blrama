import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    // Cloudflare Tunnel(trycloudflare.com) 외부 미리보기 허용
    allowedHosts: ['.trycloudflare.com'],
    // /@fs/ 경로로도 DB·암호 키·업로드 원본을 읽지 못하게 막습니다(앞의 4개는 Vite 기본값).
    fs: {
      deny: [
        '.env',
        '.env.*',
        '*.{crt,pem}',
        '**/.git/**',
        '**/data/**',
        '**/uploads/**',
        '**/*.sqlite*',
        '**/.ai-secret',
        '**/*.log',
        '**/tests/**',
        '**/scripts/**',
        '**/*.md',
        '**/*.bat',
        '**/*.ps1',
      ],
    },
    watch: {
      ignored: [
        '**/data/**',
        '**/uploads/**',
        '**/public/**',
        '**/assets/**',
        '**/docs/**',
        '**/tests/**',
      ],
    },
  },
  build: { outDir: 'dist' },
});
