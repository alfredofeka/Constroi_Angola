// kilamba.js — maquete do Kilamba (Centralidade): quarteirões, prédios, ruas, lojas, carros, pessoas e polícia
const KC=CITIES.find(c=>c.id==='kilamba');Object.assign(KIL,{blk:[],grn:[],bl:[],lbl:[]});
const kbuf=()=>({p:[],n:[],u:[],c:[]});
function kface(b,v,n,uv,c){for(const i of[0,1,2,0,2,3]){b.p.push(v[i][0],v[i][1],v[i][2]);b.n.push(n[0],n[1],n[2]);b.u.push(uv[i][0],uv[i][1]);b.c.push(c[0],c[1],c[2])}}
function kbox(b,x0,y0,z0,x1,y1,z1,tu,tv,c,top,tb){const Lx=x1-x0,Lz=z1-z0,H=y1-y0;
 kface(b,[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],[0,0,1],[[0,0],[Lx/tu,0],[Lx/tu,H/tv],[0,H/tv]],c);
 kface(b,[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]],[0,0,-1],[[0,0],[Lx/tu,0],[Lx/tu,H/tv],[0,H/tv]],c);
 kface(b,[[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]],[1,0,0],[[0,0],[Lz/tu,0],[Lz/tu,H/tv],[0,H/tv]],c);
 kface(b,[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]],[-1,0,0],[[0,0],[Lz/tu,0],[Lz/tu,H/tv],[0,H/tv]],c);
 if(top)kface(tb,[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]],[0,1,0],[[0,0],[1,0],[1,1],[0,1]],top)}
const kflat=(b,x0,z0,x1,z1,y,c)=>kface(b,[[x0,y,z1],[x1,y,z1],[x1,y,z0],[x0,y,z0]],[0,1,0],[[0,0],[1,0],[1,1],[0,1]],c);
function kmesh(b,m){if(!b.p.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(b.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(b.u,2));g.setAttribute('color',new THREE.Float32BufferAttribute(b.c,3));const o=new THREE.Mesh(g,m);o.frustumCulled=false;scene.add(o);return o}
function mkTex(draw){const c=document.createElement('canvas');c.width=c.height=64;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function facade(g,wall){g.fillStyle=wall;g.fillRect(0,0,64,64);g.fillStyle='rgba(0,0,0,.07)';g.fillRect(0,60,64,4);g.fillStyle='#e8e1cc';g.fillRect(12,10,40,42);g.fillStyle='#5f86ad';g.fillRect(15,13,34,36);g.fillStyle='#8fb0cf';g.fillRect(15,13,34,10);g.fillStyle='#e8e1cc';g.fillRect(31,13,2,36);g.fillStyle='#bdb39a';g.fillRect(8,50,48,5);g.fillStyle='#8c846f';for(let i=10;i<56;i+=6)g.fillRect(i,44,1,6)}
function shopTile(g){g.fillStyle='#f1ead8';g.fillRect(0,0,64,64);for(let i=0;i<8;i++){g.fillStyle=i%2?'#f59e0b':'#b45309';g.fillRect(i*8,0,8,12)}g.fillStyle='#3f6b8f';g.fillRect(5,18,54,40);g.fillStyle='#8fb6d6';g.fillRect(5,18,54,8);g.fillStyle='#1f2937';g.fillRect(26,26,14,32);g.fillStyle='#e5e7eb';g.fillRect(31,18,2,40)}
const signMat={};
function ksign(text,x,y,z,ry,w,h,bg){const k=text+(bg||''),bgc=bg||'#0f766e';let m=signMat[k];if(!m){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle=bgc;g.fillRect(0,0,256,64);g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(3,3,250,58);g.fillStyle='#fff';let fs=26;g.font=`bold ${fs}px system-ui`;while(g.measureText(text).width>236&&fs>10){fs--;g.font=`bold ${fs}px system-ui`}g.textAlign='center';g.textBaseline='middle';g.fillText(text,128,34);m=signMat[k]=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)})}
 const o=new THREE.Mesh(gP,m);o.scale.set(w,h,1);o.position.set(x,y,z);o.rotation.y=ry;scene.add(o);return o}
