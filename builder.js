// builder.js — Construtor 3D: módulos (paredes, portas, janelas, lajes, telhados, escadas, ruas, lancil, passeio, separador, mobília, piscina, jardim, DJ), 20 materiais, prontos, demolir, editar e guardar
const MATS=[{n:'Madeira',c:'#8b5a2b',p:1},{n:'Betão',c:'#9a9a96',p:1},{n:'Tijolo',c:'#a5523a',p:1.1},{n:'Vidro',c:'#8fc9e8',p:2,g:1},{n:'Aço',c:'#7b8794',p:2.5},{n:'Inox',c:'#cfd6dd',p:3.5},{n:'Alumínio',c:'#b4bcc4',p:2.2},{n:'Cobre',c:'#b87333',p:4},{n:'Ouro',c:'#e6b800',p:12,e:1},{n:'Prata',c:'#d6d9de',p:8},{n:'Diamante',c:'#b9f2ff',p:40,g:1,e:1},{n:'Mármore',c:'#efeeea',p:5},{n:'Granito',c:'#6e6e73',p:3},{n:'Pedra',c:'#8c8272',p:1.5},{n:'Terracota',c:'#c4623a',p:1.2},{n:'Bambu',c:'#c8b560',p:1.3},{n:'Plástico',c:'#e04a4a',p:.8},{n:'Borracha',c:'#2b2b2e',p:.9},{n:'Neon',c:'#39ff88',p:6,e:1},{n:'Titânio',c:'#8d95a3',p:20}];
const PB=(b,o)=>Object.assign({b},o||{});
const PIECES={
 parede:{n:'Parede',cat:'Estrutura',p:400,W:3,D:.3,edge:1,gen:()=>[PB([0,0,0,3,3,.3],{s:1})]},
 muro:{n:'Muro',cat:'Estrutura',p:250,W:3,D:.3,edge:1,gen:()=>[PB([0,0,0,3,1.8,.3],{s:1})]},
 porta:{n:'Porta',cat:'Estrutura',p:700,W:3,D:.3,edge:1,gen:()=>[PB([0,0,0,.9,3,.3],{s:1}),PB([2.1,0,0,3,3,.3],{s:1}),PB([.9,2.4,0,2.1,3,.3],{s:1})]},
 janela:{n:'Janela',cat:'Estrutura',p:900,W:3,D:.3,edge:1,gen:()=>[PB([0,0,0,3,.9,.3],{s:1}),PB([0,2.4,0,3,3,.3],{s:1}),PB([0,.9,0,.6,2.4,.3],{s:1}),PB([2.4,.9,0,3,2.4,.3],{s:1}),PB([.6,.9,.1,2.4,2.4,.2],{g:1,s:1,fx:'#9fd3ee'})]},
 laje:{n:'Laje / piso',cat:'Estrutura',p:600,W:3,D:3,gen:()=>[PB([0,-.25,0,3,0,3],{slab:1})]},
 telhado:{n:'Telhado',cat:'Estrutura',p:700,W:3,D:3,gen:()=>[PB([0,0,0,3,0,3],{hip:1.6})]},
 coluna:{n:'Coluna',cat:'Estrutura',p:300,W:3,D:3,gen:()=>[PB([1.3,0,1.3,1.7,3,1.7],{s:1})]},
 escada:{n:'Escada',cat:'Estrutura',p:900,W:3,D:6,stairs:1,gen:()=>{const o=[];for(let i=0;i<12;i++)o.push(PB([0,i*.25,i*.5,3,i*.25+.25,i*.5+.5]));return o}},
 estrada:{n:'Estrada',cat:'Via',p:350,W:3,D:3,gen:()=>[PB([0,0,0,3,.06,3])]},
 passeio:{n:'Passeio',cat:'Via',p:250,W:3,D:3,gen:()=>[PB([0,0,0,3,.16,3])]},
 lancil:{n:'Lancil',cat:'Via',p:150,W:3,D:.3,edge:1,gen:()=>[PB([0,0,0,3,.2,.3])]},
 separador:{n:'Separador de betão',cat:'Via',p:450,W:3,D:.6,edge:1,gen:()=>[PB([0,0,0,3,.85,.6],{s:1})]},
 cama:{n:'Cama',cat:'Interior',p:900,W:3,D:3,inter:'cama',gen:()=>[PB([.3,0,.3,2.7,.5,1.9],{s:1}),PB([.4,.5,.4,1.4,.7,1.0],{fx:'#f2f2f2'})]},
 sofa:{n:'Sofá',cat:'Interior',p:800,W:3,D:3,gen:()=>[PB([.2,0,.4,2.8,.5,1.3],{s:1}),PB([.2,.5,.3,2.8,1.1,.6],{s:1})]},
 mesa:{n:'Mesa',cat:'Interior',p:500,W:3,D:3,gen:()=>[PB([.5,.7,.5,2.5,.85,2.0],{s:1}),PB([.6,0,.6,.8,.7,.8],{s:1}),PB([2.2,0,.6,2.4,.7,.8],{s:1}),PB([.6,0,1.7,.8,.7,1.9],{s:1}),PB([2.2,0,1.7,2.4,.7,1.9],{s:1})]},
 candeeiro:{n:'Candeeiro',cat:'Interior',p:300,W:3,D:3,gen:()=>[PB([1.45,0,1.45,1.55,2.6,1.55],{s:1}),PB([1.2,2.6,1.2,1.8,3,1.8],{e:1,fx:'#fff2b0'})]},
 dj:{n:'DJ Kit',cat:'Interior',p:6000,W:3,D:3,inter:'dj',gen:()=>[PB([.3,0,.9,2.7,.95,2.1],{s:1}),PB([.5,.95,1.1,1.3,1.05,1.9],{fx:'#222'}),PB([1.7,.95,1.1,2.5,1.05,1.9],{fx:'#222'}),PB([0,0,.4,.5,1.6,1.1],{s:1,fx:'#1a1a1a'}),PB([2.5,0,.4,3,1.6,1.1],{s:1,fx:'#1a1a1a'}),PB([1.25,.95,1.45,1.55,1.4,1.55],{e:1,fx:'#ff3df2'})]},
 piscina:{n:'Piscina',cat:'Interior',p:2500,W:3,D:3,gen:()=>[PB([0,0,0,3,.35,.25],{s:1}),PB([0,0,2.75,3,.35,3],{s:1}),PB([0,0,.25,.25,.35,2.75],{s:1}),PB([2.75,0,.25,3,.35,2.75],{s:1}),PB([.25,0,.25,2.75,.22,2.75],{g:1,fx:'#3aa8e0'})]},
 jardim:{n:'Jardim',cat:'Interior',p:400,W:3,D:3,gen:()=>[PB([0,0,0,3,.08,3],{fx:'#5f9a38'}),PB([.4,.08,.4,1,.6,1],{fx:'#2f7f3a'}),PB([2,.08,1.8,2.6,.5,2.5],{fx:'#2f7f3a'}),PB([1.4,.08,1.2,1.7,.3,1.5],{fx:'#e8527a'})]},
 arvore:{n:'Árvore',cat:'Interior',p:350,W:3,D:3,gen:()=>[PB([1.35,0,1.35,1.65,1.8,1.65],{s:1,fx:'#6b4a2b'}),PB([.4,1.8,.4,2.6,3.8,2.6],{fx:'#3a8a3a'})]}};
