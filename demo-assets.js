import {stat,readFile} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
const files={'/demo/':['index.html','text/html'],'/demo/demo.css':['demo.css','text/css'],'/demo/defend-it-demo.mp4':['defend-it-demo.mp4','video/mp4']};
export async function serveDemo(req,res,path){
 if(!['GET','HEAD'].includes(req.method))return false;
 if(path==='/demo'){res.writeHead(302,{Location:'/demo/'});res.end();return true;}
 if(!files[path])return false;
 const [name,type]=files[path],url=new URL('./public/demo/'+name,import.meta.url);
 try{
  const {size}=await stat(url);
  const headers={'Content-Type':type,'Content-Length':size,'Cache-Control':'no-cache'};
  if(type!=='video/mp4'){res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:await readFile(url));return true;}
  headers['Accept-Ranges']='bytes';let start=0,end=size-1,code=200;
  if(req.headers.range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return true;}
   if(!match[1])start=Math.max(0,size-Number(match[2]));
   else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return true;}
   code=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;headers['Content-Length']=end-start+1;
  }
  res.writeHead(code,headers);if(req.method==='HEAD')res.end();else{const stream=createReadStream(url,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);}return true;
 }catch{res.writeHead(404);res.end('Demo unavailable.');return true;}
}
