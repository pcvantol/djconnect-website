import {catalog,languages,keys} from '../src/locales/catalog.mjs';
for(const l of languages){const values=catalog[l];if(JSON.stringify(Object.keys(values))!==JSON.stringify(keys))throw Error('Key parity '+l);for(const k of keys)if(typeof values[k]!=='string'||!values[k].trim())throw Error('Missing '+l+':'+k);}
if(catalog.en['hero.title']!=='Your music. Your DJ.')throw Error('Canonical tagline');
console.log(`i18n PASS: ${languages.length} locales × ${keys.length} stable keys`);
