const games = [
  {id:'los-santos',name:'Los Santos Legends',tag:'WAYS',type:'hot',rtp:95.2,layout:'5x3',mechanic:'ways',lines:'20 LINES',betMin:10,betMax:5000,theme:'neon',image:'los-santos.svg',symbols:['cherry','lemon','plum','orange','bell','bar','seven','wild']},
  {id:'vinewood',name:'Vinewood Nights',tag:'BONUS',type:'new',rtp:96.1,layout:'5x3',mechanic:'freespins',lines:'20 LINES',betMin:10,betMax:4000,theme:'hollywood',image:'vinewood.svg',symbols:['star','clapper','rose','crown','gem','bar','wild','scatter']},
  {id:'cash-cartel',name:'Cash Cartel',tag:'HOLD & WIN',type:'vip',rtp:95.0,layout:'5x3',mechanic:'hold',lines:'25 LINES',betMin:25,betMax:7500,theme:'gold',image:'cash-cartel.svg',symbols:['coin','money','diamond','mask','crown','bar','wild','bonus']},
  {id:'diamond',name:'Diamond Rush',tag:'TUMBLE',type:'vip',rtp:96.0,layout:'6x5',mechanic:'tumble',lines:'PAY ANYWHERE',betMin:25,betMax:10000,theme:'ice',image:'diamond-rush.svg',symbols:['ruby','sapphire','emerald','diamond','crown','gold','wild','multiplier']},
  {id:'lucky',name:'Lucky Sevens',tag:'CLASSIC',type:'hot',rtp:94.8,layout:'4x3',mechanic:'classic',lines:'27 WAYS',betMin:5,betMax:5000,theme:'retro',image:'lucky-sevens.svg',symbols:['cherry','lemon','plum','orange','melon','bell','bar','seven','wild']},
  {id:'street',name:'Street Racers',tag:'RESPIN',type:'new',rtp:95.5,layout:'5x3',mechanic:'respin',lines:'30 LINES',betMin:10,betMax:4000,theme:'racing',image:'street-racers.svg',symbols:['helmet','turbo','flame','tire','flag','car','seven','wild']},
  {id:'high-roller',name:'High Roller',tag:'MULTIPLIER',type:'vip',rtp:95.7,layout:'5x3',mechanic:'multiplier',lines:'25 LINES',betMin:100,betMax:20000,theme:'luxury',image:'high-roller.svg',symbols:['club','spade','heart','diamond','crown','chip','bar','wild','multiplier']},
  {id:'fruits',name:'Blazing Fruits',tag:'TUMBLE',type:'hot',rtp:96.0,layout:'6x4',mechanic:'fruitTumble',lines:'WAYS',betMin:5,betMax:2500,theme:'fruit',image:'blazing-fruits.svg',symbols:['cherry','lemon','orange','grape','melon','bell','seven','wild','fire']},
  {id:'mafia',name:'Mafia Fortune',tag:'MYSTERY',type:'vip',rtp:94.9,layout:'5x3',mechanic:'mystery',lines:'20 LINES',betMin:50,betMax:15000,theme:'mafia',image:'mafia-fortune.svg',symbols:['rose','ring','money','cigar','car','crown','bar','seven','mystery']},
  {id:'ocean',name:'Ocean Drive',tag:'MEGAWAYS',type:'new',rtp:96.2,layout:'6x4',mechanic:'megaways',lines:'MEGAWAYS',betMin:10,betMax:5000,theme:'ocean',image:'ocean-drive.svg',symbols:['shell','pearl','anchor','wave','sun','palm','gem','wild','scatter']}
];

const SYMBOLS = {
 cherry:['🍒','CHERRY'], lemon:['🍋','LEMON'], plum:['●','PLUM'], orange:['🍊','ORANGE'], melon:['🍉','MELON'], grape:['🍇','GRAPE'], bell:['🔔','BELL'], bar:['BAR','BAR'], seven:['7','SEVEN'],
 star:['★','STAR'], clapper:['▣','CLAPPER'], rose:['✿','ROSE'], crown:['♛','CROWN'], gem:['◆','GEM'], scatter:['S','SCATTER'], coin:['◉','COIN'], money:['$','MONEY'], diamond:['◆','DIAMOND'], mask:['◈','MASK'], bonus:['BONUS','BONUS'],
 ruby:['◆','RUBY'], sapphire:['◆','SAPPHIRE'], emerald:['◆','EMERALD'], gold:['●','GOLD'], multiplier:['×','MULTIPLIER'], helmet:['⌂','HELMET'], turbo:['T','TURBO'], flame:['♨','FLAME'], tire:['◎','TIRE'], flag:['⚑','FLAG'], car:['▰','CAR'], club:['♣','CLUB'], spade:['♠','SPADE'], heart:['♥','HEART'], chip:['●','CHIP'], fire:['♨','FIRE'], cigar:['▬','CIGAR'], ring:['○','RING'], mystery:['?','MYSTERY'], shell:['◒','SHELL'], pearl:['●','PEARL'], anchor:['⚓','ANCHOR'], wave:['≈','WAVE'], sun:['☀','SUN'], palm:['♨','PALM'], wild:['W','WILD']
};

