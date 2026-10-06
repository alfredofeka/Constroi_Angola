// guide.js — palpites: próximo passo, onde ir, como fazer (seta + GPS + marcador no mapa e no chão)
const METER_TIPS={pub:'👍 Aceitação: obras, diálogo e transparência.',orc:'💰 Orçamento: não gastes em tudo; obras custam %.',emp:'👷 Emprego: legalizar, estágios e obras ajudam.',seg:'🛡️ Segurança: reage depressa a crises.',par:'🏛️ Partido/Parlamento: negoceia, mas sem te vender.',ref:'📜 Reforma: ouve, ajusta e não adies.',conf:'🤝 Confiança: ouve as pessoas e sê justo.',ord:'🚔 Ordem: patrulha e intervém a tempo.',res:'⛽ Recursos: usa só o necessário.',pro:'🔍 Provas: fala com testemunhas e segue a lei.',mor:'🪖 Moral: cuida da equipa.',luc:'💵 Lucro: controla custos sem enganar ninguém.',rep:'⭐ Reputação: honestidade com clientes.',leg:'📄 Legalidade: licenças e impostos em dia.',fun:'👥 Equipa: contratos justos e respeito.',con:'🏆 Hipótese de ganhar: proposta honesta e boa.',des:'📈 Desempenho: aceita formação e faz bem o trabalho.',rel:'🤝 Chefe: sê pontual e franco.',sau:'❤️ Saúde: descansa — dorme em casa!',cat:'🎖️ Categoria: concorre e estuda.',met:'🎯 Metas: realistas e partilhadas.',eq:'👥 Equipa: protege as pessoas.',bem:'😊 Bem-estar: come, descansa, trata da saúde.',fin:'💰 Finanças: evita dívidas.',com:'🏘️ Comunidade: ajuda os vizinhos.',fam:'👨‍👩‍👧 Família: tempo e apoio.',vz:'📣 Voz cívica: participa, denuncia, lidera.'};
const T_NPC=()=>{let b=null,bd=1e9;for(const n of npcs){const d=Math.hypot(n.x-pl.x,n.z-pl.z);if(d<bd){bd=d;b=n}}return b&&{x:b.x,z:b.z,kind:'npc',label:b.name}};
const T_HOUSE=own=>{let b=null,bd=1e9;for(const h of houses){if(!own&&h.mine)continue;const d=Math.hypot(h.x-pl.x,h.z-pl.z)-(own&&h.mine?100:0);if(d<bd){bd=d;b=h}}return b&&{x:b.x,z:b.z+3.2,kind:'house',label:b.addr}};
const spotCache={};
function T_SPOT(type){const now=Date.now(),c=spotCache[type],ptx=Math.floor(pl.x/T),pty=Math.floor(pl.z/T);if(c&&now-c.t<2500&&Math.abs(c.px-ptx)<4&&Math.abs(c.py-pty)<4)return c.v;let v=null;
 outer:for(let r=0;r<=16;r++)for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const tx=ptx+dx,ty=pty+dy;if(!canBuild(tx,ty,type))continue;
  if(![[1,0],[-1,0],[0,1],[0,-1]].some(d=>roadSet.has((tx+d[0])+','+(ty+d[1]))))continue;v={x:(tx+.5)*T,z:(ty+.5)*T,kind:'spot',label:'local livre',tx,ty};break outer}
 spotCache[type]={t:now,px:ptx,py:pty,v};return v}
const cnB=()=>cn('build:luz')+cn('build:escola')+cn('build:estrada');
const S_OBRAS=n=>({id:'obras'+n,text:()=>`Faz obras no bairro (${Math.min(cnB(),n)}/${n})`,target:()=>T_SPOT('luz'),done:()=>cnB()>=n,
 how:'1) Abre 🏗️ CONSTRUIR [B] e escolhe Luz, Escola ou Estrada.\n2) Segue a seta / GPS até ao quadrado dourado (local livre junto a uma estrada).\n3) Aponta o centro do ecrã para o chão (verde = livre) e clica ou carrega [E].\nCada obra gasta orçamento (luz 4%, estrada 8%, escola 12-15%) mas sobe a aceitação.'});
