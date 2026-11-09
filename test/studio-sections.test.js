import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Timeline,recordingRange,assemblyPlan} from '../public/studio/timeline.mjs';
const cues=JSON.parse(await readFile(new URL('../public/studio/cues.json',import.meta.url)));
test('section recording starts at its scene and pause preserves offset',()=>{
 const range=recordingRange(cues,5);assert.deepEqual(range,{start:57,end:71});
 const clock=new Timeline(110);clock.start(1000,range.start);assert.equal(clock.time(4000),60);
 clock.pause(4000);assert.equal(clock.time(9000),60);clock.resume(9000);assert.equal(clock.time(11000),62);
 assert.deepEqual(recordingRange(cues,null),{start:0,end:110});assert.throws(()=>recordingRange(cues,99));
});
test('assembly requires nine complete clips and follows cue order, including replacements',()=>{
 const takes=new Map();assert.throws(()=>assemblyPlan(cues,takes),/section 1/);
 cues.forEach((c,i)=>takes.set(i,{section:i,complete:true,blob:new Blob(['audio']),id:i}));
 takes.get(4).complete=false;assert.throws(()=>assemblyPlan(cues,takes),/section 5/);
 takes.set(4,{section:4,complete:true,blob:new Blob(['replacement']),id:'new'});
 const plan=assemblyPlan(cues,takes);assert.equal(plan[4].take.id,'new');
 assert.deepEqual(plan.map(p=>p.offset),cues.map(c=>c.start));
 assert.equal(plan.reduce((n,p)=>n+p.duration,0),110);
 takes.get(4).blob=new Blob([]);assert.throws(()=>assemblyPlan(cues,takes),/section 5/);
});
