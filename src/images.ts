// 기본 포스터(public/images/bellama-*.webp)는 320·480px 작은 파일이 함께 있어요(scripts/make-image-variants.mjs).
// 작은 카드에서는 브라우저가 화면 크기에 맞는 파일을 고르도록 srcset을 붙입니다. 업로드 이미지는 원본 하나만 씁니다.
export const posterSrcSet = (url?: string | null) => {
  const m = /^\/images\/(bellama-(?:midnight|moon|office|shadow|spring|summer))\.webp$/.exec(url || '');
  return m ? `/images/${m[1]}-320.webp 320w, /images/${m[1]}-480.webp 480w, /images/${m[1]}.webp 800w` : undefined;
};
