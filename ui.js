// ui.js — vida, painéis (trabalho, mercado, perfil, construir), início do jogo, câmaras
const updAvatar=()=>{avatar.skin=$('cSkin').value;avatar.shirt=$('cShirt').value;avatar.name=$('pName').value||'Alfredo';$('avatarPreview').style.background=avatar.skin;$('avatarPreview').style.borderColor=avatar.shirt};
function updateLifeUI(){if(!player)return;$('sMoney').textContent='💰 '+kz(player.money);$('sHome').textContent=player.house?'🏠 '+player.house:'🏠 Sem casa';$('sCar').textContent=pCar?`🚗 ${pCar.model} ⛽${pCar.fuel|0}%`:'';$('sHunger').textContent='🍞 '+(player.hunger|0)+'%';$('sEnergy').textContent='⚡ '+(player.energy|0)+'%';$('sLvl').textContent='⭐ Nv'+(player.level||1)+' · '+(player.xp||0)+' XP'}
function lifeTick(){if(!player)return;if(!inHouse)player.hunger=clamp(player.hunger+1.5,0,100);player.energy=clamp(player.energy-.5,0,100);if(player.salary>0&&Math.random()<.35)player.money+=player.salary/30;updateLifeUI()}
function startAs(role){const ct=CITIES.find(c=>c.id===$('pCity').value)||CITIES[0];
 const base={CIDADÃO:5000,TRABALHADOR:15000,POLÍCIA:35000,EMPRESÁRIO:250000,POLÍTICO:120000}[role];
 player={role,name:avatar.name,age:ri(22,34),money:base,salary:{POLÍCIA:180000,TRABALHADOR:65000,POLÍTICO:450000,EMPRESÁRIO:120000}[role]||0,house:null,job:null,hunger:22,energy:90};
 pl.x=(ct.cx+.5)*T;pl.z=(ct.cy+.5)*T;pm=mkPerson(avatar.shirt,avatar.skin,'#1f2937',1);scene.add(pm.g);pm.g.visible=false;
 if(role==='EMPRESÁRIO'){const c=cars.find(k=>k.npc);for(const o of[[4.2,1.5],[-4.2,1.5],[1.5,4.2],[1.5,-4.2]]){const x=pl.x+o[0],z=pl.z+o[1];if(!hitsCars(x,z,2,c)&&!hitsPeople(x,z,2,pl)){c.npc=0;c.owned=1;c.x=x;c.z=z;c.heading=Math.PI/2;c.model='Toyota Corolla (teu)';c.vel=0;c.g.visible=true;sync(c);break}}}
 $('start').style.display='none';$('life').style.display='block';$('cross').style.display='block';$('lifeName').textContent=player.name.toUpperCase();$('lifeRole').textContent=role;
 setMode('first');updateLifeUI();logLife(`Bem-vindo a ${ct.name}, ${player.name}! Clica no ecrã para olhar com o rato. [N] = mapa de Angola`);setInterval(lifeTick,1500);MS.start(role,1)}
function setMode(m){mode=m;for(const k of['First','Third','Drone'])$('b'+k).classList.toggle('on',m===k.toLowerCase());$('cross').style.display=player?'block':'none'}
function cycleCam(){if(inHouse)return;setMode({first:'third',third:'drone',drone:'first'}[mode])}
function openPn(h){$('pc').innerHTML=h;$('pn').style.display='block';if(document.exitPointerLock)document.exitPointerLock()}
function closePn(){$('pn').style.display='none'}
const row=(a,b)=>`<div class="r"><span>${a}</span><b>${b}</b></div>`;
function openBuildMenu(){if(!player)return;openPn(`<h3>🏗️ Construir</h3>${row('🏠 Casa 40.000 Kz',`<button class="btn green" onclick="enterBuild('casa')">COLOCAR</button>`)}${row('🌾 Terreno 15.000 Kz (fora da cidade)',`<button class="btn green" onclick="enterBuild('terreno')">COMPRAR</button>`)}${row('🏫 Escola (político)',`<button class="btn gold" onclick="enterBuild('escola')">COLOCAR</button>`)}${row('🛣️ Estrada (político)',`<button class="btn gold" onclick="enterBuild('estrada')">COLOCAR</button>`)}${row('💡 Luz (político)',`<button class="btn gold" onclick="enterBuild('luz')">COLOCAR</button>`)}<p style="font-size:11px;color:#94a3b8">Depois de escolher, clica no ecrã para voltar a controlar o rato e aponta o centro do ecrã para o chão. Terrenos comprados deixam-te construir fora das cidades.</p>`)}
function actionWork(){if(!player)return;let h='<h3>💼 Trabalho</h3>';for(const[n,s]of[['Ajudante',55000],['Técnico Elevangola',180000],['Motorista Yango',90000]])h+=row(`${n} — ${kz(s)}`,`<button class="btn gold" onclick="player.job='${n}';player.salary=${s};closePn();updateLifeUI()">Aceitar</button>`);openPn(h)}
function actionMarket(){if(!player)return;const b=(l,p,f)=>row(`${l} — ${kz(p)}`,`<button class="btn" onclick="if(player.money>=${p}){player.money-=${p};${f};updateLifeUI();logLife('Compraste: ${l}')}else toast('Sem dinheiro')">Comprar</button>`);
 openPn('<h3>🛒 Mercado</h3>'+b('Pão 5un',1500,'player.hunger=Math.max(0,player.hunger-14)')+b('Água 20L',2000,'player.hunger=Math.max(0,player.hunger-6)')+b('Combustível +50%',5000,'if(pCar)pCar.fuel=Math.min(100,pCar.fuel+50)'))}
function openProfile(){if(!player)return;openPn(`<h3>👤 ${player.name}</h3>${row('Papel',player.role)}${row('Emprego',player.job||'—')}${row('Salário',kz(player.salary))}${row('Pele',`<input type="color" value="${avatar.skin}" oninput="pm.mats.skin.color.set(this.value)">`)}${row('Camisa',`<input type="color" value="${avatar.shirt}" oninput="pm.mats.shirt.color.set(this.value)">`)}`)}
// ações da roda: ▲ saltar / buzina · ▼ sentar / dormir / travar
function jump(){if(player&&!pCar&&!pl.sit&&pl.y===0&&!inHouse)pl.vy=4.2}
function sitOrSleep(){if(!player||pCar)return;if(inHouse&&nearT&&nearT.t==='bed'){doAction();return}pl.sit=!pl.sit;toast(pl.sit?'🪑 Sentado — mexe-te para levantar':'De pé')}
function actUp(){if(pCar)horn();else jump()}
function actDown(){if(!pCar)sitOrSleep()}
