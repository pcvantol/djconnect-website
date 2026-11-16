import {privacy,privacySections,privacyContact,supervisoryAuthorityUrl} from '../locales/privacy.mjs';
import {escape as e,Button,Picture,HorizonPreview,DJCharacterPreview,DJMomentPreview,VibeCastPreview} from '../components/ui.mjs';
import {route} from '../pages/registry.mjs';
const copy=(t,label,title,description,action='')=>`<div class="section-copy"><p class="eyebrow">${e(t[label])}</p><h2>${e(t[title])}</h2><p class="lead">${e(t[description])}</p>${action}</div>`;
export const HeroSection = ({t,locale}) => `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">DJCONNECT</p><h1 id="hero-title">${e(t['hero.title']).replace('. ','.<br> ')}</h1><p class="lead">${e(t['hero.description'])}</p>${Button(t['cta.start'],route(locale,'start'))}</div><div class="hero-art glass">${Picture('hero',t['alt.hero'],true)}<span class="hero-caption glass"><span class="live-dot" aria-hidden="true"></span>${e(t['hero.caption'])}</span></div><a class="scroll-cue" href="#moment" aria-label="${e(t['moment.label'])}"><span aria-hidden="true">↓</span></a></section>`;
export const MediaTextSection = (id,content,visual,reverse=false,extra='') => `<section id="${id}" class="experience ${reverse?'experience-reverse':''}">${content}<div class="section-visual">${visual}</div>${extra}</section>`;
export const VibeSection=({t})=>MediaTextSection('vibe',copy(t,'vibe.label','vibe.title','vibe.description'),HorizonPreview(t),false,`<div class="section-visual character-visual">${DJCharacterPreview(t)}</div>`);
export const MomentSection=({t})=>MediaTextSection('moment',copy(t,'moment.label','moment.title','moment.description'),DJMomentPreview(t),true);
export const VibeCastSection=({t})=>MediaTextSection('vibecast',copy(t,'cast.label','cast.title','cast.description',Button(t['cta.cast'],'https://vibecast.tv',true)),VibeCastPreview(t));
const paragraph=(title,text)=>`<section class="prose-section"><h2>${e(title)}</h2><p>${e(text)}</p></section>`;
const service=(t,title,description,body)=>`<article class="service-page"><p class="eyebrow">DJCONNECT</p><h1>${e(t[title])}</h1><p class="lead">${e(t[description])}</p>${body}</article>`;
const providerPrivacyLinks = [
 ['Cloudflare', 'https://www.cloudflare.com/cloudflare-customer-dpa/'],
 ['Apple', 'https://www.apple.com/legal/privacy/en-ww/'],
 ['Microsoft Hotmail (Outlook.com)', 'https://www.microsoft.com/en-us/privacy/privacystatement'],
 ['GitHub', 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement#international-data-transfers'],
];
export const sections={
 hero:HeroSection,vibe:VibeSection,moment:MomentSection,cast:VibeCastSection,
 onboarding:({locale,t})=>service(t,'start.title','start.description',paragraph(t['start.step1'],t['start.requirements'])+Button(t['start.install'],'/go/hacs',true)+paragraph(t['start.distribution'],t['start.availability'])+Button(t['downloads.title'],route(locale,'downloads'),true)+paragraph(t['start.step2'],t['start.wizard'])),
 downloads:({t})=>service(t,'downloads.title','downloads.description',
  `<section class="prose-section" id="downloads" data-macos-release>
   <h2>macOS</h2>
   <div aria-live="polite" aria-atomic="true">
    <p data-release-details hidden><span>${e(t['downloads.version'])} <strong data-release-version></strong></span><span data-release-preview hidden> · ${e(t['downloads.preview'])}</span></p>
    <p data-release-unavailable hidden>${e(t['downloads.unavailable'])}</p>
   </div>
   <noscript><p>${e(t['downloads.unavailable'])}</p></noscript>
   <div data-release-actions hidden>
    ${Button(t['downloads.action'],'#downloads')}
   </div>
  </section>
  <section class="prose-section" id="esp32">
   <h2>ESP32</h2>
   <p>${e(t['downloads.esp32.description'])}</p>
   ${Button(t['downloads.esp32.action'],'/go/device/esp32')}
  </section>
  <section class="prose-section" id="raspberry-pi">
   <h2>Raspberry Pi</h2>
   <fieldset class="pi-model-picker">
    <legend>${e(t['downloads.pi.description'])}</legend>
    <div class="pi-model-options glass">
     <label><input type="radio" name="pi-model" value="pi5" checked>Pi 5</label>
     <label><input type="radio" name="pi-model" value="pi-zero-2w">Zero 2 W</label>
    </div>
    <div data-pi-download="pi5">${Button(t['downloads.pi.action'].replace('{model}','Raspberry Pi 5'),'/go/device/pi5')}</div>
    <div data-pi-download="pi-zero-2w">${Button(t['downloads.pi.action'].replace('{model}','Raspberry Pi Zero 2 W'),'/go/device/pi-zero-2w')}</div>
   </fieldset>
  </section>`),
 support:({t})=>service(t,'support.title','support.description',Button(t['support.email'],'mailto:support@djconnect.dev')),
 privacy:({locale,t})=>{
  const notice=privacy[locale];
  const body=privacySections.map(id=>{
   const [title,...paragraphs]=notice.sections[id];
   const links=id==='rights'?`<p><a href="mailto:${privacyContact}">${privacyContact}</a></p><p><a href="${supervisoryAuthorityUrl}">${e(notice.complaint)}</a></p>`:'';
   const providerLinks = id==='international-transfers'
    ? `<ul>${providerPrivacyLinks.map(([name,url])=>`<li><a href="${url}">${name}</a></li>`).join('')}</ul>` : '';
   return `<section class="prose-section privacy-section" id="${id}"><h2>${e(title)}</h2>${paragraphs.map(text=>`<p>${e(text)}</p>`).join('')}${links}${providerLinks}</section>`;
  }).join('');
  return service(t,'privacy.title','privacy.description',body);
 }
};
