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
 const queues=preview.querySelectorAll('[data-horizon-mood]');
 buttons.forEach(button=>button.addEventListener('click',()=>{
  preview.dataset.mood=button.dataset.moodChoice;
  queues.forEach(queue=>{queue.hidden=queue.dataset.horizonMood!==preview.dataset.mood;});
  buttons.forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
 }));
});
document.querySelectorAll('.character-preview').forEach(preview=>{
 const choices=preview.querySelectorAll('[data-character-choice]');
 const pictures=preview.querySelectorAll('[data-character-art]');
 const descriptions=preview.querySelectorAll('[data-character-description]');
 choices.forEach(button=>button.addEventListener('click',()=>{
  const selected=button.dataset.characterChoice;
  pictures.forEach(picture=>{picture.hidden=picture.dataset.characterArt!==selected;});
  descriptions.forEach(description=>{description.hidden=description.dataset.characterDescription!==selected;});
  choices.forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
 }));
});

const macosRelease = document.querySelector('[data-macos-release]');
if (macosRelease) {
 fetch('/api/downloads/macos', { signal: AbortSignal.timeout(7000) })
  .then(async response => {
   if (!response.ok) throw new Error('Release unavailable');
   const { version, prerelease, unsigned, downloadUrl } = await response.json();
   if (typeof version !== 'string' || typeof downloadUrl !== 'string' ||
       !downloadUrl.startsWith('https://github.com/pcvantol/djconnect-app-releases/releases/download/macos/')) {
    throw new Error('Invalid release');
   }
   macosRelease.querySelector('[data-release-version]').textContent = version;
   macosRelease.querySelector('[data-release-preview]').hidden = !prerelease;
   macosRelease.querySelector('[data-release-unsigned]').hidden = !unsigned;
   const download = macosRelease.querySelector('[data-release-download]');
   download.querySelector('a').href = downloadUrl;
   macosRelease.querySelector('[data-release-details]').hidden = false;
   download.hidden = false;
  })
  .catch(() => { macosRelease.querySelector('[data-release-unavailable]').hidden = false; });
}
