import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stat} from 'node:fs/promises';
import {createApp} from '../server.js';
test('published demo is viewable and supports video seeking and HEAD requests',async()=>{
 const server=createApp({});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 try{
  const page=await fetch(base+'/demo/');assert.equal(page.status,200);assert.match(await page.text(),/defend-it-demo.mp4/);
  const redirect=await fetch(base+'/demo',{redirect:'manual'});assert.equal(redirect.headers.get('location'),'/demo/');
  const size=(await stat(new URL('../public/demo/defend-it-demo.mp4',import.meta.url))).size;
  const head=await fetch(base+'/demo/defend-it-demo.mp4',{method:'HEAD'});assert.equal(head.status,200);assert.equal(Number(head.headers.get('content-length')),size);assert.equal(head.headers.get('content-type'),'video/mp4');
  const part=await fetch(base+'/demo/defend-it-demo.mp4',{headers:{Range:'bytes=0-99'}});assert.equal(part.status,206);assert.equal((await part.arrayBuffer()).byteLength,100);assert.equal(part.headers.get('content-range'),`bytes 0-99/${size}`);
  const suffix=await fetch(base+'/demo/defend-it-demo.mp4',{headers:{Range:'bytes=-20'}});assert.equal(suffix.status,206);assert.equal((await suffix.arrayBuffer()).byteLength,20);
  assert.equal((await fetch(base+'/demo/defend-it-demo.mp4',{headers:{Range:`bytes=${size}-`}})).status,416);
  assert.equal((await fetch(base+'/demo/defend-it-demo.mp4',{headers:{Range:'bytes=-'}})).status,416);
 }finally{await new Promise(r=>server.close(r));}
});
