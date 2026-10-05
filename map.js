// map.js — mapa de Angola interativo: posição, zoom, arrastar, marcar destino, viajar entre cidades
const mapImg=new Image();mapImg.src=MAP_IMG;
const MapUI={open:false,z:1,cx:WW/2,cy:WH/2,wp:null,drag:null,hover:null};
const mini=$('mini'),mg=mini.getContext('2d'),big=$('bigCv'),bg=big.getContext('2d'),TRAVEL=5000;
const beam=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,160,10),new THREE.MeshBasicMaterial({color:0xffd34d,transparent:true,opacity:.45,fog:false}));beam.visible=false;scene.add(beam);
function playerHeading(){return pCar?pCar.heading+Math.PI+pl.yaw:pl.yaw}
function nearestCity(tx,ty){let b=null,bd=1e9;for(const c of CITIES){const d=Math.hypot(c.cx-tx,c.cy-ty);if(d<bd){bd=d;b=c}}return{c:b,d:bd*T}}
function drawMap(ctx,w,h,v,small){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#7fb7d6';ctx.fillRect(0,0,w,h);
 const S=Math.min(w,h)*v.z,k=S/WW,ox=w/2-v.cx*k,oy=h/2-v.cy*k,X=t=>ox+t*k,Y=t=>oy+t*k;
 if(mapImg.complete)ctx.drawImage(mapImg,ox,oy,S,S*WH/WW);
 ctx.strokeStyle='#ffd34d';ctx.lineWidth=Math.max(1,k*.5);for(const r of roads){if(r.city)continue;ctx.beginPath();if(r.t==='v'){ctx.moveTo(X(r.p+.5),Y(r.lo));ctx.lineTo(X(r.p+.5),Y(r.hi+1))}else{ctx.moveTo(X(r.lo),Y(r.p+.5));ctx.lineTo(X(r.hi+1),Y(r.p+.5))}ctx.stroke()}
 ctx.fillStyle='rgba(120,120,120,.55)';for(const c of CITIES){ctx.beginPath();ctx.ellipse(X(c.cx+.5),Y(c.cy+.5),c.rx*k,c.ry*k,0,0,7);ctx.fill()}
 ctx.fillStyle='#22c55e';for(const t of owned){const[a,b]=t.split(',').map(Number);ctx.fillRect(X(a),Y(b),Math.max(2,k),Math.max(2,k))}
 ctx.fillStyle='#c49a30';for(const hs of houses)if(hs.mine)ctx.fillRect(X(hs.tx)-1,Y(hs.ty)-1,Math.max(4,k),Math.max(4,k));
 if(v.z>=2.5){ctx.fillStyle='rgba(155,61,53,.8)';for(const hs of houses)if(!hs.mine)ctx.fillRect(X(hs.tx),Y(hs.ty),Math.max(1.5,k*.8),Math.max(1.5,k*.8))}
 if(!small||v.z>=2){ctx.font=`bold ${small?10:14}px system-ui`;ctx.textAlign='left';for(const c of CITIES){ctx.fillStyle='#fff';ctx.strokeStyle='#000';ctx.lineWidth=3;ctx.strokeText(c.name,X(c.cx)+8,Y(c.cy)-6);ctx.fillText(c.name,X(c.cx)+8,Y(c.cy)-6);ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(X(c.cx+.5),Y(c.cy+.5),4,0,7);ctx.fill()}}
 const wp=MapUI.wp;if(wp){const t=(Date.now()%1200)/1200;ctx.strokeStyle='#ffd34d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(wp.tx+.5),Y(wp.ty+.5),5+t*10,0,7);ctx.stroke();ctx.fillStyle='#ffd34d';ctx.beginPath();ctx.arc(X(wp.tx+.5),Y(wp.ty+.5),4,0,7);ctx.fill()}
 if(player){const px=X(pl.x/T),py=Y(pl.z/T),a=playerHeading(),fx=-Math.sin(a),fz=-Math.cos(a),s=small?9:13;ctx.fillStyle='#c49a30';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+fx*s,py+fz*s);ctx.lineTo(px-fz*s*.6-fx*s*.5,py+fx*s*.6-fz*s*.5);ctx.lineTo(px+fz*s*.6-fx*s*.5,py-fx*s*.6-fz*s*.5);ctx.closePath();ctx.stroke();ctx.fill()}
 return{k,ox,oy}}
function drawMini(){if(!player)return;drawMap(mg,mini.width,mini.height,{z:3,cx:pl.x/T,cy:pl.z/T},true);const wp=MapUI.wp;
 if(wp){const d=Math.hypot(wp.tx*T+T/2-pl.x,wp.ty*T+T/2-pl.z);$('wpTxt').textContent=`🎯 ${wp.name} · ${d>1000?(d/1000).toFixed(1)+' km':Math.round(d)+' m'}`;beam.visible=true;beam.position.set((wp.tx+.5)*T,80,(wp.ty+.5)*T);if(d<8)clearWp()}else{$('wpTxt').textContent='';beam.visible=false}}
