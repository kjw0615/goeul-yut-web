(function(root){
'use strict';
const lessons=[];
function add(turn,type,value,title,text){lessons.push({turn,type,value,title,text});}
const roll=(t,text)=>add(t,'roll',undefined,'윷을 던져 보세요',text||'윷 던지기 버튼을 누르고 있다가 놓으세요. 힘 게이지가 움직이고 윷이 날아가요.');
const extra=t=>add(t,'extra',true,'한 번 더 던질 수 있어요','윷·모가 나오면 추가 기회가 한 번 생깁니다. 추가 던지기 버튼을 사용하세요.');
const use=(t,i,title,text)=>add(t,'use',i,title,text);
const route=(t,id,title)=>add(t,'route',id,title,'보드의 화살표나 빛나는 다음 칸을 직접 누르세요. 다른 땅을 누르면 정보도 살펴볼 수 있습니다.');
const end=t=>add(t,'end',undefined,'다음 양반에게 차례를 넘겨요','차례 마치기를 누르면 다른 양반들이 윷을 던지고 이동하며 고을을 경영해요.');
roll(1,'윷 던지기를 누르고 있다가 놓아보세요. 나온 결과를 원하는 순서로 사용할 수 있어요.');extra(1);use(1,0,'모로 평양에 멈춰보세요','결과를 합치지 않고 하나씩 사용해요. 갈림길에 정확히 멈추면 다음 결과로 지름길을 고를 수 있어요.');use(1,1,'걸을 골라 지름길로 가요','중간 도착지에서는 구매나 이벤트가 발생하지 않아요. 마지막으로 멈춘 곳에서만 처리해요.');route(1,'NE1','의주 방향 지름길을 선택하세요');use(1,2,'남은 개를 사용하세요','중앙을 지나도 이동이 남아 있으면 암행어사는 발동하지 않아요.');route(1,'SE1','영종진 방향으로 가세요');add(1,'buy',undefined,'한성부를 매입하세요','최종 도착한 빈 고을을 살 수 있어요. 고을과 건물은 개인 소유이며 팀 자산에 합산돼요.');add(1,'build',1,'초가집을 지어보세요','건설비는 기본 땅값의 1단계 20%, 2단계 40%, 3단계 60%예요. 지금은 초가집부터 지을 수 있어요.');end(1);
roll(2,'낙이 나오면 그 결과는 사용할 수 없어요. 남은 결과로 계속 이동하면 돼요.');use(2,0,'출발점으로 돌아오세요','전진으로 지나거나 도착하면 100엽전을 받아요. 복귀 한 번이면 2단계, 두 번이면 3단계 건설이 열려요.');add(2,'choose','SE2','한성부를 선택하세요','출발점에 최종 도착하면 팀 고을 하나에 건설할 수 있어요. 평소에는 최종 도착한 본인·팀원 고을에서 건설해요.');add(2,'build',2,'기와집을 추가로 지으세요','건물 세 단계는 각각 보유하며 통행료도 합산돼요. 지을 수 있는 단계라면 중간 단계를 건너뛰어도 돼요.');end(2);
roll(3,'상대 고을에 도착하면 어떤 일이 생기는지 직접 확인해볼게요.');use(3,0,'첫 개를 사용하세요','원하는 순서로 결과를 골라 이동해요. 같은 칸에 말이 모여도 잡거나 업지는 않아요.');use(3,1,'남은 개로 강경에 도착하세요','상대 팀 고을에 최종 도착하면 통행료를 내요. 팀원 고을에서는 통행료를 내지 않아요.');add(3,'acquire',undefined,'강경을 인수해보세요','통행료가 주인에게 지급됐어요. 이어 땅·건물 원가의 120%를 내면 인수할 수 있어요. 건물은 유지되며 인수는 선택 사항이에요.');
const userRolls={1:[5,3,2],2:[1,0],3:[2,2]};
const aiRolls={1:{1:[1,2],2:[1,1],3:[2,3]},2:{1:[1,0],2:[4,4,0],3:[1,2]}};
class TutorialScenario{
 constructor(name='연습대감'){this.lessonIndex=0;this.queue=[];this.trace=[];this.game=new root.Yut.Game([0,1,2,3].map(i=>({name:i===0?name:['','청단 대감','홍단 마님','청단 마님'][i],uid:i===0?'tutorial-me':'tutorial-ai-'+i,team:i%2,character:i,ai:i!==0})),()=>0,{rounds:15,startingCash:1500,victories:['allBankrupt','line','assets']});this.game.toss=()=>{if(!this.queue.length)throw Error('정해진 연습 윷이 없습니다.');const value=this.queue.shift();if(value===0){this.game.s.nakSeq=(this.game.s.nakSeq||0)+1;return {name:'낙',value:0,nak:true,used:true,bits:[]};}const bits=value===-1?[true,false,false,false]:value===1?[false,true,false,false]:value===2?[false,true,true,false]:value===3?[false,true,true,true]:value===4?[true,true,true,true]:[false,false,false,false];return {...root.Yut.result(bits),used:false};};}
 get lesson(){return lessons[this.lessonIndex]||null;}
 get complete(){return this.lessonIndex>=lessons.length;}
 accepts(type,value){const task=this.lesson;if(!task||this.game.p.id!==0)return false;return task.type===type&&(task.value===undefined||String(task.value)===String(value));}
 act(type,value,power=50,automatic=false){const g=this.game;if(!automatic&&!this.accepts(type,value))throw Error(this.lesson?.title||'AI 양반의 진행을 지켜보세요.');if(['use','build','card'].includes(type))value=Number(value);if(type==='extra')value=value===true||value==='true';if(type==='choose'&&g.s.choice?.kind==='gamble')value=Number(value);
 if(type==='roll'){if(g.p.id===0)this.queue=[...userRolls[g.s.round]];else this.queue=[...aiRolls[g.s.round][g.p.id]];}
 if(type==='choose'&&g.s.choice?.kind==='gamble')this.queue=[4];
 if(type==='use'&&g.p.id===1&&g.s.round===1){const i=g.s.deck.indexOf('shield');if(i<0)throw Error('연습 통행증을 찾지 못했습니다.');g.s.deck.splice(i,1);g.s.deck.unshift('shield');}
 if(!g.action(type,value,power))throw Error('현재 단계에서 실행할 수 없습니다.');this.trace.push([g.s.round,g.p.id,type,value??null]);if(!automatic)this.lessonIndex++;return true;}
 aiAction(){const g=this.game,s=g.s,p=g.p;if(s.phase==='notice')return ['ack'];if(s.phase==='roll')return ['roll'];if(s.phase==='extra')return ['extra',true];if(s.phase==='moves')return ['use',g.remaining()[0].index];if(s.phase==='route')return ['route',g.p.id===3&&g.p.pos==='O5'?'NE1':s.choice.options.find(id=>/^O/.test(id))||s.choice.options[0]];if(s.phase==='travel')return ['travel','O7'];if(s.phase==='exile')return ['exilePay'];if(s.phase==='debt')return !p.pawnUsed?['pawn']:g.ai();if(s.phase==='choice'){const c=s.choice;if(c.kind==='gamble')return ['choose',20];if(c.kind==='toll')return ['choose',c.options.includes('shield')?'shield':'pay'];if(c.kind==='keep')return ['choose','old'];if(c.kind==='freeze')return ['choose','skip'];if(c.kind==='startBuild')return ['choose','skip'];if(c.kind==='boost'||c.kind==='inspect')return ['choose','SE2'];return ['choose',c.options[0]];}
 if(s.phase==='manage'){if(g.canBuy())return ['buy'];if(g.canBuild(1)&&g.s.land[p.pos]?.owner===p.id)return ['build',1];return ['end'];}return null;}
 observation(effect){const name=this.game.s.players[effect.pid]?.name||'AI 양반';if(effect.kind==='card')return {key:'card',title:name+'의 복주머니를 살펴봐요',text:'복주머니에는 즉시 효과와 보유 카드가 있어요. 이 통행증은 상대 고을에서 통행료를 한 번 면제해요. 보유는 한 장까지이며 福 공으로 표시되고 사용하면 사라져요.',selector:'[data-node="O3"]'};if(effect.kind==='festival'&&!effect.targetOnly)return {key:'festival',title:'팀원의 장원급제, 내 땅도 혜택을 받아요',text:'홍단 마님이 한성부의 통행료를 두 배로 높여요. 팀원 땅도 선택할 수 있고, 다음 말이 도착하거나 다른 고을을 지정하면 효과가 끝나요.',selector:'[data-node="O10"]'};if(effect.kind==='inspector'&&!effect.targetOnly)return {key:'inspector',title:'암행어사는 이렇게 견제해요',text:'청단 마님이 한성부 건물을 모두 강제 매각해요. 땅은 그대로 내 소유이고 건설비의 50%를 돌려받아요. 중앙에 최종 도착했을 때만 발동해요.',selector:'[data-node="C"]'};return null;}
 autoUntilPlayer(){let guard=0;while(this.game.s.phase!=='ended'&&(this.game.p.id!==0||this.game.s.phase==='notice')){if(++guard>100)throw Error('AI 연습 진행이 멈췄습니다.');const action=this.game.s.phase==='notice'?['ack']:this.aiAction();if(!action)throw Error('AI 연습 선택이 없습니다.');this.act(action[0],action[1],50,true);}}
}
const api={TutorialScenario,lessons,userRolls};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.YutTutorial=api;
})(typeof window!=='undefined'?window:globalThis);
