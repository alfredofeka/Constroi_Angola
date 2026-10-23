// weapons.js — armas de vários calibres, munição, licenças, tiro, pontapés e punhos
const WEAP={punho:{n:'Punhos e pontapés',melee:1,dmg:12,range:2.5,cd:.45},
 pistola:{n:'Pistola 9mm',dmg:24,range:70,cd:.28,cal:'9mm',price:150000,spread:.012},
 cacadeira:{n:'Caçadeira cal.12',dmg:20,range:42,cd:.9,cal:'12',price:230000,pellets:9,spread:.07},
 carabina:{n:'Carabina .223',dmg:55,range:170,cd:.35,cal:'.223',price:380000,spread:.006},
 rifle308:{n:'Rifle .308 Win',dmg:110,range:280,cd:.8,cal:'.308',price:620000,spread:.003},
 rifle375:{n:'Rifle .375 (caça grossa)',dmg:260,range:250,cd:1.1,cal:'.375',price:1200000,spread:.003},
 ak47:{n:'AK-47 7.62',dmg:42,range:190,cd:.11,cal:'7.62',price:700000,spread:.02,auto:1}};
const AMMO={'9mm':[30,9000],'12':[20,12000],'.223':[30,18000],'.308':[20,26000],'.375':[10,40000],'7.62':[40,22000]};
const FIRE={held:false,cd:0,tr:[],fl:0,kick:0};
const fwd=new THREE.Vector3(),rgt=new THREE.Vector3();
const curW=()=>WEAP[(player.weapons||['punho'])[player.wi||0]]||WEAP.punho;
function cycleWeapon(d){if(!player)return;const n=player.weapons.length;player.wi=((player.wi||0)+(d||1)+n)%n;updateLifeUI();toast('🔫 '+curW().n+(curW().cal?' · munição '+(player.ammo[curW().cal]||0):''))}
function pickWeapon(i){if(player&&player.weapons[i]){player.wi=i;updateLifeUI();toast('🔫 '+curW().n)}}
function weaponTargets(){const t=[];for(const a of animals)if(!a.dead)t.push({o:a,x:a.x,y:a.d.w[1]*.6,z:a.z,r:a.d.r*.95+.25,k:'animal'});for(const n of npcs)if(!n.far&&!n.dead&&!n.arrested)t.push({o:n,x:n.x,y:1.1,z:n.z,r:.5,k:n.crim?'crim':n.police?'police':'npc'});return t}
function rayHit(ox,oy,oz,dx,dy,dz,range){let best=null,bt=range;for(const t of weaponTargets()){const vx=t.x-ox,vy=t.y-oy,vz=t.z-oz,tp=vx*dx+vy*dy+vz*dz;if(tp<0||tp>bt)continue;const d2=vx*vx+vy*vy+vz*vz-tp*tp;if(d2<t.r*t.r){const tt=tp-Math.sqrt(t.r*t.r-d2);if(tt<bt){bt=Math.max(.1,tt);best=t}}}
 for(let s=1.5;s<bt;s+=1.5){const x=ox+dx*s,y=oy+dy*s,z=oz+dz*s;if(y<0||(y<5&&hitsStatic(x,z,.05,Math.max(0,y-1.2))))return{t:s,hit:null}}return{t:bt,hit:best}}
const trMat=new THREE.LineBasicMaterial({color:0xffe9a0});
function tracer(a,b){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0],a[1],a[2]),new THREE.Vector3(b[0],b[1],b[2])]),l=new THREE.Line(g,trMat);scene.add(l);FIRE.tr.push({l,t:.07})}
function damage(t,dmg,w){const o=t.o;
 if(t.k==='animal'){o.hp-=dmg;o.aggro=10;if(o.hp<=0)killAnimal(o,'player');else sfx('roar')}
 else Crime.hit(o,dmg,w,t.k)}
