const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
let target=null,blocked=false;
const queried=[];
const document={addEventListener(){},documentElement:{clientWidth:1280},querySelector(selector){queried.push(selector);if(selector.startsWith('#throw-reveal'))return blocked?{}:null;return selector==='#next-action'?target:null;}};
const net={background:false,fastSync:true};
const context={NET:net,window:{innerHeight:720},document,getComputedStyle:el=>({visibility:el.visible?'visible':'hidden'})};
vm.runInNewContext(fs.readFileSync('public/tutorial.js','utf8'),context);
const tutorial=context.window.TUTORIAL;
tutorial.guide={hidden:false,offsetWidth:310,offsetHeight:160,style:{setProperty(){}},dataset:{}};
const originalSelector=tutorial.selector;
tutorial.selector=()=>'#next-action';
function button(){const classes=new Set();return {isConnected:true,visible:true,disabled:false,classes,attributes:{},classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)},setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];},getClientRects(){return this.visible?[{}]:[];},getBoundingClientRect(){return {left:900,right:1100,top:400,bottom:460};},matches(){return this.disabled;},closest(){return null;},scrollIntoView(){this.scrolled=true;}};}
// A missing next button must never attach the guide to an unrelated player card.
tutorial.position();assert.equal(tutorial.guide.hidden,true);assert.equal(tutorial.target,null);assert(!queried.some(s=>s.includes('.player')));
target=button();target.disabled=true;tutorial.position();assert.equal(tutorial.guide.hidden,true);assert(!target.classes.has('tutorial-highlight'));
target.disabled=false;tutorial.position();assert.equal(tutorial.guide.hidden,false);assert.equal(tutorial.target,target);assert(target.classes.has('tutorial-highlight'));
const previous=target;previous.isConnected=false;target=null;tutorial.position();assert.equal(tutorial.guide.hidden,true);assert(!previous.classes.has('tutorial-highlight'));assert.equal(previous.attributes['aria-describedby'],undefined);
// The same selector may be recreated by the renderer without another paint call.
target=button();tutorial.position();assert.equal(tutorial.target,target);assert.equal(tutorial.guide.hidden,false);
blocked=true;tutorial.position();assert.equal(tutorial.guide.hidden,true);assert.equal(tutorial.target,null);
blocked=false;target.visible=false;tutorial.position();assert.equal(tutorial.guide.hidden,true);
console.log('PASS 다음 버튼 생성·활성화까지 안내 숨김·캐릭터 카드 대체 부착 없음·화면 재생성 후 대상 재연결');
// Tutorial focus changes pause animations without enabling network catch-up mode.
const animations=[{playState:'running',pause(){this.paused=true;},play(){this.resumed=true;}}];
document.getAnimations=()=>animations;tutorial.pausedAnimations=new Set();
tutorial.visibilityChanged(true);assert.equal(net.fastSync,false);assert(animations[0].paused);
tutorial.visibilityChanged(false);assert.equal(net.background,false);assert.equal(net.fastSync,false);assert(animations[0].resumed);
// A tutorial focus event must not clear animation generations or force-finish them.
const appSource=fs.readFileSync('public/app.js','utf8');
const visibilityContext={window:{TUTORIAL:tutorial},TUTORIAL:tutorial,NET:net};tutorial.active=true;
vm.createContext(visibilityContext);vm.runInContext(appSource.slice(appSource.indexOf('function synchronizeVisibility('),appSource.indexOf("document.addEventListener('visibilitychange'")),visibilityContext);
net.fastSync=true;visibilityContext.synchronizeVisibility(true);visibilityContext.synchronizeVisibility(false);assert.equal(net.fastSync,false);
let tutorialExitOpened=0;tutorial.exitDialog={showModal(){tutorialExitOpened++;}};
tutorial.askExit();assert.equal(tutorialExitOpened,1);assert(!queried.includes('#leave-description'));
tutorial.scenario={complete:true};tutorial.selector=originalSelector;assert.equal(tutorial.selector(),'.tutorial-completion-anchor');tutorial.scenario=null;
console.log('PASS 튜토리얼 복귀 후 연출 생략 상태 해제·종료 전용 대화상자·완료 설명은 이모티콘과 분리');
// Pause only for a meaningful AI event, and let the user finish reading it.
(async()=>{
 const t=context.window.TUTORIAL;t.selector=originalSelector;
 t.active=true;t.running=false;t.stage='game';t.startAt=0;t.serial=1;t.aiIntro=false;t.seenObservations=new Set();
 t.pendingObservation={key:'card',title:'AI의 복주머니',text:'보유 카드 설명',selector:'[data-node="O3"]'};
 let actions=0,painted=0;
 const game={p:{id:1},s:{phase:'manage',effectSeq:0,motionSeq:0}};
 t.scenario={game,aiAction:()=>['end'],act(){actions++;game.p={id:0};}};
 t.paint=()=>{painted++;};t.finishPresentation=async()=>{};t.makePresentation=()=>{};t.sync=async()=>{};t.wait=async()=>{};
 const pending=t.settled();await new Promise(setImmediate);
 assert.equal(t.aiIntro,true);assert.equal(actions,0);assert.equal(t.selector(),'[data-node="O3"]');
 t.paint();await Promise.resolve();assert.equal(actions,0);assert.equal(t.aiIntro,true);
 t.continueAI();await pending;assert.equal(actions,1);assert.equal(t.aiIntro,false);assert.equal(t.aiNote,null);assert(painted>0);
 game.p={id:1};t.pendingObservation={key:'card'};await t.settled();assert.equal(actions,2);assert.equal(t.resumeAI,null);
 console.log('PASS AI 사건 설명은 계속 보기까지 유지·사건 없는 차례는 정지 없음·같은 설명 반복 없음');
})().catch(error=>{console.error(error);process.exitCode=1;});
