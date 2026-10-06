// interact.js — o que está perto de ti e o que o [E] faz
function scanNear(){nearT=null;let txt='';
 if(inHouse){let b=null,bd=2.3;for(const o of HITEMS){const d=Math.hypot(pl.x-(RX+o[1]),pl.z-(RZ+o[2]));if(d<bd){bd=d;b=o}}if(b){nearT={t:b[0]};txt=b[3]}}
 else if(pCar){nearT={t:'exitcar'};txt='[E] Sair do carro'}
 else{let bd=4;if(aim&&Math.hypot(aim.x-pl.x,aim.z-pl.z)<4.5){nearT={t:'npc',o:aim};txt='[E] Falar com '+aim.name;bd=0}
  if(!nearT){for(const c of cars){const d=Math.hypot(c.x-pl.x,c.z-pl.z);if(d<5&&d<bd+1){bd=d-1;nearT={t:'car',o:c};txt='[E] Conduzir '+c.model}}
   for(const h of houses){const d=Math.hypot(h.x-pl.x,h.z-pl.z);if(d<4.8&&d<bd+1){bd=d-1;nearT={t:'house',o:h};txt='[E] Entrar em '+(h.mine?'tua casa':'casa '+h.fam)}}}}
 const e=$('interact');e.style.display=txt&&!buildMode?'block':'none';e.textContent=txt}
function doAction(){if(!player)return;if(buildMode){place();return}if(!nearT)return;const n=nearT,o=n.o;
 if(n.t==='npc'){MS.hook('talk');toast(`${o.name} (${o.age} anos, ${o.job}): “${rnd(LINES)}”`);logLife('Falaste com '+o.name)}
 else if(n.t==='car')enterCar(o);else if(n.t==='house')enterHouse(o);else if(n.t==='exitcar')exitCar();else if(n.t==='door')exitHouse();
 else if(n.t==='bed')houseSleep();else if(n.t==='eat')houseEat();else if(n.t==='safe')houseSave();else if(n.t==='paint')housePaint();
 updateLifeUI()}
const fv=new THREE.Vector3(),hv=new THREE.Vector3();
function findAim(){aim=null;let bd=99;cam.getWorldDirection(fv);for(const n of npcs){if(n.far)continue;hv.set(n.x-cam.position.x,1.6-cam.position.y,n.z-cam.position.z);const d=hv.length();if(d>12||d<.3)continue;hv.divideScalar(d);if(fv.dot(hv)>Math.cos(.07+.4/d)&&d<bd){bd=d;aim=n}}
 const t=$('tag');if(aim){t.style.display='block';t.innerHTML=`<b>${aim.name}</b><br>${aim.age} anos · ${aim.job}`}else t.style.display='none'}
