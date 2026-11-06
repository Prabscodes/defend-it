import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.js';
test('public studio loads modules and evidence without AI configuration and permits local media previews',async()=>{
 const server=createApp({});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 try{
  const redirect=await fetch(base+'/studio',{redirect:'manual'});assert.equal(redirect.headers.get('location'),'/studio/');
  const page=await fetch(base+'/studio/');assert.equal(page.status,200);assert.match(page.headers.get('content-security-policy'),/media-src 'self' blob:/);assert.match(page.headers.get('permissions-policy'),/microphone=\(self\)/);assert.match(await page.text(),/Record my voice/);
  for(const file of ['app.mjs','timeline.mjs']){const r=await fetch(base+'/studio/'+file);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'text/javascript');}
  assert.ok((await(await fetch(base+'/studio/evidence.json')).json()).question);
  assert.equal((await fetch(base+'/studio/unknown.js')).status,404);
 }finally{await new Promise(r=>server.close(r));}
});
