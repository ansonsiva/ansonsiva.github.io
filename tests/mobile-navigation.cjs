// Requires Playwright with Chromium and WebKit installed, plus a local preview server.
const {chromium,webkit,devices}=require(process.env.DAYX_PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const base=process.env.DAYX_TEST_URL || 'http://127.0.0.1:8765/';
(async()=>{
 const results=[];
 for(const [name,type] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await type.launch();
  try {
   for(const restore of [true,false]){
    const context=await browser.newContext({...devices['iPhone 13'],locale:'zh-CN',reducedMotion:'no-preference'});
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    if(restore)await page.addInitScript(()=>{
      // Model an embedded browser restoring the current viewport on fragment navigation.
      // The assertion below checks the visible destination, independent of URL-only changes.
      let previous=0;
      document.addEventListener('pointerdown',()=>{previous=scrollY},true);
      window.addEventListener('hashchange',()=>{
        const root=document.documentElement,old=root.style.scrollBehavior;
        root.style.scrollBehavior='auto';window.scrollTo(0,previous);root.style.scrollBehavior=old;
      });
    });
    await page.goto(base);await page.waitForTimeout(3000);
    for(const id of ['works','contact','about','writing','top']){
      await page.locator('nav a[href="#'+id+'"]').tap();await page.waitForTimeout(200);
      const state=await page.evaluate(id=>({y:scrollY,top:document.getElementById(id).getBoundingClientRect().top,nav:document.querySelector('.dx nav').getBoundingClientRect().bottom,hash:location.hash}),id);
      assert.equal(state.hash,'#'+id);
      assert.ok(id==='top'?state.y<2:state.top>=state.nav-1&&state.top<=state.nav+40,name+' '+(restore?'embedded':'normal')+' '+id+' destination: '+JSON.stringify(state));
      results.push(name+' '+(restore?'embedded':'normal')+' '+id);
    }
    // Selecting the same fragment again must work after manually scrolling elsewhere.
    await page.locator('nav a[href="#works"]').tap();await page.waitForTimeout(200);
    await page.evaluate(()=>window.scrollTo({top:300,behavior:'instant'}));
    await page.locator('nav a[href="#works"]').tap();await page.waitForTimeout(200);
    assert.ok(await page.locator('#works').evaluate(el=>el.getBoundingClientRect().top<160));
    results.push(name+' '+(restore?'embedded':'normal')+' repeated fragment');
    assert.deepEqual(errors,[]);await context.close();
   }
   const desktop=await browser.newPage({viewport:{width:1440,height:900},locale:'en-US'});
   await desktop.goto(base);await desktop.waitForTimeout(3000);
   await desktop.locator('nav a[href="#works"]').click();await desktop.waitForTimeout(1400);
   assert.ok(await desktop.locator('#works').evaluate(el=>{const y=el.getBoundingClientRect().top;return y>=60&&y<150}));
   results.push(name+' desktop navigation');await desktop.close();
  } finally {await browser.close();}
 }
 console.log(JSON.stringify({passed:results.length,checks:results},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
