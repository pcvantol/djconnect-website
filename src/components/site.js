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
document.querySelectorAll('[data-mood-choice]').forEach(button=>button.addEventListener('click',()=>{const preview=button.closest('[data-mood]');preview.dataset.mood=button.dataset.moodChoice;preview.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