const CATS=['Estrutura','Via','Interior'];
function pre(items){return{items}}
const PRE={
 vivenda:{n:'Vivenda T2 (4×3)',p:0,W:12,D:9,gen:()=>{const o=[];for(let i=0;i<4;i++)for(let j=0;j<3;j++){o.push({t:'laje',x:i*3,z:j*3,l:0},{t:'laje',x:i*3,z:j*3,l:1},{t:'telhado',x:i*3,z:j*3,l:1})}
  for(let i=0;i<4;i++){o.push({t:i===1?'porta':'janela',x:i*3,z:9,l:0,r:0},{t:i===2?'janela':'parede',x:i*3,z:0,l:0,r:0})}for(let j=0;j<3;j++){o.push({t:j===1?'janela':'parede',x:0,z:j*3,l:0,r:1},{t:j===1?'janela':'parede',x:12,z:j*3,l:0,r:1})}
  o.push({t:'cama',x:0,z:0,l:0,r:0},{t:'sofa',x:6,z:3,l:0,r:0},{t:'mesa',x:9,z:0,l:0,r:0},{t:'candeeiro',x:9,z:6,l:0,r:0});return o}},
 predio:{n:'Prédio 4 andares (3×4)',p:0,W:9,D:12,gen:()=>{const o=[];for(let l=0;l<4;l++){for(let i=0;i<3;i++)for(let j=0;j<4;j++)o.push({t:'laje',x:i*3,z:j*3,l:l+1});
  for(let i=0;i<3;i++){o.push({t:l===0&&i===1?'porta':'janela',x:i*3,z:12,l,r:0},{t:'janela',x:i*3,z:0,l,r:0})}for(let j=0;j<4;j++){o.push({t:'janela',x:0,z:j*3,l,r:1},{t:'janela',x:9,z:j*3,l,r:1})}
  if(l<3)o.push({t:'escada',x:6,z:l%2?6:3,l,r:l%2?2:0})}
  for(let i=0;i<3;i++)for(let j=0;j<4;j++)o.push({t:'telhado',x:i*3,z:j*3,l:4});for(let i=0;i<3;i++)for(let j=0;j<4;j++)o.push({t:'laje',x:i*3,z:j*3,l:0});return o}},
 loja:{n:'Loja (3×3)',p:0,W:9,D:9,gen:()=>{const o=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)o.push({t:'laje',x:i*3,z:j*3,l:0},{t:'laje',x:i*3,z:j*3,l:1});
  o.push({t:'janela',x:0,z:9,l:0,r:0},{t:'porta',x:3,z:9,l:0,r:0},{t:'janela',x:6,z:9,l:0,r:0});for(let i=0;i<3;i++)o.push({t:'parede',x:i*3,z:0,l:0,r:0});for(let j=0;j<3;j++)o.push({t:'parede',x:0,z:j*3,l:0,r:1},{t:'parede',x:9,z:j*3,l:0,r:1});o.push({t:'mesa',x:3,z:3,l:0,r:0});return o}},
 condominio:{n:'Condomínio (muro+jardim+piscina)',p:0,W:18,D:18,gen:()=>{const o=[];for(let i=0;i<6;i++){o.push({t:i===2||i===3?'porta':'muro',x:i*3,z:18,l:0,r:0},{t:'muro',x:i*3,z:0,l:0,r:0},{t:'muro',x:0,z:i*3,l:0,r:1},{t:'muro',x:18,z:i*3,l:0,r:1})}
  for(const[x,z]of[[3,3],[12,3],[3,12],[12,12]])o.push({t:'jardim',x,z,l:0},{t:'candeeiro',x:x+3,z:z+3,l:0});o.push({t:'piscina',x:6,z:6,l:0},{t:'piscina',x:9,z:6,l:0},{t:'piscina',x:6,z:9,l:0},{t:'piscina',x:9,z:9,l:0});return o}},
 sala:{n:'Sala (sofá+mesa+candeeiro)',p:0,W:9,D:6,gen:()=>[{t:'sofa',x:0,z:0,l:0,r:0},{t:'mesa',x:3,z:0,l:0,r:0},{t:'candeeiro',x:6,z:0,l:0,r:0},{t:'sofa',x:0,z:3,l:0,r:2}]},
 djset:{n:'Palco DJ',p:0,W:9,D:6,gen:()=>[{t:'dj',x:3,z:0,l:0,r:0},{t:'candeeiro',x:0,z:0,l:0,r:0},{t:'candeeiro',x:6,z:0,l:0,r:0},{t:'passeio',x:0,z:3,l:0},{t:'passeio',x:3,z:3,l:0},{t:'passeio',x:6,z:3,l:0}]},
 piscina2:{n:'Piscina 2×2 + jardim',p:0,W:6,D:9,gen:()=>[{t:'piscina',x:0,z:0,l:0},{t:'piscina',x:3,z:0,l:0},{t:'piscina',x:0,z:3,l:0},{t:'piscina',x:3,z:3,l:0},{t:'jardim',x:0,z:6,l:0},{t:'jardim',x:3,z:6,l:0}]}};
