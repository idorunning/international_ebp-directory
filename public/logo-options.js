import { BRAND_OPTIONS, logoMarkup } from './brand.js';

if (new URLSearchParams(window.location.search).get('view') === 'compare') {
  document.body.classList.add('compare-mode');
  document.querySelector('#review-title').textContent = 'Choose the ID-EBP identity.';
  document.querySelector('.review-intro > p:not(.eyebrow)').textContent = 'Four directions. One consistent palette. Choose A, B, C or D.';
  const viewSwitch = document.querySelector('.view-switch');
  viewSwitch.href = '/logo-options.html';
  viewSwitch.textContent = 'View detailed examples ↗';
  document.title = 'ID-EBP — Compare four logo options';
}

document.querySelector('#options').innerHTML = BRAND_OPTIONS.map(option => `<article class="option-card" id="option-${option.id}" aria-labelledby="title-${option.id}"><header><span class="option-letter">${option.id.toUpperCase()}</span><div><h2 id="title-${option.id}">${option.name}</h2><p>${option.detail}</p></div>${option.recommended ? '<span class="recommended">Suggested direction</span>' : ''}</header><div class="main-specimen">${logoMarkup(option.id)}</div><div class="specimen-caption"><span>Primary identity</span><span>Navy + teal</span></div><div class="small-specimen"><span class="sample-label">At header size</span><div class="mini-header">${logoMarkup(option.id, { descriptor: false })}<span class="mini-nav">Explore <span aria-hidden="true">·</span> About</span></div></div><div class="alternative-specimens"><div class="mono"><span class="sample-label">One colour</span>${logoMarkup(option.id, { descriptor: false })}</div><div class="reverse"><span class="sample-label">Reversed</span>${logoMarkup(option.id, { descriptor: false })}</div></div><div class="downloads"><a href="/assets/brand/id-ebp-${option.id}.svg" download>Download ${option.id.toUpperCase()} <span>SVG</span></a><a href="/assets/brand/id-ebp-${option.id}-mono.svg" download>One colour <span>SVG</span></a></div></article>`).join('');
