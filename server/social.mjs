const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);

export const homeShare = {
  title: 'B엘라마 | 모든 사랑의 장면',
  description: '두 사람의 서사가 머무는 곳. 오직 BL을 위한 숏폼 드라마 플랫폼 B엘라마.',
};

export const shareImageUrl = (base) =>
  `${base.replace(/\/$/, '')}/images/share-bellama.jpg`;

export function socialOrigin(req, configuredOrigin, production) {
  // 개발용 공개 터널은 호스트를 제한해 공유 미리보기에만 사용합니다.
  const hostname = req.get('host') || '';
  if (!production && /^[a-z0-9-]+\.trycloudflare\.com$/i.test(hostname))
    return `https://${hostname.toLowerCase()}`;
  return configuredOrigin.replace(/\/$/, '');
}

export function socialTags({ title, description, url, image }) {
  const tags = [
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', 'B엘라마'],
    ['property', 'og:locale', 'ko_KR'],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:url', image],
    ['property', 'og:image:type', 'image/jpeg'],
    ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'],
    ['property', 'og:image:alt', '두 사람의 서사가 머무는 곳, B엘라마'],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', '두 사람의 서사가 머무는 곳, B엘라마'],
  ];
  return `<link rel="canonical" href="${escapeHtml(url)}" />\n` +
    tags.map(([kind, name, content]) => `<meta ${kind}="${name}" content="${escapeHtml(content)}" />`).join('\n');
}

export function sharePage(meta) {
  const safeTitle = escapeHtml(meta.title);
  const safeDescription = escapeHtml(meta.description);
  return `<!doctype html>
<html lang="ko"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${safeTitle}</title><meta name="description" content="${safeDescription}" />
${socialTags(meta)}</head><body>
<main><h1>${safeTitle}</h1><p>${safeDescription}</p><a href="${escapeHtml(meta.destination)}">B엘라마에서 보기</a></main>
<script src="/share-redirect.js" defer></script></body></html>`;
}

export function injectHomeTags(html, base) {
  return html.replace('</head>', `${socialTags({
    ...homeShare,
    url: `${base}/`,
    image: shareImageUrl(base),
  })}\n</head>`);
}
