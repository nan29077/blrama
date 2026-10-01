import path from 'node:path';

// 업로드 폴더: 웹 서버와 합성 작업 프로세스(worker)가 반드시 같은 곳을 써야 합니다.
export const DEFAULT_UPLOAD_DIR = 'uploads/bellama';
export const resolveUploadDir = () => path.resolve(process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR);
