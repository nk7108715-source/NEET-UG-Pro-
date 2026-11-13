'use strict';
const MAX_IMAGE_BYTES=90*1024;
const MAX_QUESTION_BYTES=850000;
function validMediaSource(value){
 if(value===''||value==null)return true;
 if(typeof value!=='string')return false;
 if(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value)){
  const encoded=value.split(',')[1];return encoded.length%4===0&&Math.floor(encoded.length*3/4)<=MAX_IMAGE_BYTES;
 }
 try{const u=new URL(value);return value.length<4096&&u.protocol==='https:'&&!u.username&&!u.password}catch{return false}
}
function imageElement(src,alt){if(!src||!validMediaSource(src))return null;let frame=node('span',undefined,'question-image'),img=node('img');img.src=src;img.alt=alt||text('Question diagram','प्रश्न का चित्र');img.referrerPolicy='no-referrer';img.decoding='async';img.onerror=()=>{frame.replaceChildren(node('p',text('Image unavailable. Please refresh or contact the admin.','चित्र उपलब्ध नहीं है। रीफ्रेश करें या एडमिन से संपर्क करें।'),'image-error'))};frame.append(img);return frame}
function appendImage(parent,src,alt){const img=imageElement(src,alt);if(img)parent.append(img)}
async function compressImage(file){
 if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Choose a PNG, JPG or WebP image.');
 if(file.size>8*1024*1024)throw Error('Select an image smaller than 8 MB.');
 let objectURL=URL.createObjectURL(file),img=new Image();
 try{
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Image cannot be opened. Choose another image.'));img.src=objectURL});
  if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth*img.naturalHeight>40000000)throw Error('Image dimensions are too large. Crop the diagram first.');
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw Error('This browser cannot prepare images.');
  const scale=Math.min(1,1800/Math.max(img.naturalWidth,img.naturalHeight));canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
  for(let quality of [.95,.88,.8,.72]){let data=canvas.toDataURL('image/webp',quality);if(validMediaSource(data))return data}
  throw Error('Image remains too large. Crop only the graph/diagram or use a hosted HTTPS image URL.');
 }finally{URL.revokeObjectURL(objectURL)}
}
function mediaField(form,title,initial='',onChange=()=>{}){
 let source=initial||'',busy=false,error='',generation=0;
 const box=node('fieldset',undefined,'media-editor'),legend=node('legend',title+' (optional)'),file=node('input');file.type='file';file.accept='image/png,image/jpeg,image/webp';file.setAttribute('aria-label',title+' — choose image');
 const preview=node('div',undefined,'media-preview'),message=node('p',undefined,'muted');message.setAttribute('role','status');
 const urlDetails=node('details');urlDetails.append(node('summary','Or use an HTTPS image link'));const link=node('input');link.type='url';link.placeholder='https://…';link.setAttribute('aria-label',title+' — HTTPS URL');if(source.startsWith('https:'))link.value=source;urlDetails.append(link);
 function update(){preview.replaceChildren();appendImage(preview,source,title);message.textContent=busy?'Preparing image…':error||(source?'Image ready. Check that labels and structures are readable.':'Choose from Gallery/Files. Images are optional.');onChange()}
 file.onchange=async()=>{const f=file.files?.[0];if(!f)return;const token=++generation;busy=true;error='';update();try{let prepared=await compressImage(f);if(token!==generation)return;source=prepared;link.value=''}catch(e){if(token!==generation)return;error=e.message}finally{if(token===generation){busy=false;update()}}};
 link.oninput=()=>{generation++;busy=false;file.value='';source=link.value.trim();error=source&&!validMediaSource(source)?'Enter a valid HTTPS image URL.':'';update()};
 const remove=button('Remove image',()=>{generation++;busy=false;error='';source='';file.value='';link.value='';update()});remove.type='button';
 box.append(legend,file,preview,message,remove,urlDetails);form.append(box);
 // Initial notification is deferred until the form has initialized all controls.
 preview.replaceChildren();appendImage(preview,source,title);message.textContent=source?'Image ready.':'Choose from Gallery/Files. Images are optional.';
 return {box,has:()=>Boolean(source)&&!error,get:()=>{if(busy)throw Error('Please wait while the image is prepared.');if(error)throw Error(error);if(!validMediaSource(source))throw Error('Invalid image source.');return source}};
}
function validateQuestionSize(data){if(new TextEncoder().encode(JSON.stringify(data)).length>MAX_QUESTION_BYTES)throw Error('This question contains too much image/text data. Use smaller diagrams or hosted HTTPS image URLs.');}
