// missions.js — contratos por papel: cronómetro, medidores, dilemas, nota final e XP
// Para acrescentar o Nível 2/3 basta juntar mais um objeto ao array do papel em MISSIONS (nada mais muda).
const MISSION_TIME_SCALE=1;  // 1 = duração real (Político: 10 min). Para testar mete 0.1
const DEC_TIMEOUT=25;        // segundos para decidir; se acabar, vale a opção "não fazer nada"
const EV=(at,txt,ch,def)=>({at,txt,ch,def:def===undefined?ch.length-1:def}),CH=(label,fx,note)=>({label,fx,note});
const cn=k=>MS.cnt[k]||0;
const MISSIONS={
'POLÍTICO':[{title:'Administrador de Bairro',adj:7,years:2,time:600,
 brief:'Foste eleito por 2 anos. O relógio já começou. Cada decisão custa orçamento ou aceitação — não dá para agradar a todos.',
 meters:{pub:['Aceitação',60,'👍'],orc:['Orçamento',60,'💰'],emp:['Emprego',40,'👷'],seg:['Segurança',50,'🛡️']},lose:{pub:30},drift:{pub:-.5,orc:2},
 buildCost:{luz:4,escola:15,estrada:8},buildPub:3,rw:{A:[200000,100],B:[120000,70],C:[60000,40]},
 objs:[['Aceitação ≥ 50%',s=>s.pub>=50],['3 obras: luz, escola ou estrada (🏗️ CONSTRUIR)',()=>cn('build:luz')+cn('build:escola')+cn('build:estrada')>=3],['Orçamento ≥ 10%',s=>s.orc>=10]],
 events:[
 EV(.08,'💧 Falta água no bairro há 3 dias. O que fazes?',[CH('Abrir furos de água (obra cara)',{orc:-15,pub:12,seg:2},'Os vizinhos agradecem.'),CH('Fazer a estrada da inauguração',{orc:-12,pub:5,emp:5},'Bonito na foto, mas a água continua em falta.'),CH('Prometer e adiar',{pub:-7},'Prometeste… outra vez.')]),
 EV(.2,'🤝 Um empreiteiro oferece 150.000 Kz "de comissão" para ganhar a obra da estrada.',[CH('Aceitar o dinheiro',{'$':150000,i:-25,orc:-4},'Dinheiro fácil. Ninguém viu… por agora.'),CH('Recusar e abrir concurso público',{i:6,pub:4,orc:-3},'Mais lento, mas limpo.')],1),
 EV(.32,'📣 Taxistas e zungueiras protestam à porta da administração.',[CH('Negociar com os líderes',{pub:6,orc:-5},'Cedeste um pouco, ganhaste confiança.'),CH('Chamar a polícia',{seg:6,pub:-10},'A rua ficou calma, mas zangada.'),CH('Ignorar',{pub:-8,seg:-5},'O protesto cresceu.')]),
 EV(.44,'🛒 O mercado informal ocupa o passeio. Muitas famílias vivem disto.',[CH('Legalizar com uma taxa pequena',{emp:8,orc:6,pub:3},'Mais emprego e mais receita.'),CH('Expulsar e limpar a rua',{seg:3,emp:-9,pub:-8},'Rua limpa, famílias sem rendimento.')],0),
 EV(.56,'🌧️ Chuva forte: inundação em 3 ruas.',[CH('Usar o fundo de emergência',{orc:-20,pub:10,seg:6},'Ajudaste quando era preciso.'),CH('Esperar pelo governo central',{pub:-12,seg:-8},'Esperaste… e o povo não perdoou.')]),
 EV(.68,'👨‍👩‍👧 Um familiar pede emprego na administração, sem concurso.',[CH('Dar o lugar ao familiar',{i:-15,pub:-2,emp:2},'Familiar contente. A imprensa ainda não soube.'),CH('Abrir concurso público',{i:8,emp:5,pub:2},'Deste igualdade de oportunidades.')],1),
 EV(.8,'📰 Um jornalista pede as contas da administração.',[CH('Mostrar tudo',{pub:8,i:6},'A transparência valeu a pena.'),CH('Esconder os números',{i:-12,pub:-4},'Escondeste. Ficou a desconfiança.')],1),
 EV(.9,'🏗️ Falta dinheiro para acabar as obras prometidas.',[CH('Pedir crédito ao governo provincial',{orc:15,pub:-3},'Mais fôlego, mais dívida.'),CH('Cortar na escola',{orc:8,pub:-9,emp:-3},'Poupaste hoje, perdes amanhã.'),CH('Deixar como está',{pub:-5},'Obras paradas.')])]}],
'POLÍCIA':[{title:'Agente de Patrulha',adj:16,time:480,brief:'Primeira semana na rua. Cada ocorrência testa o teu carácter: lei, pessoas e ordens que nem sempre são justas.',
 meters:{conf:['Confiança',55,'🤝'],ord:['Ordem',50,'🚔'],res:['Recursos',60,'⛽']},lose:{conf:25},drift:{ord:-1,res:-.5},rw:{A:[150000,100],B:[90000,70],C:[45000,40]},
 objs:[['Confiança ≥ 50%',s=>s.conf>=50],['Ordem ≥ 50%',s=>s.ord>=50],['Falar com 3 cidadãos (E)',()=>cn('talk')>=3]],
 events:[
 EV(.1,'🚕 Um taxista sem carta de condução é parado.',[CH('Multar',{ord:4,conf:-3},'Cumpriste a lei.'),CH('Dar um aviso',{conf:5,ord:-1},'Ele agradeceu.'),CH('Aceitar gorjeta de 20.000 Kz',{'$':20000,i:-15,ord:-3},'Meteste no bolso.'),CH('Deixar passar',{ord:-4},'Ninguém pagou nada.')]),
 EV(.25,'🧺 Uma zungueira sem licença vende na estrada.',[CH('Apreender a mercadoria',{ord:3,conf:-9},'A rua ficou arrumada; a vizinhança, revoltada.'),CH('Orientar para o mercado',{conf:6,ord:1},'Mostraste o caminho.'),CH('Ignorar',{ord:-2},'Nada mudou.')]),
 EV(.4,'🍺 Briga num bar. Há feridos.',[CH('Intervir sozinho',{ord:7,res:-3,conf:2},'Separaste a briga.'),CH('Chamar reforços',{ord:4,res:-7},'Mais seguro, mais caro.'),CH('Fingir que não viste',{ord:-9,i:-5},'Alguém saiu magoado.')]),
 EV(.55,'⚠️ O teu superior manda prender um jovem que só estava a protestar.',[CH('Obedecer',{conf:-12,i:-15,ord:2},'Cumpriste a ordem… injusta.'),CH('Recusar a ordem',{conf:8,i:10,res:-2},'Pagaste com coragem.'),CH('Pedir a ordem por escrito',{conf:3,i:5},'Ganhaste tempo.')],0),
 EV(.7,'📱 Roubaram um telemóvel mesmo à tua frente.',[CH('Perseguir a pé',{ord:5,res:-2},'Apanhaste o ladrão.'),CH('Usar a viatura',{ord:6,res:-5},'Rápido, mas gastou combustível.'),CH('Só registar a queixa',{conf:3,ord:1},'Burocracia.'),CH('Não fazer nada',{conf:-5,ord:-4},'O ladrão fugiu.')]),
 EV(.85,'🚑 Acidente com feridos e trânsito parado.',[CH('Socorrer primeiro',{conf:9,ord:-3},'Salvaste vidas.'),CH('Controlar o trânsito',{ord:6,conf:-4},'A estrada abriu.'),CH('Esperar a ambulância',{conf:-6},'Demorou demais.')])]}],
'EMPRESÁRIO':[{title:'Abrir uma Loja',adj:21,time:480,brief:'Tens 250.000 Kz e uma ideia. Licenças, crédito, fornecedores, fiscais: cada atalho tem um preço escondido.',
 meters:{luc:['Lucro',55,'💵'],rep:['Reputação',45,'⭐'],leg:['Legalidade',50,'📄']},lose:{luc:15},drift:{luc:-1},rw:{A:[250000,100],B:[150000,70],C:[70000,40]},
 objs:[['Abrir a tua loja (🏗️ CONSTRUIR → Loja)',()=>cn('build:loja')>=1],['Reputação ≥ 50%',s=>s.rep>=50],['Lucro ≥ 40%',s=>s.luc>=40],['Legalidade ≥ 45%',s=>s.leg>=45],['Visitar 2 casas de clientes (E)',()=>cn('house')>=2]],
 events:[
 EV(.1,'📄 Para a licença, um funcionário "agiliza" por 30.000 Kz.',[CH('Pagar o "agilizador"',{'$':-30000,i:-18,luc:-2,leg:-6},'Saiu rápido… mas ilegal.'),CH('Seguir o processo legal',{leg:10,luc:-4,i:5},'Demorou, mas ficou certo.')],1),
 EV(.25,'🏦 O banco só dá crédito com juros altos.',[CH('Aceitar juros altos',{luc:12,leg:-2},'Dinheiro hoje, dívida amanhã.'),CH('Pedir a um amigo',{luc:6,rep:-2},'Ficaste a dever um favor.'),CH('Abrir uma loja mais pequena',{luc:-4,rep:3},'Mais devagar, mais seguro.')]),
 EV(.4,'🚚 O fornecedor atrasa a entrega da mercadoria.',[CH('Comprar mais caro noutro lado',{luc:-8,rep:4},'Clientes servidos.'),CH('Avisar os clientes com honestidade',{rep:3,luc:-3},'Entenderam.'),CH('Esperar',{rep:-6,luc:-2},'Prateleiras vazias.')]),
 EV(.55,'😠 Um cliente reclama de um produto estragado.',[CH('Reembolsar',{luc:-4,rep:8},'Cliente fiel.'),CH('Negar',{rep:-10,luc:1},'Falou mal da loja.')],1),
 EV(.7,'🕵️ O fiscal pede "uma ajuda" para não multar.',[CH('Dar 30.000 Kz',{'$':-30000,i:-20,leg:-8},'Pagaste o silêncio.'),CH('Mostrar os papéis em ordem',{leg:4,i:5},'Ele foi embora.'),CH('Recusar e aceitar a multa',{leg:6,luc:-6,i:8},'Multa paga, consciência limpa.')],2),
 EV(.85,'📉 Um concorrente baixa os preços para te tirar clientes.',[CH('Baixar também os preços',{luc:-7,rep:3},'Ninguém ganha muito.'),CH('Melhorar o serviço',{rep:8,luc:-3},'Clientes ficaram.'),CH('Não reagir',{luc:-5,rep:-3},'Perdeste clientes.')])]}],
'TRABALHADOR':[{title:'Contrato de Experiência (3 meses)',adj:16,time:480,brief:'Três meses para provar que mereces o contrato fixo. O chefe observa — e tu também decides quem queres ser no trabalho.',
 meters:{des:['Desempenho',50,'📈'],rel:['Chefe',50,'🤝'],sau:['Saúde',70,'❤️']},lose:{rel:20},drift:{des:-.5},rw:{A:[120000,100],B:[80000,70],C:[40000,40]},
 objs:[['Desempenho ≥ 62%',s=>s.des>=62],['Relação com o chefe ≥ 45%',s=>s.rel>=45],['Saúde ≥ 50%',s=>s.sau>=50],['Dormir ou comer em casa 1 vez',()=>cn('rest')>=1]],
 events:[
 EV(.1,'⏰ O chefe pede horas extra sem pagar.',[CH('Aceitar',{des:8,sau:-8,rel:6},'O chefe gostou.'),CH('Recusar com educação',{rel:-4,sau:2,i:6},'Defendeste o teu tempo.'),CH('Negociar o pagamento',{rel:2,des:2},'Chegaram a acordo.')],0),
 EV(.25,'🚌 Chegaste atrasado por causa do trânsito.',[CH('Pedir desculpa e compensar',{rel:3,des:2},'Foi compreendido.'),CH('Inventar uma desculpa',{rel:-5,i:-8},'Descobriram.'),CH('Ficar calado',{rel:-4},'Notaram.')]),
 EV(.4,'📝 Um colega pede-te que marques a presença dele.',[CH('Aceitar',{rel:-1,i:-15},'Cúmplice.'),CH('Recusar',{i:8},'Disseste que não.')],1),
 EV(.55,'🎓 A empresa oferece formação, fora do horário.',[CH('Fazer a formação',{des:10,sau:-5},'Aprendeste muito.'),CH('Recusar',{des:-3},'Perdeste a oportunidade.')],1),
 EV(.7,'⚙️ Máquina sem proteção — um colega quase se magoa.',[CH('Parar e avisar o chefe',{rel:-2,i:10,sau:3,des:-4},'Segurança primeiro.'),CH('Ajudar o colega e ficar calado',{rel:2,sau:-2},'O problema continua.'),CH('Continuar a trabalhar',{des:4,sau:-8,i:-8},'Alguém pode ficar ferido.')]),
 EV(.85,'🌙 Propõem-te um biscate à noite, bem pago.',[CH('Aceitar',{'$':40000,sau:-12,des:-6},'Dinheiro extra, corpo cansado.'),CH('Recusar',{sau:5},'Descansaste.')],1)]}],
'CIDADÃO':[{title:'Sobreviver em Luanda',adj:20,th:[78,70,66],time:480,brief:'Sem cargo, sem salário garantido. Casa, comida, contas e vizinhos: o que farias se fosses tu?',
 meters:{bem:['Bem-estar',58,'😊'],fin:['Finanças',50,'💰'],com:['Comunidade',45,'🏘️']},lose:{bem:15,fin:5},drift:{fin:-1,bem:-.5},rw:{A:[100000,100],B:[60000,70],C:[30000,40]},
 objs:[['Bem-estar ≥ 50%',s=>s.bem>=50],['Finanças ≥ 40%',s=>s.fin>=40],['Ter casa ou emprego',()=>!!player.house||!!player.job]],
 events:[
 EV(.1,'🏠 A renda da casa subiu 20%.',[CH('Pagar e cortar despesas',{fin:-6,bem:-4},'Apertaste o cinto.'),CH('Mudar para um bairro mais barato',{fin:5,bem:-6,com:-4},'Longe de tudo.'),CH('Pedir ajuda à família',{fin:2,com:4},'A família ajudou.')],0),
 EV(.25,'🤒 Adoeces com febre (paludismo).',[CH('Ir ao hospital',{fin:-8,bem:10},'Ficaste tratado.'),CH('Pedir medicamento ao vizinho',{bem:4,com:3,fin:-2},'Ajudou um pouco.'),CH('Tomar chá e esperar',{bem:-8},'Piorou.')]),
 EV(.4,'🔨 Um vizinho pede ajuda para consertar o telhado.',[CH('Ajudar',{com:10,bem:-2},'Ganhaste um amigo.'),CH('Dizer que não podes',{com:-6},'Ficou chateado.')],1),
 EV(.55,'💼 Oferecem-te trabalho informal ao dia.',[CH('Aceitar',{'$':20000,fin:8,bem:-4},'Dia puxado, bolso melhor.'),CH('Recusar',{fin:-3},'Ficaste em casa.')],1),
 EV(.7,'🚓 Um polícia pede gorjeta numa blitz.',[CH('Dar 5.000 Kz',{'$':-5000,i:-10,fin:-3},'Pagaste para seguir.'),CH('Recusar educadamente',{i:8,bem:-2},'Demorou, mas seguiste.')],1),
 EV(.85,'🧹 A comunidade organiza limpeza do bairro.',[CH('Participar',{com:10,bem:3},'Bairro mais limpo.'),CH('Ficar em casa',{com:-5},'Ficaste de fora.')],1)]}]
};
// ---------- motor ----------
const MS={def:null,t:0,ev:0,cnt:{},v:{},i:50,paused:true,open:false,dl:0,cur:null,hudT:0,done:false};
MS.hook=(k,a)=>{const d=MS.def;if(!d||MS.paused)return;MS.cnt[k]=cn(k)+1;if(a)MS.cnt[k+':'+a]=cn(k+':'+a)+1;if(k==='build'&&d.buildCost&&d.buildCost[a])MS.fx({orc:-d.buildCost[a],pub:d.buildPub||3})};
MS.canBuild=t=>{const d=MS.def;if(!d||MS.paused||!d.buildCost||!d.buildCost[t])return true;if(MS.v.orc<d.buildCost[t]){toast(`Orçamento insuficiente (${d.buildCost[t]}% necessário)`);return false}return true};
MS.fx=o=>{for(const k in o){if(k==='$')player.money+=o[k];else if(k==='i')MS.i=clamp(MS.i+o[k],0,100);else if(k in MS.v)MS.v[k]=clamp(MS.v[k]+o[k],0,100)}updateLifeUI()};
MS.modal=h=>{const e=$('evt');e.innerHTML=h;e.style.display='block';if(document.exitPointerLock)document.exitPointerLock()};
MS.hide=()=>{$('evt').style.display='none'};
MS.start=(role,lvl)=>{const d=(MISSIONS[role]||[])[lvl-1];player.level=lvl;if(!d){MS.def=null;$('mission').style.display='none';MS.modal(`<h3>🚧 ${role} — Nível ${lvl}</h3><p style="font-size:13px">Este nível ainda está em construção. Continua a explorar Angola!</p><button class="btn gold" onclick="MS.hide()">Continuar</button>`);return}
 MS.def=d;MS.role=role;MS.lvl=lvl;MS.t=0;MS.ev=0;MS.cnt={};MS.i=50;MS.v={};for(const k in d.meters)MS.v[k]=d.meters[k][1];MS.paused=true;MS.open=false;MS.done=false;MS.palp=2;MS.hint=false;
 MS.modal(`<h3>📜 Contrato — ${role} · Nível ${lvl}</h3><b>${d.title}</b><p style="font-size:13px;color:#cbd5e1">${d.brief}</p><div style="font-size:12px"><b>Objetivos</b><br>${d.objs.map(o=>'• '+o[0]).join('<br>')}</div><p style="font-size:11px;color:#94a3b8">Duração: ${Math.round(d.time*MISSION_TIME_SCALE/60*10)/10} min${d.years?' ('+d.years+' anos)':''}. Vais enfrentar ${d.events.length} dilemas; cada um tem ${DEC_TIMEOUT}s — não decidir também é decidir.</p><button class="btn gold" style="width:100%;padding:11px" onclick="MS.go()">ACEITAR E COMEÇAR</button>`)};
