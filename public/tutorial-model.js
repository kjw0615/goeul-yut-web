(function(root){
'use strict';
const steps=[
 ['nickname','입장 준비','연습용 닉네임을 입력하세요','실제 접속과 같은 첫 단계입니다. 연습 이름은 서버에 등록하지 않으며, 언제든 나가도 실제 게임에 영향이 없어요.'],
 ['create','방 찾기','나만의 방을 만들어 보세요','라운드·시작 엽전·승리조건을 확인하고 방 만들기를 누르세요. 이 연습은 15라운드·1,500엽전으로 진행합니다.'],
 ['join','방 찾기','방 카드를 보고 입장해요','함께할 방에서 인원과 규칙을 확인할 수 있어요. 실제로는 방을 만들면 바로 들어가지만, 여기서는 다른 방에 입장하는 방법도 함께 연습해요.'],
 ['waiting','시작 준비','캐릭터 선택 → AI 채우기 → 준비','캐릭터 하나를 선택하고 빈 세 자리를 AI로 채우세요. 홍단·청단 두 명씩 맞춘 뒤 준비를 누르면 방장이 시작할 수 있어요. 같은 캐릭터는 중복 선택할 수 없습니다.'],
 ['opening','시작 준비','팀과 순서를 확인하세요','네 명이 두 팀으로 나뉘고 홍단·청단이 번갈아 진행합니다. 돈과 땅은 개인 소유예요. 연습에서는 내 차례만 진행하며 제한 시간이 없어요.'],
 ['roll','윷과 이동','길게 누르고 놓아 윷을 던져요','윷 던지기 버튼을 누르는 동안 파워가 차고, 놓으면 던집니다. 100%에 도달하면 다시 줄어요. 연습에서는 파워와 관계없이 항상 모·걸이 나옵니다.'],
 ['extra','윷과 이동','윷·모가 나와 한 번 더!','매 턴 기본 두 번 던집니다. 윷·모가 하나라도 나오면 추가로 한 번 던질 수 있어요. 연속으로 나와도 추가 기회는 한 번뿐! 이번에는 개가 나옵니다.'],
 ['moveMo','윷과 이동','모부터 사용해 보세요','결과는 원하는 순서로 하나씩 사용합니다. 모를 누르면 다섯 칸 이동해 오른쪽 위 평양에 도착해요. 결과 버튼에는 도착 예상 위치가 표시됩니다.'],
 ['moveGeol','윷과 이동','다음은 걸을 선택하세요','아직 결과가 남았으므로 평양에서는 구매나 건설을 하지 않아요. 걸을 사용하면 갈림길에서 어느 방향으로 갈지 선택할 수 있습니다.'],
 ['routeNE','윷과 이동','빛나는 의주 칸을 누르세요','갈림길에서는 보드의 화살표와 땅을 직접 눌러 방향을 고릅니다. 의주를 거쳐 중앙으로 가는 지름길을 선택하세요. 정확히 멈춘 갈림길에서만 길을 바꿀 수 있어요.'],
 ['moveGae','윷과 이동','남은 개를 사용하세요','중앙 암행어사에 왔지만 아직 이동이 남아 있어 효과가 발동하지 않습니다. 통행료·이벤트·구매·건설은 모든 결과를 사용한 최종 도착지에서 처리해요.'],
 ['routeSE','윷과 이동','영종진 쪽 지름길로 이동해요','중앙에서 영종진을 누르세요. 개를 사용해 영종진을 지나 한성부에 도착합니다.'],
 ['buy','고을과 건물','한성부를 매입하세요','주인 없는 고을에 최종 도착하면 구매할 수 있어요. 한성부의 기본 매입가는 300엽전입니다. 보드 색이 내 팀 색으로 바뀌는지 확인하세요.'],
 ['build1','고을과 건물','첫 초가집을 지어 보세요','매입 직후에도 건설할 수 있어요. 초가집 건설비는 기본 땅값의 20%, 한성부에서는 60엽전입니다. 건설은 최종 도착한 내 땅·팀원 땅에서만 가능해요.'],
 ['buildingInfo','고을과 건물','세 건물은 각각 따로 지어요','초가집·기와집·대저택은 각각 땅값의 20%·40%·60%예요. 1·3단계만 지어도 됩니다. 빈 땅 통행료는 땅값의 20%, 건물이 있으면 보유 건물의 배수 2·3·5를 더해 적용해요.'],
 ['teamBuild','고을과 건물','팀원 땅에 기와집을 지어요','다음 연습 상황입니다. 한 바퀴를 돌아 기와집이 해금되었고, 팀원이 가진 안동에 도착했어요. 내 엽전으로 건설하지만 땅과 건물은 팀원 자산이 됩니다.'],
 ['passStart','고을과 건물','출발점을 지나가 보세요','새 연습 상황에서 제주에 있습니다. 개를 사용해 출발점을 지나 김제로 가세요. 지원금 100엽전을 받고, 두 번째 복귀로 대저택까지 지을 수 있게 됩니다.'],
 ['build3','고을과 건물','김제에 대저택만 지어 보세요','처음에는 1단계, 한 번 복귀하면 2단계, 두 번 복귀하면 3단계가 해금돼요. 김제에는 대저택만 먼저 지을 수 있습니다. 출발점에 최종 정지하면 팀 고을 하나를 골라 건설할 수도 있어요.'],
 ['bag','복주머니','복주머니 칸으로 이동하세요','다음 연습 위치는 안동입니다. 도를 사용하면 복주머니에 도착해 카드 한 장을 뽑습니다. 이번 카드는 항상 통행증입니다.'],
 ['cardInfo','복주머니','통행증을 받았습니다','통행증은 상대 고을 통행료를 한 번 면제합니다. 보유 카드는 한 사람당 한 장! 새 보유 카드를 뽑으면 둘 중 하나를 버려요. 즉시 발동하는 카드도 있으며, 사용·반납한 카드는 복주머니로 돌아갑니다.'],
 ['toll','통행료와 인수','상대 고을로 가 보세요','도를 사용해 상대 소유 강경에 도착하세요. 상대 고을에서는 통행료를 내야 하지만 보유 카드를 먼저 사용할 수 있어요.'],
 ['useCard','통행료와 인수','통행증을 사용하세요','통행증을 제시해 통행료를 면제받으세요. 사용하면 내 카드 표시가 사라지고 카드가 복주머니로 돌아갑니다.'],
 ['acquire','통행료와 인수','상대 고을을 인수해 보세요','통행료 처리 후에는 상대 고을을 인수할 수도 있어요. 땅과 실제 건물 원가 합계의 120%를 내면 건물을 유지한 채 소유권이 바뀌고, 이전 주인은 전액을 받습니다.'],
 ['festival','특수칸','장원급제로 가 보세요','다음 연습 위치는 송도입니다. 도를 사용해 장원급제에 도착하세요. 팀 고을 하나의 통행료를 두 배로 만들 수 있습니다.'],
 ['boost','특수칸','한성부를 직접 선택하세요','보드에서 한성부를 누르세요. 다음 말이 그 땅에 도착하거나 누구든 다른 땅을 두 배로 지정하면 효과가 끝납니다. 동시에 한 곳만 적용돼요.'],
 ['inspector','특수칸','중앙 암행어사로 이동해요','다음 연습 위치에서 도를 사용해 중앙에 도착하세요. 상대 고을의 건물을 모두 강제 매각할 수 있습니다.'],
 ['inspect','특수칸','상대의 평양을 선택하세요','빛나는 평양을 누르세요. 건물은 전부 사라지고 땅 소유권은 유지됩니다. 피해 소유주는 실제 건설비의 50%를 환급받아요.'],
 ['stable','특수칸','마굿간에 도착해요','광주에서 도를 사용하면 마굿간입니다. 다음 자기 차례에는 윷을 던지는 대신 원하는 칸으로 이동할 수 있어요.'],
 ['stableInfo','특수칸','다음 차례의 자유 이동','연습에서는 다른 주자의 차례를 생략합니다. 다음을 눌러 내 다음 차례로 넘어가세요. 마굿간 이동도 출발점을 지나는 경로라면 지원금과 건설 단계 혜택을 받습니다.'],
 ['travel','특수칸','보드에서 김제를 선택하세요','가고 싶은 땅을 직접 누릅니다. 이번에는 김제로 이동해 출발점 경유 혜택을 확인하세요.'],
 ['exile','특수칸','유배지에 도착해 보세요','다음 연습 위치는 진주입니다. 도를 사용해 유배지로 가세요. 기본 두 차례를 쉬지만 탈출 방법이 있습니다.'],
 ['exileInfo','특수칸','유배 탈출 방법을 알아둬요','자기 차례에 윷·모를 던지거나 속전 10엽전을 내면 탈출할 수 있어요. 임금의 사면령 카드도 사용할 수 있습니다. 다음을 눌러 탈출을 연습하세요.'],
 ['escape','특수칸','속전 10엽전으로 탈출하세요','탈출하면 그 차례의 윷 던지기를 진행할 수 있습니다. 연습에서는 속전 납부 후 다음 상황으로 넘어갑니다.'],
 ['gamble','특수칸','놀음판의 판돈을 정하세요','20~100엽전을 10엽전 단위로 걸 수 있어요. 윷 2배·모 3배·빽도 5배를 원금 포함 돌려받고 나머지는 잃습니다. 이번 연습 결과는 항상 윷입니다.'],
 ['gambleInfo','특수칸','놀음판 결과를 확인하세요','윷이 나와 판돈의 두 배를 돌려받았습니다. 상대가 동작그만 카드를 쓰면 반환 배당금의 절반을 가져갈 수 있어요.'],
 ['bandit','특수칸','산적출현 칸으로 이동하세요','다음 연습 위치는 의주입니다. 도를 사용해 산적에게 가세요. 보유 카드가 있으면 한 장을 반납하고, 없으면 현금·땅·건물을 합친 자산의 5%를 냅니다.'],
 ['banditInfo','특수칸','산적에게 자산의 5%를 냈어요','통행증을 이미 썼으므로 이번에는 엽전으로 납부했습니다. 어떤 일이 생겼는지 현재 엽전과 고을 상태를 확인하는 습관을 들이세요.'],
 ['debt','자산과 승리','부족한 돈은 전당포로 마련해요','새 연습 상황입니다. 납부할 돈보다 현금이 부족해졌어요. 전당포는 한 게임에 딱 한 번, 부족한 금액만 빌려줍니다. 이번에는 전당포를 이용하세요.'],
 ['sale','자산과 승리','내 고을을 매각해 납부하세요','다음 연습에서는 전당포를 이미 사용했고 현금이 없습니다. 김제를 선택해 매각하면 필요한 20엽전을 낼 수 있어요. 평소에는 매각할 수 없으며, 모든 자산과 마지막 전당포 기회로도 부족하면 파산합니다.'],
 ['backdo','자산과 승리','빽도와 낙을 확인하세요','새 연습 결과는 빽도·낙입니다. 낙은 그 결과로 이동하지 못한다는 뜻이고, 다른 결과는 사용할 수 있어요. 전주에서 빽도를 선택해 보세요.'],
 ['backroute','자산과 승리','갈림길에서 뒤로 갈 길도 골라요','역방향으로 연결된 길 중 강화 쪽을 선택하세요. 전진해서 갈림길에 온 뒤 빽도를 쓰면 역방향 길을 고를 수 있어요. 방향 선택 전에는 결과 선택으로 되돌아갈 수도 있습니다.'],
 ['victory','자산과 승리','방마다 승리조건을 확인하세요','직선라인 독점, 상대 팀 전원 파산, 상대 한 명 파산, 라운드 종료 시 팀 총자산 비교 중 방에서 켠 조건으로 승리합니다. 여러 조건을 켜면 먼저 달성한 조건이 적용돼요.'],
 ['finish','연습 완료','이제 고을을 다스릴 준비가 됐어요!','닉네임·방 입장·팀 준비·윷·이동·고을·건물·복주머니·특수칸·자산 관리를 모두 연습했습니다. 튜토리얼 나가기를 누르면 메인 화면으로 돌아갑니다. 실제 게임은 그곳에서 닉네임을 입력해 시작하세요.']
].map(([id,section,title,text])=>({id,section,title,text}));
class TutorialModel{
 constructor(){this.index=0;this.name='';this.character=0;this.selected=false;this.aiCount=0;this.ready=false;this.game=null;this.bet=20;}
 get step(){return steps[this.index];}
 get id(){return this.step.id;}
 initGame(){const config=[0,1,2,3].map(i=>({name:i===0?this.name:'연습 양반 '+(i+1),team:i%2,character:i,ai:i!==0}));config[0].character=this.character;const used=new Set([this.character]);for(let i=1;i<4;i++){config[i].character=Array.from({length:12},(_,j)=>j).find(c=>!used.has(c));used.add(config[i].character);}this.game=new root.Yut.Game(config,()=>0,{rounds:15,startingCash:1500,victories:['allBankrupt','line','assets']});this.game.toss=()=>this.queue.shift();this.queue=[{name:'모',value:5,bits:[false,false,false,false],used:false},{name:'걸',value:3,bits:[false,true,true,true],used:false},{name:'개',value:2,bits:[false,true,true,false],used:false}];}
 land(id,owner,buildings=[]){Object.assign(this.game.s.land[id],{owner,buildings:[...buildings],level:Math.max(0,...buildings),boost:false,mortgageTurns:0});}
 situation(pos,value){const g=this.game,s=g.s,p=g.p;p.pos=pos;p.trace=[];p.direction='SW1';p.lastMoveForward=true;p.departed=true;s.phase='moves';s.choice=null;s.notice=null;s.debt=null;s.arrived=false;s.cardUsed=false;s.startBuildTarget=null;s.noMove=false;s.rolls=[{name:value===-1?'빽도':value===2?'개':'도',value,used:false,bits:value===-1?[true,false,false,false]:value===2?[false,true,true,false]:[false,true,false,false]}];}
 advance(){this.index++;const g=this.game;if(!g)return;switch(this.id){
 case'teamBuild':this.situation('O2',1);g.s.rolls=[];g.s.phase='manage';g.s.arrived=true;g.p.laps=1;this.land('O2',2);break;
 case'passStart':this.situation('O19',2);this.land('O1',0);break;
 case'bag':this.situation('O2',1);{const i=g.s.deck.indexOf('shield');g.s.deck.splice(i,1);g.s.deck.unshift('shield');}break;
 case'toll':this.situation('O3',1);this.land('O4',1,[1]);break;
 case'festival':this.situation('O9',1);break;
 case'inspector':this.situation('NE2',1);this.land('O5',1,[1,2,3]);break;
 case'stable':this.situation('O7',1);break;
 case'travel':g.action('ack');g.begin();break;
 case'exile':this.situation('O17',1);break;
 case'escape':g.action('ack');g.begin();break;
 case'gamble':this.situation('SW1',1);g.s.rolls=[];g.arrive();this.queue=[{name:'윷',value:4,bits:[true,true,true,true],used:false}];break;
 case'bandit':g.action('ack');this.situation('NE1',1);break;
 case'debt':g.action('ack');g.p.cash=10;g.s.phase='manage';g.pay(200,null,'연습 납부');break;
 case'sale':g.p.cash=0;g.s.phase='manage';g.pay(20,null,'매각 연습 납부');break;
 case'backdo':this.situation('O15',-1);g.s.rolls.push({name:'낙',value:0,nak:true,used:true,bits:[]});break;
 case'finish':for(const id of root.Yut.LINES[0])this.land(id,0);g.check();break;
 }}
 perform(action,value,power=50){const id=this.id,g=this.game;let valid=false;
 if(id==='nickname'&&action==='nickname'){const name=String(value||'').trim();if(!name||name.length>16)throw Error('연습용 닉네임을 1~16자로 입력하세요.');this.name=name;valid=true;}
 else if(id==='create'&&action==='create')valid=true;
 else if(id==='join'&&action==='join')valid=true;
 else if(id==='waiting'){
  if(action==='character'&&Number.isInteger(value)&&value>=0&&value<12){this.character=value;this.selected=true;this.ready=false;return true;}
  if(action==='ai'&&this.aiCount<3){this.aiCount++;return true;}
  if(action==='ready'&&this.selected&&this.aiCount===3){this.ready=!this.ready;return true;}
  if(action==='start'&&this.ready&&this.selected&&this.aiCount===3){this.initGame();valid=true;}
 }
 else if(['opening','buildingInfo','gambleInfo','banditInfo','victory','stableInfo','exileInfo'].includes(id)&&action==='next')valid=true;
 else if(id==='cardInfo'&&action==='next')valid=g.action('ack');
 else if(id==='roll'&&action==='throw')valid=g.action('roll',undefined,power);
 else if(id==='extra'&&action==='throw')valid=g.action('extra',true,power);
 else if(['moveMo','moveGeol','moveGae','passStart','bag','toll','festival','inspector','stable','exile','bandit','backdo'].includes(id)&&action==='move'){
  const expected={moveMo:5,moveGeol:3,moveGae:2,passStart:2,backdo:-1}[id]??1;
  const r=g.s.rolls[value];if(r&&!r.used&&r.value===expected)valid=g.action('use',value);
 }
 else if(id==='routeNE'&&action==='land'&&value==='NE1')valid=g.action('route',value);
 else if(id==='routeSE'&&action==='land'&&value==='SE1')valid=g.action('route',value);
 else if(id==='buy'&&action==='buy')valid=g.action('buy');
 else if(['build1','teamBuild','build3'].includes(id)&&action==='build'&&value===({build1:1,teamBuild:2,build3:3}[id]))valid=g.action('build',value);
 else if(id==='useCard'&&action==='card')valid=g.action('choose','shield');
 else if(id==='acquire'&&action==='acquire')valid=g.action('acquire');
 else if(id==='boost'&&action==='land'&&value==='SE2')valid=g.action('choose',value);
 else if(id==='inspect'&&action==='land'&&value==='O5')valid=g.action('choose',value);
 else if(id==='travel'&&action==='land'&&value==='O1')valid=g.action('travel',value);
 else if(id==='escape'&&action==='escape')valid=g.action('exilePay');
 else if(id==='gamble'&&action==='gamble'&&Number.isInteger(value)&&value>=20&&value<=100&&value%10===0){this.bet=value;valid=g.action('choose',value);}
 else if(id==='debt'&&action==='pawn')valid=g.action('pawn');
 else if(id==='sale'&&action==='land'&&value==='O1')valid=g.action('sellBatch',['O1']);
 else if(id==='backroute'&&action==='land'&&value==='SW2')valid=g.action('route',value);
 if(valid){this.advance();return true;}return false;
 }
 target(){return {routeNE:'NE1',routeSE:'SE1',boost:'SE2',inspect:'O5',travel:'O1',sale:'O1',backroute:'SW2'}[this.id]||null;}
}
const api={TutorialModel,steps};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.YutTutorial=api;
})(typeof window!=='undefined'?window:globalThis);