const S_TALK=(n,txt)=>({id:'talk'+n,text:()=>`${txt} (${Math.min(cn('talk'),n)}/${n})`,target:T_NPC,done:()=>cn('talk')>=n,how:'Vai até à pessoa que a seta/GPS indica, olha-a na cara e carrega [E] (ou no botão E).'});
const S_HOUSE=n=>({id:'house'+n,text:()=>`Visita casas de clientes (${Math.min(cn('house'),n)}/${n})`,target:()=>T_HOUSE(false),done:()=>cn('house')>=n,how:'Vai até à porta da casa que a seta/GPS indica e carrega [E] para entrar. Dentro, olha à volta; sai pela porta com [E].'});
const S_REST={id:'rest',text:()=>'Descansa ou come em casa',target:()=>T_HOUSE(true),done:()=>cn('rest')>=1,how:'Entra numa casa [E] (a tua ou outra), vai à cama 🛏️ ou à mesa 🍲 e carrega [E].'};
const S_SHOP={id:'loja',text:()=>'Abre a tua loja',target:()=>T_SPOT('loja'),done:()=>cn('build:loja')>=1,
 how:'1) Abre 🏗️ CONSTRUIR [B] → 🏪 Loja (60.000 Kz).\n2) Segue a seta / GPS até ao quadrado dourado — um local livre junto a uma estrada, bom para clientes.\n3) Aponta o centro do ecrã para o chão (verde = livre) e clica ou carrega [E] para a abrir.\nA loja rende dinheiro todos os ciclos.'};
const S_JOBHOME={id:'jobhome',text:()=>'Arranja casa ou emprego',target:()=>player.money>=40000?T_SPOT('casa'):null,done:()=>!!player.house||!!player.job,
 how:'Opção A: TRABALHO [J] → aceita um emprego.\nOpção B: 🏗️ CONSTRUIR [B] → Casa (40.000 Kz) e coloca-a no quadrado dourado.'};
const S_CASA={id:'casa',text:()=>'Compra terreno ou constrói a tua casa',target:()=>T_SPOT('casa'),done:()=>cn('build:casa')+cn('build:terreno')>=1,how:'🏗️ CONSTRUIR [B] → Casa (40.000 Kz) dentro da cidade, ou Terreno (15.000 Kz) fora dela.'};
const GUIDES={'POLÍTICO':{1:[S_OBRAS(3)],2:[S_OBRAS(4)],3:[]},'POLÍCIA':{1:[S_TALK(3,'Fala com cidadãos')],2:[S_TALK(4,'Interroga testemunhas')],3:[]},'EMPRESÁRIO':{1:[S_SHOP,S_HOUSE(2)],2:[S_HOUSE(3)],3:[]},'TRABALHADOR':{1:[S_REST],2:[S_REST],3:[]},'CIDADÃO':{1:[S_JOBHOME],2:[S_CASA],3:[S_TALK(5,'Fala com os vizinhos')]}};
const gbeam=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,120,10),new THREE.MeshBasicMaterial({color:0x38bdf8,transparent:true,opacity:.5,fog:false}));gbeam.visible=false;scene.add(gbeam);
const gmark=new THREE.Mesh(gP,new THREE.MeshBasicMaterial({color:0xfbbf24,transparent:true,opacity:.6,fog:false}));gmark.rotation.x=-Math.PI/2;gmark.scale.set(T,T,1);gmark.position.y=.12;gmark.visible=false;scene.add(gmark);
const GUIDE={active:false,gps:true,step:null,tgt:null,t:0,since:0,sid:'',shown:{},wasDone:false,
 cur(){const d=MS.def;if(!d)return null;for(const s of(GUIDES[MS.role]||{})[MS.lvl]||[])if(!s.done())return s;return null},
 update(dt){const d=MS.def,on=!!d&&!MS.done&&!MS.paused;GUIDE.active=on;const el=$('guide');if(!on){el.style.display='none';gbeam.visible=gmark.visible=false;GUIDE.sid='';return}
  el.style.display='block';const s=GUIDE.cur(),id=s?MS.role+MS.lvl+s.id:'wait';
  if(id!==GUIDE.sid){if(GUIDE.sid&&GUIDE.sid!=='wait'&&!GUIDE.cur_fail)toast('✅ Passo cumprido!');GUIDE.sid=id;GUIDE.since=Date.now();GUIDE.t=0}
  GUIDE.step=s;GUIDE.t-=dt;
  if(GUIDE.t<=0){GUIDE.t=.8;GUIDE.tgt=s&&s.target?s.target():null;if(GUIDE.tgt)gpsCompute(GUIDE.tgt.x,GUIDE.tgt.z);else GPS.pts=null}
  const g=GUIDE.tgt;
  if(s&&Date.now()-GUIDE.since>45000&&!GUIDE.shown[id]){GUIDE.shown[id]=1;toast('💡 Palpite: '+s.how.split('\n')[0])}
  let title,sub='';
  if(s){title='🎯 '+s.text();if(g){gpsArrow(g.x,g.z);const dd=GUIDE.gps?GPS.len:Math.hypot(g.x-pl.x,g.z-pl.z);sub=`${g.kind==='npc'?'👤 '+g.label+' · ':g.kind==='spot'?'📍 local livre · ':''}${fmtD(dd)}${GUIDE.gps?' · '+GPS.txt:''}`;$('gArrow').style.transform=`rotate(${GPS.ang}rad)`;$('gArrow').style.visibility='visible'}else{sub=s.id==='jobhome'?'Sem dinheiro para casa? Aceita um emprego em TRABALHO [J].':'Sem local indicado — vê 💡 Como fazer.';$('gArrow').style.visibility='hidden'}}
  else{const e=d.events[MS.ev],dur=d.time*MISSION_TIME_SCALE;title=e?'⏳ Próximo dilema':'🏁 Quase no fim do contrato';if(e){const left=Math.max(0,e.at*dur-MS.t);sub=`em ${String(Math.floor(left/60)).padStart(2,'0')}:${String(Math.floor(left%60)).padStart(2,'0')} — enquanto isso, explora e cumpre os objetivos 📋`}else sub='Já só falta o tempo acabar.';$('gArrow').style.visibility='hidden'}
  $('gTitle').textContent=title;$('gSub').textContent=sub;
  if(g&&s){gbeam.visible=true;gbeam.position.set(g.x,60,g.z);gmark.visible=g.kind==='spot';if(g.kind==='spot'){gmark.position.set(g.x,.12,g.z);gmark.material.opacity=.35+.3*Math.sin(Date.now()/250)}}else gbeam.visible=gmark.visible=false},
 toggleGps(){GUIDE.gps=!GUIDE.gps;toast(GUIDE.gps?'📍 GPS ligado: rota nas estradas':'📍 GPS desligado: só seta em linha reta')},
 how(){if(!MS.def)return;const s=GUIDE.cur(),d=MS.def,ks=Object.keys(MS.v).sort((a,b)=>MS.v[a]-MS.v[b]),w=ks[0],pend=d.objs.filter(o=>!o[1](MS.v));
  openPn(`<h3>💡 Como fazer</h3>${s?`<b>${s.text()}</b><p style="font-size:12px;line-height:1.5">${s.how.replace(/\n/g,'<br>')}</p>`:'<p style="font-size:12px">Neste momento o que conta são as tuas <b>decisões nos dilemas</b>. Entre dilemas, explora e cumpre objetivos.</p>'}
  <b style="font-size:12px">Ainda por cumprir</b><div style="font-size:12px;margin:4px 0">${pend.length?pend.map(o=>'⬜ '+o[0]).join('<br>'):'✅ Tudo cumprido neste momento — mantém!'}</div>
  <b style="font-size:12px">Mais frágil agora</b><div style="font-size:12px">${d.meters[w][2]} ${d.meters[w][0]}: ${Math.round(MS.v[w])}%<br><span style="color:#cbd5e1">${METER_TIPS[w]||''}</span></div>
  <p style="font-size:11px;color:#94a3b8">Nos dilemas, o botão <b>💡 Palpite</b> (2 por contrato) mostra ⬆️/⬇️ de cada opção.<br>Mapa: [N] · Seta e linha azul = GPS.</p>`)}};
