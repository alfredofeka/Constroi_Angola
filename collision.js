// collision.js — NINGUÉM atravessa nada: casas, árvores, água, carros e pessoas
function hitsStatic(x,z,r){
 if(x<1||z<1||x>WW*T-1||z>WH*T-1||!landXZ(x,z))return true;
 const tx=Math.floor(x/T),ty=Math.floor(z/T);
 for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const k=(tx+i)+','+(ty+j),l=occ.get(k);
  if(l){const cx=(tx+i+.5)*T,cz=(ty+j+.5)*T,dx=Math.max(Math.abs(x-cx)-l,0),dz=Math.max(Math.abs(z-cz)-l,0);if(dx*dx+dz*dz<r*r)return true}
  const t=trees.get(k);if(t)for(const o of t)if(Math.hypot(x-o.x,z-o.z)<o.r+r)return true}
 return false}
const carCircles=c=>{const s=Math.sin(c.heading),k=Math.cos(c.heading);return[[c.x+s*1.4,c.z+k*1.4],[c.x,c.z],[c.x-s*1.4,c.z-k*1.4]]};
function hitsCars(x,z,r,skip){for(const c of cars){if(c===skip||Math.abs(c.x-x)>7||Math.abs(c.z-z)>7)continue;for(const p of carCircles(c))if(Math.hypot(p[0]-x,p[1]-z)<1+r)return c}return null}
function hitsPeople(x,z,r,skip){for(const n of npcs){if(n===skip||n.far)continue;if(Math.abs(n.x-x)<2&&Math.abs(n.z-z)<2&&Math.hypot(n.x-x,n.z-z)<.35+r)return n}
 if(skip!==pl&&player&&!inHouse&&!pCar&&Math.hypot(pl.x-x,pl.z-z)<.35+r)return pl;return null}
// interior da casa (obstáculos: cama, cofre, roupeiro, mesa)
const INT=[[-3,-2.8,1.1,.65],[3,-3,.4,.4],[0,-3.6,1.1,.3],[2.6,1.4,.7,.5]];
function hitsInterior(x,z,r){for(const o of INT){const dx=Math.max(Math.abs(x-(RX+o[0]))-o[2],0),dz=Math.max(Math.abs(z-(RZ+o[1]))-o[3],0);if(dx*dx+dz*dz<r*r)return true}return Math.abs(x-RX)>4.5||z<RZ-3.5||z>RZ+3.7}
// move um peão (jogador/NPC) deslizando nas paredes; se já estiver preso deixa sair
function moveWalker(e,nx,nz,r){
 const ok=(x,z)=>inHouse&&e===pl?!hitsInterior(x,z,r):(!hitsStatic(x,z,r)&&!hitsCars(x,z,r)&&!hitsPeople(x,z,r,e));
 if(ok(nx,nz)){e.x=nx;e.z=nz;return true}
 if(ok(nx,e.z)){e.x=nx;return true}
 if(ok(e.x,nz)){e.z=nz;return true}
 if(!ok(e.x,e.z)){e.x=nx;e.z=nz;return true}
 return false}
// carro: 3 círculos contra tudo (menos ele próprio)
function carBlocked(c,nx,nz,h){const s=Math.sin(h),k=Math.cos(h);
 for(const d of[1.4,0,-1.4]){const x=nx+s*d,z=nz+k*d;if(hitsStatic(x,z,1)||hitsCars(x,z,1,c)||hitsPeople(x,z,1,c===pCar?pl:null))return true}return false}
