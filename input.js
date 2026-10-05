// input.js — teclado, rato (pointer lock), toque (olhar + joystick), roda (zoom)
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();K[k]=true;if(k.startsWith('arrow')||k===' ')e.preventDefault();if(e.repeat||!player)return;
 if(k==='e')doAction();else if(k==='c')cycleCam();else if(k==='h'&&pCar)horn();else if(k==='n')toggleMap();
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
const jEl=$('joy'),kn=$('knob');let jd=0;
function jm(e){const r=jEl.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2),l=Math.hypot(dx,dy),k=l>1?1/l:1;joy.x=dx*k;joy.y=-dy*k;kn.style.transform=`translate(${dx*k*33}px,${dy*k*33}px)`}
jEl.addEventListener('pointerdown',e=>{jd=1;jEl.setPointerCapture(e.pointerId);jm(e)});jEl.addEventListener('pointermove',e=>{if(jd)jm(e)});
for(const ev of['pointerup','pointercancel'])jEl.addEventListener(ev,()=>{jd=0;joy.x=joy.y=0;kn.style.transform=''});
$('bE').addEventListener('pointerdown',e=>{e.preventDefault();doAction()});$('bC').addEventListener('pointerdown',e=>{e.preventDefault();cycleCam()});
