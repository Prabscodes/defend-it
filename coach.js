import {prompts} from './prompts.js';
import {validateInput,validateOutput} from './validation.js';
export {prompts,validateInput,validateOutput};
const fail=message=>{throw new Error(message)};
export function isConfigured(env){
 let local=false;try{local=['localhost','127.0.0.1','[::1]'].includes(new URL(env.API_BASE_URL||'https://api.openai.com/v1').hostname);}catch{}
 return Boolean(env.MODEL&&(env.API_KEY||local));
}
export async function coach(raw,env=process.env,fetcher=fetch){
 const i=validateInput(raw);
 if(!isConfigured(env))fail('Configure API_KEY and MODEL in the server environment, then restart. See README for setup.');
 const base=env.API_BASE_URL||'https://api.openai.com/v1';
 const messages=[{role:'system',content:prompts.persona+'\n'+prompts[i.action]+(i.action==='retry'?'\nFeedback schema: '+prompts.feedback:'')},{role:'user',content:JSON.stringify(i)}];
 const signal=AbortSignal.timeout(45000);
 for(let attempt=0;attempt<2;attempt++){
  let r;try{r=await fetcher(base.replace(/\/$/,'')+'/chat/completions',{method:'POST',signal,headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.API_KEY||'local'}`},body:JSON.stringify({model:env.MODEL,messages,response_format:{type:'json_object'},temperature:0.4,max_tokens:1800})});}catch{fail('Model connection timed out or failed. Check provider settings and try again.');}
  if(!r.ok)fail('Model provider rejected the request. Check credentials, model access and quota on the server.');
  let content='';try{const body=await r.json();content=body.choices?.[0]?.message?.content;return validateOutput(i.action,JSON.parse(content),i);}catch(error){
   if(attempt===1)fail('The model did not return a valid response after one repair. Please try again.');
   messages.push({role:'assistant',content:typeof content==='string'?content.slice(0,12000):'{}'},{role:'user',content:prompts.repair+' Validation issue: '+String(error.message).slice(0,400)});
  }
 }
}