const BUILD={items:[],keys:new Set(),level:0,rot:0,mat:1,cur:null,pre:null,tool:'place',ok:false,tgt:null,djs:[],std:{},dirty:new Set()};
const CHK=new Map(),BH=new Map(),SF=new Map(),lockRects=[];
const ckey=(x,z)=>Math.floor(x/30)+','+Math.floor(z/30),hk=(ix,iz)=>ix+','+iz;
function xfb(b,r,W,D){const[x0,y0,z0,x1,y1,z1]=b;if(r===0)return[x0,y0,z0,x1,y1,z1];if(r===1)return[D-z1,y0,x0,D-z0,y1,x1];if(r===2)return[W-x1,y0,D-z1,W-x0,y1,D-z0];return[z0,y0,W-x1,z1,y1,W-x0]}
function boxesOf(it){if(it._b)return it._b;const pc=PIECES[it.t],r=it.r||0,out=[];for(const p of pc.gen()){const b=xfb(p.b,r,pc.W,pc.D);out.push({p,b:[b[0]+it.x,b[1]+it.l*3,b[2]+it.z,b[3]+it.x,b[4]+it.l*3,b[5]+it.z]})}it._b=out;return out}
function eachCell(b,fn){for(let i=Math.floor(b[0]/3);i<=Math.floor((b[3]-.001)/3);i++)for(let j=Math.floor(b[2]/3);j<=Math.floor((b[5]-.001)/3);j++)fn(hk(i,j))}
function register(it,on){const pc=PIECES[it.t];for(const e of boxesOf(it)){if(e.p.s||(pc.stairs&&0))eachCell(e.b,k=>{let a=BH.get(k);if(on){if(!a)BH.set(k,a=[]);a.push({b:e.b,it})}else if(a){const f=a.filter(q=>q.it!==it);f.length?BH.set(k,f):BH.delete(k)}});
  if(e.p.slab)eachCell(e.b,k=>{let a=SF.get(k);const s={x0:e.b[0],z0:e.b[2],x1:e.b[3],z1:e.b[5],y:e.b[4],it};if(on){if(!a)SF.set(k,a=[]);a.push(s)}else if(a){const f=a.filter(q=>q.it!==it);f.length?SF.set(k,f):SF.delete(k)}})}
 if(pc.stairs){const fb=xfb([0,0,0,3,3,6],it.r||0,3,6),dir=['+z','-x','-z','+x'][it.r||0],s={x0:fb[3-3]+it.x,z0:fb[2]+it.z,x1:fb[3]+it.x,z1:fb[5]+it.z,y0:it.l*3,rise:3,dir,it};
  eachCell([s.x0,0,s.z0,s.x1,1,s.z1],k=>{let a=SF.get(k);if(on){if(!a)SF.set(k,a=[]);a.push(s)}else if(a){const f=a.filter(q=>q.it!==it);f.length?SF.set(k,f):SF.delete(k)}})}}
