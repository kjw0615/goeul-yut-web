const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
let target=null,blocked=false;
const queried=[];
const document={addEventListener(){},documentElement:{clientWidth:1280},querySelector(selector){queried.push(selector);if(selector.startsWith('#throw-reveal'))return blocked?{}:null;return selector==='#next-action'?target:null;}};
const context={window:{innerHeight:720},document,getComputedStyle:el=>({visibility:el.visible?'visible':'hidden'})};
vm.runInNewContext(fs.readFileSync('public/tutorial.js','utf8'),context);
const tutorial=context.window.TUTORIAL;
tutorial.guide={hidden:false,offsetWidth:310,offsetHeight:160,style:{setProperty(){}},dataset:{}};
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