MS.go=()=>{MS.hide();MS.paused=false;$('mission').style.display='block';toast('⏱️ Contrato iniciado!')};
MS.openEv=e=>{MS.open=true;MS.cur=e;MS.dl=DEC_TIMEOUT;MS.hint=false;MS.renderEv()};
MS.renderEv=()=>{const e=MS.cur,d=MS.def,w=Object.keys(MS.v).sort((a,b)=>MS.v[a]-MS.v[b])[0];
 const hn=c=>MS.hint?'<br><small style="opacity:.9">'+Object.keys(c.fx).filter(k=>k!=='i').map(k=>k==='$'?(c.fx[k]>0?'💰⬆️':'💰⬇️'):(d.meters[k]?d.meters[k][2]+(c.fx[k]>0?'⬆️':'⬇️'):'')).join(' ')+'</small>':'';
 MS.modal(`<h3>${e.txt}</h3><div class="bar"><i id="evBar"></i></div><div style="font-size:11px;color:#fbbf24;margin:6px 0">⚠️ Mais frágil: ${d.meters[w][2]} ${d.meters[w][0]} ${Math.round(MS.v[w])}%</div><div id="evBtns">${e.ch.map((c,i)=>`<button class="btn" style="width:100%;margin:5px 0;padding:10px;text-align:left" onclick="MS.pick(${i})">${c.label}${hn(c)}</button>`).join('')}</div><button class="btn gold" style="width:100%" onclick="MS.palpite()">💡 Palpite (${MS.palp} restantes)</button>`)};
