import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SOURCE_TRANSLATIONS,SOURCE_TRANSLATION_COPY,localiseSource,sourceTranslationSearchText} from '../public/source-translations.js';
import {LANGUAGES,LANGUAGE_CODES} from '../public/taxonomy.js';
import {LABELS} from '../public/i18n.js';

const sources=JSON.parse(await readFile(new URL('../research/catalogue.json',import.meta.url),'utf8'));
const initialSources=sources.filter(source=>Object.hasOwn(SOURCE_TRANSLATIONS,source.id));

test('all configured and published source languages have canonical codes and translated labels',()=>{
 const languages=new Set([...LANGUAGES,...sources.flatMap(source=>source.languages)]);
 for(const language of languages){
  assert.match(LANGUAGE_CODES[language],/^[a-z]{2,3}$/);
  for(const locale of ['fr','es']){
   assert.equal(typeof LABELS[locale][language],'string',`${locale}: ${language}`);
   assert.notEqual(LABELS[locale][language],language,`${locale}: ${language}`);
  }
 }
 assert.equal(LABELS.fr.English,'Anglais');
 assert.equal(LABELS.es.English,'Inglés');
 assert.equal(LABELS.fr['Mandarin Chinese'],new Intl.DisplayNames(['fr'],{type:'language'}).of('zh'));
});

test('every catalogue profile has French and Spanish editorial descriptions and supporting notes',()=>{
 assert.equal(initialSources.length,Object.keys(SOURCE_TRANSLATIONS).length);
 for(const source of sources)for(const language of ['fr','es']){
  const view=localiseSource(source,language);
  assert.equal(view.translation.available,true,`${source.id} ${language}`);
  assert.notEqual(view.about,source.about,`${source.id} ${language} description`);
  assert.equal(view.descriptionLanguage,language);
  assert.deepEqual(view.translation.untranslatedFields,[],`${source.id} ${language} supporting notes`);
 }
});

test('international addition metadata keeps Taiwan access restrictions visible in both translations',()=>{
 const source=sources.find(s=>s.id==='taiwan-cpu-publications');
 assert(source);
 const french=localiseSource(source,'fr');
 const spanish=localiseSource(source,'es');
 assert.match(french.accessNotes,/réservées aux personnels et étudiants/);
 assert.match(spanish.accessNotes,/restringidos al personal y alumnado/);
 assert.match(french.accessNotes,/l’accès au texte intégral varie/);
 assert.match(spanish.accessNotes,/el acceso al texto completo varía/);
 assert.match(french.checkNotes,/Aucune vérification/);
 assert.match(spanish.checkNotes,/No se presume verificación/);
 assert.equal(source.access,'Mixed');
 assert.match(source.accessNotes,/explicitly restricted/);
});

test('profile translation preserves source identity, research languages, links and canonical records',()=>{
 const source=initialSources.find(s=>s.id==='portsmouth-policing');
 const original=structuredClone(source);
 const view=localiseSource(source,'fr-FR');
 assert.equal(view.originalName,source.name);
 assert.equal(view.owner,source.owner);
 assert.equal(view.url,source.url);
 assert.deepEqual(view.languages,source.languages);
 assert.deepEqual(view.publicationLinks.map(p=>[p.title,p.url]),source.publicationLinks.map(p=>[p.title,p.url]));
 assert.equal(view.publicationLinks[0].detail,'Article scientifique · 2022 (en ligne en 2021)');
 assert.deepEqual(source,original);
 assert.match(SOURCE_TRANSLATION_COPY.fr.researchUnchanged,/pas les recherches/);
});

test('profile translation uses originals for unsupported languages and invalidates stale editorial translations',()=>{
 const source=initialSources[0];
 const fallback=localiseSource(source,'de-DE');
 assert.equal(fallback.about,source.about);
 assert.equal(fallback.translation.language,'en');
 assert.equal(fallback.translation.available,false);
 const edited=localiseSource({...source,about:'An updated representative-written source description.'},'es');
 assert.equal(edited.about,'An updated representative-written source description.');
 assert.equal(edited.translation.available,false);
 assert.match(edited.translation.note,/pendiente/);
});

test('new sources may bring their own profile translations without changing the shared catalogue map',()=>{
 const source={...initialSources[0],id:'new-source',translations:{en:{about:initialSources[0].about},fr:{about:'Une nouvelle source de recherche.',accessNotes:'Accès gratuit.'}},accessNotes:'Free access.'};
 const view=localiseSource(source,'fr');
 assert.equal(view.about,'Une nouvelle source de recherche.');
 assert.equal(view.accessNotes,'Accès gratuit.');
 assert.equal(view.translation.available,true);
 const text=sourceTranslationSearchText(source);
 assert.match(text,/nouvelle source de recherche/);
 assert(!text.includes('An updated representative-written'));
 const edited=localiseSource({...source,about:'Changed by the source representative.'},'fr');
 assert.equal(edited.translation.available,false);
 assert.equal(edited.about,'Changed by the source representative.');
});
