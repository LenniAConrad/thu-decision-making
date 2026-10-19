/* Shared navigation, matching the Intro to AI and EEE study readers. */
(()=>{
 const isReader=location.pathname.endsWith('lectures.html'),header=document.createElement('header');header.className='course-header';
 header.innerHTML=`<a class="course-brand" href="index.html"><span class="course-mark">DM</span><span><strong>Decision Making</strong><small>HAI JIANG · TSINGHUA</small></span></a><button class="course-menu" type="button" aria-expanded="false" aria-controls="course-navigation">Menu</button><nav id="course-navigation" aria-label="Course"><a href="index.html" ${!isReader?'aria-current="page"':''}>Home</a><a href="lectures.html" ${isReader?'aria-current="page"':''}>Lectures</a></nav>`;
 document.body.prepend(header);
 const main=document.querySelector('main');main.tabIndex=-1;const skip=document.createElement('a');skip.className='course-skip';skip.href='#main-content';skip.textContent='Skip to content';skip.onclick=e=>{e.preventDefault();main.focus();main.scrollIntoView();};document.body.prepend(skip);
 const button=header.querySelector('button'),nav=header.querySelector('nav');button.onclick=()=>button.setAttribute('aria-expanded',String(nav.classList.toggle('open')));
 function close(){nav.classList.remove('open');button.setAttribute('aria-expanded','false');}
 window.addEventListener('hashchange',close);header.addEventListener('keydown',e=>{if(e.key==='Escape'){close();button.focus();}});
 const footer=document.createElement('footer');footer.className='course-footer';footer.innerHTML='<span>Student-built study companion · based on Prof. Hai Jiang’s course lectures.</span><a href="https://github.com/LenniAConrad/thu-decision-making">Source on GitHub ↗</a>';document.body.append(footer);
})();
