// car.js — carros: faixas, travagem, colisão sólida, volante animado
function mkCar(col,c){const g=new THREE.Group();bx(col,1.9,.7,4.2,0,.65,0,g);bx(0xcfe3ee,1.6,.6,2.1,0,1.25,-.2,g);
 for(const[x,z]of[[-.95,1.4],[.95,1.4],[-.95,-1.4],[.95,-1.4]])bx(0x111111,.3,.7,.7,x,.35,z,g);
 for(const s of[-1,1]){bx(0xffe89a,.35,.2,.1,s*.6,.7,2.1,g);bx(0xb91c1c,.35,.2,.1,s*.6,.7,-2.1,g)}
 bx(0x222222,1.5,.3,.5,0,1.0,1.0,g);
 const piv=new THREE.Group();piv.position.set(.4,1.12,.72);piv.rotation.x=3.665;g.add(piv);
 const w=new THREE.Group();piv.add(w);w.add(new THREE.Mesh(new THREE.TorusGeometry(.2,.03,6,14),M(0x111111)));bx(0x111111,.4,.04,.03,0,0,0,w);c.wheel=w;
 scene.add(g);return g}
const sync=c=>{c.g.position.set(c.x,0,c.z);c.g.rotation.y=c.heading};
function placeCar(c){const off=c.v?-c.s*1.6:c.s*1.6;c.lat=off;c.x=c.v?c.c+c.lat:c.a;c.z=c.v?c.a:c.c+c.lat;c.heading=c.v?(c.s>0?0:Math.PI):(c.s>0?Math.PI/2:-Math.PI/2);sync(c)}
function initCars(){const pools=CITIES.map(ct=>[ct.cars,roads.filter(r=>r.city===ct)]);pools.push([10,roads.filter(r=>!r.city)]);
 for(const[n,rs]of pools)for(let i=0,t=0;i<n&&t<400;t++){const r=rnd(rs),v=r.t==='v',c={v,c:(r.p+.5)*T,a:(r.lo+Math.random()*(r.hi-r.lo))*T,lo:r.lo*T,hi:(r.hi+1)*T,s:Math.random()<.5?1:-1,sp:5+Math.random()*4,npc:1,x:0,z:0,heading:0,vel:0,lat:0,model:rnd(['Toyota Corolla','Toyota Hilux','Kia Rio','Hyundai i10']),fuel:100,owned:0,steer:0,wait:0,far:false};
  c.g=mkCar(rnd(['#111827','#d62828','#2563eb','#facc15','#e5e7eb']),c);placeCar(c);
  if(!landXZ(c.x,c.z)||hitsCars(c.x,c.z,1.5,c)){scene.remove(c.g);continue}cars.push(c);i++}}
function carAhead(c){const s=Math.sin(c.heading),k=Math.cos(c.heading);
 for(const d of[3.4,5.4]){const x=c.x+s*d,z=c.z+k*d;if(hitsPeople(x,z,.9,null))return true;
  for(const o of cars){if(o===c||Math.abs(o.x-x)>6||Math.abs(o.z-z)>6)continue;let hit=false;for(const p of carCircles(o))if(Math.hypot(p[0]-x,p[1]-z)<1.9){hit=true;break}
   if(!hit)continue;if(!o.npc)return true;const dot=Math.sin(o.heading)*s+Math.cos(o.heading)*k;if(dot>.5||cars.indexOf(o)<cars.indexOf(c))return true}}
 return false}
function carUpd(dt){for(const c of cars){if(!c.npc)continue;c.far=Math.hypot(c.x-pl.x,c.z-pl.z)>200;c.g.visible=!c.far;if(c.far)continue;
  const blk=carAhead(c),tg=blk?0:c.sp;c.vel+=(tg-c.vel)*Math.min(1,dt*(blk?5:1.5));c.a+=c.s*c.vel*dt;
  if(c.a<c.lo||c.a>c.hi){c.s=-c.s;c.a=clamp(c.a,c.lo,c.hi)}
  c.lat+=((c.v?-c.s:c.s)*1.6-c.lat)*Math.min(1,dt*2);c.x=c.v?c.c+c.lat:c.a;c.z=c.v?c.a:c.c+c.lat;
  c.heading=turn(c.heading,c.v?(c.s>0?0:Math.PI):(c.s>0?Math.PI/2:-Math.PI/2),dt*4);sync(c)}}
function driveCar(c,dt){const f=clamp((K.w||K.arrowup?1:0)-(K.s||K.arrowdown||K[' ']?1:0)+joy.y,-1,1),st=clamp((K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+joy.x,-1,1);
 let acc=0;if(c.fuel>0)acc=f>0?14*f:(c.vel>.5?-22:12*f);c.vel+=acc*dt;c.vel-=c.vel*.5*dt;if(!f)c.vel-=Math.sign(c.vel)*Math.min(Math.abs(c.vel),4*dt);c.vel=clamp(c.vel,-6,24);
 const nh=c.heading-st*1.7*dt*clamp(c.vel/6,-1,1),nx=c.x+Math.sin(nh)*c.vel*dt,nz=c.z+Math.cos(nh)*c.vel*dt;
 if(!carBlocked(c,nx,nz,nh)){c.x=nx;c.z=nz;c.heading=nh;c.fuel=Math.max(0,c.fuel-Math.abs(c.vel)*dt*.03)}else c.vel*=-.3;
 if(c.wheel)c.wheel.rotation.z=-st*.9;sync(c)}
function enterCar(c){if(!c.owned&&player.money<5000&&Math.random()<.5){toast('Carro trancado!');return}
 pCar=c;c.npc=0;c.owned=1;c.vel=0;pl.yaw=0;pm.g.visible=false;toast(`🚗 ${c.model} — WASD conduz, H buzina, E sai. Olha à volta com o rato.`);updateLifeUI()}
function exitCar(){const c=pCar,h=c.heading,l=[Math.cos(h),-Math.sin(h)],f=[Math.sin(h),Math.cos(h)];
 for(const o of[[2.2,0],[-2.2,0],[2.2,-3],[-2.2,-3],[0,-3.5]]){const x=c.x+l[0]*o[0]+f[0]*o[1],z=c.z+l[1]*o[0]+f[1]*o[1];
  if(!hitsStatic(x,z,.4)&&!hitsCars(x,z,.4,c)&&!hitsPeople(x,z,.4,pl)){pl.x=x;pl.z=z;pl.yaw=h+Math.PI;pCar=null;updateLifeUI();return}}
 toast('Sem espaço para sair do carro')}
function horn(){try{const a=horn.a||(horn.a=new AudioContext()),o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.value=380;g.gain.value=.08;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.35)}catch(e){}}
