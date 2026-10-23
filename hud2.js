// hud2.js — recompensas, botões de tiro e ferramentas do construtor
function reward(t,m,x){if(!player)return;player.money+=m||0;player.xp=(player.xp||0)+(x||0);const e=$('rwd');e.innerHTML=`🏆 <b>${t}</b><br>${m?'+'+kz(m):''}${m&&x?' · ':''}${x?'+'+x+' XP':''}`;e.style.display='block';e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');clearTimeout(reward.t);reward.t=setTimeout(()=>e.style.display='none',3200);sfx('chime');updateLifeUI()}
$('bF').addEventListener('pointerdown',e=>{e.preventDefault();$('bF').setPointerCapture(e.pointerId);FIRE.held=true;fire()});
for(const ev of['pointerup','pointercancel'])$('bF').addEventListener(ev,()=>{FIRE.held=false});
$('bW').addEventListener('pointerdown',e=>{e.preventDefault();cycleWeapon(1)});
$('tR').addEventListener('pointerdown',e=>{e.preventDefault();BUILD.rotate()});$('tU').addEventListener('pointerdown',e=>{e.preventDefault();BUILD.lv(1)});$('tD').addEventListener('pointerdown',e=>{e.preventDefault();BUILD.lv(-1)});
$('tP').addEventListener('pointerdown',e=>{e.preventDefault();BUILD.open()});$('tX').addEventListener('pointerdown',e=>{e.preventDefault();exitBuild();toast('Construção terminada')});
