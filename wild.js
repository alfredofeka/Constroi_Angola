// wild.js — fora das cidades: savana, floresta, deserto e zona jurássica; árvores sólidas, animais perigosos, vida do jogador
const WC=40,wcache=new Map(),bigCols=[],animals=[];
const AN={
 leao:{n:'Leão',hp:150,dmg:18,sp:8.5,aggro:42,cdA:1.6,r:1.1,w:[.9,1.0,1.9],col:'#c9a050',reward:60000,lic:1},
 elefante:{n:'Elefante',hp:500,dmg:32,sp:6,aggro:14,cdA:2,r:2.2,w:[2.4,2.7,4.2],col:'#7b7d80',reward:150000,lic:1,charge:1},
 pacaca:{n:'Pacaça',hp:220,dmg:22,sp:7.2,aggro:20,cdA:1.6,r:1.3,w:[1.1,1.4,2.2],col:'#3a2a22',reward:45000,charge:1},
 palanca:{n:'Palanca (antílope)',hp:70,dmg:0,sp:10,aggro:0,r:.8,w:[.6,1.3,1.6],col:'#4a3524',reward:25000,flee:1},
 trex:{n:'T-Rex',hp:1200,dmg:48,sp:8.5,aggro:55,cdA:2,r:3.2,w:[2.6,3.6,8],col:'#4f6b3a',reward:400000,big:1},
 raptor:{n:'Velociraptor',hp:90,dmg:9,sp:10,aggro:45,cdA:1.4,r:1,w:[.5,1.1,1.9],col:'#5b7a3a',reward:40000},
 tricera:{n:'Triceratops',hp:600,dmg:34,sp:6,aggro:20,cdA:2,r:2.4,w:[2.2,2.2,5],col:'#6f7f4a',reward:150000,charge:1}};
const REG={savana:{n:'Savana',dn:.9,tc:'#7d8f3c',sp:{palanca:.35,pacaca:.25,elefante:.18,leao:.22}},floresta:{n:'Floresta',dn:2.2,tc:'#2f7f46',sp:{elefante:.3,pacaca:.3,palanca:.25,leao:.15}},deserto:{n:'Deserto',dn:.3,tc:'#a39c5a',sp:{palanca:.7,leao:.3}},jurassic:{n:'Zona Jurássica 🦖',dn:1.2,tc:'#3a7a3a',sp:{raptor:.45,trex:.15,tricera:.25,pacaca:.15}},city:{n:'Cidade',dn:0,tc:'#000',sp:{}}};
function cityDist(x,z){let d=1e9;for(const c of CITIES){const e=Math.hypot(x-(c.cx+.5)*T,z-(c.cy+.5)*T)-Math.max(c.rx,c.ry)*T;if(e<d)d=e}return d}
function regionAt(x,z){if(inKilXZ(x,z)||cityDist(x,z)<260)return'city';const gx=x/CELL,gz=z/CELL,n=WW;if(gx>n*.74&&gz>n*.3&&gz<n*.66)return'jurassic';if(gz>n*.78)return'deserto';if(gz<n*.5&&gx<n*.45)return'floresta';return'savana'}
function wcell(ix,iz){const k=ix+','+iz;let v=wcache.get(k);if(v)return v;v=[];const cx=(ix+.5)*WC,cz=(iz+.5)*WC;
 if(landXZ(cx,cz)){const rg=regionAt(cx,cz),dn=REG[rg].dn;let h=(ix*73856093)^(iz*19349663)^0x5bd1e995;const r=()=>{h=(Math.imul(h,1664525)+1013904223)|0;return((h>>>8)&0xffff)/65535},n=Math.floor(dn*r()*3);
  for(let i=0;i<n;i++){const x=(ix+r())*WC,z=(iz+r())*WC,tx=Math.floor(x/T),tz=Math.floor(z/T);if(!landXZ(x,z)||roadSet.has(tx+','+tz)||roadSet.has((tx+1)+','+tz)||roadSet.has((tx-1)+','+tz)||roadSet.has(tx+','+(tz+1))||roadSet.has(tx+','+(tz-1)))continue;v.push({x,z,k:r()<.06?1:0,s:.8+r()*.5,rg})}}
 wcache.set(k,v);if(wcache.size>3000)wcache.clear();return v}
