// house.js — interior da casa (cama, mesa, cofre, pintura) e painel de casa
const RX=500,RZ=500,roomMat=new THREE.MeshLambertMaterial({color:0xe8e0d0,side:THREE.BackSide});
const HITEMS=[['bed',-3,-2.8,'🛏️ [E] Dormir'],['eat',2.6,1.4,'🍲 [E] Comer (800 Kz)'],['safe',3,-3,'💰 [E] Guardar 50.000 Kz no cofre'],['paint',0,-3.6,'🎨 [E] Pintar a casa'],['door',0,3.9,'🚪 [E] Sair de casa']];
function initHouse(){const r=new THREE.Mesh(gB,roomMat);r.scale.set(10,3.4,8);r.position.set(RX,1.7,RZ);scene.add(r);bx(0x8a6a45,10,.05,8,RX,.03,RZ);
 bx(0x8b5a2b,2.2,.5,1.3,RX-3,.25,RZ-2.8);bx(0xf5f5dc,2,.15,1.1,RX-3,.58,RZ-2.8);bx(0xffffff,.6,.12,.5,RX-3.7,.7,RZ-2.8);
 bx(0x444444,.8,1,.8,RX+3,.5,RZ-3);bx(0xc49a30,.25,.25,.05,RX+3,.6,RZ-2.58);bx(0x6b4a2a,2.2,2.2,.5,RX,1.1,RZ-3.6);
 bx(0x9a6b3a,1.4,.8,1,RX+2.6,.4,RZ+1.4);bx(0xdddddd,.4,.05,.4,RX+2.6,.82,RZ+1.4);bx(0x3b5ba5,1.6,1,.05,RX-3.2,1.9,RZ-3.97);bx(0x9fd0e8,1.5,1.2,.05,RX+3.8,1.8,RZ-3.97);bx(0x5b3a1e,1.2,2.1,.1,RX,1.05,RZ+3.95);
 const l=new THREE.PointLight(0xfff2d0,.9,14);l.position.set(RX,3,RZ);scene.add(l)}
function enterHouse(h){inHouse=h;prevMode=mode;setMode('first');pl.x=RX;pl.z=RZ+2;pl.yaw=0;pl.pitch=0;roomMat.color.set(h.color);pm.g.visible=false;
 $('houseSafeText').textContent='Cofre: '+kz(h.safe||0);if(matchMedia('(pointer:coarse)').matches)$('houseUI').style.display='block';toast(`🏠 ${h.addr} — olha à volta. Cama, mesa, cofre e pintura têm [E]. [F] = menu`)}
function exitHouse(){const h=inHouse;$('houseUI').style.display='none';let p=null;
 for(const d of[[0,1],[0,-1],[1,0],[-1,0]]){const x=h.x+d[0]*4.2,z=h.z+d[1]*4.2;if(!hitsStatic(x,z,.4)&&!hitsCars(x,z,.4,null)&&!hitsPeople(x,z,.4,pl)){p=[x,z,d];break}}
 if(!p){toast('Sem espaço à porta, tenta de novo');return}
 inHouse=null;pl.x=p[0];pl.z=p[1];pl.yaw=Math.atan2(-p[2][0],-p[2][1]);pl.pitch=0;setMode(prevMode);updateLifeUI()}
function houseSleep(){player.energy=100;player.hunger=Math.min(100,player.hunger+10);logLife('😴 Dormiste 8h — Energia 100%');updateLifeUI()}
function houseEat(){if(player.money<800){toast('Sem dinheiro p/ comida');return}player.money-=800;player.hunger=Math.max(0,player.hunger-35);player.energy=Math.min(100,player.energy+25);logLife('🍲 Funge com peixe — Fome -35%, Energia +25%');updateLifeUI()}
function houseSave(){if(player.money<50000){toast('Sem 50.000 Kz');return}player.money-=50000;inHouse.safe=(inHouse.safe||0)+50000;$('houseSafeText').textContent='Cofre: '+kz(inHouse.safe);logLife(`💰 Cofre: ${kz(inHouse.safe)}`);updateLifeUI()}
function housePaint(){const c='#'+(0x808080+Math.random()*0x7f7f7f|0).toString(16).padStart(6,'0');inHouse.color=c;roomMat.color.set(c);tc.set(c);iW.setColorAt(inHouse.iw,tc);iW.instanceColor.needsUpdate=true;logLife('🎨 Casa pintada!')}
