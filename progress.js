'use strict';
let practiceTick=null;
function practiceElapsed(s,now=Date.now()){if(Number.isFinite(s.durationMs))return s.durationMs;return Math.max(0,now-(s.startedAt??now))}
function clockText(ms){let sec=Math.floor(Math.max(0,ms)/1000),h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function completePractice(s){if(s.finished)return;s.durationMs=Number.isFinite(s.timeLimitMs)?Math.min(practiceElapsed(s),s.timeLimitMs):practiceElapsed(s);s.finished=true;if(s.isPreview)return;let r=resultFor(s);history.push({at:Date.now(),group:s.group,score:r.correct,...r,durationMs:s.durationMs,mode:s.mode,kind:s.items[0]?.category==='PYQ'?'PYQ':s.items[0]?.practiceType==='ar'?'AR':'Chapter'});save('history',history)}
function progressSummary(records){let completed=records.filter(r=>r&&Number.isFinite(r.total)&&r.total>0&&Number.isFinite(r.score)&&r.score>=0&&r.score<=r.total&&!String(r.group||'').startsWith('Admin '));let attempted=0,correct=0,wrong=0,missed=0,durationMs=0;for(let r of completed){let a=Number.isFinite(r.attempted)?r.attempted:r.total;attempted+=a;correct+=r.score;wrong+=Number.isFinite(r.wrong)?r.wrong:a-r.score;missed+=Number.isFinite(r.missed)?r.missed:0;if(Number.isFinite(r.durationMs))durationMs+=Math.max(0,r.durationMs)}return {completed,attempted,correct,wrong,missed,durationMs,accuracy:attempted?Math.round(correct/attempted*100):0,marks:correct*4-wrong}}
function metric(grid,value,en,hi,icon){let tile=node('div',undefined,'progress-tile');let symbol=node('span',icon,'metric-icon');symbol.setAttribute('aria-hidden','true');if(en==='Practice time'){symbol.textContent='';symbol.classList.add('watch-face')}tile.append(symbol,node('strong',String(value)),node('span',text(en,hi)));grid.append(tile)}
function progressView(){let d=progressSummary(history),c=panel(text('My progress','मेरी प्रगति'));c.classList.add('dashboard');c.append(node('p',text('Every session moves you forward.','हर अभ्यास के साथ आगे बढ़ें।'),'dashboard-caption'));let hero=node('div',undefined,'dashboard-overview'),gauge=node('div',undefined,'accuracy-gauge');gauge.style.setProperty('--accuracy',String(d.accuracy)+'%');gauge.append(node('strong',d.accuracy+'%'),node('span',text('Accuracy','सटीकता')));let stats=node('div');stats.append(node('span',text('COMPLETED PRACTICES','पूरे किए अभ्यास'),'eyebrow'),node('strong',String(d.completed.length),'session-total'),node('p',text('Your personal learning dashboard','आपकी व्यक्तिगत प्रगति')));hero.append(gauge,stats);c.append(hero);let grid=node('div',undefined,'progress-grid');metric(grid,clockText(d.durationMs),'Practice time','अभ्यास समय','◴');metric(grid,d.attempted,'Attempted','प्रयास किए','✓');metric(grid,d.correct,'Correct answers','सही उत्तर','+4');metric(grid,d.wrong,'Wrong answers','गलत उत्तर','−1');metric(grid,d.missed,'Skipped questions','छोड़े हुए','↷');metric(grid,d.marks,'Total marks','कुल अंक','★');c.append(grid);let recent=node('section',undefined,'recent-progress');recent.append(node('h3',text('Recent results','हाल के परिणाम')));if(!d.completed.length)recent.append(node('p',text('Complete a practice from the navigation below to see your results here.','नीचे के navigation से अभ्यास पूरा करें। आपकी रिपोर्ट यहाँ दिखेगी।')));for(let r of d.completed.slice(-5).reverse()){let row=node('div',undefined,'record'),marksEarned=Number.isFinite(r.marks)?r.marks:r.score*4-(r.total-r.score);row.append(node('strong',r.group||'Practice'),node('p',`${marksEarned} / ${4*r.total} ${text('marks','अंक')} · ${Number.isFinite(r.durationMs)?clockText(r.durationMs):text('Time not recorded','समय दर्ज नहीं')} · ${new Date(r.at).toLocaleDateString(lang==='hi'?'hi-IN':'en-IN')}`));recent.append(row)}c.append(recent,node('p',text('Progress is saved on this browser/device. Older results may not include time.','प्रगति इसी browser/device पर सुरक्षित है। पुराने परिणामों में समय उपलब्ध नहीं हो सकता।'),'muted'))}

function isTimedPYQ(s){return s?.mode==='test'&&Number.isFinite(s.deadlineAt)&&Number.isFinite(s.timeLimitMs)}
function expireTimedTest(s,now=Date.now()){
 if(!s||s.finished||!isTimedPYQ(s)||now<s.deadlineAt)return false;
 s.timedOut=true;s.confirmSubmit=false;s.showTestGrid=false;completePractice(s);return true;
}
function activeClockText(s){
 return isTimedPYQ(s)?clockText(Math.ceil(Math.max(0,s.deadlineAt-Date.now())/1000)*1000):clockText(practiceElapsed(s));
}
const screenRender=render;
render=function(){
 if(practiceTick!==null){clearInterval(practiceTick);practiceTick=null}
 expireTimedTest(session);
 screenRender();
 if(pendingPractice){$('view').replaceChildren();practiceModeView();document.querySelector('.hero').hidden=true;$('cloud-status').hidden=true;return}
 if(session){
  const s=session;
  if(!s.finished){
   const bar=node('div',undefined,'practice-clock'),value=node('strong',activeClockText(s));
   bar.setAttribute('role','timer');bar.append(node('span',isTimedPYQ(s)?text('◴ Time left · 3-hour PYQ test','◴ बाकी समय · 3 घंटे का PYQ टेस्ट'):text('◴ Practice timer','◴ अभ्यास टाइमर')),value);$('view').prepend(bar);
   practiceTick=setInterval(()=>{
    if(session!==s||s.finished)return;
    if(expireTimedTest(s)){render();window.scrollTo({top:0,behavior:'instant'});return}
    value.textContent=activeClockText(s);
   },1000);
  }
 }else if(!IS_ADMIN_PAGE&&tab==='Home'){
  $('view').replaceChildren();document.querySelector('.hero').hidden=true;$('cloud-status').hidden=true;document.querySelector('.notice').hidden=true;document.querySelector('footer').hidden=true;progressView();
 }
};
// Recheck wall-clock time immediately when returning from the background.
function resumeTestClock(){if(session&&!session.finished&&isTimedPYQ(session))render()}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resumeTestClock()});
window.addEventListener('focus',resumeTestClock);
window.addEventListener('pageshow',resumeTestClock);
render();
