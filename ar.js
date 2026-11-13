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
 const subject=selectField(form,'Subject',['Physics','Chemistry','Botany','Zoology'],q?.subject||'Botany'),chapter=field(form,'Chapter','text',q?.chapter||''),aEn=field(form,'Assertion (A) — English','textarea',q?.assertion?.en||''),aHi=field(form,'कथन (A) — हिन्दी','textarea',q?.assertion?.hi||''),rEn=field(form,'Reason (R) — English','textarea',q?.reason?.en||''),rHi=field(form,'कारण (R) — हिन्दी','textarea',q?.reason?.hi||'');
 const help=node('details');help.append(node('summary','Standard answer options'));AR_OPTIONS.forEach((o,i)=>help.append(node('p',(i+1)+'. '+text(...o))));form.append(help);
 const answer=selectField(form,'Correct option',['1','2','3','4'],String((q?.answer??0)+1)),expEn=field(form,'Explanation — English','textarea',q?.explanation[0]||''),expHi=field(form,'Explanation — हिन्दी','textarea',q?.explanation[1]||''),b=submit(form,'Save restricted draft'),result=node('p');result.setAttribute('role','status');form.append(result);
 form.onsubmit=async e=>{e.preventDefault();b.disabled=true;try{
  if(!admin||!cloud)throw Error('Admin sign-in required.');
  const item=buildAR({subject:subject.value,chapter:chapter.value,setName:chapter.value,aEn:aEn.value,aHi:aHi.value,rEn:rEn.value,rHi:rHi.value,answer:Number(answer.value)-1,expEn:expEn.value,expHi:expHi.value},q?.id||'new');
  const data=cloudQuestion(item);delete data.id;
  if(q)await cloud.f.setDoc(cloud.f.doc(cloud.db,'questions',q.id),data);else await cloud.f.addDoc(cloud.f.collection(cloud.db,'questions'),data);
  await cloud.f.setDoc(cloud.f.doc(cloud.db,'mindmaps',arChapterId(item.subject,item.chapter)),{kind:'arChapter',subject:item.subject,chapter:item.chapter,titleEn:item.chapter,titleHi:item.chapter,published:true,access:'free'});arEditing=null;await refreshCloud();
 }catch(err){result.textContent=err.code||err.message}finally{b.disabled=false}};
 c.append(form);if(q)c.append(button('Cancel A&R edit',()=>{arEditing=null;render()}));
 const items=(cloud.adminQuestions||[]).filter(q=>q.practiceType==='ar'&&q.category!=='PYQ');let list=panel('Assertion & Reason drafts');if(!items.length)list.append(node('p','No A&R drafts yet.'));
 for(let item of items){let row=node('div',undefined,'record');row.append(node('p',item.subject+' · '+item.chapter+' · '+item.setName),node('p',item.en),button('Edit A&R',()=>{arEditing=item;render();document.getElementById('ar-form').scrollIntoView({block:'start'})}),button('Admin preview',()=>{start([item],'Admin A&R preview')}));list.append(row)}
}
function arChapterId(subject,chapter){return 'ar-'+encodeURIComponent(subject+'|'+chapter.trim())}
let selectedARSubject=null;
function arView(){
 const c=panel(text('Assertion & Reason','कथन और कारण'));
 c.append(node('p',text('Chapterwise practice · Rewarded-ad integration pending.','अध्यायवार अभ्यास · Rewarded-ad integration बाकी है।')));
 const chapters=cloudMaps.filter(m=>m.kind==='arChapter'&&m.published&&m.access==='free');
 const subjects=[...new Set(chapters.map(m=>m.subject))];
 if(selectedARSubject&&!subjects.includes(selectedARSubject))selectedARSubject=null;
 if(!selectedARSubject){for(const subject of subjects)c.append(button(subject,()=>{selectedARSubject=subject;render()}));if(!subjects.length)c.append(node('p',text('No A&R chapters added yet.','अभी कोई A&R अध्याय नहीं जोड़ा गया है।')));return}
 c.append(button(text('← Subjects','← विषय'),()=>{selectedARSubject=null;render()}),node('h3',selectedARSubject));
 for(const chapter of chapters.filter(m=>m.subject===selectedARSubject)){let row=node('article',undefined,'card');row.append(node('h3',chapter.chapter),node('p',text('Rewarded ad will unlock this chapter for 24 hours after Android integration.','Android integration के बाद rewarded ad से यह अध्याय 24 घंटे खुलेगा।')));let b=button(text('Rewarded ad unavailable','Rewarded ad अभी उपलब्ध नहीं'),()=>{});b.disabled=true;row.append(b);c.append(row)}
}
