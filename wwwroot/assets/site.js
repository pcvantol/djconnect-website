// Native dialog supplies modal focus containment and background inertness.
const dialog=document.querySelector('#site-menu');
const opener=document.querySelector('[data-menu-open]');
const languages=document.querySelector('.languages');
const close=()=>dialog?.close();
opener?.addEventListener('click',()=>{languages?.removeAttribute('open');dialog.showModal();opener.setAttribute('aria-expanded','true');});
dialog?.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button:not([disabled]),a[href]')];if(!items.length)return;event.preventDefault();const index=items.indexOf(document.activeElement);items[(index+(event.shiftKey?-1:1)+items.length)%items.length].focus();});
dialog?.querySelector('[data-menu-close]')?.addEventListener('click',close);
dialog?.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();});
dialog?.addEventListener('close',()=>{opener.setAttribute('aria-expanded','false');opener.focus();});
dialog?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&languages?.open){languages.removeAttribute('open');languages.querySelector('summary').focus();}});
document.addEventListener('click',event=>{if(languages?.open&&!languages.contains(event.target))languages.removeAttribute('open');});
// Preserve current section where possible, with real static URLs and no storage.
document.querySelectorAll('.language-options a').forEach(a=>a.addEventListener('click',()=>{if(location.hash)a.hash=location.hash;}));
document.querySelectorAll('.mood-preview[data-mood]').forEach(preview=>{
 const buttons=preview.querySelectorAll('[data-mood-choice]');
 const animate=()=>preview.setAttribute('data-mood-moving','');
 // Start the default mood when the visitor first reaches the artwork.
 const observer='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)){animate();observer.disconnect();}
 },{threshold:.35}) : null;
 const art=preview.querySelector('picture');
 if(art)observer?.observe(art);
 buttons.forEach(button=>button.addEventListener('click',()=>{
  preview.dataset.mood=button.dataset.moodChoice;
  buttons.forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
  observer?.disconnect();
  animate();
 }));
});
