// landmarks.js — cartões-postais de Luanda (Marginal, Fortaleza, torres), Benguela (Praia Morena, acácias rubras, Igreja do Pópulo, caminho-de-ferro) e Lubango (Cristo Rei, serra) + edifícios cívicos
Object.assign(VERB,{hospital:'Ir ao',gun:'Entrar no',fuel:'Abastecer na',church:'Ver a'});
function buildLandmarks(){
 const col=hx=>{const c=new THREE.Color(hx);return[c.r,c.g,c.b]},W=kbuf(),Rf=kbuf(),Dt=kbuf(),Gl=kbuf();
 const tW=mkTex(64,64,g=>{g.fillStyle='#fff';g.fillRect(0,0,64,64);g.fillStyle='#5f86ad';g.fillRect(14,12,36,34);g.fillStyle='#f4efe0';g.fillRect(30,12,3,34);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,60,64,4)}),
  tG=mkTex(64,64,g=>{g.fillStyle='#2b4a66';g.fillRect(0,0,64,64);g.fillStyle='#7fa8cc';for(let y=2;y<64;y+=16)for(let x=2;x<64;x+=16)g.fillRect(x,y,12,12);g.fillStyle='#1c3347';g.fillRect(0,0,64,2)});
 const clear=(tx,ty,wt,dt)=>{for(let i=0;i<wt;i++)for(let j=0;j<dt;j++){for(const h of houses.filter(q=>q.tx===tx+i&&q.ty===ty+j))removeHouse(h);for(const b of blds.filter(q=>q.tx===tx+i&&q.ty===ty+j))removeBld(b);occ.set((tx+i)+','+(ty+j),3.01)}lockRects.push([tx*T,ty*T,(tx+wt)*T,(ty+dt)*T])};
 const SV={'+z':[0,1],'-z':[0,-1]};
 function civic(tx,ty,wt,dt,fl,name,type,wall,roof,face,bg){clear(tx,ty,wt,dt);const X0=tx*T,Z0=ty*T,X1=(tx+wt)*T,Z1=(ty+dt)*T,H=fl*3.4,c=col(wall),S=SV[face];
  for(const s of['+z','-z','+x','-x'])kwall(W,s,X0,0,Z0,X1,H,Z1,3,3.4,c);khip(Rf,X0,Z0,X1,Z1,H,2.4,.5,col(roof));
  const fx=(X0+X1)/2,fz=S[1]>0?Z1:Z0;kbox(Dt,fx-.9,0,S[1]>0?fz:fz-.25,fx+.9,2.6,S[1]>0?fz+.25:fz,1,1,col('#33261a'));kbox(Dt,fx-3,3,S[1]>0?fz:fz-1.4,fx+3,3.15,S[1]>0?fz+1.4:fz,1,1,col(bg||'#b45309'));
  ksign(name,fx,H-.4,fz+S[1]*.1,S[1]>0?0:Math.PI,Math.min((X1-X0)*.8,9),1.1,bg);pois.push({x:fx,z:fz+S[1]*2.6,name,type,verb:VERB[type]||'Entrar em',nx:0,nz:S[1]})}
 function pump(tx,ty){clear(tx,ty,3,2);const X0=tx*T,Z0=ty*T;for(const[x,z]of[[1,.5],[17,.5],[1,11],[17,11]])kbox(Dt,X0+x-.3,0,Z0+z-.3,X0+x+.3,5,Z0+z+.3,1,1,col('#e5e7eb'));kbox(Dt,X0,5,Z0,X0+18,5.4,Z0+12,1,1,col('#dc2626'),col('#ef4444'),Dt);
  for(const x of[5,12])kbox(Dt,X0+x,0,Z0+5,X0+x+1.2,1.4,Z0+6,1,1,col('#ef4444'));ksign('Bomba de Combustível',X0+9,6.3,Z0-.1,Math.PI,8,1.2,'#b91c1c');pois.push({x:X0+9,z:Z0+8.5,name:'Bomba de Combustível',type:'fuel',verb:VERB.fuel,nx:0,nz:1})}
 const TYPES=[['Esquadra de Polícia','police','#e6ecf5','#1e3a8a','#1e3a8a',2],['Armeiro','gun','#e9e4da','#4a3a2a','#4a3a2a',1],['Hospital','hospital','#f2f6fb','#b91c1c','#b91c1c',3],['Farmácia','pharm','#f4f8f4','#22a05a','#15803d',1],['Mini-mercado','shop','#f1ead8','#b5532e','#b45309',1],['Restaurante','food','#f6e7c8','#9b3d35','#9a3412',1],['Padaria','food','#f5e3b8','#b5532e','#a16207',1]];
 for(const ct of CITIES){if(ct.custom)continue;const cx=ct.cx,cy=ct.cy;
  [[cx-9,cy-3,'+z',0],[cx-4,cy-3,'+z',1],[cx+1,cy-3,'+z',2],[cx+6,cy-3,'+z',3],[cx-9,cy+2,'-z',4],[cx-4,cy+2,'-z',5],[cx+6,cy+2,'-z',6]].forEach(([tx,ty,f,k])=>{const t=TYPES[k];civic(tx,ty,3,2,t[5],t[0],t[1],t[2],t[3],f,t[4])});pump(cx+1,cy+2);
  // pontos de reaparecimento seguros
  let cxC=cx;while(landT(cxC,cy)&&cx-cxC<400)cxC--;ct.coast=cxC+1;
  if(ct.id==='luanda'){const X=ct.coast;// Marginal
   kflat(Dt,(X+1)*T,(cy-26)*T,(X+3.5)*T,(cy+26)*T,.1,col('#d6ccb4'));kbox(Dt,X*T+2,0,(cy-26)*T,X*T+3,.9,(cy+26)*T,1,1,col('#b9b2a2'));for(let z=-24;z<=24;z+=4){addTree((X+2.4)*T,(cy+z)*T,'#3f8f4a');addLamp(X+3,cy+z+1)}pois.push({x:(X+2)*T,z:cy*T,name:'Marginal de Luanda',type:'park',verb:VERB.park});ksign('Marginal de Luanda',(X+1.2)*T,3,cy*T,Math.PI/2,9,1.4,'#0f766e');
   // Fortaleza de São Miguel
   const fx=X+4,fy=cy-18;clear(fx,fy,6,6);for(let i=0;i<6;i++)for(let j=0;j<6;j++){if(i>0&&i<5&&j>0&&j<5){occ.delete((fx+i)+','+(fy+j));continue}if(i===5&&j===3){occ.delete((fx+i)+','+(fy+j));continue}const x0=(fx+i)*T,z0=(fy+j)*T;kbox(W,x0,0,z0,x0+T,7,z0+T,6,7,col('#c9b48a'),col('#b8a373'),W)}
   kflat(Dt,(fx+1)*T,(fy+1)*T,(fx+5)*T,(fy+5)*T,.1,col('#bfae8a'));for(const[a,b]of[[0,0],[5,0],[0,5],[5,5]])kbox(W,(fx+a)*T-1,0,(fy+b)*T-1,(fx+a+1)*T+1,10,(fy+b+1)*T+1,6,7,col('#b8a373'),col('#a89363'),W);
   for(const[x,z]of[[2,1.3],[4,1.3],[2,4.7],[4,4.7]]){kbox(Dt,(fx+x)*T-1,0,(fy+z)*T-.3,(fx+x)*T+1,.8,(fy+z)*T+.3,1,1,col('#1a1a1a'));}pois.push({x:(fx+3)*T,z:(fy+3)*T,name:'Fortaleza de São Miguel',type:'park',verb:VERB.park});
   // torres do centro
   [[11,-9,60],[13,-9,85],[16,-9,70],[11,6,95],[13,6,65],[16,6,100]].forEach(([dx,dy,h])=>{clear(cx+dx,cy+dy,2,2);kbox(Gl,(cx+dx)*T,0,(cy+dy)*T,(cx+dx+2)*T,h,(cy+dy+2)*T,6,6,col('#ffffff'),col('#8fb0cf'),Dt)})}
  if(ct.id==='benguela'){const X=ct.coast;// Praia Morena
   kflat(Dt,X*T-30,(cy-18)*T,(X+2)*T,(cy+18)*T,.08,col('#ecdcaa'));for(let z=-16;z<=16;z+=5){addTree((X+1.2)*T,(cy+z)*T,'#3f8f4a');kbox(Dt,(X+.5)*T-.1,0,(cy+z+2)*T-.1,(X+.5)*T+.1,2.4,(cy+z+2)*T+.1,1,1,col('#e7e0d0'));kbox(Dt,(X+.5)*T-1.4,2.4,(cy+z+2)*T-1.4,(X+.5)*T+1.4,2.6,(cy+z+2)*T+1.4,1,1,col(rnd(['#ef4444','#f59e0b','#3b82f6','#10b981'])),col('#fff'),Dt);addCol((X+.5)*T,(cy+z+2)*T,.5)}
   pois.push({x:(X+1)*T,z:cy*T,name:'Praia Morena',type:'park',verb:VERB.park});ksign('Praia Morena',(X+1)*T,3,(cy-16)*T,Math.PI/2,7,1.3,'#0369a1');
   for(let x=-13;x<=13;x+=3){for(const dy of[-1,1]){const tx=cx+x,ty=cy+dy;if(!roadSet.has(tx+','+ty)&&!occ.has(tx+','+ty))addTree((tx+.5)*T,(ty+.5)*T,rnd(['#d6352b','#e0482f']))}}
   // Igreja de Nossa Senhora do Pópulo
   {const tx=cx-4,ty=cy-9;clear(tx,ty,3,4);const X0=tx*T,Z0=ty*T,X1=(tx+3)*T,Z1=(ty+4)*T;for(const s of['+z','-z','+x','-x'])kwall(W,s,X0,0,Z0,X1,11,Z1,3,3.4,col('#f6f2e8'));khip(Rf,X0,Z0,X1,Z1,11,5,.6,col('#9b3d35'));for(const x of[X0,X1-4]){kbox(W,x,0,Z1-4,x+4,16,Z1,3,3.4,col('#f6f2e8'),col('#f6f2e8'),W);khip(Rf,x,Z1-4,x+4,Z1,16,3.2,.3,col('#9b3d35'))}pois.push({x:(X0+X1)/2,z:Z1+3,name:'Igreja de Nossa Senhora do Pópulo',type:'park',verb:VERB.church,nx:0,nz:1})}
   // Estação do Caminho-de-Ferro de Benguela
   {const tx=cx+6,ty=cy+6;clear(tx,ty,3,2);const X0=tx*T,Z0=ty*T,X1=(tx+3)*T,Z1=(ty+2)*T;for(const s of['+z','-z','+x','-x'])kwall(W,s,X0,0,Z0,X1,6,Z1,3,3.4,col('#e3c98d'));khip(Rf,X0,Z0,X1,Z1,6,2.6,.8,col('#b5532e'));for(let a=0;a<6;a++)kbox(Dt,X0+1.2+a*2.8,0,Z1,X0+2.6+a*2.8,3,Z1+.2,1,1,col('#5b4326'));
    kflat(Dt,X0-10,Z1+1,X1+10,Z1+5,.1,col('#a8a090'));for(const o of[7,9]){kbox(Dt,(cx-14)*T,0,Z1+o-.1,(cx+14)*T,.15,Z1+o+.1,1,1,col('#3a3a3a'));for(let x=-13*T;x<14*T;x+=1.2)kbox(Dt,cx*T+x,0,Z1+o-1,cx*T+x+.3,.1,Z1+o+1,1,1,col('#5b4326'))}
    kbox(Dt,X0,0.4,Z1+6.6,X0+16,3.2,Z1+8.4,1,1,col('#1d4ed8'),col('#facc15'),Dt);kbox(Dt,X0+16,.4,Z1+6.6,X0+17.5,4.2,Z1+8.4,1,1,col('#facc15'));pois.push({x:(X0+X1)/2,z:Z1+4,name:'Estação do Caminho-de-Ferro de Benguela',type:'park',verb:VERB.park,nx:0,nz:1})}}
  if(ct.id==='lubango'){const X=cx+ct.rx+5,Y=cy-4;clear(X,Y,5,5);// Cristo Rei
   for(let i=0;i<4;i++){const s=(5-i*1.1)*T/2,x=(X+2.5)*T,z=(Y+2.5)*T;kbox(W,x-s,i*1.3,z-s,x+s,i*1.3+1.3,z+s,6,3,col('#cfc8b6'),col('#bdb6a4'),W)}
   const x=(X+2.5)*T,z=(Y+2.5)*T;kbox(W,x-1.2,5.2,z-1,x+1.2,9,z+1,6,3,col('#f4f1ea'));kbox(W,x-1.1,9,z-.7,x+1.1,17,z+.7,6,3,col('#f6f3ec'),col('#fff'),W);kbox(W,x-6,14.2,z-.6,x+6,15.4,z+.6,6,3,col('#f6f3ec'),col('#fff'),W);kbox(W,x-.7,17,z-.7,x+.7,18.6,z+.7,6,3,col('#f6f3ec'),col('#fff'),W);
   pois.push({x:x,z:z+(5)*T/2+2.5,name:'Cristo Rei do Lubango',type:'park',verb:VERB.park,nx:0,nz:1});
   [[-300,-120,150,110],[-340,60,180,130],[-220,260,160,95],[-120,-300,170,120],[240,-320,190,140],[360,260,150,90]].forEach(([dx,dz,b,h])=>{const mx=(cx+.5)*T+dx,mz=(cy+.5)*T+dz;if(!landXZ(mx,mz))return;khip(Rf,mx-b/2,mz-b/2,mx+b/2,mz+b/2,0,h,0,col(rnd(['#7a6a50','#6f6048','#826f55'])));bigCols.push({x:mx,z:mz,r:b*.42})})}}
 const bm=m=>new THREE.MeshBasicMaterial({map:m,vertexColors:true}),vm=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
 kmesh(W,bm(tW));kmesh(Gl,bm(tG));kmesh(Rf,vm);kmesh(Dt,vm)}
