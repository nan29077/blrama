// B엘라마 BL 전문 규칙: AI 지시문·주인공 보정·스토리 스타터가 모두 BL 기준인지 확인합니다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { planPrompt, adaptPrompt, maleLeads, posterPrompt, shotImagePrompt, BL_VISUAL } from '../server/ai/prompts.mjs';

test('AI 기획·각색 지시문은 두 성인 남성 주인공의 BL을 요구해요', () => {
  const p = { title: '', logline: '두 사람이 다시 만난다', genre: '현대 로맨스', tone: '', episode_count: 3, episode_seconds: 60, style: '' };
  const plan = planPrompt(p);
  assert.match(plan.system, /BL 장르 전문/);
  assert.match(plan.system, /성인 남성 두 명/);
  assert.match(plan.system, /미성년자를 연애 대상으로 그리지 않습니다/);
  assert.match(plan.prompt, /첫 두 명은 BL 주인공 커플인 성인 남성/);
  assert.match(adaptPrompt({ project: p, source: '남녀가 만나는 이야기' }).prompt, /BL 관계로 각색/);
});

test('주인공 커플 보정: 첫 두 인물은 성인 남성으로 바뀌고 조연은 그대로예요', () => {
  const out = maleLeads([
    { name: 'A', look: '20대 여성, 긴 머리', look_en: 'Korean woman in her 20s' },
    { name: 'B', look: '30대, 정장', look_en: 'navy suit' },
    { name: 'C', look: '50대 여성, 어머니', look_en: 'Korean woman in her 50s' },
  ]);
  assert.match(out[0].look, /남성/);
  assert.doesNotMatch(out[0].look, /여성/);
  assert.match(out[0].look_en, /\bman\b/);
  assert.match(out[1].look, /^성인 남성/);
  assert.match(out[1].look_en, /^adult Korean man/);
  assert.equal(out[2].look, '50대 여성, 어머니');
});

test('이미지 지시문(컷·포스터)에 BL·성인 조건이 붙어요', () => {
  const project = { title: 't', genre: '현대 로맨스', logline: 'l', style: 'cinematic' };
  const cast = [{ id: '1', name: 'A', look: 'man' }, { id: '2', name: 'B', look: 'man' }];
  assert.ok(shotImagePrompt(project, { visual: 'two men at a cafe' }, cast, null).includes(BL_VISUAL));
  assert.ok(posterPrompt(project, cast).includes(BL_VISUAL));
});

test('스토리 스타터 18종은 모두 B엘라마 장르이고 여성 주인공·학원 배경이 없어요', () => {
  const src = readFileSync('src/studio/presets.ts', 'utf8');
  const genres = JSON.parse(readFileSync('server/genres.json', 'utf8')).genres;
  const list = [...src.matchAll(/genre: '([^']+)'/g)].map((m) => m[1]);
  assert.equal(list.length, 18);
  for (const g of list) assert.ok(genres.includes(g), g);
  assert.doesNotMatch(src, /여주|그녀|아내|남편|고등학생|전학/);
  assert.ok(!genres.includes('학원'));
});
