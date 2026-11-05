import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildPrepSheet} from '../public/export.js';
const question={question:'Why does this follow?',rationale:'Evidence quality'};
const feedback={quote:'sample',strength:'Specific',gap:'Small sample',nextStep:'Expand it',followUp:'How?'};
const base={presentation:'A presentation',rubric:'Evidence',audience:'Classmates',difficulty:'Balanced',claims:[],rounds:[{question,attempts:[]}],answer:'My unsubmitted answer'};
test('exports unanswered and failed-feedback drafts under current question',()=>{const text=buildPrepSheet(base);assert.match(text,/### Unsubmitted draft/);assert.match(text,/My unsubmitted answer/);});
test('exports revision draft alongside completed answer without duplicating completed answer',()=>{const completed={answer:'Original sample answer',feedback};const text=buildPrepSheet({...base,rounds:[{question,attempts:[completed]}],answer:'Revised draft',revising:true});assert.match(text,/Revised draft/);assert.match(text,/Original sample answer/);const same=buildPrepSheet({...base,rounds:[{question,attempts:[completed]}],answer:completed.answer});assert.doesNotMatch(same,/Unsubmitted draft/);assert.equal(same.split(completed.answer).length-1,1);});
