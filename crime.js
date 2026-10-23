// crime.js — assaltos, bandidos que lutam, polícia que persegue e prende, nível de procurado do jogador
const Crime={t:50,bt:100,crims:[],thugs:[],wantedT:0,seen:0,wpT:0};
function freeWalk(n,tx,tz,sp,dt){const l=Math.hypot(tx,tz)||1,dx=tx/l*sp*dt,dz=tz/l*sp*dt;moveWalker(n,n.x+dx,n.z+dz,.35);n.g.position.set(n.x,n.dead?.3:0,n.z);n.g.rotation.y=turn(n.g.rotation.y,Math.atan2(tx,tz),dt*10);n.ph=(n.ph||0)+dt*sp*1.6;const sw=Math.sin(n.ph)*.7;n.legL.rotation.x=sw;n.legR.rotation.x=-sw;n.armL.rotation.x=-sw;n.armR.rotation.x=sw}
function mkBad(x,z,kind){const m=mkPerson(kind==='thug'?'#7f1d1d':'#111827',rnd(SKIN),'#000');bx(0x111111,.3,.16,.2,0,.02,.14,m.head);scene.add(m.g);
 const c={...m,v:true,w:1,c:0,a:0,lo:0,hi:0,s:1,sp:5,ph:0,lat:0,pd:0,wait:0,far:false,x,z,name:(kind==='thug'?'Bandido ':'Suspeito ')+rnd(FN),age:ri(18,40),job:kind==='thug'?'Delinquente':'Assaltante',crim:true,kind,free:true,hp:kind==='thug'?70:50,cd:0,born:0};c.g.position.set(x,0,z);npcs.push(c);return c}
function removeNpc(n){scene.remove(n.g);const i=npcs.indexOf(n);if(i>=0)npcs.splice(i,1)}
function roadPoint(ct,minD,maxD){for(let k=0;k<30;k++){const rs=roads.filter(r=>r.city===ct&&!r.noCar),r=rnd(rs),v=r.t==='v',a=(r.lo+Math.random()*(r.hi-r.lo))*T,c=(r.p+(r.w||1)/2)*T,x=v?c:a,z=v?a:c,d=Math.hypot(x-pl.x,z-pl.z);if(d>=minD&&d<=maxD)return[x,z]}return null}
function hitNpc(n,dmg,w,k){n.hp=(n.hp==null?40:n.hp)-dmg;n.panic=6;
 if(k==='npc'||k==='police'){Crime.offense(k==='police'?3:(w&&w.melee?1:2));for(const o of npcs)if(o!==n&&!o.free&&Math.hypot(o.x-n.x,o.z-n.z)<25)o.panic=6}
 if(k==='crim'){n.fleeT=4}
 if(n.hp<=0)killNpc(n,k)}
function killNpc(n,k){if(n.dead)return;n.dead=1;n.g.rotation.x=-1.4;n.g.position.y=.3;if(k==='crim'){reward('Criminoso neutralizado',n.kind==='thug'?3000:6000,8);setTimeout(()=>removeNpc(n),6000)}else{Crime.offense(2);n.respawn=25}}
Crime.hit=hitNpc;
Crime.offense=function(l){if(!player||(player.role==='POLÍCIA'&&l<2))return;player.wanted=Math.min(3,(player.wanted||0)+l);Crime.wantedT=0;toast('🚨 PROCURADO '+'★'.repeat(player.wanted)+' — foge ou entrega-te ao polícia');sfx('hurt');updateLifeUI()};
Crime.shot=function(){if(!player||regionAt(pl.x,pl.z)!=='city')return;if(player.lic&&player.wanted===0)return;if(Math.random()<.3&&npcs.some(n=>!n.free&&!n.far&&Math.hypot(n.x-pl.x,n.z-pl.z)<70))Crime.offense(1)};
function arrest(c,by){if(c.arrested)return;c.arrested=1;c.free=true;c.g.rotation.x=-1.2;c.g.position.y=.3;c.chaser=null;
 if(by==='player'){const pol=player.role==='POLÍCIA';reward('🚔 Suspeito preso',pol?25000:6000,pol?30:6)}else toast('👮 Um agente prendeu '+c.name);MS.hook('arrest');setTimeout(()=>removeNpc(c),7000)}
function releasePolice(n){n.free=false;n.chase=null;n.cT=0;if(n.v){n.a=clamp(n.z,n.lo,n.hi);n.lat=clamp(n.x-n.c,-n.pd,n.pd)}else{n.a=clamp(n.x,n.lo,n.hi);n.lat=clamp(n.z-n.c,-n.pd,n.pd)}}
function busted(){const fine=Math.min(Math.round(player.money*.25),150000);player.money-=fine;player.wanted=0;for(const n of npcs)if(n.police&&n.free)releasePolice(n);
 const st=pois.filter(p=>p.type==='police').sort((a,b)=>Math.hypot(a.x-pl.x,a.z-pl.z)-Math.hypot(b.x-pl.x,b.z-pl.z))[0];if(pCar)exitCarForce();if(st){pl.x=st.x;pl.z=st.z}toast(`🚔 Foste preso e multado em ${kz(fine)}. Libertado à porta da esquadra.`);updateLifeUI()}