function surfaceY(x,z,yRef){let best=0;const a=SF.get(hk(Math.floor(x/3),Math.floor(z/3)));if(!a)return 0;for(const s of a){if(x<s.x0||x>s.x1||z<s.z0||z>s.z1)continue;let h=s.y;if(s.rise){const f=s.dir==='+z'?(z-s.z0)/(s.z1-s.z0):s.dir==='-z'?(s.z1-z)/(s.z1-s.z0):s.dir==='+x'?(x-s.x0)/(s.x1-s.x0):(s.x1-x)/(s.x1-s.x0);h=s.y0+s.rise*clamp(f,0,1)}if(h<=yRef+.55&&h>best)best=h}return best}
function hitsBuild(x,z,r,y){if(!BH.size)return false;const ix=Math.floor(x/3),iz=Math.floor(z/3);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=BH.get(hk(ix+i,iz+j));if(!a)continue;for(const e of a){const b=e.b;if(b[4]<=y+.35||b[1]>=y+1.6)continue;const dx=Math.max(b[0]-x,0,x-b[3]),dz=Math.max(b[2]-z,0,z-b[5]);if(dx*dx+dz*dz<r*r)return true}}return false}
// ---- desenho (malhas fundidas por bloco de 30 m: leve no telemóvel) ----
const colv=(c,e)=>{const k=new THREE.Color(c),m=e?1.5:1;return[k.r*m,k.g*m,k.b*m]};
const bMatO=new THREE.MeshBasicMaterial({vertexColors:true}),bMatG=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.42,side:THREE.DoubleSide,depthWrite:false});
function rebuild(key){const ch=CHK.get(key);if(!ch)return;for(const m of ch.meshes){scene.remove(m);m.geometry.dispose()}ch.meshes=[];const o=kbuf(),g=kbuf();
 for(const it of ch.items){const mt=MATS[it.m];for(const e of boxesOf(it)){const p=e.p,b=e.b,c=colv(p.fx||mt.c,p.e||(!p.fx&&mt.e)),buf=(p.g||(mt.g&&!p.fx))?g:o;
  if(p.hip)khip(buf,b[0],b[2],b[3],b[5],b[1],p.hip,.25,c);else{kbox(buf,b[0],b[1],b[2],b[3],b[4],b[5],1,1,c,c,buf);kface(buf,[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[1],b[5]],[b[0],b[1],b[5]]],[0,-1,0],[[0,0],[1,0],[1,1],[0,1]],c)}}}
 const a=kmesh(o,bMatO),d=kmesh(g,bMatG);if(a)ch.meshes.push(a);if(d)ch.meshes.push(d);if(!ch.items.size){CHK.delete(key)}}
