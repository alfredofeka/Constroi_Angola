// viewmodel.js — braços e pés visíveis (socos e pontapés), arma na mão com clarão, projétil, faíscas, coice e tremor; poses na 3ª pessoa
const VM={g:null,t:0,anim:null,rec:0,flash:0,combo:0,bul:[],spk:[],built:false,cur:null,curId:'',ph:0,W:{},v:new THREE.Vector3(),pmGun:null};
const mbv=(c,sx,sy,sz,x,y,z,par,dt)=>{const m=new THREE.Mesh(gB,new THREE.MeshBasicMaterial({color:c,depthTest:!dt?false:true}));m.scale.set(sx,sy,sz);m.position.set(x,y,z);if(!dt){m.renderOrder=999}m.frustumCulled=false;par.add(m);return m};
function mkGun(id,fp){const g=new THREE.Group(),A=(c,sx,sy,sz,x,y,z)=>mbv(c,sx,sy,sz,x,y,z,g,!fp);let tip=-.3;
 if(id==='pistola'){A('#2a2a2e',.06,.07,.26,0,.03,-.13);A('#17171a',.055,.13,.08,0,-.05,-.02);tip=-.27}
 else if(id==='cacadeira'){A('#333',.045,.045,.85,-.02,.02,-.42);A('#333',.045,.045,.85,.03,.02,-.42);A('#6b4a2a',.07,.06,.22,0,-.02,-.4);A('#6b4a2a',.06,.12,.36,0,-.04,.2);tip=-.86}
 else if(id==='carabina'){A('#2b2b2f',.055,.08,.75,0,0,-.35);A('#1a1a1c',.05,.16,.07,0,-.1,-.2);A('#1a1a1c',.05,.1,.3,0,-.02,.15);tip=-.74}
 else if(id==='rifle308'){A('#2f3a2c',.05,.07,.95,0,0,-.45);A('#111',.04,.05,.26,0,.07,-.22);A('#7a4a22',.055,.1,.34,0,-.02,.17);tip=-.95}
 else if(id==='rifle375'){A('#2a2a2a',.06,.08,1.0,0,0,-.5);A('#111',.04,.05,.26,0,.075,-.24);A('#7a4a22',.065,.11,.4,0,-.02,.2);tip=-1.0}
 else if(id==='ak47'){A('#2b2b2f',.055,.09,.7,0,0,-.3);A('#7a4a22',.06,.06,.3,0,-.01,-.62);A('#222',.045,.22,.08,0,-.15,-.28);A('#7a4a22',.055,.1,.3,0,-.02,.17);tip=-.82}
 const mz=new THREE.Group();mz.position.set(0,.02,tip);g.add(mz);
 const fm=new THREE.MeshBasicMaterial({color:0xffe08a,transparent:true,opacity:.95,depthTest:!!(!fp),blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
 for(const r of[0,1.2]){const f=new THREE.Mesh(gP,fm);f.scale.set(.32,.32,1);f.rotation.z=r;f.renderOrder=1000;f.frustumCulled=false;mz.add(f);const f2=f.clone();f2.rotation.y=Math.PI/2;mz.add(f2)}
 const fl=new THREE.Mesh(gS,fm);fl.scale.set(.12,.12,.3);fl.position.z=-.12;fl.renderOrder=1000;mz.add(fl);mz.visible=false;g.mz=mz;g.id=id;return g}
VM.build=function(){if(VM.built||!player)return;VM.built=true;scene.add(cam);const g=VM.g=new THREE.Group();cam.add(g);const sk=avatar.skin,sh=avatar.shirt;
 const arm=(x,k)=>{const a=new THREE.Group();a.position.set(x,-.42,.05);g.add(a);mbv(sh,.14,.14,.4,0,0,.05,a);mbv(sk,.095,.095,.42,0,0,-.3,a);mbv(sk,.12,.12,.14,0,0,-.56,a);return a};
 VM.rA=arm(.3);VM.lA=arm(-.3);
 VM.leg=new THREE.Group();VM.leg.position.set(.2,-.5,-.05);g.add(VM.leg);mbv('#1f2937',.18,.95,.18,0,-.47,0,VM.leg);mbv('#0d0d10',.17,.13,.34,0,-.97,-.08,VM.leg);mbv('#e5e7eb',.17,.04,.34,0,-1.04,-.08,VM.leg);
 for(const id of['pistola','cacadeira','carabina','rifle308','rifle375','ak47']){const w=mkGun(id,true);w.position.set(0,0,-.5);w.visible=false;VM.rA.add(w);VM.W[id]=w}
 // arma da 3ª pessoa (na mão do boneco)
 VM.pmG={};for(const id of['pistola','cacadeira','carabina','rifle308','rifle375','ak47']){const w=mkGun(id,false);w.scale.set(.8,.8,.8);w.position.set(0,-.55,-.05);w.rotation.x=Math.PI/2;w.visible=false;pm.armR.add(w);VM.pmG[id]=w}}
VM.melee=function(){const seq=['punchR','punchL','kick'],k=seq[VM.combo++%3];VM.anim={type:k,t:0,dur:k==='kick'?.4:.25};FIRE.shake=.5;return k};
VM.shoot=function(w){VM.rec=1;VM.flash=.07;FIRE.shake=Math.min(1.4,.3+w.dmg/200);const m=$('mflash');if(m){m.style.opacity=.28;setTimeout(()=>m.style.opacity=0,50)}};
VM.muzzle=function(){if(!VM.built)return null;const id=(player.weapons||[])[player.wi||0],tp=mode!=='first',w=tp?VM.pmG[id]:VM.W[id];if(!w)return null;cam.updateMatrixWorld(true);pm.g.updateMatrixWorld(true);w.mz.getWorldPosition(VM.v);return[VM.v.x,VM.v.y,VM.v.z]};
VM.bullet=function(a,b){const m=new THREE.Mesh(gB,new THREE.MeshBasicMaterial({color:0xfff0b0}));m.scale.set(.05,.05,.8);m.position.set(a[0],a[1],a[2]);m.lookAt(b[0],b[1],b[2]);m.frustumCulled=false;scene.add(m);const d=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);VM.bul.push({m,a,b,t:0,dur:Math.max(.05,d/380)})};
VM.spark=function(b){const m=new THREE.Mesh(gB,new THREE.MeshBasicMaterial({color:0xffd24a}));m.scale.set(.2,.2,.2);m.position.set(b[0],b[1],b[2]);scene.add(m);VM.spk.push({m,t:.16})};
VM.update=function(dt){if(!player)return;if(!VM.built)VM.build();VM.t+=dt;
 const a=VM.anim;if(a){a.t+=dt;if(a.t>=a.dur)VM.anim=null}VM.rec=Math.max(0,VM.rec-dt*7);VM.flash=Math.max(0,VM.flash-dt);FIRE.shake=Math.max(0,(FIRE.shake||0)-dt*5);
 const id=(player.weapons||['punho'])[player.wi||0],armed=id!=='punho',fp=mode==='first'&&!pCar&&!buildMode&&player.hp>0;VM.g.visible=fp;
 for(const k in VM.W){VM.W[k].visible=armed&&k===id&&fp;VM.W[k].mz.visible=VM.W[k].visible&&VM.flash>0;if(VM.W[k].mz.visible){VM.W[k].mz.rotation.z=Math.random()*6}}
 for(const k in VM.pmG){const w=VM.pmG[k];w.visible=armed&&k===id&&mode!=='first'&&!pCar;w.mz.visible=w.visible&&VM.flash>0}
 const mv=(K.w||K.a||K.s||K.d||Math.abs(joy.x)+Math.abs(joy.y)>.1)&&!pl.sit;VM.ph+=dt*(mv?(K.shift||(typeof wheel!=='undefined'&&wheel.run)?11:8):0);
 VM.g.position.set(Math.sin(VM.ph*.5)*.012,-Math.abs(Math.sin(VM.ph))*.014+Math.sin(VM.t*1.6)*.004,0);
 const r=VM.rA,l=VM.lA,lg=VM.leg;
 r.position.set(.3,-.42,.05);r.rotation.set(.32,.18,0);l.position.set(-.3,-.42,.05);l.rotation.set(.32,-.18,0);lg.rotation.set(0,0,0);
 if(armed){const long=id!=='pistola';r.rotation.set(.34,.2,0);l.visible=long;if(long)l.rotation.set(.3,-.82,0);const w=VM.W[id];if(w){w.position.set(0,0,-.5+VM.rec*.14);w.rotation.x=VM.rec*.22}r.position.z=.05+VM.rec*.12;r.rotation.x+=VM.rec*.1}
 else l.visible=true;
 if(a){const p=Math.sin(Math.PI*clamp(a.t/a.dur,0,1));
  if(a.type==='punchR'){r.position.z=.05-.38*p;r.position.y=-.42+.08*p;r.rotation.set(.32-.3*p,.18-.3*p,0);l.rotation.set(.45,-.1,0)}
  else if(a.type==='punchL'){l.position.z=.05-.38*p;l.position.y=-.42+.08*p;l.rotation.set(.32-.3*p,-.18+.3*p,0);r.rotation.set(.45,.1,0)}
  else{lg.rotation.x=-2.15*p;lg.rotation.y=-.2*p;r.rotation.set(.5,.1,0);l.rotation.set(.5,-.1,0)}}
 for(let i=VM.bul.length-1;i>=0;i--){const b=VM.bul[i];b.t+=dt;const p=Math.min(1,b.t/b.dur);b.m.position.set(b.a[0]+(b.b[0]-b.a[0])*p,b.a[1]+(b.b[1]-b.a[1])*p,b.a[2]+(b.b[2]-b.a[2])*p);if(p>=1){scene.remove(b.m);VM.spark(b.b);VM.bul.splice(i,1)}}
 for(let i=VM.spk.length-1;i>=0;i--){const s=VM.spk[i];s.t-=dt;s.m.scale.setScalar(.12+(.16-s.t)*2);if(s.t<=0){scene.remove(s.m);VM.spk.splice(i,1)}}}
VM.pmPose=function(){if(!pm||!player)return;const a=VM.anim,id=(player.weapons||['punho'])[player.wi||0],armed=id!=='punho';
 if(a){const p=Math.sin(Math.PI*clamp(a.t/a.dur,0,1));if(a.type==='punchR'){pm.armR.rotation.x=-1.7*p;pm.armL.rotation.x=.3*p}else if(a.type==='punchL'){pm.armL.rotation.x=-1.7*p;pm.armR.rotation.x=.3*p}else{pm.legR.rotation.x=-1.6*p;pm.legL.rotation.x=.4*p;pm.armL.rotation.x=.6*p;pm.armR.rotation.x=-.4*p}return}
 if(armed){pm.armR.rotation.x=-1.45-VM.rec*.25;pm.armL.rotation.x=id==='pistola'?-.2:-1.25}};