MS.palpite=()=>{if(MS.hint)return;if(MS.palp<=0){toast('Sem palpites restantes');return}MS.palp--;MS.hint=true;MS.renderEv()};
MS.pick=i=>{const e=MS.cur;if(!e)return;const c=e.ch[i];MS.fx(c.fx);logLife(c.note||'Decidiste.');MS.cur=null;MS.open=false;MS.ev++;MS.hide();MS.lose()};
MS.lose=()=>{const d=MS.def;if(!d||MS.done)return;for(const k in d.lose)if(MS.v[k]<d.lose[k]){MS.finish(`Perdeste o cargo: ${d.meters[k][0]} caiu demasiado.`)}};
MS.update=dt=>{const d=MS.def;if(!d||MS.done)return;
 if(MS.open){MS.dl-=dt;const b=$('evBar');if(b)b.style.width=Math.max(0,MS.dl/DEC_TIMEOUT*100)+'%';if(MS.dl<=0)MS.pick(MS.cur.def);return}
 if(MS.paused)return;MS.t+=dt;const dur=d.time*MISSION_TIME_SCALE;
 for(const k in d.drift)MS.v[k]=clamp(MS.v[k]+d.drift[k]*dt/MISSION_TIME_SCALE/60,0,100);
 const e=d.events[MS.ev];if(e&&MS.t/dur>=e.at){MS.openEv(e);return}
 MS.lose();if(!MS.done&&MS.t>=dur&&!e)MS.finish()};
