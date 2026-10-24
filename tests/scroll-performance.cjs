// Optional development check: requires Playwright and a running local site.
const {chromium}=require(process.env.DAYX_PLAYWRIGHT_MODULE || 'playwright');
const path=require('node:path');
const base=process.env.DAYX_TEST_URL || 'http://127.0.0.1:8765/';
const fs=require('fs');
const assert=require('node:assert/strict');

(async()=>{
const b=await chromium.launch();const c=await b.newContext({viewport:{width:1316,height:847},locale:'zh-CN',timezoneId:'Asia/Singapore'});const p=await c.newPage();
await p.route('**/*',async route=>{
 if(new URL(route.request().url()).pathname==='/'){
  let s=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
  s=s.replace('  baseVals() {','  baseVals() { window.__profile.renders++;');
  s=s.replace(/  measure\([^)]*\) \{/,m=>m+' window.__profile.measures++;');
  s=s.replace('  drawSky(ts) {','  drawSky(ts) { window.__profile.sky++;');
  s=s.replace('  componentDidMount() {','  componentDidMount() { window.__lab = this;');
  return route.fulfill({contentType:'text/html',body:s});
 }return route.continue();
});
await p.addInitScript(()=>{
 window.__profile={renders:0,measures:0,sky:0,rects:0};
 const orig=Element.prototype.getBoundingClientRect;
 Element.prototype.getBoundingClientRect=function(){window.__profile.rects++;return orig.call(this)};
});
await p.goto(base);await p.waitForTimeout(5500);
const cdp=await c.newCDPSession(p);await cdp.send('Performance.enable');
const start=await cdp.send('Performance.getMetrics');
const r=await p.evaluate(async()=>{
 window.__profile={renders:0,measures:0,sky:0,rects:0};let frames=[],last=performance.now(),begin=last;
 const count=now=>{frames.push(now-last);last=now;if(now-begin<4000)requestAnimationFrame(count)};requestAnimationFrame(count);
 for(let i=0;i<80;i++){window.scrollTo({top:i*10,behavior:'instant'});await new Promise(r=>setTimeout(r,50));}
 frames.sort((a,b)=>a-b);
 return {...window.__profile,frames:frames.length,p95:frames[Math.floor(frames.length*.95)],over33ms:frames.filter(x=>x>33.4).length};
});
const end=await cdp.send('Performance.getMetrics');const a=Object.fromEntries(start.metrics.map(x=>[x.name,x.value])),z=Object.fromEntries(end.metrics.map(x=>[x.name,x.value]));
for(const key of ['ScriptDuration','LayoutDuration','RecalcStyleDuration','TaskDuration','LayoutCount','RecalcStyleCount'])r[key]=+(z[key]-a[key]).toFixed(4);
console.log(JSON.stringify(r,null,2));
await b.close();
{
 assert.ok(r.renders<=20,'Scrolling must not repeatedly render the entire homepage');
 assert.ok(r.rects<=50,'Scrolling must reuse measured section positions');
 assert.ok(r.sky<=150,'Ambient sky should draw at most 30 times per second');
}
})().catch(e=>{console.error(e);process.exit(1)});
