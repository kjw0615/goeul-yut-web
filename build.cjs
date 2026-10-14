require('./load-env.cjs');
const fs=require('node:fs'),path=require('node:path');process.chdir(__dirname);
const api=(process.env.GOEUL_API_BASE||(!process.env.VERCEL?'http://127.0.0.1:5174':'')).trim().replace(/\/$/,'');
if(!api)throw Error('화면 프로젝트의 GOEUL_API_BASE에 게임 API용 Vercel 주소를 입력하세요.');
const url=new URL(api);if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('게임 API의 공개 Origin만 입력하세요.');if(process.env.VERCEL&&url.protocol!=='https:')throw Error('배포에서는 HTTPS 게임 API 주소가 필요합니다.');
require('./validate.cjs');
fs.cpSync(path.join(__dirname,'public'),path.join(__dirname,'dist'),{recursive:true});
fs.writeFileSync('dist/config.js','// Public game API address. No private credentials.\nwindow.GOEUL_API_BASE='+JSON.stringify(url.origin)+';\n');
console.log('화면 배포 파일 준비 완료');