let balance=10000,current=null,bet=100,spinning=false,sound=true,history=[],dailyClaimed=false,freeSpins=0,respins=0,sticky=[],audioCtx=null;
const $=id=>document.getElementById(id); const fmt=n=>Math.max(0,Math.round(Number(n)||0)).toLocaleString('cs-CZ');

function renderGames(filter='all'){
  $('gameGrid').innerHTML=games.filter(g=>filter==='all'||g.type===filter).map(g=>`<button class="game-card theme-${g.theme}" onclick="openGame('${g.id}')"><div class="card-art"><img src="assets/games/${g.image}" alt="${g.name}"><div class="card-shade"></div><div class="layout-badge">${g.layout} • ${g.lines}</div><div class="badge badge-${g.type}">${g.tag}</div></div><div class="card-info"><div><b>${g.name}</b><small>${g.rtp}% RTP • ${g.mechanic.toUpperCase()}</small></div><span class="play-arrow">→</span></div></button>`).join('');
}

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderGames(btn.dataset.filter)}));
function showLobby(){closeGame();closePanel();window.scrollTo({top:0,behavior:'smooth'})}
function scrollToGames(){$('gamesSection').scrollIntoView({behavior:'smooth'})}
function addTokens(){balance+=10000;updateBalances();toast('＋10 000 TOKENŮ PŘIDÁNO');soundFx('coin')}
function openGame(id){
  current=games.find(g=>g.id===id); bet=Math.max(current.betMin,Math.min(current.betMax,bet)); freeSpins=0;respins=0;sticky=[];
  $('gameTitle').textContent=current.name.toUpperCase(); $('gameTag').textContent=`${current.tag} • ${current.layout} • ${current.lines}`; $('gameRtp').textContent=`RTP ${current.rtp}%`;
  $('neonSign').innerHTML=current.name.split(' ').slice(0,-1).join(' ')+'<br><span>'+current.name.split(' ').at(-1).toUpperCase()+'</span>';
  $('machine').className=`machine machine-${current.theme}`; $('machineScene').className=`machine-scene scene-${current.theme}`;
  buildReels(); setReels(randomBoard()); updateBetUI(); $('machineResult').textContent='READY TO SPIN'; $('featureText').textContent=featureLabel(); $('gameOverlay').classList.remove('hidden');
}
function closeGame(){if(!spinning)$('gameOverlay').classList.add('hidden')}
function parseLayout(){const m=current.layout.match(/(\d+)x(\d+)/);return {cols:+m[1],rows:+m[2]}}
function buildReels(){const {cols,rows}=parseLayout();const frame=$('reelFrame');frame.innerHTML='';frame.style.setProperty('--cols',cols);frame.style.setProperty('--rows',rows);for(let i=0;i<cols*rows;i++){const el=document.createElement('div');el.className='reel';el.dataset.index=i;frame.appendChild(el)}}
function symbolMarkup(s,extra=''){const [glyph,label]=SYMBOLS[s]||['?','?'];return `<div class="symbol-art symbol-${s} ${extra}"><span class="symbol-glyph">${glyph}</span><span class="symbol-label">${label}</span></div>`}
function randomSymbol(){return current.symbols[Math.floor(Math.random()*current.symbols.length)]}
function randomBoard(){const {cols,rows}=parseLayout();return Array.from({length:cols*rows},()=>randomSymbol())}
function setReels(values){document.querySelectorAll('.reel').forEach((el,i)=>{el.innerHTML=symbolMarkup(values[i%values.length]);el.classList.remove('reel-win','reel-special','tumble-pop','mystery-open')})}
function updateBalances(){$('balance').textContent=fmt(balance);$('gameBalance').textContent=fmt(balance)}
function setBet(v){if(v==='half')bet=Math.max(current.betMin,Math.floor(bet/2));else if(v==='min')bet=current.betMin;else if(v==='max')bet=current.betMax;else bet=Math.min(current.betMax,Math.max(current.betMin,Math.round(bet*v)));updateBetUI()}
function adjustBet(dir){const step=Math.max(current.betMin,Math.round(bet*.25));bet=Math.max(current.betMin,Math.min(current.betMax,bet+dir*step));updateBetUI()}
function updateBetUI(){$('betValue').textContent=fmt(bet);$('machineBetLabel').textContent=fmt(bet);$('maxWin').textContent=fmt(bet*1000);$('featureText').textContent=featureLabel()}
function featureLabel(){const f={ways:'Multi-Wild ×2/×4/×8',freespins:'Scatter → Free Spins + Wilds',hold:'Hold & Win / Respins',tumble:'Tumble + Multipliers',classic:'Classic 27-Way Fruit',respin:'Sticky Respin Bonus',multiplier:'Random Multipliers',fruitTumble:'Fire Tumble',mystery:'Mystery Reveal',megaways:'Megaways + Scatter'};return f[current?.mechanic]||'REALISTIC SLOT MECHANIC'}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2500)}

