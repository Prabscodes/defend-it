export class Timeline {
 constructor(duration){this.duration=duration;this.reset()}
 reset(){this.elapsed=0;this.anchor=null}
 start(now,offset=0){this.elapsed=offset;this.anchor=now}
 time(now){return Math.min(this.duration,this.elapsed+(this.anchor===null?0:Math.max(0,now-this.anchor)/1000))}
 pause(now){this.elapsed=this.time(now);this.anchor=null}
 resume(now){if(this.anchor===null&&this.elapsed<this.duration)this.anchor=now}
}

export function recordingRange(cues,section){
 if(section===null)return {start:0,end:cues.at(-1).end};
 const cue=cues[section];if(!cue)throw new Error('Choose a valid section.');
 return {start:cue.start,end:cue.end};
}
export function assemblyPlan(cues,takes){
 return cues.map((cue,index)=>{
  const take=takes.get(index);
  if(!take?.complete||take.section!==index||!take.blob?.size)throw new Error(`Record section ${index+1} completely first.`);
  return {take,offset:cue.start,duration:cue.end-cue.start};
 });
}
