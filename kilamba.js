// kilamba.js — Quarteirão A do Kilamba (maquete fiel à foto): prédios em H (10/8/4 andares), escolas em U e L, lojas, praça, ruas, carros, pessoas e polícia
const KC=CITIES.find(c=>c.id==='kilamba');Object.assign(KIL,{blk:[],grn:[],bl:[],lbl:[],names:[]});
const LD=(()=>{const l=[.5,.8,.35],n=Math.hypot(l[0],l[1],l[2]);return l.map(v=>v/n)})();
const shd=n=>Math.min(1,.8+.3*Math.max(0,n[0]*LD[0]+n[1]*LD[1]+n[2]*LD[2]));   // sombreado "cozinhado": não depende das luzes
const kbuf=()=>({p:[],n:[],u:[],c:[]});
function kface(b,v,n,uv,c){const f=shd(n);for(const i of[0,1,2,0,2,3]){b.p.push(v[i][0],v[i][1],v[i][2]);b.n.push(n[0],n[1],n[2]);b.u.push(uv[i][0],uv[i][1]);b.c.push(c[0]*f,c[1]*f,c[2]*f)}}
function kwall(b,s,x0,y0,z0,x1,y1,z1,tu,tv,c){const Lx=x1-x0,Lz=z1-z0,H=y1-y0;
 if(s==='+z')kface(b,[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],[0,0,1],[[0,0],[Lx/tu,0],[Lx/tu,H/tv],[0,H/tv]],c);
 else if(s==='-z')kface(b,[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]],[0,0,-1],[[0,0],[Lx/tu,0],[Lx/tu,H/tv],[0,H/tv]],c);
 else if(s==='+x')kface(b,[[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]],[1,0,0],[[0,0],[Lz/tu,0],[Lz/tu,H/tv],[0,H/tv]],c);
 else kface(b,[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]],[-1,0,0],[[0,0],[Lz/tu,0],[Lz/tu,H/tv],[0,H/tv]],c)}
function kbox(b,x0,y0,z0,x1,y1,z1,tu,tv,c,top,tb){for(const s of['+z','-z','+x','-x'])kwall(b,s,x0,y0,z0,x1,y1,z1,tu,tv,c);if(top)kface(tb,[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]],[0,1,0],[[0,0],[1,0],[1,1],[0,1]],top)}
const kflat=(b,x0,z0,x1,z1,y,c)=>kface(b,[[x0,y,z1],[x1,y,z1],[x1,y,z0],[x0,y,z0]],[0,1,0],[[0,0],[1,0],[1,1],[0,1]],c);
function kpoly(b,v,c,uvf){let n=cross3(v[0],v[1],v[2]);if(n[1]<0){v=v.slice().reverse();n=[-n[0],-n[1],-n[2]]}const f=shd(n),idx=v.length===3?[0,1,2]:[0,1,2,0,2,3];
 for(const i of idx){const p=v[i];b.p.push(p[0],p[1],p[2]);b.n.push(n[0],n[1],n[2]);b.u.push((p[0]+p[2])/3.2,p[1]/1.1);b.c.push(c[0]*f,c[1]*f,c[2]*f)}}
function cross3(a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],w=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],l=Math.hypot(n[0],n[1],n[2])||1;return[n[0]/l,n[1]/l,n[2]/l]}
function khip(b,x0,z0,x1,z1,y0,rh,ov,c){const a=x0-ov,e=x1+ov,q0=z0-ov,q1=z1+ov,w=e-a,d=q1-q0,t=y0+rh,P0=[a,y0,q0],P1=[e,y0,q0],P2=[e,y0,q1],P3=[a,y0,q1];
 if(d>=w){const cx=(a+e)/2,r0=[cx,t,q0+w/2],r1=[cx,t,q1-w/2];kpoly(b,[P0,P3,r1,r0],c);kpoly(b,[P1,r0,r1,P2],c);kpoly(b,[P0,P1,r0],c);kpoly(b,[P2,P3,r1],c)}
 else{const cz=(q0+q1)/2,r0=[a+d/2,t,cz],r1=[e-d/2,t,cz];kpoly(b,[P0,P1,r1,r0],c);kpoly(b,[P2,P3,r0,r1],c);kpoly(b,[P3,P0,r0],c);kpoly(b,[P1,P2,r1],c)}}
