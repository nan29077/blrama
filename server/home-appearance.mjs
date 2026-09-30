import { styleOf } from './home-layout.mjs';

export const homeThemes = [
  {
    id: 'cinematic',
    name: '시네마틱',
    mood: '도시의 밤, 두 사람의 로맨스',
    image: '/images/bellama-desktop.webp',
    eyebrow: 'BOYS LOVE, ENDLESS STORIES',
    headline: '두 사람의',
    highlight: '모든 순간.',
    description: '서로를 향해 움직이는 마음.\n오직 BL을 위한 드라마를 만나보세요.',
    caption: '마음이 닿는 장면, B엘라마에서.',
  },
  {
    id: 'bright',
    name: '밝은 발견',
    mood: '첫사랑의 따뜻한 재회',
    image: '/images/bellama-spring.webp',
    eyebrow: 'EVERY DAY, A NEW STORY',
    headline: '가볍게 시작해,',
    highlight: '오래 남는 이야기.',
    description: '짧은 휴식에도 새로운 장면을 만나고\n취향에 맞는 작품을 발견해 보세요.',
    caption: '매일 새롭게 만나는 B엘라마 오리지널',
  },
  {
    id: 'fantasy',
    name: '판타지',
    mood: '달빛과 마법의 세계',
    image: '/images/bellama-moon.webp',
    eyebrow: 'STEP INTO ANOTHER WORLD',
    headline: '상상 너머,',
    highlight: '새로운 세계.',
    description: '현실을 잠시 벗어나 다채로운 세계와\n새로운 주인공을 만나보세요.',
    caption: '짧은 장면에서 시작되는 큰 세계',
  },
  {
    id: 'classic',
    name: '고전 시네마',
    mood: '시간을 품은 우아함',
    image: '/images/bellama-midnight.webp',
    eyebrow: 'TIMELESS STORIES, SHORT MOMENTS',
    headline: '시간이 지나도,',
    highlight: '남는 장면.',
    description: '섬세한 감정과 오래 기억될 서사를\n짧고 밀도 높은 이야기로 만나보세요.',
    caption: '시대를 넘어 이어지는 B엘라마의 이야기',
  },
  {
    id: 'medieval',
    name: '중세 서사',
    mood: '성채와 장대한 전설',
    image: '/images/bellama-moon.webp',
    eyebrow: 'LEGENDS IN EVERY MOMENT',
    headline: '짧은 순간이,',
    highlight: '전설이 되다.',
    description: '운명과 선택이 교차하는 장대한 서사를\n손안의 짧은 드라마로 만나보세요.',
    caption: '한 장면에서 시작되는 새로운 전설',
  },
];

// 여백 로테이션: 한국 시각 0·4·8·12·16·20시마다 다음 테마로 바뀝니다(5개를 차례로 돌아가며).
export const ROTATE_HOURS = 4;
export const rotationSlot = (now = Date.now()) => Math.floor((now + 9 * 3600000) / (ROTATE_HOURS * 3600000));
export const rotationTheme = (now = Date.now()) => homeThemes[rotationSlot(now) % homeThemes.length];
const COPY = ['eyebrow', 'headline', 'highlight', 'description', 'caption'];

// live=true(시청자 화면): 로테이션이 켜져 있으면 지금 차례의 테마 사진(과 문구)을 돌려줍니다.
// live=false(관리자 편집): 저장된 값 그대로.
export const appearanceFromSettings = (settings, { live = false, now = Date.now() } = {}) => {
  const theme = homeThemes.find((item) => item.id === settings.home_theme) || homeThemes[0];
  const style = styleOf(settings.home_style);
  const base = {
    theme: theme.id,
    // 관리자가 올린 배경 사진이 있으면 테마 사진 대신 씁니다.
    image: style.image || theme.image,
    themeImage: theme.image,
    style,
    eyebrow: settings.home_eyebrow,
    headline: settings.home_headline,
    highlight: settings.home_highlight,
    description: settings.home_description,
    caption: settings.home_caption,
    copyright: settings.home_copyright,
  };
  if (!style.rotate) return base;
  const rotation = {
    hours: ROTATE_HOURS,
    copy: style.rotateCopy,
    themes: homeThemes.map((t) => ({ id: t.id, image: t.image, ...Object.fromEntries(COPY.map((k) => [k, t[k]])) })),
  };
  if (!live) return { ...base, rotation };
  const current = rotationTheme(now);
  return {
    ...base,
    theme: current.id,
    image: current.image,
    ...(style.rotateCopy ? Object.fromEntries(COPY.map((k) => [k, current[k]])) : {}),
    rotation,
  };
};
