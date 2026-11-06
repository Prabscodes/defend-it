import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {coach,prompts,validateInput,isConfigured} from './coach.js';
export function createApp(env=process.env,fetcher=fetch){
 const buckets=new Map();
 return http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  const path=new URL(req.url,'http://localhost').pathname;
  if(req.method==='GET'&&path==='/studio'){res.writeHead(302,{Location:'/studio/'});return res.end();}
  const studioFiles={'/studio/':'index.html','/studio/app.mjs':'app.mjs','/studio/timeline.mjs':'timeline.mjs','/studio/style.css':'style.css','/studio/cues.json':'cues.json','/studio/evidence.json':'evidence.json'};
  if(req.method==='GET'&&studioFiles[path]){
   res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
   res.setHeader('Permissions-Policy','microphone=(self), camera=()');
   try{const data=await readFile(new URL('./public/studio/'+studioFiles[path],import.meta.url));res.writeHead(200,{'Content-Type':path.endsWith('.mjs')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.json')?'application/json':'text/html','Cache-Control':'no-cache'});return res.end(data);}catch{return json(404,{error:'Studio asset unavailable.'});}
  }
  if(req.method==='GET'&&path==='/api/status')return json(200,{configured:isConfigured(env),model:env.MODEL||null});
  if(req.method==='GET'&&path==='/api/prompts')return json(200,prompts);
  if(req.method==='POST'&&path==='/api/coach'){
   const origin=req.headers.origin;if(origin&&origin!==`http://${req.headers.host}`&&origin!==`https://${req.headers.host}`)return json(403,{error:'Cross-origin requests are not allowed.'});
   const now=Date.now(),ip=req.socket.remoteAddress;for(const [key,value]of buckets)if(now-value.start>60000)buckets.delete(key);
   const bucket=buckets.get(ip)||{start:now,count:0};buckets.set(ip,bucket);if(++bucket.count>20)return json(429,{error:'Please wait a minute before making more coaching requests.'});
   const chunks=[];let size=0;try{for await(const chunk of req){size+=chunk.length;if(size>100000)return json(413,{error:'Request is too large (100 KB maximum).'});chunks.push(chunk);}}catch{return json(400,{error:'Unable to read request.'});}
   let input;try{input=validateInput(JSON.parse(Buffer.concat(chunks,size).toString('utf8')));}catch(e){return json(400,{error:e instanceof SyntaxError?'Send valid JSON.':e.message});}
   try{return json(200,{result:await coach(input,env,fetcher)});}catch(e){return json(503,{error:e.message});}
  }
  const files={'/':'index.html','/app.js':'app.js','/export.js':'export.js','/styles.css':'styles.css'};
  if(req.method==='GET'&&files[path]){try{const data=await readFile(new URL('./public/'+files[path],import.meta.url));res.writeHead(200,{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html'});return res.end(data);}catch{}}
  json(404,{error:'Not found.'});
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url))createApp().listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Defend It listening on port '+(process.env.PORT||3000)));
