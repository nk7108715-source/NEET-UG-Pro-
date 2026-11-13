'use strict';
// Focus is an in-app layout mode; browser controls remain under browser control.
let openedMindMap=null,focusOwner=null,focusEnabled=true;
function focusBack(){
 if(openedMindMap){openedMindMap=null;render();return}
 if(session?.finished&&session.review){delete session.review;render();return}
 if(session&&!session.finished&&!window.confirm(text('Leave this practice? Current answers and timer will be lost.','अभ्यास छोड़ें? मौजूदा उत्तर और टाइमर हट जाएंगे।')))return;
 session=null;pendingPractice=null;render();window.scrollTo({top:0,behavior:'instant'});
}
const focusMapCard=mapImageCard;
mapImageCard=function(m){const card=focusMapCard(m);card.append(button(text('Open full map','पूरा मैप खोलें'),()=>{openedMindMap=m;render();window.scrollTo({top:0,behavior:'instant'})},'primary'));return card};
const focusBaseRender=render;
render=function(){
 focusBaseRender();
 if(openedMindMap&&tab!=='Maps')openedMindMap=null;
 const owner=openedMindMap||session||pendingPractice;
 if(owner!==focusOwner){focusOwner=owner;focusEnabled=true}
 if(openedMindMap){$('view').replaceChildren();const card=focusMapCard(openedMindMap);card.classList.add('open-mind-map');$('view').append(card)}
 document.getElementById('focus-toolbar')?.remove();
 const focused=Boolean(owner)&&!IS_ADMIN_PAGE;
 document.body.classList.toggle('focus-mode',focused&&focusEnabled);
 if(!focused)return;
 const bar=node('div',undefined,'focus-toolbar');bar.id='focus-toolbar';bar.setAttribute('aria-label',text('Screen controls','स्क्रीन नियंत्रण'));
 const toggle=button(focusEnabled?text('⛶ Exit focus','⛶ नेविगेशन दिखाएँ'):text('⛶ Full screen','⛶ पूरी स्क्रीन'),()=>{focusEnabled=!focusEnabled;render()});toggle.setAttribute('aria-pressed',String(focusEnabled));
 bar.append(button(text('← Back','← वापस'),focusBack),toggle);document.querySelector('main').prepend(bar);
 // Navigation remains available on request, with an abandonment check.
 for(const b of $('nav').querySelectorAll('button')){const original=b.onclick;b.onclick=e=>{if(session&&!session.finished&&!window.confirm(text('Leave this practice? Current answers and timer will be lost.','अभ्यास छोड़ें? मौजूदा उत्तर और टाइमर हट जाएंगे।')))return;openedMindMap=null;original?.call(b,e)}}
};
render();
