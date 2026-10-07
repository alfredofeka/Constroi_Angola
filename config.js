// config.js — constantes, estado global e utilitários (carrega depois de mapdata.js)
const T=6,WW=MAP_ROWS[0].length,WH=MAP_ROWS.length;
const $=id=>document.getElementById(id);
const rnd=a=>a[Math.random()*a.length|0],ri=(a,b)=>a+(Math.random()*(b-a+1)|0),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const kz=n=>Math.round(n).toLocaleString('pt-PT')+' Kz';
const kzs=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?Math.round(n/1e3)+'k':Math.round(n)+'';
const CITIES=[
 {id:'luanda',name:'Luanda',rx:18,ry:14,npcs:34,cars:24,trees:70},
 {id:'benguela',name:'Benguela',rx:10,ry:8,npcs:14,cars:8,trees:30},
 {id:'lubango',name:'Lubango',rx:9,ry:7,npcs:12,cars:6,trees:25}];
for(const c of CITIES){[c.cx,c.cy]=MAP_CITIES[c.id]}
// Maquete do Kilamba: zona própria (longe do mapa de Angola), em metros reais
const KIL={x0:500,y0:500,w:114,h:69,BW:34,BH:30,AV:3},pois=[];
const inKil=(tx,ty)=>tx>=KIL.x0-6&&tx<KIL.x0+KIL.w+6&&ty>=KIL.y0-6&&ty<KIL.y0+KIL.h+6,inKilXZ=(x,z)=>inKil(Math.floor(x/T),Math.floor(z/T)),inKilRect=(tx,ty)=>tx>=KIL.x0&&tx<KIL.x0+KIL.w&&ty>=KIL.y0&&ty<KIL.y0+KIL.h;
CITIES.push({id:'kilamba',name:'Kilamba',custom:true,cx:KIL.x0+KIL.BW+KIL.AV+1,cy:KIL.y0+KIL.BH+KIL.AV+1,rx:57,ry:35,npcs:60,cars:26,trees:0,mx:27,my:48});
const landT=(tx,ty)=>(!!MAP_ROWS[ty]&&MAP_ROWS[ty][tx]==='1')||inKil(tx,ty);
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
