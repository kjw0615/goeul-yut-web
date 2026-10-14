(function(){
'use strict';
const files=['click','select','event','success','sad','step','throw','build','victory','defeat','goeul-breeze'];
let options={master:true,masterVolume:1,effects:true,music:true,effectVolume:.5,musicVolume:.22};
try{const saved=JSON.parse(localStorage.getItem('goeul-audio')||'null');if(saved)for(const key of Object.keys(options)){if(typeof options[key]==='boolean'&&typeof saved[key]==='boolean')options[key]=saved[key];else if(typeof options[key]==='number'&&Number.isFinite(saved[key]))options[key]=Math.max(0,Math.min(1,saved[key]));}}catch{}
const sound={options,context:null,masterGain:null,buffers:new Map(),loading:new Map(),lastPlayed:new Map(),musicSource:null,musicGain:null,lastState:null,roomId:null,unlocked:false,failed:false,
 async unlock(){
  try{
   const AudioEngine=window.AudioContext||window.webkitAudioContext;
   if(!AudioEngine){this.failed=true;return false;}
   if(!this.context){this.context=new AudioEngine();this.masterGain=this.context.createGain();this.masterGain.gain.value=options.master?options.masterVolume:0;this.masterGain.connect(this.context.destination);this.musicGain=this.context.createGain();this.musicGain.connect(this.masterGain);}
   if(this.context.state==='suspended')await this.context.resume();
   this.unlocked=this.context.state==='running';
   if(this.unlocked){this.startMusic();for(const name of files.filter(n=>n!=='goeul-breeze'))this.load(name).catch(()=>{});}
   return this.unlocked;
  }catch{this.failed=true;return false;}
 },
 async load(name){
  if(this.buffers.has(name))return this.buffers.get(name);
  if(this.loading.has(name))return this.loading.get(name);
  const task=(async()=>{const response=await fetch('assets/audio/'+name+'.wav');if(!response.ok)throw Error('Audio unavailable');const data=await response.arrayBuffer(),buffer=await this.context.decodeAudioData(data);this.buffers.set(name,buffer);return buffer;})();
  this.loading.set(name,task);
  try{return await task;}catch(error){this.loading.delete(name);this.failed=true;throw error;}
 },
 async play(name,level=1){
  if(!options.master||!options.effects||!this.unlocked||document.hidden)return;
  const now=performance.now();if(now-(this.lastPlayed.get(name)||-1000)<(name==='step'?110:90))return;this.lastPlayed.set(name,now);
  try{const buffer=await this.load(name);if(!options.master||!options.effects||document.hidden||this.context.state!=='running')return;
   const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;gain.gain.value=options.effectVolume*level;source.connect(gain);gain.connect(this.masterGain);source.onended=()=>{source.disconnect();gain.disconnect();};source.start();
   if(['victory','defeat','sad'].includes(name)){const time=this.context.currentTime;this.musicGain.gain.cancelScheduledValues(time);this.musicGain.gain.setTargetAtTime(options.musicVolume*.25,time,.05);this.musicGain.gain.setTargetAtTime(options.musicVolume,time+buffer.duration,.2);}
  }catch{}
 },
 async startMusic(){
  if(!options.music||!this.unlocked||this.musicSource||this.startingMusic)return;
  this.startingMusic=true;
  try{const buffer=await this.load('goeul-breeze');if(!options.music||!this.unlocked||this.musicSource)return;
   const source=this.context.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(this.musicGain);this.musicGain.gain.value=options.musicVolume;this.musicSource=source;source.start();sync();
  }catch{}finally{this.startingMusic=false;}
 },
 save(){if(this.masterGain){this.masterGain.gain.cancelScheduledValues(this.context.currentTime);this.masterGain.gain.setTargetAtTime(options.master?options.masterVolume:0,this.context.currentTime,.04);}try{localStorage.setItem('goeul-audio',JSON.stringify(options));}catch{}
  if(this.musicGain){this.musicGain.gain.cancelScheduledValues(this.context.currentTime);this.musicGain.gain.setTargetAtTime(options.musicVolume,this.context.currentTime,.08);}
  if(!options.music&&this.musicSource){this.musicSource.stop();this.musicSource.disconnect();this.musicSource=null;}else this.startMusic();
 },
 observe(state,roomId){
  if(!state){this.lastState=null;this.roomId=null;return;}
  const previous=this.lastState;this.lastState=JSON.parse(JSON.stringify(state));
  if(this.roomId!==roomId||!previous){this.roomId=roomId;return;}
  const me=state.players.find(p=>p.uid===window.NET?.data?.user.id),oldMe=previous.players.find(p=>p.id===me?.id);
  if(state.phase==='ended'&&previous.phase!=='ended'){this.play(!me||state.winner?.team===null||state.winner?.team===me?.team?'victory':'defeat');return;}
  if(me&&!oldMe?.out&&me.out){this.play('defeat');return;}
  let built=false,bought=false,removed=false;
  for(const [id,land] of Object.entries(state.land)){const old=previous.land[id];if(!old)continue;if(land.buildings.length>old.buildings.length)built=true;if(land.buildings.length<old.buildings.length)removed=true;if(land.owner!==null&&old.owner!==land.owner)bought=true;}
  if(built)this.play('build',.75);else if(bought)this.play('success',.8);else if(removed)this.play('sad',.65);
  if(me&&oldMe&&(me.exile>oldMe.exile||state.phase==='debt'&&previous.phase!=='debt'))this.play('sad',.7);
  else if(state.notice?.title!==previous.notice?.title&&state.notice){const positive=['관청 포상','상인방의 투자','장원급제'];const negative=['모함에 휘말리다','가혹한 가렴주구','탐관오리의 수탈','보릿고개','산적출현','유배지'];this.play(positive.includes(state.notice.title)?'success':negative.includes(state.notice.title)?'sad':'event',.65);}
  else if(state.phase==='choice'&&previous.phase!=='choice')this.play('event',.6);else if(me&&oldMe&&!built&&!bought&&!removed&&me.cash>oldMe.cash)this.play('success',.55);
  if(state.turnCount!==previous.turnCount&&state.players[state.order[state.turn]]?.uid===window.NET?.data?.user.id)this.play('select',.8);
 }
};window.SOUND=sound;
document.addEventListener('pointerdown',()=>sound.unlock(),{capture:true});
document.addEventListener('keydown',e=>{if(['Enter',' ','Tab'].includes(e.key))sound.unlock();},{capture:true});
document.addEventListener('click',e=>{const button=e.target.closest('button');if(button&&!button.disabled&&!button.hasAttribute('data-charge')&&button.id!=='sound-test')sound.play('click',.45);},{capture:true});
document.addEventListener('visibilitychange',()=>{if(!sound.context)return;if(document.hidden)sound.context.suspend().catch(()=>{});else if(sound.unlocked)sound.context.resume().catch(()=>{});});
const dialog=document.querySelector('#sound-dialog');
function sync(){for(const key of ['master','effects','music'])document.querySelector('#audio-'+key).checked=options[key];for(const [id,key] of [['master-volume','masterVolume'],['effects-volume','effectVolume'],['music-volume','musicVolume']]){document.querySelector('#audio-'+id).value=Math.round(options[key]*100);document.querySelector('#audio-'+id+'-value').textContent=Math.round(options[key]*100)+'%';}document.querySelector('#audio-status').textContent=!options.master?'전체 소리가 음소거되어 있습니다.':sound.failed?'일부 소리를 불러오지 못했습니다. 연결 상태를 확인해주세요.':(sound.musicSource&&options.music?'배경음악 재생 중. 설정은 이 기기에 저장됩니다.':options.music?'첫 화면 조작 후 소리가 재생됩니다. 설정은 이 기기에 저장됩니다.':'배경음악이 꺼져 있습니다. 설정은 이 기기에 저장됩니다.');}
document.querySelector('#sound-btn').onclick=()=>{sync();dialog.showModal();};
document.querySelector('#sound-close').onclick=()=>dialog.close();
for(const key of ['master','effects','music'])document.querySelector('#audio-'+key).onchange=e=>{options[key]=e.target.checked;sound.save();sync();};
for(const [id,key] of [['master-volume','masterVolume'],['effects-volume','effectVolume'],['music-volume','musicVolume']])document.querySelector('#audio-'+id).oninput=e=>{options[key]=Number(e.target.value)/100;sound.save();sync();};
document.querySelector('#sound-test').onclick=async()=>{await sound.unlock();sound.play('success',.7);};
})();