function kmesh(b,m,ds){if(!b.p.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(b.u,2));g.setAttribute('color',new THREE.Float32BufferAttribute(b.c,3));const o=new THREE.Mesh(g,m);o.frustumCulled=false;scene.add(o);return o}
function mkTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
// ---- texturas (cores tiradas da foto: creme/branco, amarelo, base castanha, telha amarela) ----
function drawFac(g,wall,strip){g.fillStyle=wall;g.fillRect(0,0,256,64);g.fillStyle=strip;g.fillRect(0,0,14,64);g.fillRect(242,0,14,64);
 for(const x of[26,68,160,202]){g.fillStyle='#f7f2e4';g.fillRect(x-2,12,36,42);g.fillStyle='#5f86ad';g.fillRect(x,14,32,38);g.fillStyle='#9fbad3';g.fillRect(x,14,32,8);g.fillStyle='#f7f2e4';g.fillRect(x+15,14,2,38)}
 g.fillStyle='#f4efe0';g.fillRect(110,6,36,54);g.fillStyle=strip;for(let i=0;i<6;i++)g.fillRect(112+i*6,10,3,46);g.fillStyle='rgba(255,255,255,.0)';for(let i=0;i<6;i++)g.fillRect(112+i*6,10,2,46);g.fillStyle='#f4efe0';g.fillRect(108,58,40,4);
 g.fillStyle='#8a8478';g.fillRect(102,4,4,56);g.fillRect(150,4,4,56);g.fillStyle='rgba(0,0,0,.3)';for(let y=6;y<58;y+=4){g.fillRect(102,y,4,1);g.fillRect(150,y,4,1)}g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,62,256,2)}
function drawBase(g){g.fillStyle='#7a5a47';g.fillRect(0,0,256,64);g.fillStyle='rgba(0,0,0,.18)';for(let y=0;y<64;y+=16)g.fillRect(0,y,256,2);for(let x=0;x<256;x+=32)g.fillRect(x,0,2,64);g.fillStyle='#2f3b47';for(const x of[28,92,160,224]){g.fillRect(x,18,30,26);g.fillStyle='#8aa6bd';g.fillRect(x,18,30,6);g.fillStyle='#2f3b47'}g.fillStyle='#e6b21f';g.fillRect(0,0,256,5)}
function drawShop(g){g.fillStyle='#f1ead8';g.fillRect(0,0,128,128);for(let i=0;i<8;i++){g.fillStyle=i%2?'#f59e0b':'#b45309';g.fillRect(i*16,0,16,24)}g.fillStyle='#3f6b8f';g.fillRect(8,34,112,86);g.fillStyle='#8fb6d6';g.fillRect(8,34,112,14);g.fillStyle='#1f2937';g.fillRect(52,48,26,72);g.fillStyle='#e5e7eb';g.fillRect(63,34,2,86);g.fillStyle='#7a5a47';g.fillRect(0,120,128,8)}
function drawShopUp(g){g.fillStyle='#f4efe0';g.fillRect(0,0,128,64);g.fillStyle='#e6b21f';g.fillRect(0,0,6,64);g.fillRect(122,0,6,64);g.fillStyle='#3f6b8f';g.fillRect(14,12,100,38);g.fillStyle='#8fb6d6';g.fillRect(14,12,100,9);g.fillStyle='#f7f2e4';for(let x=38;x<110;x+=24)g.fillRect(x,12,2,38);g.fillStyle='#d97706';g.fillRect(10,4,108,6)}
function drawSchool(g){g.fillStyle='#f5e6b5';g.fillRect(0,0,128,64);g.fillStyle='#e8c25a';g.fillRect(0,0,128,5);g.fillStyle='#f7f2e4';g.fillRect(8,14,112,34);g.fillStyle='#4f7fb0';g.fillRect(10,16,108,30);g.fillStyle='#8fb6d6';g.fillRect(10,16,108,8);g.fillStyle='#f7f2e4';for(let x=34;x<118;x+=24)g.fillRect(x,16,2,30);g.fillStyle='rgba(0,0,0,.1)';g.fillRect(0,60,128,4)}
function drawRoof(g){g.fillStyle='#e0a21b';g.fillRect(0,0,64,64);for(let y=0;y<64;y+=8){g.fillStyle='#b97f0f';g.fillRect(0,y,64,2);g.fillStyle='#f0b83a';g.fillRect(0,y+2,64,2)}g.fillStyle='rgba(0,0,0,.12)';for(let x=0;x<64;x+=16)g.fillRect(x,0,1,64)}
const signMat={};
function ksign(text,x,y,z,ry,w,h,bg){const k=text+(bg||''),bgc=bg||'#0f766e';let m=signMat[k];if(!m){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle=bgc;g.fillRect(0,0,256,64);g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(3,3,250,58);g.fillStyle='#fff';let fs=26;g.font=`bold ${fs}px system-ui`;while(g.measureText(text).width>236&&fs>10){fs--;g.font=`bold ${fs}px system-ui`}g.textAlign='center';g.textBaseline='middle';g.fillText(text,128,34);m=signMat[k]=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)})}
 const o=new THREE.Mesh(gP,m);o.scale.set(w,h,1);o.position.set(x,y,z);o.rotation.y=ry;scene.add(o);return o}