function hitsWild(x,z,r){const ix=Math.floor(x/WC),iz=Math.floor(z/WC);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(const t of wcell(ix+i,iz+j))if(Math.hypot(x-t.x,z-t.z)<(t.k?1.2:.4)*t.s+r)return true;
 for(const b of bigCols)if(Math.hypot(x-b.x,z-b.z)<b.r+r)return true;return false}
let wT,wCn,wDet,wLast=[-1e9,-1e9],wReg='city';
function initWild(){wT=mkInst(gPole,1700);wCn=mkInst(gS,1700);const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,128,128);for(let i=0;i<500;i++){g.fillStyle=`rgba(${60+Math.random()*80|0},${50+Math.random()*60|0},30,.35)`;g.fillRect(Math.random()*128,Math.random()*128,2+Math.random()*3,2+Math.random()*3)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(70,70);wDet=new THREE.Mesh(gP,new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.5,color:0xc8b070,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,depthWrite:false}));wDet.rotation.x=-Math.PI/2;wDet.scale.set(560,560,1);wDet.position.y=.012;scene.add(wDet)}
function wildRebuild(){wT.count=0;wCn.count=0;const ix=Math.floor(pl.x/WC),iz=Math.floor(pl.z/WC);
 for(let i=-7;i<=7;i++)for(let j=-7;j<=7;j++)for(const t of wcell(ix+i,iz+j)){if(wT.count>=1690)return;const c=REG[t.rg].tc;
  if(t.k){addInst(wT,t.x,0,t.z,1.6*t.s,7*t.s,1.6*t.s,'#7a6a55');addInst(wCn,t.x,8*t.s,t.z,5*t.s,3*t.s,5*t.s,c)}else{addInst(wT,t.x,0,t.z,.35*t.s,3.4*t.s,.35*t.s,'#6b4a2b');addInst(wCn,t.x,3.6*t.s,t.z,5.5*t.s,1.3*t.s,5.5*t.s,c)}}}
// ---- animais ----
function mkAnimal(type){const d=AN[type],g=new THREE.Group(),[w,h,l]=d.w,c=d.col,A=(cc,sx,sy,sz,x,y,z)=>bx(cc,sx,sy,sz,x,y,z,g),lg=type==='trex'||type==='raptor'?h*.5:h*.5;
 A(c,w,h*.5,l,0,lg+h*.25,0);for(const[x,z]of[[-.35,.35],[.35,.35],[-.35,-.35],[.35,-.35]])A(c,w*(type==='trex'?.45:.2),lg,w*(type==='trex'?.45:.2),x*w,lg/2,z*l*.8);
 const hz=l*.55,hy=lg+h*(type==='trex'?.7:.45);
 if(type==='trex'){A(c,w*.9,h*.35,l*.3,0,hy,hz+1);A('#c9c9b0',w*.8,.25,l*.25,0,hy-.5,hz+1.1);A(c,w*.6,.35,w*.3,.7,lg+h*.2,l*.2);A(c,w*.6,.35,w*.3,-.7,lg+h*.2,l*.2);A(c,w*.8,h*.3,l*.45,0,lg+h*.3,-l*.55)}
 else if(type==='raptor'){A(c,w*.5,h*.3,l*.3,0,hy,hz);A('#e0b020',.1,.3,.1,0,hy+.4,hz);A(c,w*.4,h*.2,l*.6,0,lg+h*.25,-l*.7)}
 else if(type==='elefante'){A(c,w*.8,h*.6,w*.7,0,hy,hz+.4);A(c,w*.3,h*.9,w*.3,0,hy-h*.4,hz+1.3);A(c,.2,h*.55,w*.9,w*.6,hy+.2,hz-.2);A(c,.2,h*.55,w*.9,-w*.6,hy+.2,hz-.2);A('#f2efe4',.18,.18,1.6,.5,hy-.5,hz+1.3);A('#f2efe4',.18,.18,1.6,-.5,hy-.5,hz+1.3)}
 else if(type==='leao'){A(c,w*.6,h*.4,w*.6,0,hy,hz);A('#6b4a1e',w*.95,h*.7,w*.5,0,hy,hz-.2);A(c,.12,.12,l*.5,0,lg+h*.4,-l*.6);A('#6b4a1e',.2,.2,.25,0,lg+h*.4,-l*.9)}
 else if(type==='pacaca'){A(c,w*.7,h*.45,w*.7,0,hy,hz);A('#e8e1cf',.12,.12,w*1.4,0,hy+h*.28,hz);A('#e8e1cf',.12,.35,.12,w*.7,hy+h*.4,hz);A('#e8e1cf',.12,.35,.12,-w*.7,hy+h*.4,hz)}
 else if(type==='tricera'){A(c,w*.9,h*.6,w*.8,0,hy,hz+.5);A('#c9c9a0',w*1.3,h*.5,.3,0,hy+h*.3,hz-.1);for(const x of[-.5,.5])A('#f2efe4',.12,.12,1.3,x,hy+.2,hz+1.4);A('#f2efe4',.12,.12,.8,0,hy-.1,hz+1.6)}
 else{A(c,w*.5,h*.35,w*.8,0,hy,hz);A('#2a1e14',.1,.1,.9,.15,hy+.6,hz-.2);A('#2a1e14',.1,.1,.9,-.15,hy+.6,hz-.2);A('#f2efe4',w*.55,.25,w*.5,0,hy-.2,hz+.3)}
 scene.add(g);return g}