function addCol(x,z,r){const k=Math.floor(x/T)+','+Math.floor(z/T);(trees.get(k)||trees.set(k,[]).get(k)).push({x,z,r})}
const VERB={shop:'Comprar em',food:'Comer em',pharm:'Ir à',police:'Falar na',school:'Ver o',gov:'Ver o',park:'Passear no',market:'Visitar a'};
function buildKilamba(){
 const{x0,y0,w,h,BW,BH,AV}=KIL,col=hx=>{const c=new THREE.Color(hx);return[c.r,c.g,c.b]},B={cream:kbuf(),yellow:kbuf(),shop:kbuf(),roof:kbuf(),det:kbuf()};
 const YL=col('#e9c24a'),WH=col('#f2f2ee'),vx=i=>x0+i*(BW+AV),hy=j=>y0+j*(BH+AV);let nb=0;
 flat(0xd2a679,900,700,(x0+w/2)*T,-.03,(y0+h/2)*T);
 // ---- ruas ----
 function road(t,p,lo,hi,wd,o={}){for(let i=lo;i<=hi;i++)for(let k=0;k<wd;k++)roadSet.add((t==='v'?p+k:i)+','+(t==='v'?i:p+k));roads.push({t,p,lo,hi,w:wd,city:KC,main:o.main,noCar:o.noCar});
  if(t==='v')kflat(B.det,p*T,lo*T,(p+wd)*T,(hi+1)*T,.05,col('#3d4046'));else kflat(B.det,lo*T,p*T,(hi+1)*T,(p+wd)*T,.05,col('#3d4046'))}
 const qa=(t,c0,c1,a0,a1,y,cl)=>t==='v'?kflat(B.det,c0,a0,c1,a1,y,cl):kflat(B.det,a0,c0,a1,c1,y,cl);
 function marks(t,p,wd,lo,hi,cuts){const c=(p+wd/2)*T;let segs=[[lo*T,(hi+1)*T]];for(const[a,b]of cuts){const nx=[];for(const[s,e]of segs){const A=a*T,Z=(b+1)*T;if(Z<=s||A>=e){nx.push([s,e]);continue}if(A>s)nx.push([s,A]);if(Z<e)nx.push([Z,e])}segs=nx}
  for(const[s,e]of segs){qa(t,c-.25,c-.13,s,e,.08,YL);qa(t,c+.13,c+.25,s,e,.08,YL);qa(t,c-wd*T/2+.4,c-wd*T/2+.55,s,e,.08,WH);qa(t,c+wd*T/2-.55,c+wd*T/2-.4,s,e,.08,WH);for(let a=s+1.5;a+3<=e;a+=6){qa(t,c-3.07,c-2.93,a,a+3,.08,WH);qa(t,c+2.93,c+3.07,a,a+3,.08,WH)}}}
 const zebra=(t,c0,c1,a0)=>{for(let c=c0+.8;c+1.2<=c1-.8;c+=2.2)qa(t,c,c+1.2,a0,a0+2.5,.085,WH)};
 // ---- pavimento dos quarteirões e relvados ----
 for(let bj=0;bj<2;bj++)for(let bi=0;bi<3;bi++){const bx0=vx(bi)+AV,by0=hy(bj)+AV;flat(0xbfbaa9,BW*T,BH*T,(bx0+BW/2)*T,.02,(by0+BH/2)*T);KIL.blk.push({x:bx0,y:by0,w:BW,h:BH});
  const gx=bx0+9,gy=by0+9,gw=BW-18,gh=BH-18;flat(0x879a58,gw*T,gh*T,(gx+gw/2)*T,.03,(gy+gh/2)*T);KIL.grn.push({x:gx,y:gy,w:gw,h:gh});
  for(let k=0;k<5;k++){const px=gx+Math.random()*(gw-3),py=gy+Math.random()*(gh-3);flat(rnd([0xa68b5b,0x6f8a4b,0x9aa066]),(2+Math.random()*3)*T,(2+Math.random()*2)*T,(px+1.5)*T,.035,(py+1.5)*T)}}
 for(let i=0;i<4;i++)road('v',vx(i),y0,y0+h-1,AV,{main:1});for(let j=0;j<3;j++)road('h',hy(j),x0,x0+w-1,AV,{main:1});
 for(let i=0;i<4;i++)marks('v',vx(i),AV,y0,y0+h-1,[0,1,2].map(j=>[hy(j),hy(j)+AV-1]));
 for(let j=0;j<3;j++)marks('h',hy(j),AV,x0,x0+w-1,[0,1,2,3].map(i=>[vx(i),vx(i)+AV-1]));
 for(let i=0;i<4;i++)for(let j=0;j<3;j++){const X=vx(i),Y=hy(j),xe=(X+AV)*T,ye=(Y+AV)*T;
  if(j>0)zebra('v',X*T,xe,Y*T-3.5);if(j<2)zebra('v',X*T,xe,ye+1);if(i>0)zebra('h',Y*T,ye,X*T-3.5);if(i<3)zebra('h',Y*T,ye,xe+1);
  for(const[px,pz,sx,sz]of[[X*T-1.5,Y*T-1.5,1,1],[xe+1.5,Y*T-1.5,-1,1],[X*T-1.5,ye+1.5,1,-1],[xe+1.5,ye+1.5,-1,-1]]){
   kbox(B.det,px-.12,0,pz-.12,px+.12,5.5,pz+.12,1,1,col('#2d3138'),col('#2d3138'),B.det);kbox(B.det,px-.3,5.5,pz-.3,px+.3,6.9,pz+.3,1,1,col('#1f2328'),col('#1f2328'),B.det);
   const lit=Math.random()<.5?0:2;[['#ef4444',6.55],['#f59e0b',6.2],['#22c55e',5.85]].forEach((l,k)=>kbox(B.det,px+sx*.3-.1,l[1]-.1,pz+sz*.3-.1,px+sx*.3+.1,l[1]+.1,pz+sz*.3+.1,1,1,col(k===lit?l[0]:'#3a3f47'),col(k===lit?l[0]:'#3a3f47'),B.det));addCol(px,pz,.3)}
  const nm1=j===1?'R. Amílcar Cabral':'Avenida H'+(j+1),nm2=i===2?'Rua Alameda Agostinho Neto':'Avenida V'+(i+1);
  ksign(nm1,X*T-1.5,4.2,Y*T-1.2,0,3.6,.9,'#1d4ed8');ksign(nm2,xe+1.2,4.2,Y*T-1.5,Math.PI/2,3.6,.9,'#15803d')}
 // ---- edifícios ----
 const tC=mkTex(g=>facade(g,'#f3ecd9')),tY=mkTex(g=>facade(g,'#e8b94c')),tS=mkTex(shopTile);
 function bld(tx,ty,wt,dt,fl,side,o={}){const X0=tx*T,Z0=ty*T,X1=(tx+wt)*T,Z1=(ty+dt)*T,H=fl*3,sg=o.shop?4.5:3,cc=col(o.tint||rnd(['#ffffff','#fbf7ec','#f6f0e0','#fffaf0'])),rf=col('#8b877d'),yy=fl>=4?H-6:H;
  kbox(o.shop?B.shop:B.cream,X0,0,Z0,X1,Math.min(sg,H),Z1,o.shop?6:3,o.shop?4.5:3,cc,H<=sg?rf:null,B.roof);
  if(yy>sg)kbox(B.cream,X0,sg,Z0,X1,yy,Z1,3,3,cc,yy===H?rf:null,B.roof);if(fl>=4)kbox(B.yellow,X0,yy,Z0,X1,H,Z1,3,3,col(rnd(['#ffffff','#fff3d6'])),rf,B.roof);
  if(fl>=8){const cx=(X0+X1)/2,cz=(Z0+Z1)/2;kbox(B.det,cx-1.5,H,cz-1.5,cx+1.5,H+2.2,cz+1.5,1,1,col('#9b978c'),col('#8b877d'),B.det)}
  for(let i=0;i<wt;i++)for(let j=0;j<dt;j++)occ.set((tx+i)+','+(ty+j),3.01);
  KIL.bl.push({x:tx,y:ty,w:wt,h:dt,c:o.shop?'#d97706':fl>=4?'#e8c66a':'#d9cfae'});
  const S={'+z':[0,1],'-z':[0,-1],'+x':[1,0],'-x':[-1,0]}[side],fx=S[0]?(S[0]>0?X1:X0):(X0+X1)/2,fz=S[1]?(S[1]>0?Z1:Z0):(Z0+Z1)/2,e=.25;
  kbox(B.det,S[1]?fx-.9:Math.min(fx,fx+S[0]*e),0,S[0]?fz-.9:Math.min(fz,fz+S[1]*e),S[1]?fx+.9:Math.max(fx,fx+S[0]*e),2.6,S[0]?fz+.9:Math.max(fz,fz+S[1]*e),1,1,col(o.shop?'#1f2937':'#4b2e1a'));
  const ox=fx+S[0]*2.2,oz=fz+S[1]*2.2,ry={'+z':0,'-z':Math.PI,'+x':Math.PI/2,'-x':-Math.PI/2}[side],len=S[1]?X1-X0:Z1-Z0;
  const nm=o.shop||o.sign||(o.poi&&o.poi.name);
  if(nm)ksign(nm,fx+S[0]*.08,Math.min(sg,H)+.7,fz+S[1]*.08,ry,Math.min(len*.9,9),1.1,o.bg);
  if(o.shop||o.poi){const ty2=(o.poi&&o.poi.type)||o.type||'shop';pois.push({x:ox,z:oz,name:nm,type:ty2,verb:VERB[ty2]||'Ver'})}
  else houses.push({door:true,x:ox,z:oz,tx,ty,fam:'Kilamba',addr:`Kilamba · Edifício ${++nb}, Apt ${ri(1,48)}`,color:'#efe6d2',safe:0,n:ri(2,5),inc:ri(150,900)*1000,sat:ri(40,90),exit:[fx+S[0]*3.3,fz+S[1]*3.3,[S[0],S[1]]],city:'Kilamba'})}
 const prop=(x,z,sx,sy,sz,c,r)=>{kbox(B.det,x-sx/2,0,z-sz/2,x+sx/2,sy,z+sz/2,1,1,col(c),col(c),B.det);if(r)addCol(x,z,r)};
 function pcar(x,z,alongX,c){const hx=alongX?2.1:.95,hz=alongX?.95:2.1;kbox(B.det,x-hx,.35,z-hz,x+hx,1,z+hz,1,1,col(c),col(c),B.det);kbox(B.det,x-hx*(alongX?.55:.8),1,z-hz*(alongX?.8:.55),x+hx*(alongX?.55:.8),1.5,z+hz*(alongX?.8:.55),1,1,col('#9fc0d8'),col('#b6cfe6'),B.det);
  const dx=alongX?1.2:0,dz=alongX?0:1.2;addCol(x+dx,z+dz,1);addCol(x-dx,z-dz,1)}
 const CC=['#e5e7eb','#111827','#9ca3af','#dc2626','#2563eb','#f5f5f4'];
 const SHOPS={0:[['Geladaria Gelados Quivi','food']],2:[['Hamburgueria Molho Sujo','food']],3:[['Rabugento Kilamba','food']],4:[['Farmácia Mecofarma Kilamba','pharm'],['Supermercado','shop'],['Carlos Garcia Miguel','food']],5:[['Picanha na Tábua','food'],['Restaurante e Bar o Rei do Fino','food']]};
 for(let bj=0;bj<2;bj++)for(let bi=0;bi<3;bi++){const bx0=vx(bi)+AV,by0=hy(bj)+AV,id=bj*3+bi,cxm=bx0+17,cym=by0+15,shops=(SHOPS[id]||[]).slice();
  road('h',by0+4,bx0+4,bx0+BW-5,1,{noCar:1});road('h',by0+BH-5,bx0+4,bx0+BW-5,1,{noCar:1});road('v',bx0+4,by0+4,by0+BH-5,1,{noCar:1});road('v',bx0+BW-5,by0+4,by0+BH-5,1,{noCar:1});
  road('v',cxm,by0,by0+4,1,{noCar:1});road('v',cxm,by0+BH-5,by0+BH-1,1,{noCar:1});road('h',cym,bx0,bx0+4,1,{noCar:1});road('h',cym,bx0+BW-5,bx0+BW-1,1,{noCar:1});
  const fl=()=>rnd([12,12,12,13,10,11]);
  for(let x=bx0+2;x+4<=bx0+BW-2;x+=5){if(x<=cxm+1&&x+4>cxm-1)continue;const s=shops.shift();bld(x,by0+1,4,2,fl(),'+z',s?{shop:s[0],type:s[1]}:{})}
  for(let x=bx0+2;x+4<=bx0+BW-2;x+=5){if(x<=cxm+1&&x+4>cxm-1)continue;bld(x,by0+BH-3,4,2,fl(),'-z')}
  for(let y=by0+4;y+4<=by0+BH-4;y+=5){if(y<=cym+1&&y+4>cym-1)continue;bld(bx0+1,y,2,4,fl(),'+x');bld(bx0+BW-3,y,2,4,fl(),'-x')}
  for(let x=bx0+7;x+4<=bx0+BW-7;x+=5){bld(x,by0+6,4,2,fl(),'-z');bld(x,by0+BH-8,4,2,fl(),'+z')}
  for(let y=by0+10;y+4<=by0+BH-10;y+=5){bld(bx0+6,y,2,4,fl(),'-x');bld(bx0+BW-8,y,2,4,fl(),'+x')}
  for(const s of shops)bld(bx0+12,by0+11,5,2,3,'+z',{shop:s[0],type:s[1]});
  const gx=bx0+10,gy=by0+10;
  if(id===0){bld(gx+1,gy+1,8,3,3,'+z',{sign:'ISCED',poi:{type:'school',name:'ISCED'},tint:'#f3e3b3'});flat(0x5f9a4a,8*T,4*T,(gx+5)*T,.05,(gy+6.5)*T);for(const[a,b,c,d]of[[gx+1,gy+4.5,gx+9,gy+4.6],[gx+1,gy+8.4,gx+9,gy+8.5]])flat(0xffffff,(c-a)*T,.2,(a+c)/2*T,.06,(b)*T)}
  else if(id===1){bld(gx+1,gy+1,8,3,4,'+z',{sign:'INAAREES',poi:{type:'gov',name:'INAAREES'},tint:'#e6dcc3',bg:'#334155'});flat(0x5b5d63,10*T,3*T,(gx+5)*T,.05,(gy+7)*T);for(let k=0;k<6;k++)pcar((gx+1+k*1.5)*T+3,(gy+7)*T,false,rnd(CC))}
  else if(id===2){for(let k=0;k<26;k++)addTree((gx+.5+Math.random()*11)*T,(gy+.5+Math.random()*7)*T);flat(0xd6cfba,2*T,9*T,(gx+6)*T,.05,(gy+4)*T);for(let k=0;k<5;k++)prop((gx+3+k*1.5)*T,(gy+1)*T,1.6,.5,.5,'#7c4a21',.7);prop((gx+10)*T,(gy+5)*T,1.5,1.2,1.5,'#ef4444',1);prop((gx+11)*T,(gy+6)*T,1.5,1.8,1.5,'#3b82f6',1);prop((gx+10)*T,(gy+7)*T,1.5,.9,1.5,'#facc15',1);
   ksign('Parque Quarteirão C',(gx+6)*T,2.6,(gy+8.8)*T,0,5,1.2,'#166534');pois.push({x:(gx+6)*T,z:(gy+8)*T,name:'Parque Quarteirão C',type:'park',verb:VERB.park})}
  else if(id===3){for(let r=0;r<3;r++)for(let k=0;k<6;k++)prop((gx+1+k*2.2)*T,(gy+1.5+r*2.4)*T,2.4,2.2,2,rnd(['#f59e0b','#ef4444','#3b82f6','#16a34a','#a855f7']),1.4);ksign('Feira do Kilamba',(gx+7)*T,3.2,(gy-.4)*T,Math.PI,6,1.3,'#b45309');pois.push({x:(gx+7)*T,z:(gy+8.4)*T,name:'Feira do Kilamba',type:'market',verb:VERB.market})}
  else if(id===4){flat(0xdcd6c2,12*T,8*T,(gx+7)*T,.05,(gy+4.5)*T);bx(0x9ca3af,5,.6,5,(gx+7)*T,.3,(gy+5)*T,scene,gCyl);bx(0x60a5fa,3.6,.7,3.6,(gx+7)*T,.35,(gy+5)*T,scene,gCyl);addCol((gx+7)*T,(gy+5)*T,3);
   bld(gx+1,gy+1,6,2,2,'+z',{shop:'Centralidade do Kilamba',type:'shop'});bld(gx+9,gy+1,4,2,2,'+z',{sign:'ESQUADRA DE POLÍCIA',poi:{type:'police',name:'Esquadra de Polícia do Kilamba'},tint:'#dbe4f5',bg:'#1e3a8a'});pcar((gx+11)*T,(gy+5.6)*T,true,'#f8fafc');pcar((gx+11)*T,(gy+7.2)*T,true,'#f8fafc')}
  else{flat(0x5b5d63,12*T,4*T,(gx+6.5)*T,.05,(gy+7)*T);for(let k=0;k<7;k++){pcar((gx+1.2+k*1.7)*T,(gy+6)*T,false,rnd(CC));pcar((gx+1.2+k*1.7)*T,(gy+8)*T,false,rnd(CC))}for(let k=0;k<14;k++)addTree((gx+.5+Math.random()*12)*T,(gy+.5+Math.random()*3)*T)}
  KIL.lbl.push({x:bx0+BW/2,y:by0+BH/2,text:['ISCED','INAAREES','Parque Quarteirão C','Feira do Kilamba','Centralidade do Kilamba','Quarteirão'][id]});
  // candeeiros e árvores nos passeios
  const ed=(tx,ty)=>{if(isRoad(tx,ty)||occ.has(tx+','+ty))return;addLamp(tx,ty)},ef=(tx,ty)=>{if(!isRoad(tx,ty)&&!occ.has(tx+','+ty)&&Math.random()<.8)addTree((tx+.5)*T,(ty+.5)*T)};
  for(let k=2;k<BW-1;k+=5){ed(bx0+k,by0);ed(bx0+k,by0+BH-1);ef(bx0+k+2,by0);ef(bx0+k+2,by0+BH-1)}for(let k=2;k<BH-1;k+=5){ed(bx0,by0+k);ed(bx0+BW-1,by0+k);ef(bx0,by0+k+2);ef(bx0+BW-1,by0+k+2)}}
 // vedação do limite
 const fx0=(x0-6)*T,fx1=(x0+w+6)*T,fz0=(y0-6)*T,fz1=(y0+h+6)*T,fc=col('#6b7280');
 kbox(B.det,fx0,0,fz0,fx1,1.6,fz0+.3,2,2,fc);kbox(B.det,fx0,0,fz1-.3,fx1,1.6,fz1,2,2,fc);kbox(B.det,fx0,0,fz0,fx0+.3,1.6,fz1,2,2,fc);kbox(B.det,fx1-.3,0,fz0,fx1,1.6,fz1,2,2,fc);
 const lm=m=>new THREE.MeshLambertMaterial({map:m,vertexColors:true}),vm=new THREE.MeshLambertMaterial({vertexColors:true});
 kmesh(B.cream,lm(tC));kmesh(B.yellow,lm(tY));kmesh(B.shop,lm(tS));kmesh(B.roof,vm);kmesh(B.det,vm);
 KIL.names=[['Rua Alameda Agostinho Neto',vx(2)+1,y0+8,true],['R. Amílcar Cabral',x0+16,hy(1)+1,false]]}
