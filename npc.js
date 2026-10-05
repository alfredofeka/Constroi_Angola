// npc.js — pessoas com rosto; andam nos passeios, param e olham-te, não atravessam ninguém
const SKIN=['#8d5524','#c68642','#e0ac69','#6b4423','#3b2219'],FN=['Ana','João','Maria','Pedro','Luísa','Paulo','Teresa','Edgar','Sofia','Carlos'],JOB=['Professor(a)','Enfermeiro(a)','Motorista','Engenheiro(a)','Comerciante','Estudante','Soldador','Contabilista'];
const LINES=['Bom dia! Como vai isso?','Está calor hoje, não está?','Viste o preço do pão no mercado?','Boa sorte com a tua casa!','Cuidado na estrada!','Angola cresce todos os dias.'];
function mkPerson(shirt,skin,hair,uniq){const mm=c=>uniq?mat(c):M(c),g=new THREE.Group(),mt={shirt:mm(shirt),skin:mm(skin)};
 const leg=x=>{const p=new THREE.Group();p.position.set(x,.85,0);g.add(p);bx(mm('#1f2937'),.2,.85,.22,0,-.425,0,p);return p},arm=x=>{const p=new THREE.Group();p.position.set(x,1.43,0);g.add(p);bx(mt.shirt,.14,.6,.16,0,-.3,0,p);return p};
 const legL=leg(-.13),legR=leg(.13),armL=arm(-.33),armR=arm(.33);bx(mt.shirt,.5,.62,.28,0,1.16,0,g);
 const head=new THREE.Group();head.position.set(0,1.68,0);g.add(head);
 bx(mt.skin,.3,.34,.3,0,0,0,head,gS);bx(mm(hair),.31,.2,.31,0,.1,-.01,head,gS);
 for(const s of[-1,1]){bx(0xffffff,.07,.05,.03,s*.075,.03,.135,head,gS);bx(0x111111,.035,.035,.02,s*.075,.03,.15,head,gS)}
 bx(mt.skin,.04,.07,.05,0,-.03,.15,head);bx(0x7a2e2e,.1,.02,.02,0,-.09,.14,head);
 return{g,legL,legR,armL,armR,head,mats:mt}}
const turn=(r,a,k)=>r+Math.atan2(Math.sin(a-r),Math.cos(a-r))*Math.min(1,k);
function initNPCs(){for(const ct of CITIES){const rs=roads.filter(r=>r.city===ct);
 for(let i=0;i<ct.npcs;i++){const r=rnd(rs),v=r.t==='v',s=Math.random()<.5?1:-1,m=mkPerson(rnd(['#d62828','#2563eb','#facc15','#16803c','#7c3aed']),rnd(SKIN),rnd(['#111','#2b1b10','#444']));scene.add(m.g);
  const n={...m,v,c:(r.p+.5)*T,a:(r.lo+Math.random()*(r.hi-r.lo))*T,lo:r.lo*T,hi:(r.hi+1)*T,s,sp:1+Math.random()*.5,ph:Math.random()*9,lat:(v?-s:s)*3.15,wait:0,far:false,x:0,z:0,name:rnd(FN)+' '+rnd(SUR),age:ri(10,70),job:rnd(JOB)};
  n.x=v?n.c+n.lat:n.a;n.z=v?n.a:n.c+n.lat;n.g.position.set(n.x,0,n.z);npcs.push(n)}}}
function npcUpd(dt){const ey=pCar?1.35:1.65;
 for(const n of npcs){const dx=pl.x-n.x,dz=pl.z-n.z,d=Math.hypot(dx,dz);n.far=d>150;n.g.visible=!n.far;if(n.far)continue;
  if(player&&!inHouse&&d<5){n.g.rotation.y=turn(n.g.rotation.y,Math.atan2(dx,dz),dt*6);n.head.rotation.x=clamp(-Math.atan2(ey-1.68,d),-.5,.5);n.legL.rotation.x=n.legR.rotation.x=n.armL.rotation.x=n.armR.rotation.x=0;continue}
  n.head.rotation.x*=.9;const dirx=n.v?0:n.s,dirz=n.v?n.s:0,px=n.x+dirx*.9,pz=n.z+dirz*.9;
  const blk=hitsCars(px,pz,.3,null)||hitsPeople(px,pz,.3,n);
  if(blk&&n.wait<6){n.wait+=dt;n.legL.rotation.x=n.legR.rotation.x=n.armL.rotation.x=n.armR.rotation.x=0}
  else{if(!blk)n.wait=0;n.a+=n.s*n.sp*dt;if(n.a<n.lo||n.a>n.hi){n.s=-n.s;n.a=clamp(n.a,n.lo,n.hi)}
   n.ph+=dt*n.sp*5;const sw=Math.sin(n.ph)*.6;n.legL.rotation.x=sw;n.legR.rotation.x=-sw;n.armL.rotation.x=-sw*.8;n.armR.rotation.x=sw*.8;
   n.lat+=((n.v?-n.s:n.s)*3.15-n.lat)*Math.min(1,dt*2);n.x=n.v?n.c+n.lat:n.a;n.z=n.v?n.a:n.c+n.lat;
   n.g.rotation.y=turn(n.g.rotation.y,n.v?(n.s>0?0:Math.PI):(n.s>0?Math.PI/2:-Math.PI/2),dt*8)}
  n.g.position.set(n.x,0,n.z)}}