function ensureAudio(){if(!sound)return; if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended')audioCtx.resume()}
function tone(freq,dur=.08,type='sine',gain=.04,when=0){if(!sound)return;ensureAudio();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,audioCtx.currentTime+when);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+when+dur);o.connect(g).connect(audioCtx.destination);o.start(audioCtx.currentTime+when);o.stop(audioCtx.currentTime+when+dur)}
function soundFx(kind){if(!sound)return; if(kind==='spin'){[180,220,260].forEach((f,i)=>tone(f,.06,'square',.025,i*.05))} if(kind==='stop')tone(90,.12,'triangle',.05);if(kind==='coin')[660,880,1040].forEach((f,i)=>tone(f,.09,'sine',.045,i*.08));if(kind==='win')[523,659,784,1046].forEach((f,i)=>tone(f,.16,'sine',.045,i*.11));if(kind==='big')[523,659,784,1046,1318,1568].forEach((f,i)=>tone(f,.22,'sawtooth',.04,i*.12));if(kind==='bonus')[392,494,659,988].forEach((f,i)=>tone(f,.18,'triangle',.05,i*.1))}
function toggleSound(){sound=!sound;$('soundBtn').textContent=sound?'♫':'🔇';if(sound){ensureAudio();soundFx('coin')}toast(sound?'SOUND ON':'SOUND OFF')}
function toggleFullscreen(){if(!document.fullscreenElement)$('gameOverlay').requestFullscreen?.();else document.exitFullscreen?.()}

function evaluateClassic(board){const {cols,rows}=parseLayout();let wins=[];for(let r=0;r<rows;r++){let line=[];for(let c=0;c<cols;c++)line.push(board[r*cols+c]);let base=line[0],count=1;for(let c=1;c<cols;c++){if(line[c]===base||line[c]==='wild')count++;else break}if(count>=3 && base!=='wild')wins.push({symbol:base,count,mult:count===3?2:count===4?8:20,cells:Array.from({length:count},(_,c)=>r*cols+c)})}return wins}
function evaluateWays(board){const {cols,rows}=parseLayout();let wins=[];for(const sym of current.symbols.filter(s=>!['wild','scatter','multiplier','bonus','mystery'].includes(s))){let ways=1,used=[];for(let c=0;c<cols;c++){let rowsHit=[];for(let r=0;r<rows;r++){const s=board[r*cols+c];if(s===sym||s==='wild')rowsHit.push(r)}if(!rowsHit.length)break;ways*=rowsHit.length;rowsHit.forEach(r=>used.push(r*cols+c));if(c===cols-1||rowsHit.length){} }
  if(ways>1){const len=Math.max(...used.map(i=>Math.floor(i/rows)),0)+1; if(len>=3)wins.push({symbol:sym,count:len,mult:ways,cells:used})}
 }return wins}
function evaluateBoard(board){if(current.mechanic==='ways'||current.mechanic==='classic'||current.mechanic==='megaways')return evaluateClassic(board);return evaluateClassic(board)}
function winAmount(wins){let total=0;for(const w of wins){let base=bet*(w.mult||1);if(current.mechanic==='ways')base*=w.count>=4?1.8:1;if(current.mechanic==='megaways')base*=1.25;if(current.mechanic==='classic')base*=.75;total+=Math.round(base)}return total}

