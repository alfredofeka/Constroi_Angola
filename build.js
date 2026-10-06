// build.js — construção: casa, terreno, escola, estrada, luz (nunca em cima de pessoas, carros ou árvores)
const ghost=new THREE.Mesh(gUnit,new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:.5}));ghost.visible=false;scene.add(ghost);
const CUSTO={casa:40000,loja:60000,escola:0,estrada:0,luz:0,terreno:15000};let gt={tx:0,ty:0,ok:false};
function aimPoint(){const d=new THREE.Vector3();cam.getWorldDirection(d);if(d.y>-.02)return null;const t=-cam.position.y/d.y;if(t>90)return null;return{x:cam.position.x+d.x*t,z:cam.position.z+d.z*t}}
function tileFree(tx,ty){const x0=tx*T,z0=ty*T,i=(x,z,m)=>x>x0-m&&x<x0+T+m&&z>z0-m&&z<z0+T+m;
 for(const n of npcs)if(!n.far&&i(n.x,n.z,.5))return false;for(const c of cars)if(i(c.x,c.z,1.6))return false;
 if(player&&!inHouse&&i(pl.x,pl.z,.5))return false;const t=trees.get(tx+','+ty);return !t||!t.length}
function canBuild(tx,ty,t){if(!landT(tx,ty)||isRoad(tx,ty))return false;const k=tx+','+ty;if(occ.has(k))return false;
 if(t==='terreno')return !cityZone(tx,ty)&&!owned.has(k);return(cityZone(tx,ty)||owned.has(k))&&tileFree(tx,ty)}
function updGhost(){const p=aimPoint();ghost.visible=!!p;if(!p){gt.ok=false;return}gt.tx=Math.floor(p.x/T);gt.ty=Math.floor(p.z/T);gt.ok=canBuild(gt.tx,gt.ty,buildMode);
 const S={casa:[4.2,3.2],escola:[5.4,8],luz:[.4,5],loja:[5.4,4.5],estrada:[T,.1],terreno:[T,.1]}[buildMode];ghost.scale.set(S[0],S[1],S[0]);ghost.position.set((gt.tx+.5)*T,0,(gt.ty+.5)*T);ghost.material.color.set(gt.ok?0x22c55e:0xef4444)}
function enterBuild(t){if(!player){toast('Escolhe um papel');return}
 if(t==='casa'&&player.money<CUSTO.casa){toast('Sem dinheiro (40.000 Kz). Trabalha ou pede crédito.');return}
 if(['escola','luz','estrada'].includes(t)&&player.role!=='POLÍTICO'){toast('Só o POLÍTICO constrói isso');return}
 if(t==='loja'&&player.role!=='EMPRESÁRIO'){toast('Só o EMPRESÁRIO abre lojas');return}
 if(t==='loja'&&player.money<CUSTO.loja){toast('Sem dinheiro (60.000 Kz)');return}
 if(t==='terreno'&&player.money<CUSTO.terreno){toast('Sem dinheiro (15.000 Kz)');return}
 if(!MS.canBuild(t))return;
 buildMode=t;closePn();setMode('first');const b=$('buildBar');b.textContent=`🏗️ ${t.toUpperCase()} — aponta o centro do ecrã para o chão: VERDE = livre. Clica / [E] coloca. ESC cancela`;b.style.display='block'}
function exitBuild(){buildMode=null;ghost.visible=false;$('buildBar').style.display='none'}
function place(){updGhost();if(!gt.ok){toast('❌ Local inválido — procura um quadrado verde');return}const{tx,ty}=gt,t=buildMode,k=tx+','+ty,x=(tx+.5)*T,z=(ty+.5)*T;
 if(t==='casa'){if(player.money<CUSTO.casa){toast('Sem dinheiro.');return}addHouse({x,z,tx,ty,h:3.4,color:'#e8e0d0',roof:'#c49a30',fam:player.name,n:1,inc:player.salary,sat:88,addr:`Casa de ${player.name}`,safe:0,mine:1});player.house=`(${tx},${ty})`;player.money-=CUSTO.casa;logLife('🏠 Casa construída!')}
 else if(t==='loja'){if(player.money<CUSTO.loja){toast('Sem dinheiro.');return}addBld({x,z,tx,ty,h:4.5,color:'#f59e0b',name:'Loja de '+player.name,emp:2,mine:1,city:'—'});player.money-=CUSTO.loja;player.shops=(player.shops||0)+1;logLife('🏪 Loja aberta! Rende 1.500 Kz por ciclo.')}
 else if(t==='escola'){addBld({x,z,tx,ty,h:8,color:'#e8e0d0',name:'Escola Municipal',emp:35});logLife('🏫 Escola construída!')}
 else if(t==='luz'){addLamp(tx,ty);logLife('💡 Luz instalada!')}
 else if(t==='estrada'){roadSet.add(k);bx(0x4a4f55,T,.06,T,x,.05,z);logLife('🛣️ Estrada construída!')}
 else{player.money-=CUSTO.terreno;owned.add(k);flat(0xb8d68a,T,T,x,.03,z);logLife('🌾 Terreno comprado!');MS.hook('build','terreno');updateLifeUI();return}
 MS.hook('build',t);exitBuild();updateLifeUI()}
