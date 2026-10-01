import { useEffect } from 'react';
import { setLeaveGuard } from './App';

// 저장하지 않은 입력이 있을 때 다른 메뉴로 옮기거나(앱 안 이동) 창을 닫으려 하면 한 번 묻습니다.
// 한 화면에 입력 칸 묶음이 여러 개 있어도 함께 동작하도록, 켜진 안내를 모아 두고 첫 번째 것을 보여 줍니다.
const active = new Map<symbol, string>();
const sync = () => {
  setLeaveGuard(active.size ? () => [...active.values()][0] : null);
};
const warn = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = '';
};
export function useLeaveGuard(dirty: boolean, message = '저장하지 않은 변경이 있어요. 저장하지 않고 이 화면을 떠날까요?') {
  useEffect(() => {
    if (!dirty) return;
    const id = Symbol('leave-guard');
    active.set(id, message);
    if (active.size === 1) window.addEventListener('beforeunload', warn);
    sync();
    return () => {
      active.delete(id);
      if (!active.size) window.removeEventListener('beforeunload', warn);
      sync();
    };
  }, [dirty, message]);
}