async function spin(){
 if(spinning)return;if(balance<bet && freeSpins<=0){toast('NEMÁŠ DOSTATEK TOKENŮ');return}
 spinning=true;$('spinBtn').disabled=true;ensureAudio();soundFx('spin');
 const paid=freeSpins>0?0:bet;if(paid){balance-=bet;updateBalances()} if(freeSpins>0){freeSpins--;toast(`FREE SPIN • ${freeSpins} ZBÝVÁ`)}
 const reels=[...document.querySelectorAll('.reel')];reels.forEach(r=>r.classList.remove('reel-win','reel-special'));
 const {cols}=parseLayout();
 for(let i=0;i<reels.length;i++){reels[i].classList.add('reel-spin');if(i%cols===cols-1)soundFx('stop');await wait(90)}
 const board=randomBoard(); setReels(board);reels.forEach(r=>r.classList.remove('reel-spin'));soundFx('stop');
 let wins=evaluateBoard(board);let win=winAmount(wins);
 const specials=handleSpecials(board,wins);
 win+=specials.win;
 if(win>0){balance+=win;updateBalances();highlightWins(wins,specials.cells);$('lastWin').textContent=fmt(win);$('machineResult').textContent=`WIN +${fmt(win)} TOKENS`;soundFx(win>=bet*20?'big':'win');celebrate(win>=bet*20)}else{$('lastWin').textContent='0';$('machineResult').textContent='NO WIN';}
 history.unshift({game:current.name,bet,win,time:new Date().toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'})});history=history.slice(0,40);
 updateBalances();updateBetUI();spinning=false;$('spinBtn').disabled=false;
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function handleSpecials(board,wins){let win=0,cells=[];
 if(current.mechanic==='ways'){const wilds=board.reduce((a,s,i)=>s==='wild'?(a.push(i),a):a,[]);if(wilds.length&&wins.length){const mult=wilds.length>=3?8:wilds.length===2?4:2;win+=Math.round(bet*(mult-1));cells.push(...wilds);toast(`MULTI WILD ×${mult}`);soundFx('bonus')}}
 if(current.mechanic==='freespins'){const sc=board.filter(s=>s==='scatter').length;if(sc>=3){freeSpins+=8;toast(`BONUS • +8 FREE SPINS`);soundFx('bonus');cells.push(...board.map((s,i)=>s==='scatter'?i:-1).filter(i=>i>=0))}}
 if(current.mechanic==='hold'){const coins=board.map((s,i)=>s==='coin'||s==='money'?i:-1).filter(i=>i>=0);if(coins.length>=3){const extra=coins.length*bet*2;win+=extra;cells.push(...coins);toast(`HOLD & WIN • +${fmt(extra)}`);soundFx('bonus')}}
 if(current.mechanic==='tumble'||current.mechanic==='fruitTumble'){if(wins.length){const mult=1+Math.min(5,wins.length);win+=Math.round(bet*(mult-1));cells.push(...wins.flatMap(w=>w.cells));toast(`TUMBLE ×${mult}`);soundFx('bonus');tumbleVisual(wins.flatMap(w=>w.cells))}}
 if(current.mechanic==='respin'){const locked=board.filter(s=>s==='wild'||s==='turbo'||s==='flame').length;if(locked>=2){const extra=bet*locked*3;win+=extra;cells.push(...board.map((s,i)=>(s==='wild'||s==='turbo'||s==='flame')?i:-1).filter(i=>i>=0));toast(`RESPIN • +${fmt(extra)}`);soundFx('bonus')}}
 if(current.mechanic==='multiplier'){const m=board.filter(s=>s==='multiplier').length;if(m){const mult=2+m;const extra=bet*(mult-1)*Math.max(1,wins.length);win+=extra;cells.push(...board.map((s,i)=>s==='multiplier'?i:-1).filter(i=>i>=0));toast(`RANDOM MULTIPLIER ×${mult}`);soundFx('bonus')}}
 if(current.mechanic==='mystery'){const m=board.map((s,i)=>s==='mystery'?i:-1).filter(i=>i>=0);if(m.length){const extra=bet*m.length*(Math.floor(Math.random()*8)+3);win+=extra;cells.push(...m);toast(`MYSTERY REVEAL • +${fmt(extra)}`);soundFx('bonus');m.forEach(i=>document.querySelector(`.reel[data-index="${i}"]`)?.classList.add('mystery-open'))}}
 if(current.mechanic==='megaways'){const sc=board.filter(s=>s==='scatter').length;if(sc>=3){freeSpins+=5;toast('MEGAWAYS BONUS • +5 FREE SPINS');soundFx('bonus')}}
 return {win,cells}
}
function highlightWins(wins,cells=[]){const set=new Set([...wins.flatMap(w=>w.cells),...cells]);set.forEach(i=>document.querySelector(`.reel[data-index="${i}"]`)?.classList.add('reel-win','reel-special'));}
function tumbleVisual(cells){cells.forEach(i=>document.querySelector(`.reel[data-index="${i}"]`)?.classList.add('tumble-pop'))}
function celebrate(big){const fx=document.createElement('div');fx.className=`celebration ${big?'big':''}`;fx.innerHTML='<i>✦</i><i>✦</i><i>✦</i><b>'+ (big?'MEGA WIN':'BIG WIN') +'</b>';document.querySelector('.machine-scene').appendChild(fx);setTimeout(()=>fx.remove(),1600)}

function openPaytable(){const g=current||games[0];$('paytableTitle').textContent=g.name.toUpperCase();const names=g.symbols.filter(s=>!['wild','scatter','multiplier','bonus','mystery'].includes(s));$('paytableContent').innerHTML=`<div class="pay-feature"><b>${featureLabel()}</b><span>${g.rtp}% theoretical RTP • Demo credits only</span></div>`+names.map((s,i)=>`<div class="pay-row"><span class="pay-symbol">${symbolMarkup(s)}</span><span>3+ × ${SYMBOLS[s]?.[1]||s}</span><b>x${[2,4,6,10,18,30][Math.min(i,5)]}</b></div>`).join('')+`<div class="pay-note">Mechanika je inspirovaná běžnými video-sloty, ale symboly, názvy a matematika jsou originální pro FastCash demo. ${g.lines}. RTP se v tomto demo zobrazuje jako teoretický parametr a nemusí přesně odpovídat krátkodobému výsledku.</div>`;$('paytableOverlay').classList.remove('hidden')}
function closePaytable(){$('paytableOverlay').classList.add('hidden')}
function openRewards(){$('panelContent').innerHTML=`<div class="eyebrow gold">REWARDS</div><h2>FASTCASH <em>VIP</em></h2><div class="reward-level"><b>BRONZE</b><span>0 / 10,000 XP</span></div><div class="progress"><i style="width:18%"></i></div><div class="reward-grid"><div>♛<b>VIP TABLES</b><small>Coming soon</small></div><div>★<b>DAILY BONUS</b><small>250 tokens</small></div><div>◆<b>EXCLUSIVE SLOTS</b><small>Unlock at VIP</small></div></div>`;$('panelOverlay').classList.remove('hidden')}
function openStats(){const spins=history.length,wins=history.reduce((a,x)=>a+x.win,0),bets=history.reduce((a,x)=>a+x.bet,0);$('panelContent').innerHTML=`<div class="eyebrow gold">PLAYER STATS</div><h2>YOUR <em>SESSION</em></h2><div class="stats-big"><div><b>${spins}</b><small>SPINS</small></div><div><b>${fmt(bets)}</b><small>WAGERED</small></div><div><b>${fmt(wins)}</b><small>WON</small></div></div><h3>RECENT SPINS</h3><div class="history">${history.length?history.map(x=>`<div><span>${x.game}</span><small>${x.time}</small><b class="${x.win?'win':''}">${x.win?'+':''}${fmt(x.win-x.bet)}</b></div>`).join(''):'No spins yet.'}</div>`;$('panelOverlay').classList.remove('hidden')}
function openHelp(){$('panelContent').innerHTML=`<div class="eyebrow gold">HELP</div><h2>HOW TO <em>PLAY</em></h2><div class="help"><p><b>SPIN:</b> každý spin používá vlastní náhodný výsledek; animace pouze vizualizuje jeho průběh.</p><p><b>FEATURES:</b> každý automat má jinou herní smyčku — ways, free spins, hold & win, tumble, respin, multipliers nebo mystery.</p><p><b>SOUND:</b> zvuk se aktivuje prvním kliknutím a je vytvořen Web Audio API, bez externích licencovaných nahrávek.</p><p><b>DEMO:</b> používají se pouze virtuální TOKENS.</p></div>`;$('panelOverlay').classList.remove('hidden')}
function closePanel(){$('panelOverlay').classList.add('hidden')}
function claimDaily(){if(dailyClaimed){toast('DNEŠNÍ ODMĚNA UŽ BYLA VYZVEDNUTA');return}dailyClaimed=true;balance+=250;updateBalances();toast('🎁 +250 TOKENŮ — DAILY REWARD');soundFx('coin')}
const ticker=['Mikey hit 2,500 tokens on Lucky Sevens','Vinnie won 8,000 tokens on Diamond Rush','Sofia triggered Free Spins on Vinewood Nights','Tony hit a Multi Wild ×8 on Los Santos Legends','CJ landed a Fire Tumble on Blazing Fruits'];let ti=0;setInterval(()=>{ti=(ti+1)%ticker.length;$('tickerText').textContent=ticker[ti]},4000);
renderGames();updateBalances();
