'use strict';
function questionOutcome(s,index){const selected=s.answers[index];if(!Number.isInteger(selected)||selected<0||selected>3)return 'missed';return selected===s.items[index].answer?'correct':'wrong'}
function reviewIndices(s,filter){return s.items.map((q,i)=>i).filter(i=>filter==='all'||(filter==='attempted'?questionOutcome(s,i)!=='missed':questionOutcome(s,i)===filter))}
function openReview(filter='all',showGrid=false){if(!session?.finished)return;const indices=reviewIndices(session,filter);session.review={filter,index:indices[0]??null,showGrid};render();window.scrollTo({top:0,behavior:'instant'})}
function outcomeLabel(outcome){return outcome==='correct'?text('Correct · +4','सही · +4'):outcome==='wrong'?text('Wrong · −1','गलत · −1'):text('Not attempted · 0','प्रयास नहीं किया · 0')}
function reviewView(s){
 const state=s.review,indices=reviewIndices(s,state.filter),c=panel(text('Answer review','उत्तर समीक्षा'));
 c.append(node('p',s.group,'review-group'));
 const controls=reviewControls(s,state.filter);controls.prepend(button(text('← Report','← रिपोर्ट'),()=>{s.review=null;render()}));c.append(controls);
 if(state.showGrid)questionNumberDialog(c,s);
 if(!indices.length){c.append(node('p',text('No questions in this category.','इस श्रेणी में कोई प्रश्न नहीं है।')));return}
 if(!indices.includes(state.index))state.index=indices[0];const index=state.index,q=s.items[index],selected=s.answers[index],position=indices.indexOf(index),outcome=questionOutcome(s,index);
 const question=node('article',undefined,'review-single-question');question.append(node('p',text('Question ','प्रश्न ')+(index+1)+' / '+s.items.length+' · '+(position+1)+' / '+indices.length+' '+text('in this review','इस समीक्षा में')),node('span',outcomeLabel(outcome),'outcome-badge outcome-'+outcome),node('h2',text(q.en,q.hi)));appendImage(question,q.questionImage,text('Question diagram','प्रश्न का चित्र'));
 q.options.forEach((option,i)=>{let row=node('div',undefined,'option review-option');if(i===q.answer)row.classList.add('correct');else if(i===selected)row.classList.add('wrong');row.append(node('span',String(i+1)+'. '+text(...option),'option-label'));if(i===q.answer)row.append(node('strong',text('✓ Correct answer','✓ सही उत्तर'),'answer-tag'));if(i===selected)row.append(node('strong',text('Your answer','आपका उत्तर'),'answer-tag'));appendImage(row,q.optionImages?.[i],text('Option ','विकल्प ')+(i+1));question.append(row)});
 question.append(node('h3',text('Solution','समाधान')),node('p',text(...q.explanation)));appendImage(question,q.solutionImage,text('Solution diagram','समाधान का चित्र'));c.append(question);
 let actions=node('div',undefined,'actions');let previous=button(text('Previous','पिछला'),()=>{state.index=indices[position-1];render();window.scrollTo({top:0,behavior:'instant'})}),next=button(text('Next','अगला'),()=>{state.index=indices[position+1];render();window.scrollTo({top:0,behavior:'instant'})},'primary');previous.disabled=position===0;next.disabled=position===indices.length-1;actions.append(previous,next);c.append(actions);
}

function reviewControls(s,active='all'){
 const bar=node('div',undefined,'report-tools');
 bar.append(button(text('Question No.','प्रश्न संख्या'),()=>{if(!s.review)openReview('all',true);else{s.review.showGrid=true;render()}},'primary'));
 const filters=node('details',undefined,'compact-filters'),summary=node('summary',text('☷ Filters','☷ फ़िल्टर'));
 filters.append(summary);const choices=node('div',undefined,'filter-choices');
 for(const [filter,en,hi]of [['all','All','सभी'],['correct','Correct','सही'],['wrong','Wrong','गलत'],['missed','Missed','बिना उत्तर'],['attempted','Attempted','प्रयास किए']]){
  const count=reviewIndices(s,filter).length,b=button(text(en,hi)+' '+count,()=>openReview(filter),active===filter?'active':'');
  b.setAttribute('aria-pressed',String(active===filter));choices.append(b);
 }filters.append(choices);bar.append(filters);return bar;
}
function questionNumberDialog(parent,s){
 const state=s.review,box=centerDialog(parent,text('All question numbers','सभी प्रश्न संख्याएँ'),()=>{state.showGrid=false;render()},'number-dialog');
 box.append(button(text('✕ Close','✕ बंद करें'),()=>{state.showGrid=false;render()},'dialog-close'),node('p',text('✓ Green: correct · ✕ Red: wrong · ○ Grey: missed','✓ हरा: सही · ✕ लाल: गलत · ○ ग्रे: बिना उत्तर'),'number-legend'));
 const grid=node('div',undefined,'review-number-grid');
 s.items.forEach((q,i)=>{const outcome=questionOutcome(s,i),symbol=outcome==='correct'?'✓':outcome==='wrong'?'✕':'○';
  const b=button((i+1)+' '+symbol,()=>{state.filter='all';state.index=i;state.showGrid=false;render();window.scrollTo({top:0,behavior:'instant'})},'review-number outcome-'+outcome);
  b.setAttribute('aria-label',text('Question ','प्रश्न ')+(i+1)+' — '+outcomeLabel(outcome));if(state.index===i)b.setAttribute('aria-current','step');grid.append(b);
 });box.append(grid);
}
reportView=function(s){
 if(s.review)return reviewView(s);const r=resultFor(s),c=panel(text('Practice report','अभ्यास रिपोर्ट'));
 c.append(reviewControls(s),node('h3',s.group),node('div',r.marks+' / '+r.maxMarks,'result-score'),node('p',text('Marks earned','प्राप्त अंक')));
 const metrics=node('div',undefined,'report-metrics');
 for(const [value,en,hi]of [[clockText(practiceElapsed(s)),'Time','समय'],[r.total,'Questions','प्रश्न'],[r.attempted,'Attempted','प्रयास किए'],[r.correct,'Correct','सही'],[r.wrong,'Wrong','गलत'],[r.missed,'Missed','बिना उत्तर'],[r.accuracy+'%','Accuracy','सटीकता']]){
  let item=node('span');item.append(node('strong',String(value)),node('span',text(en,hi)));metrics.append(item);
 }c.append(metrics,node('p',text('Negative marks deducted: ','काटे गए नकारात्मक अंक: ')+r.wrong),button(text('Review all answers','सभी उत्तर देखें'),()=>openReview('all')),button(text('Back to section','सेक्शन पर वापस'),()=>{session=null;render()}));
 if(!IS_ADMIN_PAGE)c.append(button(text('View my progress','मेरी प्रगति देखें'),()=>{session=null;tab='Home';render()}));
};
