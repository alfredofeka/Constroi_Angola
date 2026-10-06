// input.js — teclado, rato (pointer lock), toque (olhar + joystick), roda (zoom)
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();K[k]=true;if(k.startsWith('arrow')||k===' ')e.preventDefault();if(e.repeat||!player)return;
 if(k==='e')doAction();else if(k==='q')uturn();else if(k===' '){if(!pCar)jump()}else if(k==='x')actDown();else if(k==='c')cycleCam();else if(k==='h'&&pCar)horn();else if(k==='n')toggleMap();
 else if(k==='escape'){if(MapUI.open)toggleMap(false);else if(buildMode)exitBuild();closePn()}
 else if(k==='f'&&inHouse){const u=$('houseUI');u.style.display=u.style.display==='block'?'none':'block';if(document.exitPointerLock)document.exitPointerLock()}
 else if(k==='b')openBuildMenu();else if(k==='m')actionMarket();else if(k==='j')actionWork();else if(k==='p')openProfile()});
addEventListener('keyup',e=>{K[e.key.toLowerCase()]=false});addEventListener('blur',()=>{for(const k in K)K[k]=false});
const cv=$('c'),drag=new Map();let canLock=!!cv.requestPointerLock&&!matchMedia('(pointer:coarse)').matches,moved=0;
function look(dx,dy){pl.yaw-=dx;pl.pitch=clamp(pl.pitch-dy,-1.5,1.5);lastLook=Date.now()}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);drag.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0});
cv.addEventListener('pointermove',e=>{let dx,dy,s=.0022;if(document.pointerLockElement===cv){dx=e.movementX;dy=e.movementY}else if(drag.has(e.pointerId)){const p=drag.get(e.pointerId);dx=e.clientX-p.x;dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;s=e.pointerType==='touch'?.005:.0035}else return;moved+=Math.abs(dx)+Math.abs(dy);if(player)look(dx*s,dy*s)});
cv.addEventListener('pointerup',e=>{drag.delete(e.pointerId);if(moved>6||!player)return;const locked=document.pointerLockElement===cv;
 if(buildMode&&(locked||e.pointerType==='touch'||!canLock)){place();return}
 if(!locked&&canLock&&e.pointerType==='mouse'){try{cv.requestPointerLock()}catch(x){}}});
cv.addEventListener('pointercancel',e=>drag.delete(e.pointerId));cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('wheel',e=>{e.preventDefault();pl.fov=clamp(pl.fov+e.deltaY*.03,35,95)},{passive:false});
// roda de controlo: bola = frente · ◀ ▶ = lados · ▲ saltar/buzina · ▼ sentar/dormir/travar
const wheel={f:0,l:0,r:0,u:0,d:0};
wheel.run=false;
function wset(){joy.x=wheel.r-wheel.l;joy.y=wheel.f-wheel.d}
function uturn(){if(!player)return;if(pCar)pl.turn=(Math.abs(pl.yaw)>1.5?0:Math.PI)-pl.yaw;else pl.turn=(pl.turn||0)+Math.PI}
for(const[id,k]of[['wF','f'],['wL','l'],['wR','r'],['wU','u'],['wD','d']]){const b=$(id);
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);wheel[k]=1;b.classList.add('on');if(k==='u')actUp()});
 for(const ev of['pointerup','pointercancel'])b.addEventListener(ev,()=>{wheel[k]=0;b.classList.remove('on')})}
let wlab='';function wheelLabels(){const s=pCar?'car':(inHouse&&nearT&&nearT.t==='bed')?'bed':'foot';if(s===wlab)return;wlab=s;
 $('wU').innerHTML=`▲<small>${pCar?'Buzina':'Saltar'}</small>`;$('wD').innerHTML=`▼<small>${pCar?'Travar':'Trás'}</small>`;$('wSit').innerHTML=`🪑<small>${s==='bed'?'Dormir':'Sentar'}</small>`;$('wSit').style.display=pCar?'none':'';$('wRun').style.display=pCar?'none':''}
$('bE').addEventListener('pointerdown',e=>{e.preventDefault();doAction()});$('bC').addEventListener('pointerdown',e=>{e.preventDefault();cycleCam()});
// botões pequenos: correr (liga/desliga), virar 180°, sentar/dormir
$('wRun').addEventListener('pointerdown',e=>{e.preventDefault();wheel.run=!wheel.run;$('wRun').classList.toggle('on',wheel.run);toast(wheel.run?'🏃 A correr (carrega outra vez para andar)':'🚶 A andar')});
$('wTurn').addEventListener('pointerdown',e=>{e.preventDefault();uturn()});
$('wSit').addEventListener('pointerdown',e=>{e.preventDefault();sitOrSleep()});
