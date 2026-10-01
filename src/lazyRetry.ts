import { lazy, type ComponentType } from 'react';

// 배포 직후 열려 있던 화면은 예전 파일 이름(해시)으로 화면 조각을 찾다가 실패할 수 있어요.
// 그때 한 번만 새로고침해 새 파일을 받습니다(1분 안에 또 실패하면 오류 화면을 그대로 보여 줘요).
const KEY = 'bellama.chunkReloadAt';
export function lazyRetry<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      return await load();
    } catch (e) {
      let last = 0;
      try {
        last = Number(sessionStorage.getItem(KEY) || 0);
      } catch {
        // 저장 공간을 못 쓰면 새로고침하지 않고 오류를 그대로 보여 줍니다.
        throw e;
      }
      if (Date.now() - last > 60_000) {
        try {
          sessionStorage.setItem(KEY, String(Date.now()));
        } catch {
          throw e;
        }
        location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      throw e;
    }
  });
}
