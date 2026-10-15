const assert=require('node:assert/strict');global.Yut=require('./public/engine.js');const {TutorialModel,steps}=require('./public/tutorial-model.js');
function run(power){const t=new TutorialModel();const act=(a,v)=>{const id=t.id;assert(t.perform(a,v,power),'튜토리얼 진행 실패: '+id+' / '+a);};
act('nickname','연습대감');act('create');act('join');assert(!t.perform('start'));act('character',4);for(let i=0;i<3;i++)act('ai');act('ready');act('start');assert.equal(new Set(t.game.s.players.map(p=>p.character)).size,4);act('next');act('throw');assert.deepEqual(t.game.s.rolls.map(r=>r.name),['모','걸']);act('throw');assert.deepEqual(t.game.s.rolls.map(r=>r.name),['모','걸','개']);
const moves={moveMo:5,moveGeol:3,moveGae:2,passStart:2,bag:1,toll:1,festival:1,inspector:1,stable:1,exile:1,bandit:1,backdo:-1};
while(t.id!=='finish'){
 const id=t.id,g=t.game;
 if(id in moves){act('move',g.s.rolls.findIndex(r=>!r.used&&r.value===moves[id]));if(id==='moveMo')assert.equal(g.p.pos,'O5');if(id==='passStart'){assert.equal(g.p.pos,'O1');assert.equal(g.p.laps,2);}continue;}
 if(t.target()){const target=t.target();assert(!t.perform('land','invalid'));act('land',target);continue;}
 if(id==='buy')act('buy');else if(['build1','teamBuild','build3'].includes(id))act('build',{build1:1,teamBuild:2,build3:3}[id]);else if(id==='useCard'){act('card');assert.equal(g.p.cards.length,0);}else if(id==='acquire')act('acquire');else if(id==='escape')act('escape');else if(id==='gamble')act('gamble',40);else if(id==='debt'){act('pawn');assert(g.p.pawnUsed);}else act('next');
}
assert.equal(t.index,steps.length-1);assert.equal(t.game.s.winner.team,0);assert.equal(t.game.s.land.O5.buildings.length,0);return t.game.s.players[0].cash;}
assert.equal(run(0),run(100));assert.throws(()=>new TutorialModel().perform('nickname',''));console.log('PASS 튜토리얼 전체 시나리오·시작 조건·캐릭터 중복 방지·고정 윷·갈림길·건설·카드·모든 특수칸·부족금·승리');
