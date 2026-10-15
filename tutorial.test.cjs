const assert=require('node:assert/strict');
global.Yut=require('./public/engine.js');
const {TutorialScenario,lessons}=require('./public/tutorial-scenario.js');
function run(power){
 const t=new TutorialScenario(),notes=new Set();let guard=0;
 while(t.lesson){
  if(++guard>30)throw Error('핵심 연습 진행 초과');
  const task=t.lesson;assert.equal(t.game.p.id,0);assert.equal(t.game.s.round,task.turn);
  t.act(task.type,task.value,power);t.autoUntilPlayer();
  for(const effect of t.game.s.effects||[]){const note=t.observation(effect);if(note)notes.add(note.key);}
 }
 assert(t.complete);assert.equal(t.game.s.round,3);assert.equal(t.game.s.phase,'manage');
 assert.equal(t.game.s.land.O4.owner,0,'상대 고을 인수 완료');assert.deepEqual(t.game.s.land.O4.buildings,[1],'인수 시 건물 유지');
 assert.equal(t.game.s.land.SE2.owner,0);assert.deepEqual(t.game.s.land.SE2.buildings,[],'AI 암행어사의 건물 매각');assert.equal(t.game.s.land.SE2.boost,true,'팀원 장원급제 혜택');
 assert(t.game.s.players[1].cards.includes('shield'),'AI 복주머니 카드 보유');
 assert.deepEqual([...notes].sort(),['card','festival','inspector']);
 const aiTurns=new Set(t.trace.filter(row=>row[1]!==0).map(row=>row[0]+':'+row[1]));assert.equal(aiTurns.size,6,'AI는 두 차례씩만 진행');
 assert(t.trace.some(row=>row[1]===0&&row[2]==='build'&&row[3]===2));assert(t.trace.some(row=>row[1]===3&&row[2]==='route'&&row[3]==='NE1'));
 return {trace:t.trace,state:t.game.s};
}
const a=run(0),b=run(100);assert.deepEqual(JSON.parse(JSON.stringify(a,(k,v)=>['power','lastPower'].includes(k)?undefined:v)),JSON.parse(JSON.stringify(b,(k,v)=>['power','lastPower'].includes(k)?undefined:v)));assert.equal(lessons.length,19);assert(a.trace.length<60);
console.log('PASS 내 차례 3회·19개 조작·AI 총 6차례·복주머니/장원급제/암행어사 관찰·건설 해금·통행료/인수·동일 시나리오');