function flushDirty(){for(const k of BUILD.dirty)rebuild(k);BUILD.dirty.clear()}
const ikey=it=>[it.t,it.x,it.z,it.l,it.r||0].join('|');
function addItem(it,noSave){const k=ikey(it);if(BUILD.keys.has(k))return false;it.r=it.r||0;it.m=it.m==null?BUILD.mat:it.m;BUILD.keys.add(k);BUILD.items.push(it);register(it,true);const ck=ckey(it.x,it.z);let ch=CHK.get(ck);if(!ch)CHK.set(ck,ch={items:new Set(),meshes:[]});ch.items.add(it);BUILD.dirty.add(ck);if(it.t==='dj')BUILD.djs.push(it);if(!noSave)BUILD.save();return true}
function removeItem(it){register(it,false);BUILD.keys.delete(ikey(it));BUILD.items.splice(BUILD.items.indexOf(it),1);const ck=ckey(it.x,it.z),ch=CHK.get(ck);if(ch)ch.items.delete(it);BUILD.dirty.add(ck);BUILD.djs=BUILD.djs.filter(d=>d!==it);BUILD.save()}
const price=(t,m)=>Math.round(PIECES[t].p*MATS[m].p);
const preCost=(p,m)=>PRE[p].gen().reduce((a,i)=>a+price(i.t,m),0);
BUILD.save=function(){clearTimeout(BUILD._s);BUILD._s=setTimeout(()=>{try{localStorage.setItem('lv8build',JSON.stringify({i:BUILD.items.map(i=>[i.t,i.m,i.x,i.z,i.l,i.r]),s:BUILD.std}))}catch(e){}},400)};
BUILD.load=function(){try{const d=JSON.parse(localStorage.getItem('lv8build')||'null');if(!d)return;for(const a of d.i)addItem({t:a[0],m:a[1],x:a[2],z:a[3],l:a[4],r:a[5]},true);BUILD.std=d.s||{};for(const k in BUILD.std){const[tx,ty]=k.split(',').map(Number),h=houses.find(q=>q.tx===tx&&q.ty===ty&&!q.door),b=blds.find(q=>q.tx===tx&&q.ty===ty);const s=BUILD.std[k];if(h){if(s.del)removeHouse(h);else if(s.col)recolorHouse(h,s.col)}else if(b&&s.del)removeBld(b)}flushDirty()}catch(e){}};
// ---- pontaria ----
const rd=new THREE.Vector3();
function aimY(y){cam.getWorldDirection(rd);if(Math.abs(rd.y)<.02)return null;const t=(y-cam.position.y)/rd.y;if(t<.5||t>45)return null;return{x:cam.position.x+rd.x*t,z:cam.position.z+rd.z*t}}
function snapP(t,p){const pc=PIECES[t];if(pc.edge){const gx=Math.round(p.x/3)*3,gz=Math.round(p.z/3)*3;if(Math.abs(p.z-gz)<=Math.abs(p.x-gx))return{x:Math.floor(p.x/3)*3,z:gz,r:0};return{x:gx,z:Math.floor(p.z/3)*3,r:1}}return{x:Math.floor(p.x/3)*3,z:Math.floor(p.z/3)*3,r:BUILD.rot}}
function rayBox(o,d,b,mx){let t0=0,t1=mx;for(const[a,lo,hi]of[[0,b[0],b[3]],[1,b[1],b[4]],[2,b[2],b[5]]]){const oa=a===0?o.x:a===1?o.y:o.z,da=a===0?d.x:a===1?d.y:d.z;if(Math.abs(da)<1e-6){if(oa<lo||oa>hi)return null}else{let a0=(lo-oa)/da,a1=(hi-oa)/da;if(a0>a1)[a0,a1]=[a1,a0];t0=Math.max(t0,a0);t1=Math.min(t1,a1);if(t0>t1)return null}}return t0}
function pickItem(){cam.getWorldDirection(rd);let best=null,bt=16;for(const[k,ch]of CHK){const[cx,cz]=k.split(',').map(Number);if(Math.hypot(cx*30+15-cam.position.x,cz*30+15-cam.position.z)>60)continue;for(const it of ch.items)for(const e of boxesOf(it)){const t=rayBox(cam.position,rd,e.b,bt);if(t!=null&&t<bt){bt=t;best={it,b:e.b}}}}return best}
function stdNear(p){let b=null,bd=9;for(const h of houses){if(h.door)continue;const d=Math.hypot(h.x-p.x,h.z-p.z);if(d<bd){bd=d;b={h}}}for(const h of blds){if(h.locked)continue;const d=Math.hypot(h.x-p.x,h.z-p.z);if(d<bd){bd=d;b={b:h}}}return b}
function footprint(items){let a=[1e9,1e9,-1e9,-1e9,0];for(const it of items)for(const e of boxesOf(it)){a[0]=Math.min(a[0],e.b[0]);a[1]=Math.min(a[1],e.b[2]);a[2]=Math.max(a[2],e.b[3]);a[3]=Math.max(a[3],e.b[5]);a[4]=Math.max(a[4],e.b[4])}return a}
function groundFree(x0,z0,x1,z1,l){if(l>0)return true;for(let x=x0+.5;x<x1;x+=3)for(let z=z0+.5;z<z1;z+=3){const tx=Math.floor(x/T),tz=Math.floor(z/T);if(!landXZ(x,z)||inKilXZ(x,z)||occ.has(tx+','+tz))return false;for(const r of lockRects)if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3])return false}return true}
BUILD.make=function(p){// itens na posição apontada
 if(BUILD.pre){const P=PRE[BUILD.pre],ox=Math.floor(p.x/3)*3-Math.floor(P.W/6)*3,oz=Math.floor(p.z/3)*3-Math.floor(P.D/6)*3;return P.gen().map(i=>({t:i.t,x:i.x+ox,z:i.z+oz,l:i.l+BUILD.level,r:i.r||0,m:BUILD.mat}))}
 const s=snapP(BUILD.cur,p);return[{t:BUILD.cur,x:s.x,z:s.z,l:BUILD.level,r:s.r,m:BUILD.mat}]};