function fire(){if(!player||player.hp<=0||FIRE.cd>0||buildMode||inHouse)return;const w=curW();FIRE.cd=w.cd;cam.getWorldDirection(fwd);
 if(w.melee){sfx('punch');FIRE.kick=.12;let best=null,bd=9;for(const t of weaponTargets()){const dx=t.x-pl.x,dz=t.z-pl.z,d=Math.hypot(dx,dz);if(d>w.range+t.r||d>=bd)continue;if((dx*fwd.x+dz*fwd.z)/(d||1)<.4)continue;bd=d;best=t}
  if(best)damage(best,w.dmg,w);return}
 const am=player.ammo[w.cal]||0;if(am<=0){toast('Sem munição '+w.cal+' — compra no Armeiro');FIRE.cd=.6;return}
 player.ammo[w.cal]=am-1;sfx('shot',w);pl.pitch=Math.min(1.4,pl.pitch+.012+w.dmg/20000);FIRE.fl=.06;updateLifeUI();
 cam.updateMatrixWorld();rgt.set(1,0,0).applyQuaternion(cam.quaternion);const ox=cam.position.x,oy=cam.position.y,oz=cam.position.z,mx=ox+rgt.x*.25+fwd.x*.7,my=oy-.18+fwd.y*.7,mz=oz+rgt.z*.25+fwd.z*.7;
 for(let p=0;p<(w.pellets||1);p++){const sp=w.spread||.01,dx=fwd.x+(Math.random()-.5)*sp*2,dy=fwd.y+(Math.random()-.5)*sp*2,dz=fwd.z+(Math.random()-.5)*sp*2,l=Math.hypot(dx,dy,dz),r=rayHit(ox,oy,oz,dx/l,dy/l,dz/l,w.range);
  tracer([mx,my,mz],[ox+dx/l*r.t,oy+dy/l*r.t,oz+dz/l*r.t]);if(r.hit)damage(r.hit,w.dmg,w)}
 Crime.shot()}
function weaponsUpdate(dt){FIRE.cd-=dt;FIRE.kick-=dt;for(let i=FIRE.tr.length-1;i>=0;i--){const t=FIRE.tr[i];t.t-=dt;if(t.t<=0){scene.remove(t.l);FIRE.tr.splice(i,1)}}
 if(FIRE.held&&player&&(curW().auto||curW().melee))fire()}
// ---- loja de armas (Armeiro) ----
function openArmeiro(){const p=player;let h='<h3>🔫 Armeiro</h3>';
 h+=row('Licença de porte de arma — 80.000 Kz',p.lic?'✅ tens':`<button class="btn gold" onclick="buyLic('lic',80000)">Comprar</button>`);
 h+=row('Licença de caça — 50.000 Kz',p.caca?'✅ tens':`<button class="btn gold" onclick="buyLic('caca',50000)">Comprar</button>`);
 for(const k in WEAP){const w=WEAP[k];if(w.melee)continue;h+=row(`${w.n} — ${kz(w.price)}`,p.weapons.includes(k)?'✅':`<button class="btn" onclick="buyWeapon('${k}')">Comprar</button>`)}
 h+='<b style="font-size:12px">Munição</b>';for(const c in AMMO)h+=row(`${c} ×${AMMO[c][0]} — ${kz(AMMO[c][1])} <small>(tens ${p.ammo[c]||0})</small>`,`<button class="btn" onclick="buyAmmo('${c}')">Comprar</button>`);
 openPn(h)}
function buyLic(k,price){if(player.money<price)return toast('Sem dinheiro');player.money-=price;player[k]=1;sfx('buy');updateLifeUI();openArmeiro()}
function buyWeapon(k){const w=WEAP[k];if(!player.lic)return toast('Precisas da licença de porte de arma');if(player.money<w.price)return toast('Sem dinheiro');player.money-=w.price;player.weapons.push(k);player.wi=player.weapons.length-1;sfx('buy');updateLifeUI();openArmeiro()}
function buyAmmo(c){if(player.money<AMMO[c][1])return toast('Sem dinheiro');player.money-=AMMO[c][1];player.ammo[c]=(player.ammo[c]||0)+AMMO[c][0];sfx('buy');updateLifeUI();openArmeiro()}
function openWeapons(){const p=player;let h='<h3>🔫 As minhas armas</h3>';p.weapons.forEach((k,i)=>{const w=WEAP[k];h+=row(`${w.n}${w.cal?' · '+(p.ammo[w.cal]||0)+' balas':''}`,i===p.wi?'✅ em uso':`<button class="btn keep" onclick="pickWeapon(${i});openWeapons()">Equipar</button>`)});h+='<p style="font-size:11px;color:#94a3b8">Teclas 1-7 trocam de arma · V roda · clique/botão 🔫 dispara · sem arma: soco e pontapé. Compra armas e munição no Armeiro das cidades.</p>';openPn(h)}