function addCol(x,z,r){const k=Math.floor(x/T)+','+Math.floor(z/T);(trees.get(k)||trees.set(k,[]).get(k)).push({x,z,r})}
const VERB={shop:'Comprar em',food:'Comer em',pharm:'Ir à',police:'Falar na',school:'Ver a',gov:'Ver o',park:'Passear no',market:'Visitar a'};
const SHOPN=[['Mini-mercado','shop'],['Farmácia','pharm'],['Cabeleireiro','shop'],['Padaria','food'],['Papelaria','shop'],['Restaurante','food'],['Lanchonete','food'],['Telecomunicações','shop'],['Boutique','shop'],['Barbearia','shop'],['Clínica','pharm'],['Frutaria','shop'],['Talho','shop'],['Ferragens','shop'],['Lavandaria','shop'],['Pastelaria','food']];
function buildKilamba(){
 const{x0,y0,w,h,BW,BH,AV}=KIL,col=hx=>{const c=new THREE.Color(hx);return[c.r,c.g,c.b]},B={fac:kbuf(),facY:kbuf(),base:kbuf(),shop:kbuf(),shopUp:kbuf(),school:kbuf(),roof:kbuf(),det:kbuf()};
 const YL=col('#e9c24a'),WHT=col('#f2f2ee'),vx=[x0,x0+BW+AV],hy=[y0,y0+BH+AV],bx0=x0+AV,by0=y0+AV,ex=10;let nb=0,sh=0;
 const shopQ=SHOPN.slice().sort(()=>Math.random()-.5);
 // ---- chão: terra, pavimento, relvados ----
 kflat(B.det,bx0*T,by0*T,(bx0+BW)*T,(by0+BH)*T,.02,col('#c7c2b4'));KIL.blk.push({x:bx0,y:by0,w:BW,h:BH});
 const L=(lx,ly,lw,lh,c,y)=>{kflat(B.det,(bx0+lx)*T,(by0+ly)*T,(bx0+lx+lw)*T,(by0+ly+lh)*T,y||.05,col(c))},G='#5f8f35',G2='#6c9a3c';
 L(0,3,BW,1,G);L(0,36,BW,1,G);L(3,3,1,BH-6,G);L(42,3,1,BH-6,G);L(5,5,BW-10,1,G2);L(5,34,BW-10,1,G2);L(14,12,18,2,G);L(14,24,18,2,G);L(14,14,1,10,G);L(31,14,1,10,G);L(6,10,BW-12,1,G2);L(6,29,BW-12,1,G2);
 for(let k=0;k<14;k++)L(7+Math.floor(Math.random()*30),10+Math.floor(Math.random()*18),2+Math.floor(Math.random()*3),1+Math.floor(Math.random()*2),rnd(['#b98a5e','#b0835a','#c19467']),.07);
 L(15,14,16,10,'#ddd6c1',.09);L(16,15,14,8,'#d3cbb2',.11);L(17,16,12,6,'#ddd6c1',.13);KIL.grn.push({x:bx0+15,y:by0+14,w:16,h:10});
 // ---- ruas ----
 function road(t,p,lo,hi,wd,o={}){for(let i=lo;i<=hi;i++)for(let k=0;k<wd;k++)roadSet.add((t==='v'?p+k:i)+','+(t==='v'?i:p+k));roads.push({t,p,lo,hi,w:wd,city:o.city===undefined?KC:o.city,main:o.main,noCar:o.noCar,ped:o.ped});
  const c=col(o.c||'#46494f');if(t==='v')kflat(B.det,p*T,lo*T,(p+wd)*T,(hi+1)*T,.18,c);else kflat(B.det,lo*T,p*T,(hi+1)*T,(p+wd)*T,.18,c)}
 const qa=(t,c0,c1,a0,a1,y,cl)=>t==='v'?kflat(B.det,c0,a0,c1,a1,y,cl):kflat(B.det,a0,c0,a1,c1,y,cl);
 function marks(t,p,wd,lo,hi,cuts){const c=(p+wd/2)*T;let segs=[[lo*T,(hi+1)*T]];for(const[a,b]of cuts){const nx=[];for(const[s,e]of segs){const A=a*T,Z=(b+1)*T;if(Z<=s||A>=e){nx.push([s,e]);continue}if(A>s)nx.push([s,A]);if(Z<e)nx.push([Z,e])}segs=nx}
  for(const[s,e]of segs){qa(t,c-.25,c-.13,s,e,.22,YL);qa(t,c+.13,c+.25,s,e,.22,YL);qa(t,c-wd*T/2+.4,c-wd*T/2+.55,s,e,.22,WHT);qa(t,c+wd*T/2-.55,c+wd*T/2-.4,s,e,.22,WHT);for(let a=s+1.5;a+3<=e;a+=6){qa(t,c-3.07,c-2.93,a,a+3,.22,WHT);qa(t,c+2.93,c+3.07,a,a+3,.22,WHT)}}}
 const zebra=(t,c0,c1,a0)=>{for(let c=c0+.8;c+1.2<=c1-.8;c+=2.2)qa(t,c,c+1.2,a0,a0+2.5,.24,WHT)};
 const ya=y0-ex+1,yb=y0+h+ex-2,xa=x0-ex+1,xb=x0+w+ex-2;
 for(const X of vx)road('v',X,ya,yb,AV,{main:1});for(const Y of hy)road('h',Y,xa,xb,AV,{main:1});
 for(const X of vx)marks('v',X,AV,ya,yb,hy.map(Y=>[Y,Y+AV-1]));for(const Y of hy)marks('h',Y,AV,xa,xb,vx.map(X=>[X,X+AV-1]));
 vx.forEach((X,i)=>hy.forEach((Y,j)=>{const xe=(X+AV)*T,ye=(Y+AV)*T;
  zebra('v',X*T,xe,Y*T-3.5);zebra('v',X*T,xe,ye+1);zebra('h',Y*T,ye,X*T-3.5);zebra('h',Y*T,ye,xe+1);
  for(const[px,pz,sx,sz]of[[X*T-1.5,Y*T-1.5,1,1],[xe+1.5,Y*T-1.5,-1,1],[X*T-1.5,ye+1.5,1,-1],[xe+1.5,ye+1.5,-1,-1]]){
   kbox(B.det,px-.12,0,pz-.12,px+.12,5.5,pz+.12,1,1,col('#2d3138'),col('#2d3138'),B.det);kbox(B.det,px-.3,5.5,pz-.3,px+.3,6.9,pz+.3,1,1,col('#1f2328'),col('#1f2328'),B.det);
   const lit=Math.random()<.5?0:2;[['#ef4444',6.55],['#f59e0b',6.2],['#22c55e',5.85]].forEach((l,k)=>kbox(B.det,px+sx*.3-.1,l[1]-.1,pz+sz*.3-.1,px+sx*.3+.1,l[1]+.1,pz+sz*.3+.1,1,1,col(k===lit?l[0]:'#3a3f47'),col(k===lit?l[0]:'#3a3f47'),B.det));addCol(px,pz,.3)}
  ksign(j===1?'R. Amílcar Cabral':'Avenida H1',X*T-1.5,4.2,Y*T-1.2,0,3.6,.9,'#1d4ed8');ksign(i===0?'Rua Alameda Agostinho Neto':'Avenida V2',xe+1.2,4.2,Y*T-1.5,Math.PI/2,3.6,.9,'#15803d')}));
 KIL.names=[['Rua Alameda Agostinho Neto',x0+1.5,y0+h/2,true],['R. Amílcar Cabral',x0+w/2,y0+BH+AV+1.5,false]];
 // anel interior, acessos e caminhos da praça
 const ring=(t,p,lo,hi)=>road(t,p,lo,hi,1,{noCar:1,ped:2.3,c:'#4b4e54'});
 ring('h',by0+4,bx0+4,bx0+BW-5);ring('h',by0+BH-5,bx0+4,bx0+BW-5);ring('v',bx0+4,by0+4,by0+BH-5);ring('v',bx0+BW-5,by0+4,by0+BH-5);
 ring('v',bx0+22,by0,by0+4);ring('v',bx0+22,by0+BH-5,by0+BH-1);ring('h',by0+19,bx0,bx0+4);ring('h',by0+19,bx0+BW-5,bx0+BW-1);
 road('h',by0+18,bx0+5,bx0+BW-6,1,{noCar:1,ped:1.8,c:'#cfc7ae'});road('v',bx0+22,by0+5,by0+BH-6,1,{noCar:1,ped:1.8,c:'#cfc7ae'});
 // ---- materiais ----
 const tFac=mkTex(256,64,g=>drawFac(g,'#f3ecd8','#e6b21f')),tFacY=mkTex(256,64,g=>drawFac(g,'#e8b422','#f4efe0')),tBase=mkTex(256,64,drawBase),tShop=mkTex(128,128,drawShop),tShopUp=mkTex(128,64,drawShopUp),tSchool=mkTex(128,64,drawSchool),tRoof=mkTex(64,64,drawRoof);
 // ---- volumes ----
 const RCOL=['#ffffff','#fff6dd','#ffe9b8'];
 function wing(tx,ty,wt,dt,fl,o={}){const X0=tx*T,Z0=ty*T,X1=(tx+wt)*T,Z1=(ty+dt)*T,bh=o.shopSide?4.5:3,H=o.school?3*fl:bh+(fl-1)*3,yT=fl>=4?H-6:H,cc=o.cc||col('#ffffff');
  for(const s of o.sides||['+z','-z','+x','-x']){
   if(o.school){kwall(B.school,s,X0,0,Z0,X1,H,Z1,6,3,cc);continue}
   const sp=s===o.shopSide;kwall(sp?B.shop:B.base,s,X0,0,Z0,X1,bh,Z1,sp?6:12,sp?4.5:bh,sp?[1,1,1]:cc);let y1=bh;
   if(o.upSide===s&&yT>bh+3){kwall(B.shopUp,s,X0,bh,Z0,X1,bh+3,Z1,6,3,[1,1,1]);y1=bh+3}
   if(yT>y1)kwall(B.fac,s,X0,y1,Z0,X1,yT,Z1,12,3,cc);if(fl>=4)kwall(B.facY,s,X0,yT,Z0,X1,H,Z1,12,3,cc)}
  if(o.roof==='hip')khip(B.roof,X0,Z0,X1,Z1,H,Math.min(wt,dt)*T*.3,.6,col(o.rc||'#ffffff'));
  else{kflat(B.det,X0,Z0,X1,Z1,H,col(o.school?'#c9c3b2':'#9b968a'));if(o.school){kbox(B.det,X0,H,Z0,X0+.3,H+.5,Z1,1,1,col('#e8e0c8'));kbox(B.det,X1-.3,H,Z0,X1,H+.5,Z1,1,1,col('#e8e0c8'));kbox(B.det,X0,H,Z0,X1,H+.5,Z0+.3,1,1,col('#e8e0c8'));kbox(B.det,X0,H,Z1-.3,X1,H+.5,Z1,1,1,col('#e8e0c8'))}}
  return H}
 const occT=(tx,ty,wt,dt,c)=>{for(let i=0;i<wt;i++)for(let j=0;j<dt;j++)occ.set((tx+i)+','+(ty+j),3.01);KIL.bl.push({x:tx,y:ty,w:wt,h:dt,c})};
 function door(fx,fz,S,shop){const e=.25;kbox(B.det,S[1]?fx-.9:Math.min(fx,fx+S[0]*e),0,S[0]?fz-.9:Math.min(fz,fz+S[1]*e),S[1]?fx+.9:Math.max(fx,fx+S[0]*e),2.6,S[0]?fz+.9:Math.max(fz,fz+S[1]*e),1,1,col(shop?'#1f2937':'#4b2e1a'));
  kbox(B.det,S[1]?fx-1.4:Math.min(fx,fx+S[0]*1.2),2.7,S[0]?fz-1.4:Math.min(fz,fz+S[1]*1.2),S[1]?fx+1.4:Math.max(fx,fx+S[0]*1.2),2.85,S[0]?fz+1.4:Math.max(fz,fz+S[1]*1.2),1,1,col('#b8b2a2'))}
 const aptDoor=(fx,fz,S,tx,ty)=>{door(fx,fz,S,false);houses.push({door:true,x:fx+S[0]*2.2,z:fz+S[1]*2.2,tx,ty,fam:'Kilamba',addr:`Kilamba · Edifício ${++nb}, Apt ${ri(1,48)}`,color:'#efe6d2',safe:0,n:ri(2,5),inc:ri(150,900)*1000,sat:ri(40,90),exit:[fx+S[0]*3.3,fz+S[1]*3.3,[S[0],S[1]]],city:'Kilamba'})};
 function hbld(tx,ty,fl,o={}){const cc=col(rnd(RCOL)),rc=rnd(['#ffffff','#fff3d0','#ffe6a8']);
  wing(tx,ty,2,4,fl,{cc,rc,roof:'hip'});wing(tx+3,ty,2,4,fl,{cc,rc,roof:'hip'});const Hc=wing(tx+2,ty+1,1,2,fl,{cc,sides:['-z','+z'],roof:'flat'});
  const cx=(tx+2.5)*T,cz=(ty+2)*T;kbox(B.det,cx-1.5,Hc,cz-1.5,cx+1.5,Hc+2.2,cz+1.5,1,1,col('#9b978c'),col('#8b877d'),B.det);
  if(o.decor)return;occT(tx,ty,2,4,'#e8c66a');occT(tx+3,ty,2,4,'#e8c66a');occT(tx+2,ty+1,1,2,'#e8c66a');
  aptDoor(cx,(ty+1)*T,[0,-1],tx+2,ty+1);aptDoor(cx,(ty+3)*T,[0,1],tx+2,ty+1)}
 function sbld(tx,ty,wt,dt,front){const cc=col(rnd(RCOL)),rc=rnd(['#ffffff','#fff3d0','#ffe6a8']),S={'+z':[0,1],'-z':[0,-1],'+x':[1,0],'-x':[-1,0]},rear={'+z':'-z','-z':'+z','+x':'-x','-x':'+x'}[front],r=Math.random(),ground=r<.55,up=!ground&&r<.8;
  const H=wing(tx,ty,wt,dt,4,{cc,rc,roof:'hip',shopSide:ground?front:null,upSide:up?front:null});occT(tx,ty,wt,dt,ground||up?'#d97706':'#e8c66a');
  const X0=tx*T,Z0=ty*T,X1=(tx+wt)*T,Z1=(ty+dt)*T,fc=s=>[S[s][0]?(S[s][0]>0?X1:X0):(X0+X1)/2,S[s][1]?(S[s][1]>0?Z1:Z0):(Z0+Z1)/2],ry={'+z':0,'-z':Math.PI,'+x':Math.PI/2,'-x':-Math.PI/2},len=(front==='+z'||front==='-z')?X1-X0:Z1-Z0;
  const[rx,rz]=fc(rear);aptDoor(rx,rz,S[rear],tx,ty);
  if(ground||up){const sq=shopQ[sh++%shopQ.length],[fx,fz]=fc(front),n=S[front];door(fx,fz,n,true);ksign(sq[0],fx+n[0]*.08,ground?5.2:4.5+1.5,fz+n[1]*.08,ry[front],Math.min(len*.8,8),1,'#b45309');pois.push({x:fx+n[0]*2.4,z:fz+n[1]*2.4,name:sq[0],type:sq[1],verb:VERB[sq[1]],nx:n[0],nz:n[1]})}}
 function school(pieces,doorSide,name,type){const S={'+z':[0,1],'-z':[0,-1]}[doorSide],ry=doorSide==='+z'?0:Math.PI;let first=true;
  for(const[tx,ty,wt,dt]of pieces){wing(tx,ty,wt,dt,2,{school:true,cc:col('#ffffff')});occT(tx,ty,wt,dt,'#e6dcc3');
   if(first){first=false;const X0=tx*T,X1=(tx+wt)*T,Z0=ty*T,Z1=(ty+dt)*T,fx=(X0+X1)/2,fz=S[1]>0?Z1:Z0;door(fx,fz,S,true);ksign(name,fx,6.9,fz+S[1]*.08,ry,7,1.2,'#1d4ed8');pois.push({x:fx,z:fz+S[1]*2.4,name,type:'school',verb:VERB.school,nx:0,nz:S[1]})}}}
 // --- escolas e creches (U e L) nos cantos interiores ---
 school([[bx0+6,by0+6,8,2],[bx0+6,by0+8,2,2],[bx0+12,by0+8,2,2]],'-z','ISCED');
 school([[bx0+32,by0+6,8,2],[bx0+38,by0+8,2,2]],'-z','Creche do Quarteirão A');
 school([[bx0+6,by0+32,8,2],[bx0+6,by0+30,2,2],[bx0+12,by0+30,2,2]],'+z','Escola Primária');
 school([[bx0+32,by0+32,8,2],[bx0+32,by0+30,2,2]],'+z','Creche');
 L(8,8,4,2,'#d8c08a',.08);L(34,8,4,2,'#d8c08a',.08);L(8,30,4,2,'#d8c08a',.08);L(34,30,4,2,'#d8c08a',.08);
 // --- prédios em H: 10 andares no centro, 8 andares nas laterais do largo ---
 for(const[lx,ly]of[[16,8],[24,8],[16,26],[24,26]])hbld(bx0+lx,by0+ly,10);
 for(const[lx,ly]of[[9,14],[9,19],[32,14],[32,19]])hbld(bx0+lx,by0+ly,8);
 // --- prédios de 4 andares à volta (lojas no rés-do-chão ou no 1º piso, virados para a avenida) ---
 for(let lx=2;lx+4<=BW-2;lx+=5){if(lx<=23&&lx+4>21)continue;sbld(bx0+lx,by0+1,4,2,'-z');sbld(bx0+lx,by0+37,4,2,'+z')}
 for(let ly=4;ly+4<=BH-4;ly+=5){if(ly<=20&&ly+4>18)continue;sbld(bx0+1,by0+ly,2,4,'-x');sbld(bx0+43,by0+ly,2,4,'+x')}
 // --- largo: quiosques, fontes, bancos, árvores ---
 for(const[lx,ly,nm,ty2,bg]of[[15,15,'Quiosque','shop','#b45309'],[30,22,'Quiosque','shop','#b45309'],[30,15,'Posto Policial','police','#1e3a8a']]){const tx=bx0+lx,ty=by0+ly;wing(tx,ty,1,1,1,{shopSide:'+z',roof:'flat'});occT(tx,ty,1,1,ty2==='police'?'#3b82f6':'#d97706');ksign(nm,(tx+.5)*T,5.2,(ty+1)*T+.08,0,4,.9,bg);pois.push({x:(tx+.5)*T,z:(ty+1)*T+2.4,name:nm,type:ty2,verb:VERB[ty2],nx:0,nz:1})}
 const cyl=(c,sx,sy,sz,x,y,z)=>{const o=new THREE.Mesh(gCyl,new THREE.MeshBasicMaterial({color:c}));o.scale.set(sx,sy,sz);o.position.set(x,y,z);scene.add(o)};
 for(const lz of[16,21]){const fx=(bx0+22.5)*T,fz=(by0+lz+.5)*T;cyl(0xaeb4bd,6,.7,6,fx,.35,fz);cyl(0x5aa6d6,5,.75,5,fx,.37,fz);cyl(0xaeb4bd,1.2,2.2,1.2,fx,1.4,fz);addCol(fx,fz,3.2)}
 const prop=(x,z,sx,sy,sz,c,r)=>{kbox(B.det,x-sx/2,0,z-sz/2,x+sx/2,sy,z+sz/2,1,1,col(c),col(c),B.det);if(r)addCol(x,z,r)};
 for(let k=0;k<6;k++){prop((bx0+17.5+k*2.2)*T,(by0+18.1)*T-2.5,1.8,.5,.5,'#7c4a21',.8)}
 for(let k=0;k<10;k++)addTree((bx0+15.5+Math.random()*15)*T,(by0+14.5+Math.random()*9)*T);
 KIL.lbl.push({x:bx0+23,y:by0+19,text:'Largo do Quarteirão A'});ksign('Largo do Quarteirão A',(bx0+22.5)*T,3.4,(by0+14.2)*T,0,7,1.3,'#166534');pois.push({x:(bx0+22.5)*T,z:(by0+18.5)*T-6,name:'Largo do Quarteirão A',type:'park',verb:VERB.park});
 // --- estacionamento, árvores e candeeiros ---
 const pcar=(x,z,alongX,c)=>{const hx=alongX?2.1:.95,hz=alongX?.95:2.1;kbox(B.det,x-hx,.35,z-hz,x+hx,1,z+hz,1,1,col(c),col(c),B.det);kbox(B.det,x-hx*(alongX?.55:.8),1,z-hz*(alongX?.8:.55),x+hx*(alongX?.55:.8),1.5,z+hz*(alongX?.8:.55),1,1,col('#9fc0d8'),col('#b6cfe6'),B.det);const dx=alongX?1.2:0,dz=alongX?0:1.2;addCol(x+dx,z+dz,1);addCol(x-dx,z-dz,1)};
 pcar((bx0+33)*T,(by0+16.2)*T,true,'#f8fafc');pcar((bx0+33)*T,(by0+17.4)*T,true,'#f8fafc');
 const CC=['#e5e7eb','#111827','#9ca3af','#dc2626','#2563eb','#f5f5f4','#d6d3d1'];
 for(let k=0;k<7;k++){pcar((bx0+8+k*5.2+Math.random())*T,(by0+5.5)*T,true,rnd(CC));pcar((bx0+8+k*5.2+Math.random())*T,(by0+34.5)*T,true,rnd(CC))}
 for(let k=0;k<4;k++){pcar((bx0+5.5)*T,(by0+10+k*6+Math.random())*T,false,rnd(CC));pcar((bx0+40.5)*T,(by0+10+k*6+Math.random())*T,false,rnd(CC))}
 const ed=(tx,ty)=>{if(!isRoad(tx,ty)&&!occ.has(tx+','+ty))addLamp(tx,ty)},ef=(tx,ty)=>{if(!isRoad(tx,ty)&&!occ.has(tx+','+ty)&&Math.random()<.85)addTree((tx+.5)*T,(ty+.5)*T)};
 for(let k=2;k<BW-1;k+=5){ed(bx0+k,by0);ed(bx0+k,by0+BH-1);ef(bx0+k+2,by0);ef(bx0+k+2,by0+BH-1);ef(bx0+k+1,by0+3);ef(bx0+k+1,by0+36)}
 for(let k=2;k<BH-1;k+=5){ed(bx0,by0+k);ed(bx0+BW-1,by0+k);ef(bx0,by0+k+2);ef(bx0+BW-1,by0+k+2);ef(bx0+3,by0+k+1);ef(bx0+42,by0+k+1)}
 for(let k=0;k<30;k++){const tx=bx0+6+Math.floor(Math.random()*34),ty=by0+6+Math.floor(Math.random()*28);if(!isRoad(tx,ty)&&!occ.has(tx+','+ty)&&!(tx>=bx0+14&&tx<=bx0+31&&ty>=by0+14&&ty<=by0+23))addTree((tx+.5)*T,(ty+.5)*T)}
 // --- estrada contínua até à autoestrada ---
 if(KIL.link){const lk=KIL.link,p=lk.row;if(lk.side==='E'){road('h',p,lk.hx+2,x0-ex,AV,{main:1,city:null});marks('h',p,AV,lk.hx+2,x0-ex,[])}else{road('h',p,x0+w+ex-1,lk.hx-1,AV,{main:1,city:null});marks('h',p,AV,x0+w+ex-1,lk.hx-1,[])}}
 const bm=m=>new THREE.MeshBasicMaterial({map:m,vertexColors:true}),vm=new THREE.MeshBasicMaterial({vertexColors:true}),rm=new THREE.MeshBasicMaterial({map:tRoof,vertexColors:true,side:THREE.DoubleSide});
 kmesh(B.fac,bm(tFac));kmesh(B.facY,bm(tFacY));kmesh(B.base,bm(tBase));kmesh(B.shop,bm(tShop));kmesh(B.shopUp,bm(tShopUp));kmesh(B.school,bm(tSchool));kmesh(B.roof,rm);kmesh(B.det,vm)}