BUILD.cost=its=>its.reduce((a,i)=>a+price(i.t,i.m),0);
BUILD.updGhost=function(){const tl=BUILD.tool;ghost.visible=false;BUILD.ok=false;BUILD.tgt=null;
 if(tl!=='place'){const pk=pickItem();if(pk){BUILD.tgt=pk;const b=pk.b;ghost.visible=true;ghost.scale.set(b[3]-b[0]+.1,b[4]-b[1]+.1,b[5]-b[2]+.1);ghost.position.set((b[0]+b[3])/2,b[1]-.05,(b[2]+b[5])/2);ghost.material.color.set(tl==='demolir'?0xef4444:0xfacc15);BUILD.ok=true;return}
  const p=aimY(0);if(p){const s=stdNear(p);if(s){BUILD.tgt=s;const o=s.h||s.b;ghost.visible=true;ghost.scale.set(5,(o.h||4)+2,5);ghost.position.set(o.x,0,o.z);ghost.material.color.set(tl==='demolir'?0xef4444:0xfacc15);BUILD.ok=true}}return}
 const p=aimY(BUILD.level*3);if(!p)return;const its=BUILD.make(p);BUILD.its=its;const f=footprint(its);ghost.visible=true;ghost.scale.set(f[2]-f[0],Math.max(.2,f[4]-BUILD.level*3),f[3]-f[1]);ghost.position.set((f[0]+f[2])/2,BUILD.level*3,(f[1]+f[3])/2);
 const cost=BUILD.cost(its),near=Math.hypot(p.x-pl.x,p.z-pl.z)<45,free=groundFree(f[0],f[1],f[2],f[3],BUILD.level),inside=!BUILD.pre&&Math.abs(pl.x-(f[0]+f[2])/2)<(f[2]-f[0])/2+.4&&Math.abs(pl.z-(f[1]+f[3])/2)<(f[3]-f[1])/2+.4&&PIECES[BUILD.cur].edge,dup=its.every(i=>BUILD.keys.has(ikey(i)));
 BUILD.ok=near&&free&&!dup&&player.money>=cost&&!inside;ghost.material.color.set(BUILD.ok?0x22c55e:0xef4444);BUILD.cost_=cost;BUILD.why=!near?'longe demais':!free?'local ocupado':dup?'já existe':player.money<cost?'sem dinheiro ('+kz(cost)+')':inside?'estás no caminho':''}