function setWp(tx,ty){if(!landT(tx,ty)){toast('Isso é mar — escolhe terra firme');return}const n=nearestCity(tx,ty);MapUI.wp={tx,ty,name:n.d<T*12?'perto de '+n.c.name:`Destino (${tx},${ty})`};toast('🎯 Destino marcado: '+MapUI.wp.name)}
function clearWp(){MapUI.wp=null}
function travelTo(id){const c=CITIES.find(k=>k.id===id);if(!player||inHouse){toast('Sai de casa primeiro');return}if(player.money<TRAVEL){toast('Viagem custa '+kz(TRAVEL));return}
 player.money-=TRAVEL;const x=(c.cx+.5)*T,z=(c.cy+.5)*T;if(pCar){pCar.x=x+1.6;pCar.z=z;pCar.heading=Math.PI/2;pCar.vel=0;sync(pCar)}pl.x=x+(pCar?1.6:0);pl.z=z;logLife(`🚗 Viajaste para ${c.name} (-${kz(TRAVEL)})`);updateLifeUI();toggleMap(false)}
function toggleMap(f){MapUI.open=f===undefined?!MapUI.open:f;$('bigmap').style.display=MapUI.open?'flex':'none';if(MapUI.open){if(document.exitPointerLock)document.exitPointerLock();MapUI.cx=pl.x/T;MapUI.cy=pl.z/T;MapUI.z=1.6;$('mapCities').innerHTML=CITIES.map(c=>`<div class="r"><b>${c.name}</b><span><button class="btn" onclick="setWp(${c.cx},${c.cy})">📍 Marcar</button> <button class="btn gold" onclick="travelTo('${c.id}')">🚗 Viajar ${kz(TRAVEL)}</button></span></div>`).join('')+`<div class="r"><span>Destino</span><button class="btn red" onclick="clearWp()">Limpar</button></div>`}}
let bgv=null;
function drawBig(){if(!MapUI.open)return;const dpr=devicePixelRatio||1,w=big.clientWidth,h=big.clientHeight;if(big.width!==w*dpr){big.width=w*dpr;big.height=h*dpr}
 bg.setTransform(dpr,0,0,dpr,0,0);bgv=drawMap(bg,w,h,MapUI,false);bg.setTransform(dpr,0,0,dpr,0,0);
 const n=nearestCity(pl.x/T,pl.z/T);let t=`Tu: (${pl.x/T|0},${pl.z/T|0}) · ${n.d<T*14?'em '+n.c.name:'a '+Math.round(n.d)+' m de '+n.c.name}`;
 if(MapUI.hover){const{tx,ty}=MapUI.hover;t+=` · cursor (${tx},${ty}) ${landT(tx,ty)?(cityZone(tx,ty)?cityAt(tx,ty).name:'terra'):'mar'}`}$('mapInfo').textContent=t}
function mapTile(e){const r=big.getBoundingClientRect(),k=bgv.k;return{tx:Math.floor((e.clientX-r.left-bgv.ox)/k),ty:Math.floor((e.clientY-r.top-bgv.oy)/k)}}
big.addEventListener('pointerdown',e=>{big.setPointerCapture(e.pointerId);MapUI.drag={x:e.clientX,y:e.clientY,m:0}});
big.addEventListener('pointermove',e=>{if(!bgv)return;MapUI.hover=mapTile(e);const d=MapUI.drag;if(d){const dx=e.clientX-d.x,dy=e.clientY-d.y;d.m+=Math.abs(dx)+Math.abs(dy);MapUI.cx-=dx/bgv.k;MapUI.cy-=dy/bgv.k;d.x=e.clientX;d.y=e.clientY}});
big.addEventListener('pointerup',e=>{const d=MapUI.drag;MapUI.drag=null;if(d&&d.m<6&&bgv){const t=mapTile(e);setWp(t.tx,t.ty)}});
big.addEventListener('wheel',e=>{e.preventDefault();if(!bgv)return;const t=mapTile(e),oz=MapUI.z;MapUI.z=clamp(oz*Math.exp(-e.deltaY*.0015),.7,14);const r=big.getBoundingClientRect(),S=Math.min(r.width,r.height)*MapUI.z,k=S/WW;MapUI.cx=t.tx+.5-(e.clientX-r.left-r.width/2)/k;MapUI.cy=t.ty+.5-(e.clientY-r.top-r.height/2)/k},{passive:false});
mini.addEventListener('click',()=>toggleMap(true));
