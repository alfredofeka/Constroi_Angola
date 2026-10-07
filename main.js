// main.js — arranque, movimento do jogador, câmara e ciclo do jogo
buildWorld();buildKilamba();initHouse();initNPCs();initCars();spawnPolice(8);spawnPoliceCars(3);
function move(dt){if(pl.turn){const st=Math.sign(pl.turn)*Math.min(Math.abs(pl.turn),dt*10);pl.yaw+=st;pl.turn-=st;lastLook=Date.now()}
 if(pCar){driveCar(pCar,dt);pl.x=pCar.x;pl.z=pCar.z;if(Date.now()-lastLook>1500)pl.yaw*=1-Math.min(1,dt*3);return}
 let fw=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0)+joy.y,st=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+joy.x;const l=Math.hypot(fw,st);if(l>1){fw/=l;st/=l}
 pl.vy-=12*dt;pl.y=Math.max(0,pl.y+pl.vy*dt);if(pl.y===0)pl.vy=0;if(pl.sit){if(l>.05)pl.sit=false;else return}
 if(l>.05){const sp=(K.shift||wheel.run?7.5:4)*dt,dx=(-Math.sin(pl.yaw)*fw+Math.cos(pl.yaw)*st)*sp,dz=(-Math.cos(pl.yaw)*fw-Math.sin(pl.yaw)*st)*sp;
  moveWalker(pl,pl.x+dx,pl.z+dz,.35);pl.walk+=dt*8;pm.face=Math.atan2(dx,dz)}else pl.walk=0}
function updCam(){const car=pCar,px=car?car.x:pl.x,pz=car?car.z:pl.z,ya=car?car.heading+Math.PI+pl.yaw:pl.yaw;
 if(cam.fov!==pl.fov){cam.fov=pl.fov;cam.updateProjectionMatrix()}
 if(mode==='first'){if(car){const h=car.heading;cam.position.set(px+Math.cos(h)*.4+Math.sin(h)*.35,1.35,pz-Math.sin(h)*.4+Math.cos(h)*.35)}else cam.position.set(px,1.65+pl.y-(pl.sit?.65:0),pz);cam.rotation.set(pl.pitch,ya,0)}
 else{const d=mode==='drone'?70:(car?8:4.2),el=mode==='drone'?clamp(1.05-pl.pitch*.7,.35,1.5):clamp(.28-pl.pitch*.8,.04,1.3),cy=car?1.2:1.5+pl.y-(pl.sit?.5:0);
  cam.position.set(px+Math.sin(ya)*Math.cos(el)*d,cy+Math.sin(el)*d,pz+Math.cos(ya)*Math.cos(el)*d);cam.lookAt(px,cy,pz)}
 pm.g.visible=mode!=='first'&&!pCar&&!inHouse;if(pm.g.visible){pm.g.position.set(pl.x,pl.y-(pl.sit?.45:0),pl.z);pm.g.rotation.y=turn(pm.g.rotation.y,pm.face||0,.2);const sw=Math.sin(pl.walk)*.7;pm.legL.rotation.x=pl.sit?-1.4:sw;pm.legR.rotation.x=pl.sit?-1.4:-sw;pm.armL.rotation.x=-sw;pm.armR.rotation.x=sw}}
let last=0,fr=0;
function frame(t){requestAnimationFrame(frame);const dt=Math.min(.05,(t-last)/1000||0);last=t;
 if(player){wset();wheelLabels();move(dt);MS.update(dt);GUIDE.update(dt);UIX.tick(dt);npcUpd(dt);carUpd(dt);updCam();findAim();scanNear();if(buildMode)updGhost();
  if(!(fr++%2)){const n=nearestCity(pl.x/T,pl.z/T);$('hud').textContent=`ANGOLA v8 · ${mode==='first'?'1ª PESSOA':mode==='third'?'3ª PESSOA':'DRONE'} · ${n.d<T*14?n.c.name:'estrada/campo'}${pCar?' · 🚗 '+(pCar.vel*3.6|0)+' km/h':''}${inHouse?' · EM CASA':''} · [N] mapa`;$('map').style.opacity=inHouse?.3:1;drawMini();MS.hud()}}
 else{const c=CITIES[0],a=t/7000;cam.position.set((c.cx+.5)*T+Math.cos(a)*130,45,(c.cy+.5)*T+Math.sin(a)*130);cam.lookAt((c.cx+.5)*T,0,(c.cy+.5)*T);npcUpd(dt);carUpd(dt)}
 drawBig();R.render(scene,cam)}
requestAnimationFrame(frame);
