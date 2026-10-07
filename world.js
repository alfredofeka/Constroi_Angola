// world.js — mapa real de Angola, cidades, estradas, casas, árvores
let iW,iR,iD,iB,iT,iC,iL,iLh;
function addRoad(t,p,lo,hi,main,city){let run=null;const flush=e=>{if(run===null)return;const a=run,len=(e-a+1)*T,mid=(a+e+1)/2*T,x=t==='v'?(p+.5)*T:mid,z=t==='v'?mid:(p+.5)*T;
  bx(0x4a4f55,t==='v'?T:len,.06,t==='v'?len:T,x,.05,z);if(main)bx(0xd9ad48,t==='v'?.3:len,.02,t==='v'?len:.3,x,.09,z);run=null};
 for(let i=lo;i<=hi;i++){const x=t==='v'?p:i,y=t==='v'?i:p;if(landT(x,y)){roadSet.add(x+','+y);if(run===null)run=i}else{flush(i-1)}}flush(hi);roads.push({t,p,lo,hi,main,city})}
function addHouse(o){const h=o.h;o.iw=addInst(iW,o.x,0,o.z,4.2,h,4.2,o.color);addInst(iR,o.x,h,o.z,4.9,1.7,4.9,o.roof);addInst(iD,o.x,0,o.z+2.1,.95,2,.14,'#5b3a1e');occ.set(o.tx+','+o.ty,2.5);houses.push(o);return o}
function addBld(o){addInst(iB,o.x,0,o.z,5.4,o.h,5.4,o.color);occ.set(o.tx+','+o.ty,2.95);blds.push(o)}
function addLamp(tx,ty){const x=(tx+.5)*T,z=(ty+.5)*T;addInst(iL,x,0,z,.2,5,.2,'#444');addInst(iLh,x,5.2,z,.7,.7,.7,'#ffe28a');occ.set(tx+','+ty,.5)}
function addTree(x,z){addInst(iT,x,0,z,.3,2.4,.3,'#6b4423');addInst(iC,x,3.2,z,2.2,2.6,2.2,rnd(['#3f8f4a','#4e9a3c','#2f7f46']));const k=Math.floor(x/T)+','+Math.floor(z/T);(trees.get(k)||trees.set(k,[]).get(k)).push({x,z,r:.5})}
const SUR=['Silva','Neto','Kiala','Manuel','Santos','Domingos'];
function buildWorld(){
 flat(0x7fb7d6,WW*T*4,WH*T*4,WW*T/2,-.08,WH*T/2);
 const tex=new THREE.TextureLoader().load(MAP_IMG);tex.anisotropy=4;
 const g=new THREE.Mesh(gP,new THREE.MeshBasicMaterial({map:tex}));g.rotation.x=-Math.PI/2;g.scale.set(WW*T,WH*T,1);g.position.set(WW*T/2,0,WH*T/2);scene.add(g);
 const inst=(g,n,m)=>mkInst(g,n,m);
 iW=inst(gUnit,1800);iR=inst(gRoof,1800);iD=inst(gUnit,1800);
 const c=document.createElement('canvas');c.width=64;c.height=128;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,64,128);x.fillStyle='#4a6a8a';for(let r=0;r<8;r++)for(let k=0;k<4;k++)x.fillRect(k*16+3,r*16+4,10,9);
 iB=inst(gUnit,500,new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c)}));iT=inst(gPole,1600);iC=inst(gS,1600);iL=inst(gPole,600);iLh=inst(gS,600);
 for(const ct of CITIES){if(ct.custom)continue;const e=new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshBasicMaterial({color:0xc8c2ac,transparent:true,opacity:.92}));e.rotation.x=-Math.PI/2;e.scale.set(ct.rx*T,ct.ry*T,1);e.position.set((ct.cx+.5)*T,.02,(ct.cy+.5)*T);scene.add(e);
  const gx=Math.floor(ct.rx/5)*5,gy=Math.floor(ct.ry/5)*5;
  for(let k=-gx;k<=gx;k+=5)addRoad('v',ct.cx+k,ct.cy-ct.ry,ct.cy+ct.ry,k===0,ct);
  for(let k=-gy;k<=gy;k+=5)addRoad('h',ct.cy+k,ct.cx-ct.rx,ct.cx+ct.rx,k===0,ct)}
 for(const s of MAP_HW)addRoad(s[0],s[1],s[2],s[3],1);
 for(const ct of CITIES){if(ct.custom)continue;
  for(let x=ct.cx-ct.rx;x<=ct.cx+ct.rx;x++)for(let y=ct.cy-ct.ry;y<=ct.cy+ct.ry;y++){if(cityAt(x,y)!==ct||isRoad(x,y)||Math.random()>.42)continue;const px=(x+.5)*T,pz=(y+.5)*T;
   if(Math.random()<.25)addBld({x:px,z:pz,tx:x,ty:y,h:ri(10,26),color:rnd(['#d7dce2','#c9c4bd','#b9c3cf']),name:rnd(['Banco','Hotel','Escola','Clínica']),emp:ri(20,160),city:ct.name});
   else addHouse({x:px,z:pz,tx:x,ty:y,h:ri(30,45)/10,color:rnd(['#e8e0d0','#d9dee8','#f1e6cf','#dfe8df']),roof:rnd(['#9b3d35','#b5532e','#3b5ba5']),fam:rnd(SUR),n:ri(2,5),inc:ri(100,800)*1000,sat:ri(40,90),addr:`${ct.name}, Bairro ${ri(1,28)}, nº ${ri(1,99)}`,safe:0,city:ct.name})}
  for(let i=0,n=0;i<900&&n<ct.trees;i++){const x=ri(ct.cx-ct.rx,ct.cx+ct.rx),y=ri(ct.cy-ct.ry,ct.cy+ct.ry);if(cityAt(x,y)!==ct||isRoad(x,y)||occ.has(x+','+y))continue;addTree((x+.3+Math.random()*.4)*T,(y+.3+Math.random()*.4)*T);n++}}
 for(let i=0,n=0;i<4000&&n<260;i++){const x=ri(2,WW-3),y=ri(2,WH-3);if(!landT(x,y)||cityAt(x,y)||isRoad(x,y))continue;addTree((x+Math.random())*T,(y+Math.random())*T);n++}
}