function crimeUpdate(dt){if(!player)return;const rg=regionAt(pl.x,pl.z),ct=rg==='city'?nearestCity(pl.x/T,pl.z/T).c:null;Crime.t-=dt;Crime.bt-=dt;
 // respawn de civis mortos
 for(const n of npcs)if(n.respawn){n.respawn-=dt;if(n.respawn<=0){n.respawn=0;n.dead=0;n.hp=40;n.g.rotation.x=0;n.g.position.y=0}}
 // evento: assalto
 if(ct&&!ct.custom&&Crime.t<=0&&!inHouse&&!Crime.crims.some(c=>!c.arrested&&!c.dead)){Crime.t=70+Math.random()*50;const p=roadPoint(ct,60,130);if(p){const c=mkBad(p[0],p[1],'robber');Crime.crims.push(c);c.born=0;toast('🚨 ASSALTO a decorrer! Procura o suspeito (marcado no GPS). Polícia a caminho.');Crime.wpT=0}}
 // bandidos nos arredores
 if(ct&&Crime.bt<=0&&!inHouse&&Math.hypot(pl.x-(ct.cx+.5)*T,pl.z-(ct.cy+.5)*T)>Math.max(ct.rx,ct.ry)*T*.55&&!Crime.thugs.some(t=>!t.dead&&!t.arrested)){Crime.bt=110+Math.random()*60;const p=roadPoint(ct,30,60);if(p){for(let k=0;k<2;k++)Crime.thugs.push(mkBad(p[0]+k*2,p[1],'thug'));toast('👊 Bandidos à vista! Luta (soco/pontapé), foge ou chama a polícia.')}}
 const police=npcs.filter(n=>n.police&&!n.far);
 for(const c of Crime.crims.concat(Crime.thugs)){if(c.arrested||c.dead)continue;c.born+=dt;c.cd-=dt;const dp=Math.hypot(pl.x-c.x,pl.z-c.z);
  let near=null,nd=1e9;for(const o of police){const d=Math.hypot(o.x-c.x,o.z-c.z);if(d<nd){nd=d;near=o}}
  if(c.kind==='robber'){let fx=0,fz=0;const tx=c.x-pl.x,tz=c.z-pl.z;if(dp<25){fx+=tx/dp;fz+=tz/dp}if(near&&nd<35){fx+=(c.x-near.x)/nd;fz+=(c.z-near.z)/nd}if(!fx&&!fz){c.hd=(c.hd||Math.random()*6.28)+(Math.random()-.5)*.3;fx=Math.cos(c.hd);fz=Math.sin(c.hd)}freeWalk(c,fx,fz,c.fleeT>0?5.8:4.6,dt);c.fleeT-=dt;
   if(near&&!near.free&&nd<260){near.free=true;near.chase=c}
   if(dp<2.4&&!pCar&&c.born>1){c.near=1}else c.near=0;
   if(near&&near.free&&near.chase===c&&nd<1.8)arrest(c,'police');
   if(c.born>130){removeNpc(c)}}
  else{// bandido: ataca o jogador
   if(dp<28&&!inHouse){freeWalk(c,pl.x-c.x,pl.z-c.z,dp<2?0:5.2,dt);if(dp<1.9&&c.cd<=0&&!pCar){c.cd=1.1;hurt(8,'um bandido');sfx('punch')}}else{c.hd=(c.hd||0)+(Math.random()-.5)*.3;freeWalk(c,Math.cos(c.hd),Math.sin(c.hd),1.4,dt)}
   if(near&&!near.free&&nd<80){near.free=true;near.chase=c}if(near&&near.free&&near.chase===c&&nd<1.8)arrest(c,'police');
   if(dp>220||c.born>150)removeNpc(c)}}
 // GPS dinâmico para o assalto
 if(Crime.crims.length&&(Crime.wpT-=dt)<=0){Crime.wpT=2;const c=Crime.crims.find(k=>!k.arrested&&!k.dead);if(c)MapUI.wp={tx:Math.floor(c.x/T),ty:Math.floor(c.z/T),name:'Assalto — suspeito'};else if(MapUI.wp&&MapUI.wp.name.startsWith('Assalto'))MapUI.wp=null}
 Crime.crims=Crime.crims.filter(c=>npcs.includes(c));Crime.thugs=Crime.thugs.filter(c=>npcs.includes(c));
 // polícia em perseguição
 for(const n of police){if(!n.free)continue;const tg=n.chase==='player'?{x:pl.x,z:pl.z,ok:player.wanted>0}:n.chase&&npcs.includes(n.chase)&&!n.chase.arrested?{x:n.chase.x,z:n.chase.z,ok:true}:null;
  if(!tg||!tg.ok){releasePolice(n);continue}freeWalk(n,tg.x-n.x,tg.z-n.z,6.8,dt);n.cT=(n.cT||0)+dt;if(n.cT>14&&n.chase!=='player'&&Math.hypot(tg.x-n.x,tg.z-n.z)<50){arrest(n.chase,'police');n.cT=0}if(n.chase==='player'&&Math.hypot(tg.x-n.x,tg.z-n.z)<1.8&&!pCar)busted()}
 // procurado do jogador
 if(player.wanted>0){const ns=police.filter(n=>!n.free&&Math.hypot(n.x-pl.x,n.z-pl.z)<150);for(const n of ns){n.free=true;n.chase='player'}
  const any=npcs.some(n=>n.police&&Math.hypot(n.x-pl.x,n.z-pl.z)<130);Crime.wantedT+=any?-dt*.2:dt;if(Crime.wantedT>18){player.wanted=Math.max(0,player.wanted-1);Crime.wantedT=0;toast(player.wanted?'🚨 A polícia perdeu-te de vista… ★'.repeat(1):'✅ Já não és procurado');updateLifeUI()}}}