function spawnAnimal(type,x,z){const d=AN[type],a={type,d,hp:d.hp,x,z,g:mkAnimal(type),st:'wander',t:Math.random()*3,hd:Math.random()*6.28,cd:0,dead:0,aggro:0,vis:true};a.g.position.set(x,0,z);animals.push(a);return a}
function pickType(rg){const sp=REG[rg].sp;let r=Math.random(),s=0;for(const k in sp){s+=sp[k];if(r<=s)return k}return Object.keys(sp)[0]}
function killAnimal(a,by){if(a.dead)return;a.dead=1;a.tD=18;a.g.rotation.z=Math.PI/2;a.g.position.y=a.d.w[0]*.5;
 let rw=a.d.reward;if(a.d.lic&&!player.caca){const fine=Math.min(player.money,Math.round(rw*.5));player.money-=fine;toast(`🚔 Caçaste ${a.d.n} sem licença: multa ${kz(fine)}`);updateLifeUI();return}
 reward('🎯 '+a.d.n+' abatido',rw,a.d.big?150:20);player.kills=(player.kills||0)+1;MS.hook('hunt',a.type)}
function animalsUpdate(dt){const px=pCar?pCar.x:pl.x,pz=pCar?pCar.z:pl.z;
 for(let i=animals.length-1;i>=0;i--){const a=animals[i],dx=px-a.x,dz=pz-a.z,d=Math.hypot(dx,dz);
  if(a.dead){a.tD-=dt;if(a.tD<=0){scene.remove(a.g);animals.splice(i,1)}continue}
  if(d>320||regionAt(a.x,a.z)==='city'){scene.remove(a.g);animals.splice(i,1);continue}
  a.cd-=dt;a.t-=dt;const dd=a.d;let tx=0,tz=0,sp=0;
  const prov=a.aggro>0||(!dd.flee&&!dd.charge&&dd.aggro&&d<dd.aggro)||(dd.charge&&a.aggro>0);
  if(dd.flee&&d<45){tx=-dx/d;tz=-dz/d;sp=dd.sp}
  else if(dd.aggro&&(prov||(!dd.charge&&d<dd.aggro))&&!inHouse){tx=dx/d;tz=dz/d;sp=dd.sp;a.aggro=Math.max(0,a.aggro-dt*.2);
   if(d<dd.r+1.5&&!pCar){if(a.cd<=0){a.wu=(a.wu||0)>0?a.wu-dt:.55;if(a.wu<=0){a.cd=dd.cdA||1.5;a.wu=0;hurt(dd.dmg,a.d.n)}}}else a.wu=0}
  else{if(a.t<=0){a.t=3+Math.random()*4;a.hd=Math.random()*6.28;a.idle=Math.random()<.35}if(!a.idle){tx=Math.cos(a.hd);tz=Math.sin(a.hd);sp=1.6}}
  if(sp){const nx=tx*sp*dt,nz=tz*sp*dt,rr=Math.min(dd.r,1.4);if(!hitsStatic(a.x+nx,a.z,rr))a.x+=nx;else a.hd+=1.5;if(!hitsStatic(a.x,a.z+nz,rr))a.z+=nz;else a.hd+=1.5;a.g.rotation.y=turn(a.g.rotation.y,Math.atan2(tx,tz),dt*6);const hop=Math.abs(Math.sin(performance.now()/160))*.08;a.g.position.set(a.x,hop,a.z)}
  a.g.visible=d<260}}
