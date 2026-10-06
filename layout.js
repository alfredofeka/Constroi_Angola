// layout.js — ecrã limpo: janelas aparecem, desaparecem sozinhas, arrastam-se (e lembram a posição); menu ☰; palpites quando o jogador está parado
const UIX={timers:{},grp:['mission','guide'],idle:0,sig:'',lastHint:0,t0:0,newStep:'',pos:{},
 show(id,ms,pin){const el=$(id);if(!el)return;if(UIX.grp.includes(id))for(const o of UIX.grp)if(o!==id)UIX.hide(o,true);
  clearTimeout(UIX.timers[id]);el.classList.remove('fade');el.style.display='block';el._ms=pin?0:ms;
  if(id==='mission'&&MS.def){MS.hudT=0;MS.hud()}
  if(!pin&&ms)UIX.timers[id]=setTimeout(()=>UIX.hide(id),ms)},
 hide(id,now){const el=$(id);if(!el||el.style.display==='none'||el.style.display==='')return;clearTimeout(UIX.timers[id]);
  if(now){el.style.display='none';el.classList.remove('fade');return}el.classList.add('fade');UIX.timers[id]=setTimeout(()=>{el.style.display='none';el.classList.remove('fade')},400)},
 pin(id){UIX.show(id,0,true)},
 menu(){const m=$('menu');if(m.style.display==='block')UIX.hide('menu',true);else{for(const o of UIX.grp)UIX.hide(o,true);UIX.show('menu',0,true)}},
 touch(el){const id=el.id;if(id==='toast'){clearTimeout(toastT);toastT=setTimeout(()=>el.style.display='none',7000);return}if(UIX.timers[id]&&el._ms){clearTimeout(UIX.timers[id]);UIX.timers[id]=setTimeout(()=>UIX.hide(id),el._ms+5000)}},
 save(id,x,y){UIX.pos[id]=[x,y];try{localStorage.setItem('lv8pos',JSON.stringify(UIX.pos))}catch(e){}},
 place(el){const p=UIX.pos[el.id];if(!p)return;const w=el.offsetWidth||200,h=el.offsetHeight||60;el.style.left=clamp(p[0],0,Math.max(0,innerWidth-w))+'px';el.style.top=clamp(p[1],0,Math.max(0,innerHeight-h))+'px';el.style.right=el.style.bottom='auto';el.style.transform='none'},
 drag(id){const el=$(id);if(!el)return;let st=null;const grip=el.querySelector('.grip');
  el.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,select,textarea,.xx'))return;if(grip&&!e.target.closest('.grip'))return;const r=el.getBoundingClientRect();st={x:e.clientX,y:e.clientY,l:r.left,t:r.top,m:0,on:false,id:e.pointerId};UIX.touch(el)});
  addEventListener('pointermove',e=>{if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;st.m=Math.max(st.m,Math.abs(dx)+Math.abs(dy));if(st.m<7)return;
   if(!st.on){st.on=true;el.style.left=st.l+'px';el.style.top=st.t+'px';el.style.right=el.style.bottom='auto';el.style.transform='none';el.classList.add('dragging')}
   el.style.left=clamp(st.l+dx,0,innerWidth-el.offsetWidth)+'px';el.style.top=clamp(st.t+dy,0,innerHeight-el.offsetHeight)+'px';UIX.touch(el)});
  const up=e=>{if(!st||e.pointerId!==st.id)return;if(st.on){UIX.save(id,parseFloat(el.style.left),parseFloat(el.style.top));el._dragged=true;setTimeout(()=>el._dragged=false,60);el.classList.remove('dragging')}st=null};
  addEventListener('pointerup',up);addEventListener('pointercancel',up);
  el.addEventListener('click',e=>{if(el._dragged){e.stopPropagation();e.preventDefault()}},true);
  if(typeof MutationObserver!=='undefined')new MutationObserver(()=>{const vis=el.style.display!=='none'&&el.style.display!=='';if(vis&&!el._vis){el._vis=true;UIX.place(el)}else if(!vis)el._vis=false}).observe(el,{attributes:true,attributeFilter:['style']})},
 intro(){UIX.t0=Date.now();UIX.idle=0;UIX.lastHint=Date.now();UIX.show('mission',9000);setTimeout(()=>{if(GUIDE.active&&!MS.open&&$('menu').style.display!=='block'&&$('mission').style.display!=='block')UIX.show('guide',9000)},9800)},
 tick(dt){if(!player||!MS.def||MS.done||MS.paused||MS.open)return;
  const sig=GUIDE.sid+'|'+MS.ev+'|'+Object.keys(MS.cnt).reduce((a,k)=>a+MS.cnt[k],0);
  if(sig!==UIX.sig){UIX.sig=sig;UIX.idle=0}else UIX.idle+=dt;
  if(UIX.newStep!==GUIDE.sid){UIX.newStep=GUIDE.sid;if(Date.now()-UIX.t0>20000&&$('menu').style.display!=='block')UIX.show('guide',9000)}
  if(UIX.idle>=45&&Date.now()-UIX.lastHint>60000&&$('menu').style.display!=='block'&&$('pn').style.display!=='block'){UIX.lastHint=Date.now();UIX.show('guide',14000)}},
 init(){for(const id of['mission','guide','menu','pn','map','houseUI','toast','life','timer'])UIX.drag(id);
  try{UIX.pos=JSON.parse(localStorage.getItem('lv8pos')||'{}')}catch(e){}
  $('menu').addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.classList.contains('keep'))setTimeout(()=>UIX.hide('menu',true),30)});
  $('timer').addEventListener('click',()=>{const m=$('mission');if(m.style.display==='block')UIX.hide('mission');else UIX.show('mission',10000)});
  $('life').addEventListener('click',()=>UIX.menu())},
 reset(){UIX.pos={};try{localStorage.removeItem('lv8pos')}catch(e){}for(const id of['mission','guide','menu','pn','map','houseUI','toast','life','timer']){const el=$(id);if(el){el.style.left=el.style.top=el.style.right=el.style.bottom=el.style.transform=''}}toast('Janelas repostas ao sítio original')}};
UIX.init();
