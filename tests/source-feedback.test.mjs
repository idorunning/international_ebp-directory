import test from 'node:test';import assert from 'node:assert/strict';
import {FEEDBACK_FIELDS,FEEDBACK_PURPOSES,feedbackCopy,normaliseFeedback,feedbackMatches,feedbackCard,feedbackSummary,feedbackForm} from '../public/source-feedback.js';
import {COPY} from '../public/i18n.js';
test('every feedback question and message is translated',()=>{
 for(const lang of ['en','fr','es']){const copy=feedbackCopy(lang);assert.deepEqual(Object.keys(copy).sort(),Object.keys(feedbackCopy()).sort());for(const field of Object.keys(FEEDBACK_FIELDS))assert.ok(copy[field+'Question']);for(const choices of Object.values(FEEDBACK_FIELDS))for(const choice of choices)assert.ok(copy[choice]);for(const purpose of FEEDBACK_PURPOSES)assert.ok(copy[purpose]);assert.ok(COPY[lang].readerFeedback&&COPY[lang].feedbackPrivacy);}
});
test('canonical answers compare without revisions, duplicate purposes or surrounding note whitespace',()=>{
 const value=normaliseFeedback({usefulness:'very',clarity:'invalid',purposes:['research','policy','research','invalid'],note:' x ',revision:'one'});assert.deepEqual(value,{usefulness:'very',clarity:null,traceability:null,purposes:['policy','research'],note:'x',revision:'one'});
 assert.ok(feedbackMatches(value,{usefulness:'very',purposes:['research','policy'],note:'x',revision:'two'}));assert.equal(feedbackMatches(value,{usefulness:'limited'}),false);
});
test('bars use a separate assessed denominator per question and keep unavailable and omitted answers separate',()=>{
 const html=feedbackSummary({contributors:4,dimensions:{usefulness:{answered:2,unassessed:1,omitted:1,responses:{very:1,somewhat:1}},clarity:{answered:1,unassessed:2,omitted:1,responses:{clear:1}},traceability:{answered:0,unassessed:3,omitted:1}},purposes:{research:2}});
 assert.equal((html.match(/max="2"/g)||[]).length,3);assert.equal((html.match(/max="1"/g)||[]).length,3);assert.equal((html.match(/<meter/g)||[]).length,6);assert.match(html,/3 unable to assess \/ not applicable · 1 unanswered/);assert.match(html,/4 contributors/);assert.match(html,/Research<span>2<\/span>/);assert.doesNotMatch(html,/star|out of 5|style=/i);
});
test('guest, representative, unavailable and editable forms communicate access and private optional notes',()=>{
 assert.match(feedbackForm(null),/Sign in to contribute/);assert.doesNotMatch(feedbackForm(null),/<form/);assert.match(feedbackForm(null,'en',{can:true,managed:true}),/cannot assess/);assert.doesNotMatch(feedbackForm(null,'en',{can:true,ready:false}),/<form/);
 const html=feedbackForm({usefulness:'unable',clarity:'clear',traceability:'na',purposes:['teaching'],note:'<script>private</script>',revision:'current',updatedAt:'2026-10-20T00:00:00Z'},'en',{can:true});assert.equal((html.match(/<select/g)||[]).length,3);assert.equal((html.match(/name="purposes"/g)||[]).length,5);assert.match(html,/data-revision="current"/);assert.match(html,/<option value="unable" selected/);assert.match(html,/remove-feedback/);assert.match(html,/&lt;script&gt;private/);assert.doesNotMatch(html,/<script>|minlength=|\brequired\b|data-rate/);assert.match(html,/Notes are private/);assert.match(feedbackCard('source',{contributors:1}),/1 contributor<\/span>/);
});