function hurt(dmg,src){if(!player||player.hp<=0)return;player.lastHurt=Date.now();player.hp=Math.max(0,player.hp-dmg);const h=$('hurt');if(h){h.style.opacity=.55;setTimeout(()=>h.style.opacity=0,220)}sfx('hurt');updateLifeUI();if(player.hp<=0)die(src)}
function die(src){const fine=Math.round(player.money*.12);player.money-=fine;player.hp=60;player.wanted=0;const c=nearestCity(pl.x/T,pl.z/T).c;if(pCar)exitCarForce();inHouse=null;pl.x=(c.cx+.5)*T+4;pl.z=(c.cy+.5)*T+4;pl.y=0;toast(`💀 Foste morto por ${src||'perigo'}. Reanimado no hospital de ${c.name} (−${kz(fine)})`);updateLifeUI()}
function exitCarForce(){pCar=null;pm.g.visible=false}
let rgT=0,spT=0;
function wildUpdate(dt){if(!player)return;rgT-=dt;spT-=dt;if(player.hp>0&&player.hp<100&&Date.now()-(player.lastHurt||0)>8000){const o=player.hp|0;player.hp=Math.min(100,player.hp+dt*1.5);if((player.hp|0)!==o)updateLifeUI()}
 if(Math.hypot(pl.x-wLast[0],pl.z-wLast[1])>25){wLast=[pl.x,pl.z];wildRebuild()}
 wDet.position.x=Math.round(pl.x/20)*20;wDet.position.z=Math.round(pl.z/20)*20;
 if(rgT<=0){rgT=.5;const rg=regionAt(pl.x,pl.z);wDet.visible=rg!=='city';if(rg!==wReg){wReg=rg;const n=REG[rg].n;$('sZone').textContent=rg==='city'?'':'📍 '+n;if(rg==='jurassic')toast('🦖 ZONA JURÁSSICA! Dinossauros à solta — arranja uma arma forte ou foge!');else if(rg!=='city')toast(`⚠️ ${n}: animais selvagens. Leva arma e munição.`);else toast('🏙️ Zona segura')}}
 if(spT<=0&&wReg!=='city'){spT=1.5;const cap=wReg==='jurassic'?9:12;if(animals.filter(a=>!a.dead).length<cap){const ang=Math.random()*6.28,dd=90+Math.random()*100,x=pl.x+Math.cos(ang)*dd,z=pl.z+Math.sin(ang)*dd;
   if(landXZ(x,z)&&regionAt(x,z)===wReg&&cityDist(x,z)>350&&!hitsStatic(x,z,2)){const t=pickType(wReg),n=t==='raptor'?3:(t==='elefante'||t==='palanca'||t==='pacaca')?2:1;for(let k=0;k<n;k++)spawnAnimal(t,x+k*3,z+k*2)}}}
 animalsUpdate(dt)}
