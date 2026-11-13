'use strict';
let practiceTick=null;
function practiceElapsed(s,now=Date.now()){
 if(Number.isFinite(s.durationMs))return s.durationMs;
 return Math.max(0,now-(s.startedAt||now));
}
function clockText(ms){let sec=Math.floor(Math.max(0,ms)/1000),h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function completePractice(s){
 if(s.finished)return;
 s.durationMs=practiceElapsed(s);s.finished=true;
 if(s.isPreview)return;
 history.push({at:Date.now(),group:s.group,score:s.answers.filter((v,i)=>v===s.items[i].answer).length,total:s.items.length,durationMs:s.durationMs,kind:s.items[0]?.category==='PYQ'?'PYQ':'Chapter'});
 save('history',history);
}
function progressSummary(records){
 const completed=records.filter(r=>r&&Number.isFinite(r.total)&&r.total>0&&Number.isFinite(r.score)&&r.score>=0&&r.score<=r.total&&!String(r.group||'').startsWith('Admin '));
 let total=completed.reduce((n,r)=>n+r.total,0),correct=completed.reduce((n,r)=>n+r.score,0),timed=completed.filter(r=>Number.isFinite(r.durationMs)&&r.durationMs>=0);
 return {completed,total,correct,accuracy:total?Math.round(correct/total*100):0,timedCount:timed.length,durationMs:timed.reduce((n,r)=>n+r.durationMs,0)};
}
function progressView(){
 const data=progressSummary(history),card=panel(text('Your progress','आपकी प्रगति'));
 const grid=node('div',undefined,'progress-grid');
 for(const [value,en,hi]of [[data.completed.length,'Completed practices','पूरे किए अभ्यास'],[data.total,'Questions attempted','हल किए प्रश्न'],[data.accuracy+'%','Accuracy','सटीकता'],[clockText(data.durationMs),'Practice time','अभ्यास समय']]){let tile=node('div',undefined,'progress-tile');tile.append(node('strong',String(value)),node('span',text(en,hi)));grid.append(tile)}
 card.append(grid,node('p',text('Saved on this browser/device. Time is counted for completed practices with the new timer.','प्रगति इसी browser/device पर सुरक्षित है। समय नए timer से पूरे किए अभ्यासों का है।'),'muted'));
 if(data.completed.length){let recent=node('details');recent.append(node('summary',text('Recent practices','हाल के अभ्यास')));for(const r of data.completed.slice(-5).reverse()){let row=node('div',undefined,'record');row.append(node('strong',r.group||'Practice'),node('p',`${r.score}/${r.total} · ${Number.isFinite(r.durationMs)?clockText(r.durationMs):text('Time not recorded','समय दर्ज नहीं')} · ${new Date(r.at).toLocaleDateString(lang==='hi'?'hi-IN':'en-IN')}`));recent.append(row)}card.append(recent)}
}
const screenRender=render;
render=function(){
 if(practiceTick!==null){clearInterval(practiceTick);practiceTick=null}
 screenRender();
 if(session){let s=session,bar=node('div',undefined,'practice-clock');bar.setAttribute('role','timer');let label=node('span',text(s.finished?'Total practice time':'Practice timer',s.finished?'कुल अभ्यास समय':'अभ्यास टाइमर')),value=node('strong',clockText(practiceElapsed(s)));bar.append(label,value);$('view').prepend(bar);if(!s.finished)practiceTick=setInterval(()=>{value.textContent=clockText(practiceElapsed(s))},1000)}
 else if(!IS_ADMIN_PAGE&&tab==='Home')progressView();
};
render();