// ---- polícia ----
function spawnPolice(n,ct){ct=ct||KC;const rs=roads.filter(r=>r.city===ct&&!r.noCar);for(let i=0;i<n;i++){const r=rnd(rs),v=r.t==='v',s=Math.random()<.5?1:-1,wd=r.w||1,m=mkPerson('#1d4ed8',rnd(SKIN),'#0b1f4d');bx('#0b1f4d',.34,.09,.34,0,.15,0,m.head);bx('#0b1f4d',.3,.03,.18,0,.1,.18,m.head);scene.add(m.g);
 const o={...m,v,w:wd,c:(r.p+wd/2)*T,a:(r.lo+Math.random()*(r.hi-r.lo))*T,lo:r.lo*T,hi:(r.hi+1)*T,s,sp:.9+Math.random()*.4,ph:Math.random()*9,pd:3*wd+.15,lat:(v?-s:s)*(3*wd+.15),wait:0,far:false,x:0,z:0,name:'Agente '+rnd(FN)+' '+rnd(SUR),age:ri(24,50),job:'Polícia',police:true};
 o.x=v?o.c+o.lat:o.a;o.z=v?o.a:o.c+o.lat;o.g.position.set(o.x,0,o.z);npcs.push(o)}separateNPCs(30)}
function spawnPoliceCars(n,ct){ct=ct||KC;const rs=roads.filter(r=>r.city===ct&&!r.noCar);for(let i=0,t=0;i<n&&t<60;t++){const r=rnd(rs),v=r.t==='v',wd=r.w||1,c={v,w:wd,c:(r.p+wd/2)*T,a:(r.lo+Math.random()*(r.hi-r.lo))*T,lo:r.lo*T,hi:(r.hi+1)*T,s:Math.random()<.5?1:-1,sp:6,npc:1,x:0,z:0,heading:0,vel:0,lat:0,model:'Viatura da Polícia',fuel:100,owned:0,steer:0,wait:0,far:false};
 c.g=mkCar('#f8fafc',c);bx(0x2563eb,.5,.14,.3,-.35,1.62,-.2,c.g);bx(0xef4444,.5,.14,.3,.35,1.62,-.2,c.g);placeCar(c);if(hitsCars(c.x,c.z,1.5,c)){scene.remove(c.g);continue}cars.push(c);i++}}
