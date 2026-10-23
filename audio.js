// audio.js — sons gerados no telemóvel (sem ficheiros), música à escolha do jogador e DJ com pads e batida
const AU={ctx:null,out:null,djBus:null,musBus:null,vol:.8,src:null,dj:{on:false,bpm:124,step:0,next:0,pat:'house',timer:0},buf:null,nb:null};
function au(){if(!AU.ctx){try{const C=window.AudioContext||window.webkitAudioContext;AU.ctx=new C();AU.out=AU.ctx.createGain();AU.out.gain.value=AU.vol;AU.out.connect(AU.ctx.destination);AU.djBus=AU.ctx.createGain();AU.djBus.connect(AU.out);AU.musBus=AU.ctx.createGain();AU.musBus.gain.value=.6;AU.musBus.connect(AU.out)}catch(e){}}if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume();return AU.ctx}
function tone(f,d,type,v,f2,when,bus){const c=au();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(when||0);o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v||.2,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(bus||AU.out);o.start(t);o.stop(t+d+.03)}
function noise(d,v,fc,when,type,bus){const c=au();if(!c)return;if(!AU.nb){AU.nb=c.createBuffer(1,c.sampleRate,c.sampleRate);const a=AU.nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
 const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+(when||0);s.buffer=AU.nb;f.type=type||'lowpass';f.frequency.value=fc||2000;g.gain.setValueAtTime(v||.3,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(bus||AU.out);s.start(t);s.stop(t+d+.03)}
function sfx(k,w){if(!AU.ctx&&k!=='chime')au();if(!AU.ctx)return;
 if(k==='shot'){const big=w&&(w.dmg>=100);noise(big?.35:.16,big?.7:.45,big?1500:2800);tone(big?70:120,.14,'square',.3,40)}
 else if(k==='punch'){noise(.08,.4,900);tone(110,.08,'sine',.3,60)}
 else if(k==='hurt'){tone(220,.2,'sawtooth',.25,90)}
 else if(k==='roar'){tone(95,.7,'sawtooth',.3,55);noise(.6,.25,500)}
 else if(k==='chime'){tone(660,.18,'triangle',.25);tone(880,.22,'triangle',.25,null,.1);tone(1320,.3,'triangle',.22,null,.2)}
 else if(k==='click'){tone(500,.04,'square',.1)}
 else if(k==='buy'){tone(520,.08,'square',.15);tone(780,.12,'square',.15,null,.07)}}
// ---- DJ ----
const PAT={house:{bpm:124,k:'x...x...x...x...',s:'....x.......x...',h:'..x...x...x...x.',c:'................',b:'x..x..x...x..x..',n:[55,55,65,55,73]},
 kuduro:{bpm:136,k:'x..xx..xx..xx..x',s:'....x..x....x.x.',h:'x.x.x.x.x.x.x.x.',c:'....x.......x...',b:'x.x.x..xx.x.x..x',n:[49,49,55,62,49]},
 semba:{bpm:98,k:'x.....x.x.....x.',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',c:'................',b:'x...x.x.x...x.x.',n:[65,73,82,73,65]}};
function djHit(k,when,bus){bus=bus||AU.djBus;if(k==='kick'){tone(160,.22,'sine',.9,40,when,bus)}else if(k==='snare'){noise(.16,.5,1800,when,'highpass',bus);tone(190,.1,'triangle',.3,120,when,bus)}else if(k==='hat'){noise(.05,.25,7000,when,'highpass',bus)}else if(k==='clap'){noise(.07,.5,1500,when,'bandpass',bus);noise(.1,.4,1500,when+.02,'bandpass',bus)}else if(k==='bass'){tone(55,.3,'sawtooth',.45,null,when,bus)}else if(k==='lead'){tone(660,.2,'square',.2,null,when,bus);tone(880,.2,'square',.18,null,when+.1,bus)}}
function djStep(i,t){const p=PAT[AU.dj.pat],w=t-AU.ctx.currentTime;if(p.k[i]==='x')djHit('kick',w);if(p.s[i]==='x')djHit('snare',w);if(p.h[i]==='x')djHit('hat',w);if(p.c[i]==='x')djHit('clap',w);if(p.b[i]==='x'){tone(p.n[(i>>2)%p.n.length]*(i%8===6?2:1),.22,'sawtooth',.4,null,w,AU.djBus)}}
function djToggle(){au();const d=AU.dj;d.on=!d.on;if(d.on){d.step=0;d.next=AU.ctx.currentTime+.05;clearInterval(d.timer);d.timer=setInterval(()=>{while(d.next<AU.ctx.currentTime+.15){djStep(d.step%16,d.next);d.next+=60/PAT[d.pat].bpm/4;d.step++}},30)}else clearInterval(d.timer);return d.on}
function djPattern(p){AU.dj.pat=p}
function musicLoad(file,bus){au();const fr=new FileReader();fr.onload=()=>AU.ctx.decodeAudioData(fr.result,b=>{musicStop();const s=AU.ctx.createBufferSource();s.buffer=b;s.loop=true;s.connect(bus==='dj'?AU.djBus:AU.musBus);s.start();AU.src=s;toast('🎵 A tocar: '+file.name)},()=>toast('Não consegui abrir esse ficheiro de áudio'));fr.readAsArrayBuffer(file)}
function musicStop(){if(AU.src){try{AU.src.stop()}catch(e){}AU.src=null}}
function audioUpdate(){if(!AU.ctx||!AU.djBus)return;let g=0;if(typeof BUILD!=='undefined'&&player){const d=BUILD.nearestDJ();g=d<0?0:clamp(1-(d-6)/70,0,1)}AU.djBus.gain.value=(AU.dj.on||AU.src)?g:0;
 if(typeof pCar!=='undefined'&&pCar&&AU.ctx&&!audioUpdate.eng&&0){}}
function openDJ(){const d=AU.dj;openPn(`<h3>🎧 DJ Kit</h3><div class="r"><span>Batida</span><span><button class="btn gold keep" onclick="const on=djToggle();this.textContent=on?'⏹ Parar':'▶ Tocar'">${d.on?'⏹ Parar':'▶ Tocar'}</button></span></div>
 <div class="r"><span>Estilo</span><span><button class="btn keep" onclick="djPattern('house')">House</button> <button class="btn keep" onclick="djPattern('kuduro')">Kuduro</button> <button class="btn keep" onclick="djPattern('semba')">Semba</button></span></div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0">${['kick','snare','hat','clap','bass','lead'].map(k=>`<button class="btn keep" style="padding:14px 4px" onclick="djHit('${k}',0)">${k.toUpperCase()}</button>`).join('')}</div>
 <div class="r"><span>🎵 A minha música</span><span><input type="file" accept="audio/*" onchange="musicLoad(this.files[0],'dj')" style="max-width:150px;font-size:10px"></span></div>
 <div class="r"><span>Parar música</span><button class="btn red keep" onclick="musicStop()">⏹</button></div><p style="font-size:11px;color:#94a3b8">O som ouve-se mais alto perto do DJ Kit.</p>`)}
function openMusic(){openPn(`<h3>🎵 Música e som</h3><div class="r"><span>Escolher música</span><span><input type="file" accept="audio/*" onchange="musicLoad(this.files[0],'mus')" style="max-width:150px;font-size:10px"></span></div>
 <div class="r"><span>Volume música</span><input type="range" min="0" max="100" value="${(AU.musBus?AU.musBus.gain.value*100:60)|0}" oninput="au();AU.musBus.gain.value=this.value/100"></div>
 <div class="r"><span>Volume geral</span><input type="range" min="0" max="100" value="${AU.vol*100|0}" oninput="au();AU.vol=this.value/100;AU.out.gain.value=AU.vol"></div>
 <div class="r"><span>Parar</span><button class="btn red keep" onclick="musicStop()">⏹</button></div><p style="font-size:11px;color:#94a3b8">Escolhe um ficheiro do teu telemóvel/PC (mp3, wav, m4a). Toca em ciclo.</p>`)}
