// config.js — constantes, estado global e utilitários (carrega depois de mapdata.js)
const T=6,WW=MAP_ROWS[0].length,WH=MAP_ROWS.length,CELL=MAP_CELL,MT=CELL/T,WT=WW*MT,HT=WH*MT,WX=WW*CELL,WZ=WH*CELL; // mundo em escala: ~1 km de jogo ≈ 100 km reais
const $=id=>document.getElementById(id);
const rnd=a=>a[Math.random()*a.length|0],ri=(a,b)=>a+(Math.random()*(b-a+1)|0),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const kz=n=>Math.round(n).toLocaleString('pt-PT')+' Kz';
const kzs=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?Math.round(n/1e3)+'k':Math.round(n)+'';
const CITIES=[
 {id:'luanda',name:'Luanda',rx:28,ry:20,npcs:40,cars:26,trees:90},
 {id:'benguela',name:'Benguela',rx:14,ry:10,npcs:16,cars:8,trees:40},
 {id:'lubango',name:'Lubango',rx:12,ry:9,npcs:14,cars:6,trees:35}];
for(const c of CITIES){[c.cx,c.cy]=MAP_CITIES[c.id]}
// Maquete do Kilamba: zona própria (longe do mapa de Angola), em metros reais
const KIL={x0:4000,y0:4000,w:52,h:46,BW:46,BH:40,AV:3},pois=[];
const inKil=(tx,ty)=>tx>=KIL.x0-10&&tx<KIL.x0+KIL.w+10&&ty>=KIL.y0-10&&ty<KIL.y0+KIL.h+10,inKilXZ=(x,z)=>inKil(Math.floor(x/T),Math.floor(z/T)),inKilRect=(tx,ty)=>tx>=KIL.x0&&tx<KIL.x0+KIL.w&&ty>=KIL.y0&&ty<KIL.y0+KIL.h;
Object.assign(CITIES[1],{pal:['#f4c9b8','#f6e3a1','#b9d6ea','#c9e4c5','#f0d0e0'],roofs:['#b5532e','#c4623a','#a64a30'],tcols:['#d6352b','#3f8f4a','#e0482f']});Object.assign(CITIES[2],{pal:['#f4f1ea','#efe9dd','#e8e0cf'],roofs:['#9b2f24','#a8392b','#8c2a20'],tcols:['#8a5fc4','#3a8a3a','#2f7f46','#9a6fd0']});
CITIES.push({id:'kilamba',name:'Kilamba',custom:true,cx:KIL.x0+KIL.AV+22,cy:KIL.y0+KIL.AV+18,rx:26,ry:23,npcs:46,cars:14,trees:0,mx:CITIES[0].cx+60,my:CITIES[0].cy+120});
const landT=(tx,ty)=>{const cx=Math.floor(tx/MT),cy=Math.floor(ty/MT);return(!!MAP_ROWS[cy]&&MAP_ROWS[cy][cx]==='1')||inKil(tx,ty)};
const landXZ=(x,z)=>landT(Math.floor(x/T),Math.floor(z/T));
function cityAt(x,y){for(const c of CITIES){if(c.custom){if(inKilRect(x,y))return c;continue}if(((x-c.cx)/c.rx)**2+((y-c.cy)/c.ry)**2<1&&landT(x,y))return c}return null}
const cityZone=(x,y)=>!!cityAt(x,y);
// estado partilhado
const roads=[],roadSet=new Set(),owned=new Set(),occ=new Map(),trees=new Map(),houses=[],blds=[],npcs=[],cars=[];
let player=null,pm=null,pCar=null,inHouse=null,mode='first',prevMode='first',buildMode=null,nearT=null,aim=null,lastLook=0;
const pl={x:0,z:0,yaw:0,pitch:0,fov:72,walk:0,y:0,vy:0,sit:false,turn:0},K={},joy={x:0,y:0},avatar={skin:'#d7a77c',shirt:'#2563eb',name:'Alfredo'};
const isRoad=(x,y)=>roadSet.has(x+','+y);
let toastT;function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>e.style.display='none',3000)}
function logLife(t){toast(t);$('lifeLog').innerHTML=`> ${t}<br>`+$('lifeLog').innerHTML.slice(0,400)}
