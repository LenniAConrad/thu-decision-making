/* Teaching-material inventory. Source files remain in the student's Learn folder. */
(()=>{
 const root=document.getElementById('materials-root');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=s=>String(s).normalize('NFKC').toLocaleLowerCase().replace(/\b(?:assignment|homework|hw)\s*(\d+)/g,'assignment $1');
 const groups=[...new Set(CourseMaterials.items.map(m=>m.group))];
 root.innerHTML=`<header class="reader-heading"><p class="eyebrow">Introduction to Decision Making</p><h1>Course materials</h1><p>Read the lectures, follow the solver tutorial, and work through all five problem sets.</p><p class="materials-updated">Updated ${esc(CourseMaterials.updated)} · ${CourseMaterials.items.length} teaching materials</p></header><div class="lecture-search"><label for="material-search">Find a material or assignment</label><input id="material-search" type="search" placeholder="Try Chapter 3, COPT, Homework 5…" autocomplete="off"><p data-material-count role="status"></p></div><div data-materials></div><p class="materials-note">The readings include source references and distinguish official answer keys from worked solutions derived for this study companion.</p>`;
 const input=root.querySelector('input'),list=root.querySelector('[data-materials]');
 function render(){
  const terms=normalize(input.value).trim().split(/\s+/).filter(Boolean);
  const items=CourseMaterials.items.filter(m=>terms.every(t=>normalize([m.title,m.description,...m.files].join(' ')).includes(t)));
  list.innerHTML=groups.map(group=>{const entries=items.filter(m=>m.group===group);return entries.length?`<section class="materials-group"><h2>${esc(group)}</h2><div class="materials-grid">${entries.map(m=>`<article class="material-card"><p class="eyebrow">${esc(m.label)}</p><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><ul class="material-links">${m.links.map(l=>`<li><a href="${esc(l.href)}">${esc(l.title)} →</a></li>`).join('')}</ul><details><summary>Source material${m.files.length>1?'s':''}</summary><ul>${m.files.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></details></article>`).join('')}</div></section>`:'';}).join('');
  root.querySelector('[data-material-count]').textContent=terms.length?`${items.length} matching material${items.length===1?'':'s'}`:'';
 }
 input.oninput=render;render();
})();