// ---- lojas, restaurantes, farmácia... ----
function poiBuy(p,h,e,n){if(player.money<p){toast('Sem dinheiro');return}player.money-=p;player.hunger=clamp(player.hunger-h,0,100);player.energy=clamp(player.energy+e,0,100);updateLifeUI();MS.hook('rest');logLife('Compraste: '+n)}
function poiAction(p){const t=p.type;if(typeof IDEF!=='undefined'&&IDEF[t]&&p.enter!==false)return enterInterior(p);if(t==='fuel')return fuelPanel();
 if(t==='shop'||t==='market')return actionMarket();
 if(t==='food')return openPn(`<h3>🍽️ ${p.name}</h3>`+row('Refeição completa — 2.500 Kz',`<button class="btn" onclick="poiBuy(2500,35,10,'refeição')">Comprar</button>`)+row('Sumo / gelado — 800 Kz',`<button class="btn" onclick="poiBuy(800,8,4,'sumo/gelado')">Comprar</button>`));
 if(t==='pharm')return openPn(`<h3>💊 ${p.name}</h3>`+row('Vitaminas — 3.000 Kz',`<button class="btn" onclick="poiBuy(3000,0,20,'vitaminas')">Comprar</button>`)+row('Paracetamol — 1.200 Kz',`<button class="btn" onclick="poiBuy(1200,0,8,'paracetamol')">Comprar</button>`));
 if(t==='police'){MS.hook('talk');return toast('👮 Esquadra de Polícia do Kilamba — o agente cumprimenta-te.')}
 if(!p.seen){p.seen=1;reward('Visitaste: '+p.name,6000,8)}toast('📍 '+p.name)}