BUILD.place=function(){BUILD.updGhost();const tl=BUILD.tool;
 if(tl==='place'){if(!BUILD.ok){toast('❌ '+(BUILD.why||'local inválido'));return}const its=BUILD.its,cost=BUILD.cost(its);player.money-=cost;let n=0;for(const i of its)if(addItem(i))n++;flushDirty();sfx('buy');updateLifeUI();toast(`🧱 ${n} módulo(s) · −${kz(cost)}`);MS.hook('build','mod');if(!BUILD.first){BUILD.first=1;reward('Primeira construção!',5000,10)}return}
 if(!BUILD.tgt){toast('Aponta para uma peça ou edifício');return}
 const t=BUILD.tgt;
 if(t.it){if(tl==='demolir'){const rf=Math.round(price(t.it.t,t.it.m)*.5);removeItem(t.it);flushDirty();player.money+=rf;toast('🧨 Demolido · reembolso '+kz(rf));sfx('punch')}
  else{const c=Math.round(price(t.it.t,BUILD.mat)*.4);if(player.money<c)return toast('Sem dinheiro');player.money-=c;removeItem(t.it);t.it.m=BUILD.mat;t.it._b=null;addItem(t.it);flushDirty();toast(`🎨 ${MATS[BUILD.mat].n} · −${kz(c)}`)}updateLifeUI();return}
 if(t.h||t.b){const o=t.h||t.b,key=o.tx+','+o.ty;if(tl==='demolir'){const c=t.h?20000:60000;if(player.money<c)return toast('Demolir custa '+kz(c));player.money-=c;if(t.h)removeHouse(t.h);else removeBld(t.b);BUILD.std[key]={del:1};BUILD.save();toast('🧨 Edifício demolido (−'+kz(c)+')')}
  else{const c=Math.round(15000*MATS[BUILD.mat].p);if(player.money<c)return toast('Alterar custa '+kz(c));if(!t.h)return toast('Só moradias podem mudar de material por agora');player.money-=c;recolorHouse(t.h,MATS[BUILD.mat].c);BUILD.std[key]={col:MATS[BUILD.mat].c};BUILD.save();toast(`🎨 Moradia em ${MATS[BUILD.mat].n} (−${kz(c)})`)}updateLifeUI()}}
