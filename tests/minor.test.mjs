// BL 전용 규칙: 미성년으로 보이는 표현 차단(이미지·영상 지시문, 인물 외형) 단위 검사
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minorTerm, minorLook } from '../server/ai/prompts.mjs';

test('minor expressions are caught in image prompts', () => {
  for (const t of ['교복 입은 고등학생', '여고생', '남고생', '중2', '고3 수험생', '17살 소년', '열일곱 살', 'a teenage boy', '16 years old', '17-year-old', 'fifteen-year-old', '15yo', 'boy of 15', 'high schooler', 'shota', 'underage'])
    assert.ok(minorTerm([t]), t);
});
test('adult descriptions and age gaps are not blocked', () => {
  for (const t of ['20대 후반 성인 남성', '28살 회사원', '30세', '1세대 아이돌', '10살 차이 연상', '5살 연하', '3살 고양이', 'minor scar on cheek', 'childhood friend', 'boyish charm', '소년미 있는 20대', '대학생', 'college student', '고1000원'])
    assert.equal(minorTerm([t]), null, t);
});
test('character looks are checked strictly (child words, 소년)', () => {
  assert.ok(minorLook({ look: '어린 소년' }));
  assert.ok(minorLook({ look_en: 'a young boy with a child face' }));
  assert.ok(minorLook({ outfit: '교복' }));
  assert.equal(minorLook({ look: '20대 후반 남성, 소년미 있는 얼굴', outfit: '네이비 코트' }), null);
});