MS.finish=why=>{const d=MS.def;if(MS.done)return;MS.done=true;MS.paused=true;MS.open=false;MS.hide();
 const ks=Object.keys(MS.v),avg=ks.reduce((a,k)=>a+MS.v[k],0)/ks.length,res=d.objs.map(o=>o[1](MS.v)),fail=res.filter(x=>!x).length;
 let sc=avg-6*fail+(d.adj||0),extra='';if(MS.i<40){sc-=15;const fine=Math.min(100000,Math.round(player.money*.1));player.money-=fine;extra=`<p style="color:#fca5a5">🔎 Investigação: a tua integridade era baixa (${Math.round(MS.i)}%). Multa de ${kz(fine)}.</p>`}else if(MS.i>=70){sc+=5;extra=`<p style="color:#86efac">✅ Integridade alta (${Math.round(MS.i)}%): bónus de reputação.</p>`}else extra=`<p style="color:#cbd5e1">Integridade: ${Math.round(MS.i)}%.</p>`;
 const th=d.th||[78,68,58];let g=sc>=th[0]?'A':sc>=th[1]?'B':sc>=th[2]?'C':'D';if(why)g='D';MS.score=sc;MS.grade=g;MS.objFail=fail;const pass=g!=='D',rw=d.rw[g];
 if(pass){player.money+=rw[0];player.xp=(player.xp||0)+rw[1]}
 const next=MISSIONS[MS.role][MS.lvl];$('mission').style.display='none';updateLifeUI();
 MS.modal(`<h3>${why?'❌ '+why:'🏁 Fim do contrato'}</h3><div style="font-size:46px;font-weight:900;color:${pass?'#c49a30':'#ef4444'};text-align:center">${g}</div><div style="font-size:12px">${ks.map(k=>`${d.meters[k][2]} ${d.meters[k][0]}: <b>${Math.round(MS.v[k])}%</b>`).join(' · ')}</div><div style="font-size:12px;margin-top:6px">${d.objs.map((o,i)=>(res[i]?'✅ ':'❌ ')+o[0]).join('<br>')}</div>${extra}<p style="font-size:13px">${pass?`Recompensa: <b>${kz(rw[0])}</b> + <b>${rw[1]} XP</b>`:'Não passaste. Tenta outra vez com outras escolhas.'}</p>`+
 (pass?`<button class="btn gold" style="width:100%;padding:11px" onclick="MS.start('${MS.role}',${MS.lvl+1})">${next?'PRÓXIMO NÍVEL ▶':'Nível '+(MS.lvl+1)+' (em breve)'}</button>`:`<button class="btn green" style="width:100%;padding:11px" onclick="MS.start('${MS.role}',${MS.lvl})">🔁 REPETIR NÍVEL</button>`))};
MS.hud=()=>{const d=MS.def,n=Date.now();if(!d||MS.done||n-MS.hudT<400)return;MS.hudT=n;const dur=d.time*MISSION_TIME_SCALE,left=Math.max(0,dur-MS.t),m=Math.floor(left/60),s=Math.floor(left%60),pr=MS.t/dur;
 const yr=d.years?` · Ano ${Math.min(d.years,Math.floor(pr*d.years)+1)}/${d.years}`:'';
 $('mission').innerHTML=`<b>${MS.role} · Nv${MS.lvl}</b> — ${d.title}<div class="clock">⏱️ ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}${yr}</div>`+Object.keys(d.meters).map(k=>{const v=MS.v[k];return`<div class="mt"><span>${d.meters[k][2]} ${d.meters[k][0]}</span><div class="bar"><i style="width:${v}%;background:${v<30?'#ef4444':v<50?'#f59e0b':'#22c55e'}"></i></div></div>`}).join('')+`<div class="ob">${d.objs.map(o=>(o[1](MS.v)?'✅ ':'⬜ ')+o[0]).join('<br>')}</div>`};