BUILD.rotate=()=>{BUILD.rot=(BUILD.rot+1)%4;BUILD.bar()};BUILD.lv=d=>{BUILD.level=clamp(BUILD.level+d,0,8);BUILD.bar()};
BUILD.bar=function(){const t=BUILD.tool,nm=t==='place'?(BUILD.pre?PRE[BUILD.pre].n:PIECES[BUILD.cur].n):t==='demolir'?'🧨 DEMOLIR':'🎨 MATERIAL';$('buildBar').textContent=`🧱 ${nm} · ${MATS[BUILD.mat].n} · nível ${BUILD.level}${t==='place'?' · '+kz(BUILD.cost_||0):''} — clica/[E] para aplicar · R roda`;$('buildBar').style.display='block';$('bTools').style.display='flex'};
BUILD.start=function(tool,cur,pre){buildMode='mod';BUILD.tool=tool;BUILD.cur=cur||BUILD.cur||'parede';BUILD.pre=pre||null;closePn();setMode('first');BUILD.bar()};
BUILD.setMat=function(i){BUILD.mat=i;sfx('click');if(buildMode==='mod')BUILD.bar();BUILD.open(BUILD._tab)};
BUILD.open=function(tab){if(!player)return;tab=tab||BUILD._tab||'Estrutura';BUILD._tab=tab;const m=MATS[BUILD.mat];
 let h=`<h3>🧱 Construtor</h3><div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px">${[...CATS,'Prontos'].map(c=>`<button class="btn keep ${c===tab?'on':''}" onclick="BUILD.open('${c}')">${c}</button>`).join('')}</div>`;
 h+=`<div style="font-size:11px;margin:4px 0">Material: <b>${m.n}</b> (×${m.p}) — escolhe:</div><div class="swg">${MATS.map((x,i)=>`<button class="sw ${i===BUILD.mat?'on':''}" title="${x.n} ×${x.p}" style="background:${x.c}" onclick="BUILD.setMat(${i})"><small>${x.n}</small></button>`).join('')}</div>`;
 if(tab==='Prontos')for(const k in PRE)h+=row(PRE[k].n+` <small>${kz(preCost(k,BUILD.mat))}</small>`,`<button class="btn green" onclick="BUILD.start('place',null,'${k}')">Colocar</button>`);
 else for(const k in PIECES){const p=PIECES[k];if(p.cat!==tab)continue;h+=row(p.n+` <small>${kz(price(k,BUILD.mat))}</small>`,`<button class="btn green" onclick="BUILD.start('place','${k}')">Colocar</button>`)}
 h+=`<div class="r"><span>Ferramentas</span><span><button class="btn red" onclick="BUILD.start('demolir')">🧨 Demolir</button> <button class="btn gold" onclick="BUILD.start('material')">🎨 Material</button></span></div><p style="font-size:11px;color:#94a3b8">Demolir/Material também funcionam em casas das cidades (monumentos e instituições são protegidos). Tudo o que construíres fica guardado.</p>`;openPn(h)};
BUILD.nearInter=function(x,z){for(const it of BUILD.items){const pc=PIECES[it.t];if(!pc.inter)continue;const cx=it.x+pc.W/2,cz=it.z+pc.D/2;if(Math.abs(cx-x)<3.4&&Math.abs(cz-z)<3.4&&Math.abs(it.l*3-pl.y)<2.5)return{it,k:pc.inter}}return null};
BUILD.nearestDJ=function(){let b=-1;for(const it of BUILD.djs){const d=Math.hypot(it.x+1.5-pl.x,it.z+1.5-pl.z);if(b<0||d<b)b=d}return b};
BUILD.act=function(n){if(n.k==='dj')openDJ();else if(n.k==='cama'){player.energy=100;toast('😴 Dormiste na tua cama. Energia 100%');MS.hook('rest');updateLifeUI()}};
function recolorHouse(h,c){tc.set(c);iW.setColorAt(h.iw,tc);iW.instanceColor.needsUpdate=true}
