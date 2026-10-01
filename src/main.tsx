import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App, { navigate } from './App';
import '@fontsource-variable/noto-sans-kr';
import './style.css';
import './brand.css';
import './admin-mobile.css';
import { installTableLabels } from './tableLabels';
import { isNativeApp, refreshMediaToken } from './platform';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="fatal">
        <img src="/icon.svg" width="56" alt="" />
        <h1>잠시 화면을 불러오지 못했어요</h1>
        <button onClick={() => location.reload()}>다시 시도</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
installTableLabels();
// 제목용 명조체(Noto Serif KR)는 첫 화면을 그린 뒤에 불러옵니다(첫 로드에서 글꼴·CSS 용량을 줄이기 위해).
// 불러오기 전에는 기본 글꼴로 보이다가 바뀝니다.
const loadSerif = () => void import('@fontsource-variable/noto-serif-kr').catch(() => {});
if ('requestIdleCallback' in window) (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadSerif);
else setTimeout(loadSerif, 600);
const root: Root = import.meta.hot?.data.root ?? createRoot(document.getElementById('root')!);
if (import.meta.hot)
  import.meta.hot.dispose((data) => {
    data.root = root;
  });
const render = () =>
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
if (isNativeApp) {
  // 앱: 영상 · 음성 주소에 붙일 미디어 토큰을 먼저 받고(최대 3초 기다림) 화면을 그립니다.
  void Promise.race([refreshMediaToken(), new Promise((ok) => setTimeout(ok, 3000))]).then(render);
  // 안드로이드 뒤로 가기 버튼: 앱 안에서 뒤로 갈 곳이 있으면 뒤로, 없으면 앱을 닫습니다.
  // 패키지를 불러오지 않고 앱이 넣어 주는 플러그인(Capacitor.Plugins.App)을 바로 씁니다
  // (웹 개발 서버에서 @capacitor/app 설치 여부와 상관없이 화면이 뜨도록).
  type BackEvent = { canGoBack: boolean };
  type NativeAppPlugin = {
    addListener: ((e: 'backButton', cb: (ev: BackEvent) => void) => unknown) & ((e: 'appUrlOpen', cb: (ev: { url: string }) => void) => unknown);
    exitApp: () => Promise<void>;
  };
  const NativeApp = (window as unknown as { Capacitor?: { Plugins?: { App?: NativeAppPlugin } } }).Capacitor?.Plugins?.App;
  NativeApp?.addListener('backButton', ({ canGoBack }) => {
    // 열린 창(팝업)이 있으면 먼저 닫습니다.
    const open = document.querySelector('.modal-backdrop, .ws-overlay, .preview-overlay, .viewer-bell-panel');
    if (open) {
      (document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return;
    }
    // 홈에서는 앱을 닫고, 그 밖의 화면은 뒤로(앱 안 기록이 없으면 홈으로) 갑니다.
    // (history.length는 '앞으로' 기록까지 세므로 기준으로 쓰지 않습니다.)
    const here = location.hash.replace(/^#\/?/, '');
    if (!here || here === 'home') void NativeApp.exitApp();
    else if (canGoBack) history.back();
    else navigate('home', { replace: true });
  });
  // 공유 링크(https://…/share/drama/ID 등)로 앱이 열리면 해당 화면으로 이동합니다(App Link·Universal Link 설정 시).
  NativeApp?.addListener('appUrlOpen', ({ url }) => {
    try {
      const u = new URL(url);
      const share = /^\/share\/(drama|channel)\/([^/]+)/.exec(u.pathname);
      if (share) navigate(`${share[1]}/${decodeURIComponent(share[2])}`);
      else if (u.hash.startsWith('#/')) navigate(u.hash.slice(2));
    } catch {
      // 알 수 없는 주소는 무시합니다.
    }
  });
} else {
  render();
  if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => {});
}
