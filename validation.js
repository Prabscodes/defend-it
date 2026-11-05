const fail = message => {throw new Error(message)};
function str(v,min=1,max=2000){return typeof v==='string'&&v.trim().length>=min&&v.length<=max;}
export function validateInput(i){
 if(!i||!['claims','question','feedback','retry'].includes(i.action))fail('Invalid action.');
 if(!str(i.presentation,20,20000))fail('Presentation must be 20–20,000 characters.');
 if(i.rubric!==undefined&&!str(i.rubric,0,4000))fail('Rubric must be at most 4,000 characters.');
 if(!['Classmates','Instructor','Capstone panel'].includes(i.audience)||!['Supportive','Balanced','Challenging'].includes(i.difficulty))fail('Choose a valid audience and difficulty.');
 if(i.action!=='claims'){
  validateOutput('claims',{claims:i.claims},i);
  if(i.previousQuestions!==undefined&&(!Array.isArray(i.previousQuestions)||i.previousQuestions.length>30||i.previousQuestions.some(q=>!str(q,1,2000))))fail('Invalid question history.');
 }
 if(['feedback','retry'].includes(i.action)){
  validateOutput('question',i.question,i);
  if(!str(i.answer,1,8000))fail('Answer must be 1–8,000 characters.');
 }
 if(i.action==='retry'&&!str(i.previousAnswer,1,8000))fail('Previous answer is required.');
 return i;
}
export function validateOutput(action,o,i){
 if(!o||typeof o!=='object'||Array.isArray(o))fail('Expected JSON object.');
 if(action==='claims'){
  if(!Array.isArray(o.claims)||o.claims.length<1||o.claims.length>6)fail('Expected 1–6 claims.');
  const ids=new Set();for(const c of o.claims){if(!c||!str(c.id,1,40)||ids.has(c.id)||!str(c.claim,1,1000)||!str(c.evidence,1,2000)||!i.presentation.includes(c.evidence))fail('Claims require unique ids and exact presentation evidence.');ids.add(c.id);}
 }else if(action==='question'){
  if(!str(o.question)||!str(o.rationale)||!i.claims.some(c=>c.id===o.claimId))fail('Question must reference a confirmed claim.');
  if(i.action==='question'&&i.previousQuestions?.some(q=>q.trim().toLowerCase()===o.question.trim().toLowerCase()))fail('Question repeats a previous question.');
 }else{
  for(const k of ['strength','quote','gap','nextStep','followUp'])if(!str(o[k]))fail('Feedback fields must be nonempty strings.');
  if(!i.answer.includes(o.quote))fail('Feedback requires an exact answer quote.');
  if(action==='retry'){
   const c=o.comparison;if(!c||!str(c.previousQuote)||!str(c.currentQuote)||!str(c.change)||!i.previousAnswer.includes(c.previousQuote)||!i.answer.includes(c.currentQuote))fail('Comparison requires exact quotes from both answers.');
  }
 }
 return o;
}
