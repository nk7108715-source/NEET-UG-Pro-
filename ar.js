'use strict';
const AR_OPTIONS=[
 ['Both A and R are true, and R correctly explains A.','A और R दोनों सही हैं तथा R, A की सही व्याख्या है।'],
 ['Both A and R are true, but R does not correctly explain A.','A और R दोनों सही हैं, लेकिन R, A की सही व्याख्या नहीं है।'],
 ['A is true, but R is false.','A सही है, लेकिन R गलत है।'],
 ['A is false, but R is true.','A गलत है, लेकिन R सही है।']
];
let arEditing=null;
function buildAR(values,id){
 const item={id,type:'mcq',practiceType:'ar',category:'AssertionReason',subject:values.subject,chapter:values.chapter.trim(),paper:values.setName.trim(),setName:values.setName.trim(),assertion:{en:values.aEn.trim(),hi:values.aHi.trim()},reason:{en:values.rEn.trim(),hi:values.rHi.trim()},en:'Assertion (A): '+values.aEn.trim()+'\n\nReason (R): '+values.rEn.trim(),hi:'कथन (A): '+values.aHi.trim()+'\n\nकारण (R): '+values.rHi.trim(),options:AR_OPTIONS.map(o=>o.slice()),answer:values.answer,explanation:[values.expEn.trim(),values.expHi.trim()],published:false,access:'rewarded'};
 if(!valid(item)||![values.aEn,values.aHi,values.rEn,values.rHi,values.expEn,values.expHi].every(v=>v.trim()))throw Error('Complete all bilingual fields and select the correct option.');
 return item;
}
function arForm(){
 const q=arEditing,c=panel(q?'Edit Assertion & Reason':'Add Assertion & Reason'),form=node('form');
 c.id='ar-form';c.append(node('p','A&R questions are saved as restricted drafts. Admin preview works now; student access will open after Android rewarded ads are integrated.'));
 const subject=selectField(form,'Subject',['Physics','Chemistry','Botany','Zoology'],q?.subject||'Botany'),chapter=field(form,'Chapter','text',q?.chapter||''),setName=field(form,'Question set name','text',q?.setName||''),aEn=field(form,'Assertion (A) — English','textarea',q?.assertion?.en||''),aHi=field(form,'कथन (A) — हिन्दी','textarea',q?.assertion?.hi||''),rEn=field(form,'Reason (R) — English','textarea',q?.reason?.en||''),rHi=field(form,'कारण (R) — हिन्दी','textarea',q?.reason?.hi||'');
 const help=node('details');help.append(node('summary','Standard answer options'));AR_OPTIONS.forEach((o,i)=>help.append(node('p',(i+1)+'. '+text(...o))));form.append(help);
 const answer=selectField(form,'Correct option',['1','2','3','4'],String((q?.answer??0)+1)),expEn=field(form,'Explanation — English','textarea',q?.explanation[0]||''),expHi=field(form,'Explanation — हिन्दी','textarea',q?.explanation[1]||''),b=submit(form,'Save restricted draft'),result=node('p');result.setAttribute('role','status');form.append(result);
 form.onsubmit=async e=>{e.preventDefault();b.disabled=true;try{
  if(!admin||!cloud)throw Error('Admin sign-in required.');
  const item=buildAR({subject:subject.value,chapter:chapter.value,setName:setName.value,aEn:aEn.value,aHi:aHi.value,rEn:rEn.value,rHi:rHi.value,answer:Number(answer.value)-1,expEn:expEn.value,expHi:expHi.value},q?.id||'new');
  const data=cloudQuestion(item);delete data.id;
  if(q)await cloud.f.setDoc(cloud.f.doc(cloud.db,'questions',q.id),data);else await cloud.f.addDoc(cloud.f.collection(cloud.db,'questions'),data);
  arEditing=null;await refreshCloud();
 }catch(err){result.textContent=err.code||err.message}finally{b.disabled=false}};
 c.append(form);if(q)c.append(button('Cancel A&R edit',()=>{arEditing=null;render()}));
 const items=(cloud.adminQuestions||[]).filter(q=>q.practiceType==='ar');let list=panel('Assertion & Reason drafts');if(!items.length)list.append(node('p','No A&R drafts yet.'));
 for(let item of items){let row=node('div',undefined,'record');row.append(node('p',item.subject+' · '+item.chapter+' · '+item.setName),node('p',item.en),button('Edit A&R',()=>{arEditing=item;render();document.getElementById('ar-form').scrollIntoView({block:'start'})}),button('Admin preview',()=>{start([item],'Admin A&R preview')}));list.append(row)}
}
function arView(){let c=panel(text('Assertion & Reason','कथन और कारण'));c.append(node('p',text('Practice by chapter and question set.','अध्याय और प्रश्न सेट के अनुसार अभ्यास।')),node('p',text('Student access is not available yet. Android rewarded-ad integration is pending.','छात्र अभ्यास अभी उपलब्ध नहीं है। Android rewarded-ad integration बाकी है।')));let b=button(text('Rewarded ad unavailable','Rewarded ad अभी उपलब्ध नहीं'),()=>{});b.disabled=true;c.append(b,node('p',text('Planned: complete a rewarded ad to unlock that set for 24 hours.','योजना: rewarded ad पूरा होने पर उस सेट को 24 घंटे के लिए खोलें।'),'muted'));if(admin&&IS_ADMIN_PAGE)c.append(button('Prepare A&R questions',()=>{tab='Manage';render();document.getElementById('ar-form').scrollIntoView({block:'start'})}))}