function drawGuide(ctx,X,Y,k,v,small){
 const g=GUIDE;if(g.active&&g.gps&&GPS.pts&&g.tgt){ctx.strokeStyle='#38bdf8';ctx.lineWidth=Math.max(2.5,k*.55);ctx.lineJoin='round';ctx.setLineDash([]);ctx.beginPath();GPS.pts.forEach((p,i)=>{const x=X(p[0]/T),y=Y(p[1]/T);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}
 if(small||v.z>=4){const r=small?2.2:3;ctx.fillStyle='#fff';for(const n of npcs){const x=X(n.x/T),y=Y(n.z/T);if(x<-5||y<-5||x>ctx.canvas.width+5||y>ctx.canvas.height+5)continue;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
  ctx.fillStyle='#60a5fa';for(const c of cars){const x=X(c.x/T),y=Y(c.z/T);if(x<-5||y<-5||x>ctx.canvas.width+5||y>ctx.canvas.height+5)continue;ctx.fillRect(x-r,y-r,r*2,r*2)}}
 if(g.active&&g.tgt){const t=g.tgt,x=X(t.x/T),y=Y(t.z/T),p=(Date.now()%1000)/1000;ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,6+p*10,0,7);ctx.stroke();ctx.fillStyle='#fbbf24';ctx.strokeStyle='#000';ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.fill();ctx.stroke();
  if(!small||v.z>=2){ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(t.label,x,y-12);ctx.fillText(t.label,x,y-12)}}}
