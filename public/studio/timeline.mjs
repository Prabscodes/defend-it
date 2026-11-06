export class Timeline {
 constructor(duration){this.duration=duration;this.reset()}
 reset(){this.elapsed=0;this.anchor=null}
 start(now){this.elapsed=0;this.anchor=now}
 time(now){return Math.min(this.duration,this.elapsed+(this.anchor===null?0:Math.max(0,now-this.anchor)/1000))}
 pause(now){this.elapsed=this.time(now);this.anchor=null}
 resume(now){if(this.anchor===null&&this.elapsed<this.duration)this.anchor=now}
}
