import { randomBytes, scryptSync } from 'node:crypto';
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
// 방송국(마이 방송국) demo data: two uploaders, each with their own station shelf.
export const secondPd = 'demo-pd-2';
export const pd2Dramas = new Set(['moon', 'promise', 'summer']);
export const seedChannels = [
  [
    'channel-bellama',
    'demo-pd',
    '스튜디오 B엘라마',
    'bellama-studio',
    '두 사람의 서사를 담은 BL 오리지널 드라마',
    'B엘라마 오리지널을 만드는 제작 스튜디오입니다. 현대 로맨스와 미스터리를 중심으로 새로운 BL 이야기를 공개합니다.',
    '/images/bellama-midnight.webp',
    '#e6a5c9',
    1,
    0,
    ['신작', '현대 로맨스', '미스터리'],
  ],
  [
    'channel-moonlight',
    secondPd,
    '달빛 스튜디오',
    'moonlight',
    '시간을 건너는 사랑 이야기',
    '사극 판타지와 청춘 BL을 전문으로 하는 스튜디오입니다. 달빛 아래 너, 천 년의 약속을 제작했습니다.',
    '/images/bellama-moon.webp',
    '#bda7f0',
    1,
    1,
    ['판타지', '청춘', '완결작'],
  ],
];
export const seedDramas = [
  ['midnight', '자정의 계약', '우리의 비밀은, 자정부터 시작된다.', '서로 다른 목적을 품고 같은 계약서에 서명한 변호사 도현과 재벌가 후계자 서준. 위험한 동행이 진심으로 바뀌는 밤.', '현대 로맨스', 'bellama-midnight', '#d994b8', '독점', 128400, 3900],
  ['spring', '너를 다시 만난 봄', '끝인 줄 알았던 첫사랑이 돌아왔다.', '봄의 작은 서점에서 재회한 지우와 태윤. 지나간 계절에 남겨둔 말을 다시 꺼낼 용기를 배운다.', '청춘', 'bellama-spring', '#e8b6b5', 'NEW', 86200, 2900],
  ['shadow', '그림자 사이', '의심할수록 가까워지는 두 사람.', '사건을 쫓는 형사 하준과 유일한 목격자 이안. 서로를 믿어야만 진실에 닿을 수 있다.', '미스터리', 'bellama-shadow', '#9f739a', '독점', 109800, 4900],
  ['moon', '달빛 아래 너', '다른 시간, 같은 마음.', '궁궐의 비밀을 풀기 위해 만난 기록관 연우와 왕세자 이현. 시대가 가른 두 사람의 약속이 달빛 아래 되살아난다.', '판타지', 'bellama-moon', '#bba0d4', 'HOT', 95700, 3900],
  ['office', '팀장님, 로그아웃!', '회사에서는 라이벌, 온라인에서는 단짝.', '완벽주의 팀장 민재와 신입 개발자 시온은 서로의 정체를 모른 채 게임 속에서 마음을 나눈다.', '현대 로맨스', 'bellama-office', '#e3a9bb', 'NEW', 42800, 2900],
  ['summer', '우리의 여름 페이지', '가장 빛나던 계절에 너를 만났다.', '바닷가 마을에서 한 달 살기를 시작한 작가 은우. 사진가 도겸과 함께 잊고 있던 마음을 찾아간다.', '청춘', 'bellama-summer', '#c9a8b8', '완결', 73100, 2900],
  ['signal', '마지막 시그널', '미래에서 온 목소리가 너를 불렀다.', '라디오 PD 유진에게 내일의 사건을 알리는 낯선 음성이 들린다. 그 목소리의 주인인 태오를 만난 순간 운명이 바뀐다.', '미스터리', 'bellama-shadow', '#a781ad', 'HOT', 64300, 3900],
  ['promise', '천 년의 약속', '몇 번의 생을 지나도 너를 찾을게.', '천 년을 살아온 기록관과 기억을 잃은 소설가. 매번 달라지는 생에서도 두 사람을 이어주는 단 하나의 약속.', '판타지', 'bellama-moon', '#c7a5d6', '완결', 51200, 3900],
];
export async function seed(db) {
  const now = new Date().toISOString();
  for (const [id, role, name] of [
    ['demo-admin', 'admin', 'B엘라마 관리자'],
    ['demo-pd', 'pd', '스튜디오 B엘라마'],
    [secondPd, 'pd', '달빛 스튜디오'],
    ['demo-viewer', 'viewer', 'B엘라마러'],
  ]) {
    await db.run(
      'INSERT INTO users (id,email,name,password,role,created_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',
      [
        id,
        `${id.replace('demo-', '')}@bellama.local`,
        name,
        hashPassword(randomBytes(32).toString('hex')),
        role,
        now,
      ],
    );
  }
  for (const [
    id,
    title,
    tagline,
    synopsis,
    genre,
    image,
    accent,
    badge,
    views,
    price,
  ] of seedDramas) {
    await db.run(
      'INSERT INTO dramas (id,owner_id,title,tagline,synopsis,genre,image,accent,badge,status,price,views,created_at,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',
      [
        id,
        pd2Dramas.has(id) ? secondPd : 'demo-pd',
        title,
        tagline,
        synopsis,
        genre,
        `/images/${image}.webp`,
        accent,
        badge,
        'published',
        price,
        views,
        now,
        now,
      ],
    );
    await db.run('UPDATE dramas SET bl_confirmed=1,rights_confirmed=1 WHERE id=?', [id]);
    for (let n = 1; n <= 12; n++)
      await db.run(
        'INSERT INTO episodes (id,drama_id,number,title,video,duration) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',
        [
          `${id}-${n}`,
          id,
          n,
          [
            '우연의 시작',
            '낯선 마음',
            '뜻밖의 재회',
            '숨겨진 이야기',
            '엇갈린 시선',
            '한 걸음 더',
            '위험한 선택',
            '진실의 조각',
            '서로의 시간',
            '마지막 비밀',
            '너에게 가는 길',
            '우리의 새로운 시작',
          ][n - 1],
          '/demo/preview.mp4',
          12,
        ],
      );
  }
  for (const [
    id,
    owner,
    name,
    slug,
    tagline,
    description,
    banner,
    accent,
    featured,
    order,
    categories,
  ] of seedChannels) {
    await db.run(
      "INSERT INTO channels (id,owner_id,name,slug,tagline,description,banner,logo,accent,status,featured,featured_order,created_at,banner_fit) VALUES (?,?,?,?,?,?,?,'',?,'active',?,?,?,'cover') ON CONFLICT(id) DO NOTHING",
      [id, owner, name, slug, tagline, description, banner, accent, featured, order, now],
    );
    await db.run('UPDATE channels SET logo=? WHERE id=? AND logo=?', [
      id === 'channel-bellama' ? '/icon.svg' : '/images/bellama-moon.webp', id, '',
    ]);
    await db.run('UPDATE dramas SET channel_id=? WHERE owner_id=? AND channel_id IS NULL', [
      id,
      owner,
    ]);
    let sort = 0;
    for (const category of categories)
      await db.run(
        'INSERT INTO channel_categories (id,channel_id,name,sort_order) VALUES (?,?,?,?) ON CONFLICT(channel_id,name) DO NOTHING',
        [`${id}-${sort}`, id, category, sort++],
      );
  }
}
