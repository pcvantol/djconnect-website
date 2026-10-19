// New routes compose shared sections; no page or locale-specific HTML files.
export const pages = {
 home: {slug:'',title:'seo.title',description:'hero.description',sections:['hero','vibe','moment','cast']},
 start: {slug:'start',title:'start.title',description:'start.description',sections:['onboarding']},
 privacy: {slug:'privacy',title:'privacy.title',description:'privacy.website',sections:['privacy']},
 support: {slug:'support',title:'support.title',description:'support.description',sections:['support']}
};
export const route = (locale, slug='') => `${locale==='nl'?'':`/${locale}`}/${slug}`;
