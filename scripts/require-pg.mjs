// npm run test:pg 전에: PostgreSQL 테스트용 관리자 주소가 없으면 SQLite로 조용히 돌지 않도록 멈춥니다.
if (!process.env.TEST_PG_ADMIN_URL) {
  console.error('TEST_PG_ADMIN_URL을 지정하세요. 예) TEST_PG_ADMIN_URL=postgres://user:pass@127.0.0.1:5432/postgres npm run test:pg');
  process.exit(1);
}
