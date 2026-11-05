import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prompts} from '../prompts.js';
function luminance(hex){const rgb=hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;}
function contrast(a,b){const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (values[0]+0.05)/(values[1]+0.05);}
test('normal text colors meet 4.5:1 against the interface backgrounds',async()=>{const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');const variables=Object.fromEntries([...css.matchAll(/--([\w-]+):#([a-f\d]{6})/gi)].map(m=>[m[1],m[2]]));for(const foreground of ['muted','orange'])for(const background of ['paper','sage','white'])assert.ok(contrast(variables[foreground],variables[background])>=4.5,`${foreground} on ${background} has insufficient contrast`);assert.match(css,/textarea::placeholder\{color:var\(--muted\)\}/);assert.match(css,/\.steps\{[^}]*color:var\(--muted\)/);});
test('prompts explicitly separate examiner from coach and prohibit grades',()=>{assert.match(prompts.question,/examiner/i);assert.match(prompts.feedback,/coach/i);assert.match(prompts.retry,/coach/i);assert.match(prompts.persona,/never.*numeric.*(grades|scores)/i);});