// ---- polícia ----
function spawnPolice(n){const rs=roads.filter(r=>r.city===KC&&!r.noCar);for(let i=0;i<n;i++){const r=rnd(rs),v=r.t==='v',s=Math.random()<.5?1:-1,wd=r.w||1,m=mkPerson('#1d4ed8',rnd(SKIN),'#0b1f4d');bx('#0b1f4d',.34,.09,.34,0,.15,0,m.head);bx('#0b1f4d',.3,.03,.18,0,.1,.18,m.head);scene.add(m.g);
 const o={...m,v,w:wd,c:(r.p+wd/2)*T,a:(r.lo+Math.random()*(r.hi-r.lo))*T,lo:r.lo*T,hi:(r.hi+1)*T,s,sp:.9+Math.random()*.4,ph:Math.random()*9,lat:(v?-s:s)*(3*wd+.15),wait:0,far:false,x:0,z:0,name:'Agente '+rnd(FN)+' '+rnd(SUR),age:ri(24,50),job:'Polícia',police:true};
 o.x=v?o.c+o.lat:o.a;o.z=v?o.a:o.c+o.lat;o.g.position.set(o.x,0,o.z);npcs.push(o)}separateNPCs(30)}
function spawnPoliceCars(n){const rs=roads.filter(r=>r.city===KC&&!r.noCar);for(let i=0,t=0;i<n&&t<60;t++){const r=rnd(rs),v=r.t==='v',wd=r.w||1,c={v,w:wd,c:(r.p+wd/2)*T,a:(r.lo+Math.random()*(r.hi-r.lo))*T,lo:r.lo*T,hi:(r.hi+1)*T,s:Math.random()<.5?1:-1,sp:6,npc:1,x:0,z:0,heading:0,vel:0,lat:0,model:'Viatura da Polícia',fuel:100,owned:0,steer:0,wait:0,far:false};
 c.g=mkCar('#f8fafc',c);bx(0x2563eb,.5,.14,.3,-.35,1.62,-.2,c.g);bx(0xef4444,.5,.14,.3,.35,1.62,-.2,c.g);placeCar(c);if(hitsCars(c.x,c.z,1.5,c)){scene.remove(c.g);continue}cars.push(c);i++}}
