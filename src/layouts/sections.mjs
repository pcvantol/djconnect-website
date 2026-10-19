import {escape as e,Button,Picture,MoodPreview,DJMomentPreview,VibeCastPreview} from '../components/ui.mjs';
import {route} from '../pages/registry.mjs';
const copy=(t,label,title,description,action='')=>`<div class="section-copy"><p class="eyebrow">${e(t[label])}</p><h2>${e(t[title])}</h2><p class="lead">${e(t[description])}</p>${action}</div>`;
export const HeroSection = ({t,locale}) => `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">DJCONNECT</p><h1 id="hero-title">${e(t['hero.title']).replace('. ','.<br> ')}</h1><p class="lead">${e(t['hero.description'])}</p>${Button(t['cta.start'],route(locale,'start'))}</div><div class="hero-art">${Picture('hero',t['alt.hero'],true)}<span class="hero-caption glass"><span class="live-dot" aria-hidden="true"></span>${e(t['hero.caption'])}</span></div><a class="scroll-cue" href="#vibe" aria-label="${e(t['vibe.label'])}"><span aria-hidden="true">↓</span></a></section>`;
export const MediaTextSection = (id,content,visual,reverse=false) => `<section id="${id}" class="experience ${reverse?'experience-reverse':''}">${content}<div class="section-visual">${visual}</div></section>`;
export const VibeSection=({t})=>MediaTextSection('vibe',copy(t,'vibe.label','vibe.title','vibe.description'),MoodPreview(t));
export const MomentSection=({t})=>MediaTextSection('moment',copy(t,'moment.label','moment.title','moment.description'),DJMomentPreview(t),true);
export const VibeCastSection=({t})=>MediaTextSection('vibecast',copy(t,'cast.label','cast.title','cast.description',Button(t['cta.cast'],'https://vibecast.tv',true)),VibeCastPreview(t));
const paragraph=(title,text)=>`<section class="prose-section"><h2>${e(title)}</h2><p>${e(text)}</p></section>`;
const service=(t,title,description,body)=>`<article class="service-page"><p class="eyebrow">DJCONNECT</p><h1>${e(t[title])}</h1><p class="lead">${e(t[description])}</p>${body}</article>`;
export const sections={
 hero:HeroSection,vibe:VibeSection,moment:MomentSection,cast:VibeCastSection,
 onboarding:({t})=>service(t,'start.title','start.description',paragraph(t['start.step1'],t['start.requirements'])+Button(t['start.install'],'/go/hacs',true)+paragraph(t['start.step2'],t['start.wizard'])+paragraph(t['start.distribution'],t['start.availability'])+Button(t['support.email'],'mailto:support@djconnect.dev')),
 support:({t})=>service(t,'support.title','support.description',Button(t['support.email'],'mailto:support@djconnect.dev')),
 privacy:({t})=>service(t,'privacy.title','privacy.website',paragraph(t['privacy.dataTitle'],t['privacy.data'])+paragraph(t['privacy.personalTitle'],t['privacy.personal'])+paragraph(t['privacy.notificationsTitle'],t['privacy.notifications'])+paragraph(t['privacy.contactTitle'],t['privacy.contact'])+Button(t['support.email'],'mailto:support@djconnect.dev'))
};
