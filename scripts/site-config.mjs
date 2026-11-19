import {readFile} from 'node:fs/promises';
export const sourceDir='wwwroot';export const releaseOutputDir='dist/wwwroot';
export const supportedLanguages=['en','nl','de','fr','es'];export const defaultLanguage='nl';
export const publicPages=['index','start','privacy','support'];
export const sharedReleaseAssets=['assets/tokens.css','assets/site.css','assets/site.js'];
export const readSiteVersion=async()=>(await readFile('VERSION','utf8')).trim();