// ---- lojas, restaurantes, farmácia... ----
function poiBuy(p,h,e,n){if(player.money<p){toast('Sem dinheiro');return}player.money-=p;player.hunger=clamp(player.hunger-h,0,100);player.energy=clamp(player.energy+e,0,100);updateLifeUI();MS.hook('rest');logLife('Compraste: '+n)}
function poiAction(p){const t=p.type;
 if(t==='shop'||t==='market')return actionMarket();
 if(t==='food')return openPn(`<h3>🍽️ ${p.name}</h3>`+row('Refeição completa — 2.500 Kz',`<button class="btn" onclick="poiBuy(2500,35,10,'refeição')">Comprar</button>`)+row('Sumo / gelado — 800 Kz',`<button class="btn" onclick="poiBuy(800,8,4,'sumo/gelado')">Comprar</button>`));
 if(t==='pharm')return openPn(`<h3>💊 ${p.name}</h3>`+row('Vitaminas — 3.000 Kz',`<button class="btn" onclick="poiBuy(3000,0,20,'vitaminas')">Comprar</button>`)+row('Paracetamol — 1.200 Kz',`<button class="btn" onclick="poiBuy(1200,0,8,'paracetamol')">Comprar</button>`));
 if(t==='police'){MS.hook('talk');return toast('👮 Esquadra de Polícia do Kilamba — o agente cumprimenta-te.')}
 toast('📍 '+p.name)}
