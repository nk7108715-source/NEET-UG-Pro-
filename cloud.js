'use strict';
// Firebase rules enforce authorization; this UID check also controls the UI.
const ADMIN_UID='1ocjfH5edshtXpkCPEYPBFLgKN32';
const firebaseConfig={apiKey:'AIzaSyC1jMxXA7wuoGTe5SMRUtBQkgusAyNTW9s',authDomain:'neet-ug-pro.firebaseapp.com',projectId:'neet-ug-pro',storageBucket:'neet-ug-pro.firebasestorage.app',messagingSenderId:'461230670713',appId:'1:461230670713:web:85efb6f6a791f12b2025a8'};
let cloud=null,admin=false,cloudMaps=[],cloudMessage='Connecting to cloud…',editing=null,mapEditing=null;
const localBank=questions.slice();
labels.Manage=['Admin','एडमिन'];
function status(message){cloudMessage=message;$('cloud-status').textContent=message}
function fail(e){status('Cloud error: '+(e.code||e.message)+'. Check your connection and Firebase rules.');}
function cloudQuestion(q){return {...q,options:q.options.map(o=>({en:o[0],hi:o[1]})),explanation:{en:q.explanation[0],hi:q.explanation[1]}}}
function localQuestion(id,data){return {...data,id,options:(data.options||[]).map(o=>Array.isArray(o)?o:[o.en,o.hi]),explanation:Array.isArray(data.explanation)?data.explanation:[data.explanation?.en||'',data.explanation?.hi||'']}}
function safeImage(value){try{let u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
async function refreshCloud(){
 if(!cloud)return;
 status('Loading shared content…');
 try{
  const {db,f}=cloud;
  async function readAll(name){let items=[],last=null;for(;;){let constraints=admin?[]:[f.where('published','==',true),f.where('access','==','free')];if(last)constraints.push(f.startAfter(last));constraints.push(f.limit(250));let snap=await f.getDocs(f.query(f.collection(db,name),...constraints));items.push(...snap.docs);if(snap.size<250)break;last=snap.docs[snap.docs.length-1]}return items}
  const [qs,ms]=await Promise.all([readAll('questions'),readAll('mindmaps')]);
  const loaded=qs.map(d=>localQuestion(d.id,d.data()));
  const usable=loaded.filter(valid);
  questions=usable.filter(q=>q.access==='free'&&q.published===true);
  cloud.adminQuestions=usable;
  cloudMaps=ms.map(d=>({...d.data(),id:d.id}));
  status(`Cloud connected · ${questions.length} published questions${loaded.length!==usable.length?' · Some invalid records were skipped':''}`);
  if(!session)render();
 }catch(e){fail(e)}
}
function field(form,title,type='text',value=''){let label=node('label',title),input=node(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;input.value=value;input.required=true;label.append(input);form.append(label);return input}
function checkbox(form,title,value){let label=node('label'),i=node('input');i.type='checkbox';i.checked=value;label.className='check-field';label.append(i,node('span',title));form.append(label);return i}
function selectField(form,title,values,value){let label=node('label',title),s=node('select');for(let v of values){let o=node('option',v);o.value=v;s.append(o)}s.value=value;label.append(s);form.append(label);return s}
function submit(form,label){let b=node('button',label,'primary');b.type='submit';form.append(b);return b}
function panel(title){let c=node('section',undefined,'card');c.append(node('h2',title));$('view').append(c);return c}
manage=function(){
 let c=panel(text('Admin workspace','एडमिन पैनल'));
 if(!cloud){c.append(node('p',cloudMessage),button('Retry cloud connection',()=>location.reload()));return}
 if(!admin){let form=node('form'),email=field(form,'Admin email','email'),password=field(form,'Password','password');email.autocomplete='username';password.autocomplete='current-password';let result=node('p');let b=submit(form,'Sign in');form.append(result);form.onsubmit=async e=>{e.preventDefault();b.disabled=true;try{let u=await cloud.a.signInWithEmailAndPassword(cloud.auth,email.value.trim(),password.value);password.value='';if(u.user.uid!==ADMIN_UID){await cloud.a.signOut(cloud.auth);result.textContent='This account does not have admin access.'}}catch(err){result.textContent='Login failed: '+(err.code||'Please try again.')}finally{b.disabled=false}};c.append(node('p','Students can study without login. Only the configured admin can publish content.'),form);return}
 c.append(node('p','Admin signed in'),button('Sign out',async()=>{await cloud.a.signOut(cloud.auth)}),button('Refresh cloud',refreshCloud));
 questionForm();arForm();mapForm();
 let list=panel('Manage questions');for(let q of (cloud.adminQuestions||[]).filter(q=>q.practiceType!=='ar'||q.category==='PYQ')){let row=node('div',undefined,'record');row.append(node('p',q.subject+' · '+q.chapter+' · '+q.en+' · '+(q.published?'Published':'Draft')),button('Edit',()=>{editing=q;render()}),button('Move to draft',async()=>{try{await cloud.f.updateDoc(cloud.f.doc(cloud.db,'questions',q.id),{published:false});await refreshCloud()}catch(e){fail(e)}}));list.append(row)}
 let mapsPanel=panel('Manage mind maps');for(let m of cloudMaps.filter(m=>m.kind!=='arChapter')){mapsPanel.append(node('p',(m.subject?m.subject+' · '+(m.chapter||'')+' · ':'')+(m.titleEn||m.id)+' · '+(m.published?'Published':'Draft')),button('Edit map',()=>{mapEditing=m;render()}),button('Move map to draft',async()=>{try{await cloud.f.updateDoc(cloud.f.doc(cloud.db,'mindmaps',m.id),{published:false});await refreshCloud()}catch(e){fail(e)}}))}
 let importPanel=panel('Import existing local questions');importPanel.append(node('p',`${localBank.length} questions preserved from this browser. Import creates drafts and does not overwrite cloud questions.`),button('Import local bank as drafts',async()=>{try{for(let q of localBank){if(!valid(q))continue;await cloud.f.addDoc(cloud.f.collection(cloud.db,'questions'),{...cloudQuestion(q),sourceId:q.id,published:false,access:'free'})}status('Imported as drafts. Review and publish individually.');await refreshCloud()}catch(e){fail(e)}}));
};
function questionForm(){
 const q=editing,c=panel(q?'Edit question':'Add bilingual question'),form=node('form');
 const category=selectField(form,'Category',['Chapter','PYQ'],q?.category||'Chapter');
 const subject=selectField(form,'Subject',['Physics','Chemistry','Botany','Zoology'],q?.subject||'Botany');
 const chapter=field(form,'Chapter','text',q?.chapter||'');
 const year=selectField(form,'PYQ year',Array.from({length:new Date().getFullYear()-1988+1},(_,i)=>String(new Date().getFullYear()-i)),String(q?.year||new Date().getFullYear()));
 const paperType=selectField(form,'PYQ paper type',['Main NEET','Re-NEET'],q?.paperType||'Main NEET');
 const format=selectField(form,'Question type',['MCQ','Assertion & Reason'],q?.practiceType==='ar'?'Assertion & Reason':'MCQ');
 const en=field(form,'Question — English','textarea',q?.practiceType==='ar'?'':q?.en||''),hi=field(form,'Question — हिन्दी','textarea',q?.practiceType==='ar'?'':q?.hi||'');
 const aEn=field(form,'Assertion (A) — English','textarea',q?.assertion?.en||''),aHi=field(form,'कथन (A) — हिन्दी','textarea',q?.assertion?.hi||''),rEn=field(form,'Reason (R) — English','textarea',q?.reason?.en||''),rHi=field(form,'कारण (R) — हिन्दी','textarea',q?.reason?.hi||'');
 const questionImage=mediaField(form,'Question image',q?.questionImage||'',()=>syncFields());
 const optionFields=[],optionImages=[];for(let i=0;i<4;i++){optionFields.push([field(form,`Option ${i+1} — English`,'text',q?.practiceType==='ar'?'':q?.options[i][0]||''),field(form,`Option ${i+1} — हिन्दी`,'text',q?.practiceType==='ar'?'':q?.options[i][1]||'')]);optionImages.push(mediaField(form,`Option ${i+1} image`,q?.optionImages?.[i]||'',()=>syncFields()))}
 const arHelp=node('details');arHelp.append(node('summary','A&R answer options'));AR_OPTIONS.forEach((o,i)=>arHelp.append(node('p',(i+1)+'. '+text(...o))));form.append(arHelp);
 const answer=selectField(form,'Correct option',['1','2','3','4'],String((q?.answer??0)+1)),expEn=field(form,'Explanation — English','textarea',q?.explanation[0]||''),expHi=field(form,'Explanation — हिन्दी','textarea',q?.explanation[1]||''),published=checkbox(form,'Publish for all students',q?.published||false);
 const solutionImage=mediaField(form,'Solution image',q?.solutionImage||'',()=>syncFields());
 function syncFields(){const pyq=category.value==='PYQ',isAR=pyq&&format.value==='Assertion & Reason';subject.parentElement.hidden=pyq;chapter.parentElement.hidden=pyq;chapter.required=!pyq;year.parentElement.hidden=!pyq;paperType.parentElement.hidden=!pyq;format.parentElement.hidden=!pyq;for(const input of [en,hi,...optionFields.flat()]){input.parentElement.hidden=isAR;input.required=!isAR}optionFields.forEach((pair,i)=>pair.forEach(input=>input.required=!isAR&&!optionImages[i].has()));expEn.required=!solutionImage.has();expHi.required=!solutionImage.has();for(const input of [aEn,aHi,rEn,rHi]){input.parentElement.hidden=!isAR;input.required=isAR}arHelp.hidden=!isAR}
 category.onchange=syncFields;format.onchange=syncFields;form.addEventListener('change',syncFields);form.addEventListener('input',syncFields);syncFields();
 const b=submit(form,'Save to cloud'),result=node('p');result.setAttribute('role','status');form.append(result);
 form.onsubmit=async e=>{e.preventDefault();b.disabled=true;try{
  if(!admin||!cloud)throw Error('Admin sign-in required.');
  const pyq=category.value==='PYQ',isAR=pyq&&format.value==='Assertion & Reason';
  const item={id:q?.id||'new',type:'mcq',practiceType:isAR?'ar':'mcq',category:category.value,subject:pyq?(q?.subject||'All subjects'):subject.value,chapter:pyq?(q?.chapter||'Full paper'):chapter.value.trim(),paper:pyq?String(year.value)+' · '+paperType.value:chapter.value.trim(),en:en.value.trim(),hi:hi.value.trim(),options:optionFields.map(pair=>pair.map(i=>i.value.trim())),answer:Number(answer.value)-1,explanation:[expEn.value.trim(),expHi.value.trim()],published:published.checked,access:'free'};
  if(pyq){item.year=Number(year.value);item.paperType=paperType.value;if(!Number.isInteger(item.year)||item.year<1988||item.year>new Date().getFullYear())throw Error('Select a valid PYQ year.')}
  if(isAR){item.assertion={en:aEn.value.trim(),hi:aHi.value.trim()};item.reason={en:rEn.value.trim(),hi:rHi.value.trim()};if(![...Object.values(item.assertion),...Object.values(item.reason)].every(Boolean))throw Error('Fill all assertion and reason fields.');item.en='Assertion (A): '+item.assertion.en+'\n\nReason (R): '+item.reason.en;item.hi='कथन (A): '+item.assertion.hi+'\n\nकारण (R): '+item.reason.hi;item.options=AR_OPTIONS.map(o=>o.slice())}
  item.questionImage=questionImage.get();item.optionImages=optionImages.map(m=>m.get());item.solutionImage=solutionImage.get();
  if(!valid(item))throw Error('Complete the bilingual question, options and chapter if applicable.');
  const data=cloudQuestion(item);delete data.id;validateQuestionSize(data);if(q)await cloud.f.setDoc(cloud.f.doc(cloud.db,'questions',q.id),data);else await cloud.f.addDoc(cloud.f.collection(cloud.db,'questions'),data);
  editing=null;await refreshCloud();
 }catch(err){result.textContent=err.code||err.message}finally{b.disabled=false}};
 c.append(form);if(q)c.append(button('Cancel edit',()=>{editing=null;render()}));
}
let mapSubject=null,mapChapter=null;
function mapForm(){
 const m=mapEditing,c=panel(m?'Edit mind map':'Add chapterwise mind map'),form=node('form');
 const subject=selectField(form,'Subject',['Physics','Chemistry','Botany','Zoology'],m?.subject||'Botany');
 const chapter=field(form,'Chapter — English','text',m?.chapter||''),chapterHi=field(form,'Chapter — हिन्दी','text',m?.chapterHi||m?.chapter||'');
 let suggestions=node('datalist');suggestions.id='map-chapter-list';chapter.setAttribute('list',suggestions.id);form.append(suggestions);
 function refreshSuggestions(){suggestions.replaceChildren();const chapters=[...new Set([...cloudMaps.filter(x=>x.kind!=='arChapter'&&x.subject===subject.value).map(x=>x.chapter),...(cloud.adminQuestions||[]).filter(q=>q.subject===subject.value&&q.category!=='PYQ').map(q=>q.chapter)].filter(Boolean))];for(const value of chapters){let option=node('option');option.value=value;suggestions.append(option)}}subject.onchange=refreshSuggestions;refreshSuggestions();
 const titleEn=field(form,'Mind map title — English','text',m?.titleEn||''),titleHi=field(form,'Mind map title — हिन्दी','text',m?.titleHi||'');
 c.append(node('p','Choose the subject, then enter/select the chapter. Multiple mind maps can belong to one chapter.'));
 const image=mediaField(form,'Mind map image',m?.url||''),published=checkbox(form,'Publish map',m?.published||false),b=submit(form,'Save mind map'),result=node('p');result.setAttribute('role','status');form.append(result);
 form.onsubmit=async e=>{e.preventDefault();b.disabled=true;try{if(!admin||!cloud)throw Error('Admin sign-in required.');const url=image.get();if(!url)throw Error('Choose a mind map image or enter its HTTPS URL.');const data={subject:subject.value,chapter:chapter.value.trim(),chapterHi:chapterHi.value.trim(),titleEn:titleEn.value.trim(),titleHi:titleHi.value.trim(),url,published:published.checked,access:'free'};if(![data.chapter,data.chapterHi,data.titleEn,data.titleHi].every(Boolean))throw Error('Complete both chapter names and titles.');validateQuestionSize(data);if(m)await cloud.f.setDoc(cloud.f.doc(cloud.db,'mindmaps',m.id),data);else await cloud.f.addDoc(cloud.f.collection(cloud.db,'mindmaps'),data);mapEditing=null;await refreshCloud()}catch(err){result.textContent=err.code||err.message}finally{b.disabled=false}};c.append(form);if(m)c.append(button('Cancel map edit',()=>{mapEditing=null;render()}));
}
function mapImageCard(m){const c=node('article',undefined,'card');c.append(node('h3',text(m.titleEn||'',m.titleHi||'')));appendImage(c,m.url,text(m.titleEn||'Mind map',m.titleHi||'माइंड मैप'));return c}
maps=function(){
 const items=cloudMaps.filter(m=>m.published&&m.access==='free'&&m.kind!=='arChapter'),grouped=items.filter(m=>typeof m.subject==='string'&&m.subject&&typeof m.chapter==='string'&&m.chapter),legacy=items.filter(m=>!grouped.includes(m));
 const subjects=[...new Set(grouped.map(m=>m.subject))].sort();
 if(mapSubject&&!subjects.includes(mapSubject)){mapSubject=null;mapChapter=null}
 if(mapSubject&&mapChapter&&!grouped.some(m=>m.subject===mapSubject&&m.chapter===mapChapter))mapChapter=null;
 if(!mapSubject){let grid=node('div',undefined,'grid');for(const subject of subjects){let list=grouped.filter(m=>m.subject===subject),c=node('article',undefined,'card');c.append(node('h3',subject),node('p',new Set(list.map(m=>m.chapter)).size+' '+text('chapters','अध्याय')),button(text('View chapters','अध्याय देखें'),()=>{mapSubject=subject;render()},'primary'));grid.append(c)}$('view').append(grid);if(!items.length)$('view').append(node('p',text('No published mind maps yet.','अभी कोई प्रकाशित माइंड मैप नहीं है।')));if(legacy.length){let section=node('section',undefined,'card');section.append(node('h3',text('Earlier uploads','पुराने अपलोड')),node('p',text('The admin can assign these maps to a subject and chapter.','एडमिन इन्हें विषय और अध्याय में रख सकते हैं।')));for(const map of legacy)section.append(mapImageCard(map));$('view').append(section)}return}
 const top=node('div',undefined,'actions');top.append(button(text('← Subjects','← विषय'),()=>{mapSubject=null;mapChapter=null;render()}),node('h3',mapSubject));$('view').append(top);
 const list=grouped.filter(m=>m.subject===mapSubject);
 if(!mapChapter){const grid=node('div',undefined,'grid');for(const chapter of [...new Set(list.map(m=>m.chapter))].sort()){let maps=list.filter(m=>m.chapter===chapter),c=node('article',undefined,'card');c.append(node('h3',text(chapter,maps[0].chapterHi||chapter)),node('p',maps.length+' '+text('mind maps','माइंड मैप')),button(text('Open maps','मैप खोलें'),()=>{mapChapter=chapter;render()},'primary'));grid.append(c)}$('view').append(grid);return}
 $('view').append(button(text('← Chapters','← अध्याय'),()=>{mapChapter=null;render()}));const maps=list.filter(m=>m.chapter===mapChapter);$('view').append(node('h3',text(mapChapter,maps[0]?.chapterHi||mapChapter)));for(const m of maps)$('view').append(mapImageCard(m));
};
const baseRender=render;
render=function(){baseRender();if(tab==='Home'&&!session){let ar=panel(text('Assertion & Reason','कथन और कारण'));ar.append(node('p',text('Build conceptual clarity with assertion and reason questions.','कथन और कारण के प्रश्नों से अवधारणाएँ मजबूत करें।')),button(text('Explore A&R','A&R देखें'),()=>{tab='AR';render()},'primary'));let c=panel(text('Shared question bank','साझा प्रश्न बैंक'));c.append(node('p',cloudMessage),button(text('Refresh content','कंटेंट रीफ्रेश करें'),refreshCloud))}};
// Never show cached drafts after sign-out; local backup remains untouched.
questions=[];render();
(async()=>{try{const root='https://www.gstatic.com/firebasejs/13.3.0/';const [app,a,f]=await Promise.all([import(root+'firebase-app.js'),import(root+'firebase-auth.js'),import(root+'firebase-firestore.js')]);let instance=app.initializeApp(firebaseConfig);cloud={a,f,auth:a.getAuth(instance),db:f.getFirestore(instance),adminQuestions:[]};await a.setPersistence(cloud.auth,a.browserSessionPersistence);a.onAuthStateChanged(cloud.auth,async user=>{admin=user?.uid===ADMIN_UID;editing=null;mapEditing=null;arEditing=null;session=null;questions=[];cloudMaps=[];render();await refreshCloud()})}catch(e){fail(e);render()}})();
