import {Timeline,recordingRange,assemblyPlan} from './timeline.mjs';
const $=id=>document.getElementById(id),canvas=$('demo'),ctx=canvas.getContext('2d'),clock=new Timeline(110);
let cues,evidence,state='idle',recorder,mic,output,audioContext,analyser,countTimer,db,recordedSeconds=0,diagnostic=false,frames=0,attempt=0;
const fmt=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function text(s,x,y,size=24,color='#223b36',weight='400'){ctx.fillStyle=color;ctx.font=`${weight} ${size}px system-ui`;ctx.fillText(s,x,y)}
function wrap(s,x,y,width,size=24,color='#223b36',line=34){ctx.font=`${size}px system-ui`;let row='';for(const word of s.split(/\s+/)){let next=row?row+' '+word:word;if(ctx.measureText(next).width>width&&row){text(row,x,y,size,color);y+=line;row=word}else row=next}if(row)text(row,x,y,size,color);return y+line}
function box(x,y,w,h,fill='#fffef9',stroke='#dcded4'){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}}
function code(lines,x,y,size=25,color='#33465b'){ctx.fillStyle=color;ctx.font=`${size}px monospace`;for(const line of lines.split('\n')){ctx.fillText(line,x,y);y+=38}}
function button(label,x,y,w=210){box(x,y,w,46,'#223b36',null);text(label,x+18,y+30,19,'#fff','600')}
function cursor(t,points){let end=points.findIndex(p=>t<p[0]);if(end<0)end=points.length-1;let b=points[end],a=points[Math.max(0,end-1)],u=Math.min(1,Math.max(0,(t-a[0])/(b[0]-a[0]||1)));u=u*u*(3-2*u);let x=a[1]+(b[1]-a[1])*u,y=a[2]+(b[2]-a[2])*u;ctx.save();ctx.translate(x,y);ctx.fillStyle='#142033';ctx.strokeStyle='white';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,28);ctx.lineTo(8,21);ctx.lineTo(14,35);ctx.lineTo(21,31);ctx.lineTo(14,18);ctx.lineTo(25,18);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();for(const p of points){if(p[3]&&t>=p[0]&&t<p[0]+.7){ctx.beginPath();ctx.arc(p[1],p[2],14+(t-p[0])*32,0,Math.PI*2);ctx.strokeStyle=`rgba(172,65,36,${1-(t-p[0])/.7})`;ctx.lineWidth=4;ctx.stroke()}}}
function heading(kicker,title){text(kicker,54,124,15,'#ac4124','700');ctx.fillStyle='#223b36';ctx.font='42px Georgia';ctx.fillText(title,54,181)}
function label(s,x,y){text(s,x,y,16,'#ac4124','700')}
function draw(t){
 ctx.fillStyle='#f5f3eb';ctx.fillRect(0,0,1280,720);ctx.fillStyle='#fffef9';ctx.fillRect(0,0,1280,78);
 ctx.font='bold 45px Georgia';ctx.fillStyle='#223b36';ctx.fillText('d',34,54);ctx.fillStyle='#ac4124';ctx.fillText('.',60,54);text('Defend It',95,50,24,'#223b36','600');text('A little pressure. A stronger presentation.',760,48,19,'#58665d');
 ctx.fillStyle='#223b36';ctx.fillRect(0,659,1280,61);text('Recorded AI session • edited replay',30,686,19,'#fffef9','600');text('Reconstructed walkthrough · actual outputs · not live inference',30,710,15,'#c6d2c3');text('Historical run: dolphin3:8b',946,695,17,'#fffef9');
 const c=cues.find(c=>t>=c.start&&t<c.end)||cues.at(-1),local=t-c.start;
 switch(c.scene){
 case 'setup':
 heading('01 / SET THE SCENE','Good ideas deserve a strong defense.');
 box(54,218,795,390);label('PRESENTATION OR SPEAKING NOTES',80,255);text('Campus Cup: a reusable cup return pilot',80,301,27,'#223b36','600');
 wrap(evidence.presentation.split('\n\n')[1],80,348,733,25,'#223b36',36);
 box(880,218,346,390,'#e7ece0');label('THE PRACTICE LOOP',909,260);wrap('Ground it.\nSay it.\nStrengthen it.',909,315,280,33,'#223b36',55);button('Try a sample ↗',909,525,285);
 cursor(local,[[0,690,550],[3,1030,548,1],[7,550,393],[10,550,393]]);break;
 case 'claim':
 heading('02 / CHECK YOUR CLAIMS','Your claims, in focus.');box(54,220,1172,320);label('✓ SELECTED CLAIM · RECORDED EXTRACTION',85,266);wrap(evidence.claim.claim,85,319,1100,31,'#223b36',41);wrap('“'+evidence.claim.evidence+'”',85,405,1085,30,'#223b36',42);text('The excerpt identifies the claim. It does not prove it.',85,583,24,'#58665d');button('Confirm & rehearse →',897,563,329);cursor(local,[[0,550,390],[2,86,266,1],[6,1050,586,1]]);break;
 case 'question':
 heading('03 / DEFEND & REFINE','The question that makes you pause.');box(54,222,1172,300);label('ACTUAL RECORDED QUESTION',86,267);wrap(evidence.question,86,328,1080,34,'#223b36',49);text('Grounded in: the 80% waste-reduction prediction',85,583,23,'#58665d');cursor(local,[[0,1050,585],[4,685,340],[9,685,438]]);break;
 case 'answer':
 heading('FIRST ATTEMPT','Confidence needs evidence.');box(54,227,1172,300);label('YOUR ORIGINAL ANSWER · VERBATIM',85,273);wrap(evidence.answer,85,345,1080,35,'#223b36',51);button('Get feedback →',958,562,268);cursor(local,[[0,660,380],[3,830,394],[6,1080,584,1]]);break;
 case 'feedback':
 heading('RECORDED COACH FEEDBACK','A useful start. A gap to address.');box(54,220,557,380);box(638,220,588,380,'#e7ece0');label('STRENGTH',82,260);wrap(evidence.feedback.strength,82,305,495,25,'#223b36',35);label('GAP · EXACT OUTPUT',82,400);wrap(evidence.feedback.gap,82,441,495,21,'#223b36',29);label('NEXT STEP · EXACT OUTPUT',668,260);wrap(evidence.feedback.nextStep,668,309,524,27,'#223b36',39);button('Refine this answer ↻',668,524,321);cursor(local,[[0,1080,584],[3,300,445,1],[8,900,381],[11,825,548,1]]);break;
 case 'revision':
 heading('SAME QUESTION / SECOND ATTEMPT','Make the reasoning stronger.');box(54,220,1172,335);label('YOUR REVISED ANSWER · VERBATIM',85,264);wrap(evidence.revision,85,315,1090,30,'#223b36',43);button('Compare attempts →',909,576,317);cursor(local,[[0,825,548],[3,470,318,1],[8,620,445],[12,1070,599,1]]);break;
 case 'comparison':
 heading('ACTUAL COMPARISON','Stronger reasoning. Still a fallible coach.');box(54,220,1172,200,'#e7ece0');label('CHANGE · EXACT RECORDED OUTPUT',85,262);wrap(evidence.revisedFeedback.change,85,309,1085,30,'#223b36',43);box(54,441,1172,175);label('FOLLOW-UP · EXACT RECORDED OUTPUT',85,480);wrap(evidence.revisedFeedback.followUp,85,522,1085,26,'#223b36',36);text('Limitation: the revised answer already names those metrics.',85,600,20,'#ac4124');cursor(local,[[0,1070,599],[3,730,328,1],[7,690,537,1]]);break;
 case 'patterns':
 heading('UNDER THE HOOD / PROMPT DESIGN','Three patterns. One practice loop.');
 for(const [x,n,title,body] of [[54,'01','Persona','A rigorous, kind presentation defense coach for students.'],[452,'02','Few-shot examples','Examples connect quoted answers to specific gaps and next steps.'],[850,'03','Iterative refinement','Keep the same question. Compare evidence, reasoning, and limitations.']]){box(x,230,376,310,x===452?'#e7ece0':'#fffef9');label(n,x+25,271);ctx.fillStyle='#223b36';ctx.font='29px Georgia';ctx.fillText(title,x+25,321);wrap(body,x+25,370,320,26,'#223b36',37)}
 text('Design summary · current templates include later corrections.',55,588,22,'#58665d');text('Historical outputs above are unchanged.',55,620,22,'#58665d');cursor(local,[[0,1070,599],[3,205,325,1],[7,605,325,1],[11,1010,325,1]]);break;
 case 'close':
 heading('TAKE YOUR PRACTICE WITH YOU','Walk in with a better answer.');box(54,225,730,370);label('YOUR PREP SHEET',85,269);for(const [i,line] of ['The claim and its original excerpt','The question you practiced','Both answers and coach feedback','What to test before the real presentation'].entries()){text('✓',86,330+i*62,27,'#ac4124');text(line,125,330+i*62,26,'#223b36')}
 box(815,225,411,370,'#e7ece0');ctx.font='32px Georgia';ctx.fillStyle='#223b36';ctx.fillText('Progress is in',845,285);ctx.fillText('the revision.',845,325);wrap('A practice partner, not a grading authority.',845,381,345,26,'#223b36',38);button('Download prep sheet ↓',845,510,351);text('Reconstructed export step',845,583,18,'#58665d');cursor(local,[[0,1010,325],[4,1015,534,1],[8,1015,534]]);break;
 }
}
const selectedTakes=new Map();
let section=0,range={start:0,end:12},assembling=false,sources=[];
const titles=['Introduction','Sample claim','The question','First answer','Feedback','Try again','Comparison','Prompt techniques','Wrap-up'];
function position(){clock.reset();clock.elapsed=recordingRange(cues,section).start;}
function render(){
 const t=clock.time(performance.now());
 const display=section!==null&&!assembling?Math.min(t,cues[section].end-.001):t;
 const i=cues.findIndex(c=>display>=c.start&&display<c.end),c=cues[i<0?cues.length-1:i];
 draw(display);$('clock').textContent=`${fmt(t)} / 1:50`;$('cue').textContent=c.text;
 $('next').textContent=section!==null&&!assembling?'This section stops automatically. You can listen back or redo just this cue.':(i>=0?cues[i+1]?.text:null)||'Finish your sentence. The recording will save automatically.';
 $('cue-label').textContent=assembling?'BUILDING FINAL VIDEO — NO NEED TO SPEAK':state==='paused'?'PAUSED — RESUME WHEN READY':state==='idle'?'READY — CHOOSE A SECTION OR RECORD':'READ NOW';
 $('cue-time').textContent=`${Math.max(0,Math.ceil(c.end-t))} seconds for this line · cue ${Math.max(0,i)+1} of ${cues.length}`;
 $('cue-progress').value=Math.max(0,Math.min(1,(t-c.start)/(c.end-c.start)));
 if(analyser){const a=new Uint8Array(analyser.fftSize);analyser.getByteTimeDomainData(a);$('level').value=Math.min(1,Math.sqrt(a.reduce((s,v)=>s+((v-128)/128)**2,0)/a.length)*5)}
 if(state==='playing'&&t>=range.end)finish();requestAnimationFrame(render);
}
function status(s){$('status').textContent=s}
function controls(){
 const active=state!=='idle';
 for(const id of ['record','rehearse','diagnostic','section','reset'])$(id).disabled=active||!cues;
 $('pause').disabled=!['playing','paused'].includes(state);$('pause').textContent=state==='paused'?'Resume':'Pause';
 $('stop').disabled=!['playing','paused','countdown'].includes(state);
 $('record').textContent=section===null?'Record my voice + full demo':'Record my voice for this section';
 $('assemble').disabled=active||selectedTakes.size!==cues?.length;
 document.querySelectorAll('.use-take').forEach(b=>b.disabled=active);
 updateSections();
}
function updateSections(){
 if(!cues)return;
 const select=$('section');
 if(!select.options.length){for(let i=0;i<cues.length;i++)select.add(new Option('',String(i)));select.add(new Option('Whole demo — one continuous take','all'));select.value=String(section);}
 for(let i=0;i<cues.length;i++)select.options[i].textContent=`${selectedTakes.has(i)?'✓ ':''}${i+1}. ${titles[i]} (${cues[i].end-cues[i].start}s)`;
 $('section-summary').textContent=`${selectedTakes.size} of ${cues.length} sections ready. ${selectedTakes.size===cues.length?'You can build your final video now.':'Completed takes are selected automatically. Earlier takes remain below.'}`;
 document.querySelectorAll('.use-take').forEach(b=>{b.textContent=selectedTakes.get(Number(b.dataset.section))?.id===b.dataset.take?'Selected for final video':'Use this take';});
}
function cleanup(){
 for(const source of sources){try{source.stop()}catch{}}sources=[];
 mic?.getTracks().forEach(t=>t.stop());output?.getTracks().forEach(t=>t.stop());mic=null;output=null;
 audioContext?.close().catch(()=>{});audioContext=null;analyser=null;$('level').value=0;
}
function pause(){if(state!=='playing')return;clock.pause(performance.now());if(assembling)audioContext?.suspend();if(recorder?.state==='recording')recorder.pause();state='paused';status('Paused. Your recording and demo clock are both paused.');controls()}
async function resume(){if(state!=='paused')return;if(assembling)await audioContext.resume();if(recorder?.state==='paused')recorder.resume();clock.resume(performance.now());state='playing';status(assembling?'Building final video — microphone off.':recorder?'Recording. Read the bright cue.':'Rehearsing — microphone is off.');controls()}
function finish(){
 attempt++;clearTimeout(countTimer);$('countdown').textContent='';recordedSeconds=Math.min(range.end,clock.time(performance.now()))-range.start;clock.pause(performance.now());
 if(recorder&&recorder.state!=='inactive'){state='saving';recorder.stop();status('Saving your take…')}
 else{cleanup();recorder=null;state='idle';assembling=false;status('Session finished. Ready to record or rehearse again.')}controls();
}
async function save(blob,label,duration,meta={}){
 const take={...meta,id:crypto.randomUUID(),date:Date.now(),blob,label,duration};let stored=false;
 if(db)try{await transaction('readwrite',s=>s.put(take));stored=true}catch{}
 if(take.complete&&Number.isInteger(take.section))selectedTakes.set(take.section,take);
 addTake(take,!stored);return stored;
}
function addTake(take,temporary=false){
 const el=document.createElement('div');el.className='take';const name=document.createElement('strong');name.textContent=`${take.label} · ${Math.round(take.duration)}s · ${new Date(take.date).toLocaleTimeString()}`;
 const v=document.createElement(take.audioOnly?'audio':'video');v.controls=true;const url=URL.createObjectURL(take.blob);v.src=url;
 const link=document.createElement('a');link.href=url;link.download=`defend-it-${Number.isInteger(take.section)?'section-'+(take.section+1):take.label.includes('diagnostic')?'silent-diagnostic':'voice-demo'}-${take.date}.webm`;link.textContent=take.audioOnly?'Download voice clip':'Download video + audio';
 const note=document.createElement('small');note.textContent=(temporary?'Not persisted: download now before leaving.':'Saved in this browser. Download for safekeeping.')+(Number.isInteger(take.section)&&!take.complete?' Incomplete take — record the full section to include it in the final video.':'');
 el.append(name,v,link);
 if(take.complete&&Number.isInteger(take.section)){const use=document.createElement('button');use.className='use-take';use.dataset.take=take.id;use.dataset.section=take.section;use.onclick=async()=>{
  selectedTakes.set(take.section,take);updateSections();
  if(db)try{const all=await transaction('readonly',s=>s.getAll());for(const old of all.filter(t=>t.section===take.section)){old.selected=old.id===take.id;await transaction('readwrite',s=>s.put(old));}}catch{status('Take selected for this visit. Storage was unavailable.');}
 };el.append(use);}
 el.append(note);$('takes').prepend(el);updateSections();
}
function transaction(mode,fn){return new Promise((resolve,reject)=>{const tx=db.transaction('takes',mode);const req=fn(tx.objectStore('takes'));tx.oncomplete=()=>resolve(req.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
function createRecorder(audioOnly,meta){
 const mime=(audioOnly?['audio/webm;codecs=opus','audio/webm']:['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm']).find(m=>MediaRecorder.isTypeSupported(m));
 if(!mime)throw new Error('WebM recording is unavailable. Use desktop Chrome or Edge.');
 recorder=new MediaRecorder(output,{mimeType:mime,...(!audioOnly?{videoBitsPerSecond:3500000}:{})});const chunks=[];
 recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 recorder.onerror=()=>{status('Recording error. Saving captured media if available.');finish()};
 recorder.onstop=async()=>{
  const blob=new Blob(chunks,{type:mime});cleanup();recorder=null;
  const complete=recordedSeconds>=range.end-range.start-.25;
  try{
   if(blob.size){
    if(Number.isInteger(meta.section)&&complete&&db)try{const all=await transaction('readonly',s=>s.getAll());for(const old of all.filter(t=>t.section===meta.section&&t.selected)){old.selected=false;await transaction('readwrite',s=>s.put(old));}}catch{}
    const stored=await save(blob,meta.label+(complete?'':' (stopped early)'),recordedSeconds,{...meta,audioOnly,complete,selected:complete});
    status(stored?(Number.isInteger(meta.section)?complete?'Section saved and selected. Listen below, then choose the next section or redo this one.':'Partial take saved. Record this section to its end before building the video.':'Video saved. Preview and download it below.'):'Take ready. Download now: persistent storage was unavailable.');
   }else status('No media was captured. Try again.');
  }catch(e){status('Saving failed: '+e.message)}state='idle';const wasAssembly=assembling;assembling=false;if(wasAssembly)position();controls();
 };
}
async function start(withMic=false,silent=false){
 if(state!=='idle')return;const token=++attempt;diagnostic=silent;assembling=false;
 range=recordingRange(cues,section);if(silent)range={start:range.start,end:range.start+3};position();
 if(!withMic&&!silent){clock.start(performance.now(),range.start);state='playing';status('Rehearsing — microphone is off. The section stops automatically.');controls();return}
 state='countdown';controls();
 try{
  if(!window.MediaRecorder||!canvas.captureStream)throw new Error('Use desktop Chrome or Edge for recording.');
  if(withMic){const granted=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});if(token!==attempt){granted.getTracks().forEach(t=>t.stop());return}mic=granted;audioContext=new AudioContext();await audioContext.resume();if(token!==attempt){cleanup();return}analyser=audioContext.createAnalyser();audioContext.createMediaStreamSource(mic).connect(analyser);}
  const audioOnly=section!==null&&!silent;
  output=audioOnly?new MediaStream(mic.getAudioTracks()):canvas.captureStream(30);
  if(!audioOnly)for(const track of mic?.getAudioTracks()||[])output.addTrack(track);
  createRecorder(audioOnly,{label:silent?'Silent diagnostic':audioOnly?`Section ${section+1}: ${titles[section]}`:'Full voice take',...(audioOnly?{section}:{})});
  let n=3;function tick(){if(state!=='countdown')return;$('countdown').textContent=n>0?String(n):'';if(n--<=0){draw(range.start);recorder.start(1000);clock.start(performance.now(),range.start);state='playing';status(silent?'Silent diagnostic — no microphone.':'Recording. Read this cue; it will stop automatically.');controls();}else countTimer=setTimeout(tick,1000)}status('Get ready. Recording starts after the countdown.');tick();
 }catch(e){if(token!==attempt)return;cleanup();recorder=null;state='idle';$('countdown').textContent='';status('Could not start: '+e.message);controls()}
}
async function assemble(){
 if(state!=='idle')return;state='preparing';assembling=true;controls();status('Preparing your selected voice clips…');
 try{
  const plan=assemblyPlan(cues,selectedTakes);audioContext=new AudioContext();await audioContext.resume();
  const decoded=await Promise.all(plan.map(async item=>({...item,buffer:await audioContext.decodeAudioData(await item.take.blob.arrayBuffer())})));
  const dest=audioContext.createMediaStreamDestination();
  output=canvas.captureStream(30);output.addTrack(dest.stream.getAudioTracks()[0]);
  range=recordingRange(cues,null);createRecorder(false,{label:'Combined final video'});
  const startAt=audioContext.currentTime;
  for(const item of decoded){const source=audioContext.createBufferSource();source.buffer=item.buffer;source.connect(dest);source.start(startAt+item.offset,0,Math.min(item.duration,item.buffer.duration));sources.push(source);}
  draw(0);recorder.start(1000);clock.start(performance.now());state='playing';status('Building your 1:50 video. No need to speak. Keep this tab visible; switching away pauses the export.');controls();
 }catch(e){cleanup();recorder=null;state='idle';assembling=false;status('Could not build video: '+e.message+'. Your clips are still saved.');controls()}
}
$('section').onchange=()=>{section=$('section').value==='all'?null:Number($('section').value);position();status(section===null?'Ready for a continuous take.':`Section ${section+1} selected. Rehearse or record just this cue.`);controls()};
$('assemble').onclick=assemble;$('rehearse').onclick=()=>start();$('record').onclick=()=>start(true);$('diagnostic').onclick=()=>start(false,true);$('pause').onclick=()=>state==='paused'?resume():pause();$('stop').onclick=finish;$('reset').onclick=()=>{position();status('Back to the start of your selected section.');controls()};
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(state==='playing')pause();else if(state==='countdown')finish()}});
 document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['BUTTON','INPUT','TEXTAREA','VIDEO','AUDIO','SELECT'].includes(document.activeElement.tagName)&&['playing','paused'].includes(state)){e.preventDefault();state==='paused'?resume():pause()}if(e.code==='Escape'&&['playing','paused','countdown'].includes(state))finish()});
 window.addEventListener('beforeunload',e=>{if(state!=='idle'){e.preventDefault();e.returnValue=''}});
try{
 [cues,evidence]=await Promise.all(['cues.json','evidence.json'].map(async p=>{const r=await fetch(p);if(!r.ok)throw new Error(p+' unavailable');return r.json()}));
 if(!evidence.question||!evidence.revisedFeedback?.change)throw new Error('Expected preserved Defend It session');
 try{const request=indexedDB.open('defend-it-guided-recorder',1);request.onupgradeneeded=()=>request.result.createObjectStore('takes',{keyPath:'id'});request.onsuccess=async()=>{db=request.result;try{
  const takes=(await transaction('readonly',s=>s.getAll())).sort((a,b)=>a.date-b.date);
  for(const t of takes){if(t.complete&&Number.isInteger(t.section)&&t.selected!==false)selectedTakes.set(t.section,t);addTake(t)}controls();
 }catch{}};request.onerror=()=>status('Local storage unavailable. Download each take before leaving.');}catch{db=null}
 position();status('Ready. Choose a section, rehearse, then record. Your microphone is off until you click Record.');controls();render();
}catch(e){status('Could not load the studio: '+e.message);controls()}