// ---- mapa do Kilamba (minimapa e mapa grande) ----
function drawKilBase(ctx,X,Y,k,w,h,small){ctx.fillStyle='#d8bd8a';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#c9c4b3';for(const b of KIL.blk)ctx.fillRect(X(b.x),Y(b.y),b.w*k,b.h*k);ctx.fillStyle='#8a9a5a';for(const g of KIL.grn)ctx.fillRect(X(g.x),Y(g.y),g.w*k,g.h*k);
 ctx.fillStyle='#4b4f57';for(const r of roads){if(r.city!==KC)continue;const wd=r.w||1;if(r.t==='v')ctx.fillRect(X(r.p),Y(r.lo),wd*k,(r.hi-r.lo+1)*k);else ctx.fillRect(X(r.lo),Y(r.p),(r.hi-r.lo+1)*k,wd*k)}
 for(const b of KIL.bl){ctx.fillStyle=b.c;ctx.fillRect(X(b.x),Y(b.y),b.w*k,b.h*k)}
 ctx.font=`bold ${small?9:12}px system-ui`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.fillStyle='#fff';
 if(!small||k>=3){for(const p of pois){const x=X(p.x/T),y=Y(p.z/T);ctx.fillStyle=p.type==='police'?'#60a5fa':p.type==='food'?'#fb923c':p.type==='pharm'?'#ef4444':'#fbbf24';ctx.beginPath();ctx.arc(x,y,3.5,0,7);ctx.fill();if(!small){ctx.fillStyle='#fff';ctx.strokeText(p.name,x,y-7);ctx.fillText(p.name,x,y-7)}}
  ctx.fillStyle='#fff';for(const n of KIL.names){const x=X(n[1]),y=Y(n[2]);ctx.strokeText(n[0],x,y);ctx.fillText(n[0],x,y)}}}
