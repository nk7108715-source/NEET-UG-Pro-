'use strict';
let selectedPYQYear=null;
const MIN_PYQ_YEAR=1988,MAX_PYQ_YEAR=new Date().getFullYear();
function getPYQYear(q){let year=Number(q.year);return Number.isInteger(year)&&year>=MIN_PYQ_YEAR&&year<=MAX_PYQ_YEAR?year:null}
function getPaperType(q){return q.paperType==='Re-NEET'?'Re-NEET':'Main NEET'}
function pyqView(){
 const all=questions.filter(q=>q.category==='PYQ');
 const years=[...new Set(all.map(getPYQYear).filter(Boolean))].sort((a,b)=>b-a);
 if(selectedPYQYear!==null&&!years.includes(selectedPYQYear))selectedPYQYear=null;
 let title=node('h2',text('Previous Year Questions','पिछले वर्षों के प्रश्न'));$('view').append(title);
 if(selectedPYQYear===null){let grid=node('div',undefined,'grid');for(let year of years){let items=all.filter(q=>getPYQYear(q)===year),card=node('article',undefined,'card');card.append(node('h2',String(year)),node('p',text('NEET question papers','NEET प्रश्नपत्र')),button(text('View papers','प्रश्नपत्र देखें'),()=>{selectedPYQYear=year;render()},'primary'));grid.append(card)}$('view').append(grid);if(!years.length)$('view').append(node('p',text('No year-wise papers published yet.','अभी कोई वर्षवार प्रश्नपत्र प्रकाशित नहीं है।')));
 }else{let bar=node('div',undefined,'actions');bar.append(button(text('← All years','← सभी वर्ष'),()=>{selectedPYQYear=null;render()}),node('h3',String(selectedPYQYear)));$('view').append(bar);let grid=node('div',undefined,'grid');for(let paperType of ['Main NEET','Re-NEET']){let items=all.filter(q=>getPYQYear(q)===selectedPYQYear&&getPaperType(q)===paperType);if(!items.length)continue;let c=node('article',undefined,'card');c.append(node('h2',paperType),node('p',`${items.length} ${text('questions','प्रश्न')}`),button(text('Start practice','अभ्यास शुरू करें'),()=>start(items,selectedPYQYear+' · '+paperType),'primary'));grid.append(c)}$('view').append(grid)}
 const legacy=all.filter(q=>getPYQYear(q)===null);if(legacy.length){let c=node('section',undefined,'card');c.append(node('h3',text('Earlier uploads — year not assigned','पुराने अपलोड — वर्ष तय नहीं')),node('p',text('These questions are preserved. The admin can assign their year.','ये प्रश्न सुरक्षित हैं। एडमिन इनमें वर्ष जोड़ सकते हैं।')),button(text('Practice earlier uploads','पुराने प्रश्नों का अभ्यास'),()=>start(legacy,'Earlier PYQ uploads')));$('view').append(c)}
}
const contentRender=render;
render=function(){
 if(IS_ADMIN_PAGE){tab='Manage'}else if(tab==='Manage'){tab='Home'}
 contentRender();
 const showHome=!IS_ADMIN_PAGE&&tab==='Home'&&!session;
 document.querySelector('.hero').hidden=!showHome;
 $('nav').hidden=IS_ADMIN_PAGE;
 $('cloud-status').hidden=!IS_ADMIN_PAGE&&tab!=='Home';
 document.querySelector('.notice').hidden=tab!=='Home'||IS_ADMIN_PAGE;
 if(IS_ADMIN_PAGE){document.body.classList.add('admin-page');return}
 if(tab==='PYQ'&&!session){$('view').replaceChildren();pyqView()}
 else if(!session&&['Chapters','Bookmarks','Maps'].includes(tab)){
  let title=node('h2',text(...labels[tab]));title.className='section-heading';$('view').prepend(title)
 }
 // Real banner stays hidden until an Android ad adapter mounts a loaded ad.
 // Deliberately no fake ad, countdown, or earnings claim.
 const area=$('ad-banner-slot');area.hidden=true;area.replaceChildren();
 if(!session&&['Home','PYQ','Chapters'].includes(tab)){
  area.dataset.screen=tab;area.setAttribute('aria-label','Advertisement');
  // Native adapter must reserve layout space before revealing this slot and
  // keep clear separation from cards/navigation. No live adapter is bundled.
 }
};
render();