// ---- mapa do Kilamba (minimapa e mapa grande) ----
function drawKilBase(ctx,X,Y,k,w,h,small){ctx.fillStyle='#d8bd8a';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#c9c4b3';for(const b of KIL.blk)ctx.fillRect(X(b.x),Y(b.y),b.w*k,b.h*k);ctx.fillStyle='#8a9a5a';for(const g of KIL.grn)ctx.fillRect(X(g.x),Y(g.y),g.w*k,g.h*k);
 ctx.fillStyle='#4b4f57';for(const r of roads){if(r.city!==KC)continue;const wd=r.w||1;if(r.t==='v')ctx.fillRect(X(r.p),Y(r.lo),wd*k,(r.hi-r.lo+1)*k);else ctx.fillRect(X(r.lo),Y(r.p),(r.hi-r.lo+1)*k,wd*k)}
 for(const b of KIL.bl){ctx.fillStyle=b.c;ctx.fillRect(X(b.x),Y(b.y),b.w*k,b.h*k)}
 ctx.font=`bold ${small?9:12}px system-ui`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.fillStyle='#fff';
 if(!small||k>=3){for(const p of pois){const x=X(p.x/T),y=Y(p.z/T);ctx.fillStyle=p.type==='police'?'#60a5fa':p.type==='food'?'#fb923c':p.type==='pharm'?'#ef4444':'#fbbf24';ctx.beginPath();ctx.arc(x,y,3.5,0,7);ctx.fill();if(!small){ctx.fillStyle='#fff';ctx.strokeText(p.name,x,y-7);ctx.fillText(p.name,x,y-7)}}
  ctx.fillStyle='#fff';for(const n of KIL.names){const x=X(n[1]),y=Y(n[2]);ctx.strokeText(n[0],x,y);ctx.fillText(n[0],x,y)}}}
