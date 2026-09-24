
const games = [
  {id:"neon81",name:"Neon 81",tag:"WAYS",rtp:95.5,min:25,max:5000,layout:"4x3",lines:"81 WAYS",image:"neon81.svg",theme:"cyan",mode:"waysMulti",symbols:["SEVEN","BAR","DIAMOND","COIN","STAR"],payouts:{SEVEN:{3:12,4:40},BAR:{3:7,4:20},DIAMOND:{3:5,4:12},COIN:{3:3,4:8},STAR:{3:2,4:5}}},
  {id:"wildhunt",name:"Wild Hunt",tag:"FREE SPINS",rtp:96.2,min:10,max:4000,layout:"5x3",lines:"20 LINES",image:"wildhunt.svg",theme:"forest",mode:"stickyFree",symbols:["HUNTER","WOLF","EAGLE","BUFFALO","A","K","Q","J"],wild:"CAMPFIRE",scatter:"LODGE",payouts:{HUNTER:{2:4,3:15,4:40,5:100},WOLF:{2:3,3:10,4:25,5:70},EAGLE:{2:2,3:8,4:18,5:45},BUFFALO:{2:2,3:6,4:15,5:30},A:{2:1,3:4,4:10,5:20},K:{2:1,3:3,4:8,5:15},Q:{2:1,3:2,4:6,5:12},J:{2:1,3:2,4:5,5:10}}},
  {id:"hot100",name:"Hot 100",tag:"JACKPOT",rtp:94.8,min:10,max:5000,layout:"6x4",lines:"100 LINES",image:"hot100.svg",theme:"hot",mode:"expandWild",symbols:["RED7","BELL","BAR","MELON","PLUM","LEMON","CHERRY"],wild:"JOKER",scatter:"HORSESHOE",payouts:{RED7:{3:8,4:20,5:50,6:120},BELL:{3:5,4:12,5:30,6:70},BAR:{3:4,4:10,5:20,6:50},MELON:{3:3,4:7,5:15,6:35},PLUM:{3:2,4:5,5:10,6:25},LEMON:{3:2,4:4,5:8,6:18},CHERRY:{3:1,4:3,5:6,6:12}}},
  {id:"joker",name:"Joker ReSpin",tag:"RESPIN",rtp:95.1,min:10,max:5000,layout:"4x3",lines:"81 WAYS",image:"joker.svg",theme:"purple",mode:"stickyRespin",symbols:["JOKER","BAR","SEVEN","GEM","CHERRY"],wild:"JOKER",payouts:{JOKER:{3:15,4:60},SEVEN:{3:10,4:35},BAR:{3:6,4:20},GEM:{3:4,4:12},CHERRY:{3:2,4:7}}},
  {id:"multi5",name:"Multi Five",tag:"MULTIPLIER",rtp:95.2,min:10,max:3500,layout:"5x4",lines:"20 LINES",image:"multi5.svg",theme:"green",mode:"multiFree",symbols:["CROWN","DIAMOND","BAR","MELON","PLUM","LEMON","CHERRY"],wild:"MULTI5",scatter:"BONUS",payouts:{CROWN:{3:10,4:30,5:100},DIAMOND:{3:7,4:20,5:60},BAR:{3:5,4:15,5:40},MELON:{3:3,4:9,5:25},PLUM:{3:2,4:6,5:15},LEMON:{3:1,4:4,5:10},CHERRY:{3:1,4:3,5:8}}},
  {id:"midnight",name:"Midnight Fruits",tag:"CASHBACK",rtp:96,min:10,max:3000,layout:"4x3",lines:"81 WAYS",image:"midnight.svg",theme:"midnight",mode:"cashback",symbols:["WATERMELON","GRAPE","PLUM","BANANA","LEMON","CHERRY"],wild:"MIDWILD",payouts:{WATERMELON:{3:10,4:35},GRAPE:{3:7,4:20},PLUM:{3:4,4:12},BANANA:{3:3,4:8},LEMON:{3:2,4:5},CHERRY:{3:1,4:3}}},
  {id:"fruitjack",name:"Fruit Jack",tag:"MYSTERY",rtp:95.7,min:10,max:4500,layout:"5x4",lines:"40 LINES",image:"fruitjack.svg",theme:"fruit",mode:"mystery",symbols:["JACK","SEVEN","ORANGE","MELON","PLUM","LEMON","CHERRY"],wild:"FRUITWILD",scatter:"GIFT",payouts:{JACK:{3:12,4:35,5:90},SEVEN:{3:8,4:25,5:60},ORANGE:{3:5,4:15,5:35},MELON:{3:4,4:10,5:25},PLUM:{3:3,4:8,5:18},LEMON:{3:2,4:5,5:12},CHERRY:{3:1,4:3,5:8}}},
  {id:"vegas81",name:"Vegas 81",tag:"RETRO",rtp:95.4,min:25,max:5000,layout:"4x3",lines:"81 WAYS",image:"vegas81.svg",theme:"gold",mode:"waysMulti",symbols:["SEVEN","BAR","MELON","GRAPE","BELL","PLUM"],wild:"VEGASWILD",payouts:{SEVEN:{3:15,4:55},BAR:{3:8,4:25},MELON:{3:5,4:14},GRAPE:{3:4,4:10},BELL:{3:3,4:7},PLUM:{3:2,4:5}}},
  {id:"olympus",name:"Olympus Clash",tag:"TUMBLE",rtp:96.1,min:10,max:5000,layout:"6x5",lines:"PAY ANYWHERE",image:"olympus.svg",theme:"olympus",mode:"tumble",symbols:["ZEUS","CROWN","GOBLET","GEMBLUE","GEMRED","GEMGREEN"],scatter:"SCATTER",payouts:{ZEUS:{8:8,10:15,12:30},CROWN:{8:5,10:10,12:20},GOBLET:{8:4,10:8,12:15},GEMBLUE:{8:3,10:6,12:12},GEMRED:{8:2,10:5,12:10},GEMGREEN:{8:2,10:4,12:8}}},
  {id:"firebird",name:"Firebird Double",tag:"DOUBLE WAYS",rtp:95.0,min:10,max:4500,layout:"4x3",lines:"27 + 27 WAYS",image:"firebird.svg",theme:"fire",mode:"doubleWays",symbols:["FIREBIRD","SEVEN","BELL","BAR","MELON","GRAPE","PLUM","LEMON","CHERRY"],wild:"FIREWILD",payouts:{FIREBIRD:{3:20},SEVEN:{3:20},BELL:{3:10},BAR:{3:6},MELON:{3:4},GRAPE:{3:3},PLUM:{3:2},LEMON:{3:2},CHERRY:{3:1}}}
];

let balance=10000,current=null,bet=100,spinning=false,sound=true,history=[],dailyClaimed=false;
let freeSpins=0, freeSpinBet=0, sticky=[], pendingGamble=0, lastMatrix=null, jackpot=125000;

const $=id=>document.getElementById(id), fmt=n=>Number(Math.max(0,n)).toLocaleString("cs-CZ");

function renderGames(filter="all"){
  $("gameGrid").innerHTML=games.filter(g=>filter==="all"||filter===g.mode||filter==="hot"&&["waysMulti","doubleWays","expandWild"].includes(g.mode)||filter==="new"&&["tumble","mystery","cashback"].includes(g.mode)||filter==="vip"&&["olympus","multiFree"].includes(g.mode))
  .map(g=>`<button class="game-card theme-${g.theme}" onclick="openGame('${g.id}')">
    <div class="card-art"><img src="assets/games/${g.image}" alt="${g.name}"><div class="card-shade"></div><div class="layout-badge">${g.layout} • ${g.lines}</div><div class="badge badge-${g.tag.toLowerCase().replace(/[^a-z]/g,"")}">${g.tag}</div></div>
    <div class="card-info"><div><b>${g.name}</b><small>${g.min}–${fmt(g.max)} TOKENS • ${g.lines}</small></div><span class="play-arrow">→</span></div>
  </button>`).join("");
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderGames(btn.dataset.filter)}));

function showLobby(){closeGame();closePanel();window.scrollTo({top:0,behavior:"smooth"})}
function scrollToGames(){$("gamesSection").scrollIntoView({behavior:"smooth"})}
function addTokens(){balance+=10000;updateBalances();toast("＋10,000 TOKENŮ PŘIDÁNO");}
function openGame(id){
  current=games.find(g=>g.id===id);bet=Math.max(current.min,Math.min(current.max,bet));
  freeSpins=0;freeSpinBet=0;sticky=[];pendingGamble=0;
  $("gameTitle").textContent=current.name.toUpperCase();
  $("gameTag").textContent=current.tag+" • "+current.layout+" • "+current.lines;
  $("gameRtp").textContent=`RTP ${current.rtp}%`;
  $("neonSign").innerHTML=current.name.split(" ").slice(0,-1).join(" ")+"<br><span>"+current.name.split(" ").at(-1).toUpperCase()+"</span>";
  $("machine").className="machine machine-"+current.theme;
  $("machineScene").className="machine-scene scene-"+current.theme;
  buildReels(); updateBetUI(); setReels(randomMatrix()); $("machineResult").textContent="READY TO SPIN";
  updateFeatureBar(); $("gameOverlay").classList.remove("hidden");
}
function closeGame(){if(!spinning)$("gameOverlay").classList.add("hidden")}
function buildReels(){
  const [cols,rows]=current.layout.split("x").map(Number), frame=$("reelFrame");
  frame.innerHTML=""; frame.style.setProperty("--cols",cols); frame.style.setProperty("--rows",rows);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const el=document.createElement("div"); el.className="reel"; el.dataset.row=r; el.dataset.col=c; frame.appendChild(el);
  }
}
const iconMap={
  SEVEN:"seven",BAR:"bar",DIAMOND:"diamond",COIN:"coin",STAR:"star",HUNTER:"hunter",WOLF:"wolf",EAGLE:"eagle",BUFFALO:"buffalo",A:"ace",K:"king",Q:"queen",J:"jack",
  CAMPFIRE:"fire",LODGE:"lodge",RED7:"red7",BELL:"bell",MELON:"melon",PLUM:"plum",LEMON:"lemon",CHERRY:"cherry",JOKER:"joker",GEM:"gem",CROWN:"crown",BONUS:"bonus",
  MULTI5:"multi",WATERMELON:"watermelon",GRAPE:"grape",BANANA:"banana",MIDWILD:"moon",JACK:"jack",ORANGE:"orange",GIFT:"gift",FRUITWILD:"wildfruit",VEGASWILD:"vegaswild",
  ZEUS:"zeus",GOBLET:"goblet",GEMBLUE:"gemblue",GEMRED:"gemred",GEMGREEN:"gemgreen",SCATTER:"scatter",FIREBIRD:"firebird",FIREWILD:"firewild"
};
function symbolSvg(s){
  const cls=iconMap[s]||"coin";
  const label=s==="RED7"?"7":s==="SEVEN"?"7":s==="BAR"?"BAR":s==="A"?"A":s==="K"?"K":s==="Q"?"Q":s==="J"?"J":"";
  const shape = label ? `<text x="50" y="66" text-anchor="middle" class="icon-text">${label}</text>` :
    `<circle cx="50" cy="50" r="28" class="icon-core"/><path d="M35 50h30M50 35v30" class="icon-line"/>`;
  return `<span class="slot-symbol sym-${cls}"><svg viewBox="0 0 100 100" aria-hidden="true">${shape}</svg></span>`;
}
function randomMatrix(){
  const [cols,rows]=current.layout.split("x").map(Number), arr=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)arr.push(randomBaseSymbol());
  return arr;
}
function randomBaseSymbol(){
  const s=current.symbols;
  const r=Math.random();
  if(current.wild && r<0.035)return current.wild;
  if(current.scatter && r<0.028)return current.scatter;
  // bias lower symbols
  return s[Math.floor(Math.pow(Math.random(),0.72)*s.length)];
}
function setReels(values, wins=[]){
  document.querySelectorAll(".reel").forEach((el,i)=>{el.innerHTML=symbolSvg(values[i]||current.symbols[0]);el.classList.remove("reel-win","reel-sticky");});
  wins.forEach(i=>document.querySelector(`.reel[data-row="${Math.floor(i/current.layout.split("x")[0])}"][data-col="${i%+current.layout.split("x")[0]}"]`)?.classList.add("reel-win"));
  sticky.forEach(i=>document.querySelectorAll(".reel")[i]?.classList.add("reel-sticky"));
}
function playTone(freq=440,duration=.07,type="sine",gain=.035){
  if(!sound)return;
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;window.__ac=window.__ac||new C();const o=window.__ac.createOscillator(),g=window.__ac.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain;o.connect(g);g.connect(window.__ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,window.__ac.currentTime+duration);o.stop(window.__ac.currentTime+duration)}catch(e){}
}
function spinSound(){[0,1,2,3,4,5].forEach((x)=>setTimeout(()=>playTone(180+x*65,.055,"square",.018),x*105))}
function winSound(big=false){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>playTone(f,.12,"triangle",big?.06:.035),i*90))}
function flash(type="win"){
  const layer=document.querySelector(".effect-layer"); if(!layer)return;
  const e=document.createElement("div");e.className="fx "+type;layer.appendChild(e);setTimeout(()=>e.remove(),1100);
}
async function animateSpin(final){
  const reels=[...document.querySelectorAll(".reel")], [cols]=current.layout.split("x").map(Number);
  spinning=true;$("spinBtn").disabled=true;spinSound();
  reels.forEach(el=>el.classList.add("reel-spin"));
  const start=performance.now();
  while(performance.now()-start<1150){
    reels.forEach((el,i)=>{if(Math.random()<.55)el.innerHTML=symbolSvg(current.symbols[Math.floor(Math.random()*current.symbols.length)]);});
    await new Promise(r=>setTimeout(r,55));
  }
  for(let c=0;c<cols;c++){
    reels.forEach((el,i)=>{if(i%cols===c)el.innerHTML=symbolSvg(final[i]||current.symbols[0]);el.classList.remove("reel-spin")});
    playTone(260+c*65,.08,"square",.025);
    await new Promise(r=>setTimeout(r,150));
  }
  setReels(final);
}
function countWays(matrix,sym,fromRight=false){
  const [cols,rows]=current.layout.split("x").map(Number);
  let count=0;
  for(let r=0;r<rows;r++){
    let len=0;
    for(let k=0;k<cols;k++){
      const c=fromRight?cols-1-k:k, v=matrix[r*cols+c];
      if(v===sym||v===current.wild){len++}else break;
    }
    if(len>=3)count+=len===4?1:1;
  }
  return count;
}
function lineWin(matrix){
  const [cols,rows]=current.layout.split("x").map(Number), wins=[], payouts=[];
  const lines=Math.min(40, rows*8);
  for(let r=0;r<rows;r++){
    for(const dir of [1,-1]){
      const sym=matrix[r*cols+(dir===1?0:cols-1)];
      if(!current.payouts[sym])continue;
      let len=0;
      for(let k=0;k<cols;k++){const c=dir===1?k:cols-1-k,v=matrix[r*cols+c];if(v===sym||v===current.wild)len++;else break}
      if(len>=2 && current.payouts[sym][len]){payouts.push(bet*current.payouts[sym][len]);for(let k=0;k<len;k++)wins.push(r*cols+(dir===1?k:cols-1-k));}
    }
  }
  return {win:payouts.reduce((a,b)=>a+b,0),wins:[...new Set(wins)]};
}
function waysWin(matrix){
  const [cols,rows]=current.layout.split("x").map(Number);let total=0,wins=[];
  for(const sym of current.symbols){
    const pay=current.payouts[sym]; if(!pay)continue;
    let left=0,right=0,leftCells=[],rightCells=[];
    for(let r=0;r<rows;r++){
      let l=0,rc=0;
      for(let c=0;c<cols;c++){const v=matrix[r*cols+c];if(v===sym||v===current.wild){l++;leftCells.push(r*cols+c)}else break}
      for(let c=cols-1;c>=0;c--){const v=matrix[r*cols+c];if(v===sym||v===current.wild){rc++;rightCells.push(r*cols+c)}else break}
      if(l>=3)left+=pay[l]||0;
      if(rc>=3)right+=pay[rc]||0;
    }
    if(left){total+=bet*left;wins.push(...leftCells)}
    if(right&&current.mode==="doubleWays"){total+=bet*right;wins.push(...rightCells)}
  }
  return {win:total,wins:[...new Set(wins)]};
}
function payAnywhere(matrix){
  const counts={}; matrix.forEach(s=>{if(current.payouts[s])counts[s]=(counts[s]||0)+1});
  let best=0,wins=[];
  for(const [s,n] of Object.entries(counts)){
    const keys=Object.keys(current.payouts[s]).map(Number).filter(x=>x<=n).sort((a,b)=>b-a);if(!keys.length)continue;
    const mult=current.payouts[s][keys[0]]; if(mult){const w=bet*mult; if(w>best)best=w; if(w>=best)wins=matrix.map((v,i)=>v===s?i:-1).filter(i=>i>=0)}
  }
  return {win:best,wins};
}
function resolveSpin(matrix){
  if(current.mode==="tumble")return payAnywhere(matrix);
  if(["waysMulti","doubleWays","stickyRespin"].includes(current.mode))return waysWin(matrix);
  return lineWin(matrix);
}
function applySpecials(matrix,result){
  let extra=0, message="";
  // Wild multipliers
  if(["waysMulti","multiFree"].includes(current.mode)){
    const wc=matrix.filter(x=>x===current.wild).length;
    if(wc&&result.win){const mult=Math.min(8,2**Math.min(3,wc));extra=result.win*(mult-1);message=`MULTI WILD ×${mult}`;}
  }
  // Hot 100 expanding wild visual + bonus
  if(current.mode==="expandWild"&&matrix.includes(current.wild)&&result.win){
    const [cols,rows]=current.layout.split("x").map(Number);
    const idx=matrix.indexOf(current.wild), c=idx%cols;
    for(let r=0;r<rows;r++)matrix[r*cols+c]=current.wild;
    message="EXPANDING WILD";
  }
  // Scatter / free spins
  if(current.scatter){
    const sc=matrix.filter(x=>x===current.scatter).length;
    if(sc>=3 && ["stickyFree","multiFree","mystery"].includes(current.mode)){
      freeSpins=Math.min(20,freeSpins+10);freeSpinBet=bet;message=message?message+" • 10 FREE SPINS":"10 FREE SPINS";
    }
  }
  // Jackpot for Hot 100
  if(current.mode==="expandWild" && Math.random()<0.0008){const j=Math.min(jackpot,bet*500);extra+=j;jackpot+=Math.floor(bet*.01);message=`ROYAL JACKPOT +${fmt(j)}`;flash("jackpot");}
  // Midnight cashback only when player is at/under 0 after stake
  if(current.mode==="cashback" && balance<=0 && Math.random()<.025){const cb=Math.max(bet*5,250);extra+=cb;message=`CASHBACK +${fmt(cb)}`;flash("cashback");}
  // Fruit Jack mystery
  if(current.mode==="mystery" && Math.random()<.015){const mystery=bet*(10+Math.floor(Math.random()*41));extra+=mystery;message=`MYSTERY BONUS +${fmt(mystery)}`;flash("mystery");}
  return {extra,message};
}
async function spin(){
  if(spinning)return;
  const activeFree=freeSpins>0;
  if(!activeFree && balance<bet){toast("NEMÁŠ DOSTATEK TOKENŮ");return}
  if(!activeFree){balance-=bet}else freeSpins--;
  updateBalances(); updateFeatureBar();
  const final=randomMatrix(); lastMatrix=final;
  $("machineResult").textContent=activeFree?`FREE SPIN • ${freeSpins} ZBÝVÁ`:"SPINNING...";
  await animateSpin(final);
  let result=resolveSpin(final);
  const special=applySpecials(final,result);
  result.win+=special.extra;
  // Sticky respin: a wild that participates can trigger up to 3 respins
  if(current.mode==="stickyRespin" && final.includes(current.wild) && result.win && sticky.length<8){
    sticky=[...new Set([...sticky,...final.map((x,i)=>x===current.wild?i:-1).filter(i=>i>=0)])];
    setReels(final,result.wins); flash("purple"); toast("STICKY RESPIN!");
    await new Promise(r=>setTimeout(r,450));
    const again=final.slice(); for(let i=0;i<again.length;i++)if(!sticky.includes(i))again[i]=randomBaseSymbol();
    const sub=resolveSpin(again); result.win+=sub.win; result.wins=[...new Set([...result.wins,...sub.wins])]; lastMatrix=again; setReels(again,result.wins);
  }else sticky=[];
  // Tumble chain
  if(current.mode==="tumble" && result.win){
    let chain=0, matrix=final.slice();
    while(chain<3){
      chain++; const winning=result.wins.length?result.wins:[]; if(!winning.length)break;
      winning.forEach(i=>matrix[i]=null);
      const [cols,rows]=current.layout.split("x").map(Number);
      for(let c=0;c<cols;c++){const col=[];for(let r=rows-1;r>=0;r--){const v=matrix[r*cols+c];if(v)col.push(v)}while(col.length<rows)col.push(randomBaseSymbol());for(let r=rows-1;r>=0;r--)matrix[r*cols+c]=col[rows-1-r]}
      flash("tumble"); await new Promise(r=>setTimeout(r,320)); setReels(matrix);
      const nxt=payAnywhere(matrix); if(!nxt.win)break; result.win+=nxt.win; result.wins=nxt.wins;
      if(Math.random()<.25)result.win+=bet*(2+Math.floor(Math.random()*6));
    }
  }
  balance+=result.win; updateBalances(); updateFeatureBar();
  const net=result.win-bet;
  $("machineResult").textContent=result.win?`${special.message||"WIN"} +${fmt(result.win)} TOKENS`:"NO WIN";
  if(result.win){winSound(result.win>=bet*20);flash(result.win>=bet*20?"mega":"win");}
  setReels(lastMatrix||final,result.wins);
  history.unshift({game:current.name,bet:activeFree?0:bet,win:result.win,time:new Date().toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})});
  history=history.slice(0,30);$("lastWin").textContent=fmt(result.win);
  if(result.win>=bet*25)toast(`🔥 BIG WIN +${fmt(result.win)} TOKENS`);
  else if(special.message)toast(special.message);
  if(result.win && current.mode==="mystery"){pendingGamble=result.win;showGamble();}
  updateFeatureBar();
  spinning=false;$("spinBtn").disabled=false;
  if(freeSpins>0){setTimeout(()=>spin(),500)}
}
function showGamble(){
  const f=$("featureControls"); if(!f)return;
  f.innerHTML=`<button class="feature-btn gamble" onclick="gamble('red')">🔴 RED ×2</button><button class="feature-btn gamble" onclick="gamble('black')">⚫ BLACK ×2</button><button class="feature-btn collect" onclick="collectGamble()">COLLECT ${fmt(pendingGamble)}</button>`;
}
function gamble(color){
  if(!pendingGamble)return; const win=Math.random()<.5;
  if(win){pendingGamble*=2;playTone(880,.12,"triangle",.06);toast("GAMBLE WIN ×2");showGamble()}
  else{pendingGamble=0;$("featureControls").innerHTML="";toast("GAMBLE LOST")}
}
function collectGamble(){if(!pendingGamble)return;balance+=pendingGamble;updateBalances();toast(`COLLECT +${fmt(pendingGamble)}`);pendingGamble=0;$("featureControls").innerHTML=""}
function updateFeatureBar(){
  const f=$("featureControls"); if(!f)return;
  if(pendingGamble)return;
  let bits=[];
  if(freeSpins>0)bits.push(`FREE SPINS <b>${freeSpins}</b>`);
  if(current?.mode==="expandWild")bits.push(`ROYAL <b>${fmt(jackpot)}</b>`);
  if(current?.mode==="cashback")bits.push(`CASHBACK ON ZERO`);
  if(current?.mode==="tumble")bits.push(`TUMBLE MODE`);
  f.innerHTML=bits.length?bits.map(x=>`<span class="feature-pill">${x}</span>`).join(""):"";
}
function updateBalances(){$("balance").textContent=fmt(balance);$("gameBalance").textContent=fmt(balance)}
function setBet(v){if(!current)return;if(v==="half")bet=Math.max(current.min,Math.floor(bet/2));else if(v==="min")bet=current.min;else bet=Math.min(current.max,Math.max(current.min,bet*v));updateBetUI()}
function adjustBet(dir){if(!current)return;const step=Math.max(current.min,Math.round(bet*.25));bet=Math.max(current.min,Math.min(current.max,bet+dir*step));updateBetUI()}
function updateBetUI(){if(!current)return;$("betValue").textContent=fmt(bet);$("machineBetLabel").textContent=fmt(bet);$("maxWin").textContent=fmt(bet*1000)}
function toggleSound(){sound=!sound;$("soundBtn").textContent=sound?"♫":"🔇";toast(sound?"SOUND ON":"SOUND OFF")}
function toggleFullscreen(){if(!document.fullscreenElement)$("gameOverlay").requestFullscreen?.();else document.exitFullscreen?.()}
function openPaytable(){
  const g=current||games[0];
  $("paytableTitle").textContent=g.name.toUpperCase();
  const rows=Object.entries(g.payouts).map(([s,p])=>{const vals=Object.entries(p).map(([n,m])=>`${n}× → x${m}`).join("  •  ");return `<div class="pay-row"><span class="pay-symbol">${symbolSvg(s)}</span><span>${s}</span><b>${vals}</b></div>`}).join("");
  $("paytableContent").innerHTML=rows+`<div class="pay-note">${g.layout} • ${g.lines} • RTP ${g.rtp}% (demo target) • Speciální mechanika: ${featureName(g.mode)}</div>`;
  $("paytableOverlay").classList.remove("hidden");
}
function featureName(mode){return ({waysMulti:"Ways + Multi Wild",stickyFree:"Sticky Free Spins",expandWild:"Expanding Wild + Jackpot",stickyRespin:"Sticky Respin + Gamble",multiFree:"Multi Wild + Free Spins",cashback:"Wild + Cashback",mystery:"Mystery Bonus + Gamble",tumble:"Tumble + Multipliers",doubleWays:"27 + 27 Ways"})[mode]||"Classic";}
function closePaytable(){$("paytableOverlay").classList.add("hidden")}
function openRewards(){$("panelContent").innerHTML=`<div class="eyebrow gold">REWARDS</div><h2>FASTCASH <em>VIP</em></h2><div class="reward-level"><b>BRONZE</b><span>0 / 10,000 XP</span></div><div class="progress"><i style="width:18%"></i></div><div class="reward-grid"><div>♛<b>VIP TABLES</b><small>Coming soon</small></div><div>★<b>DAILY BONUS</b><small>250 tokens</small></div><div>◆<b>EXCLUSIVE SLOTS</b><small>10 original machines</small></div></div>`;$("panelOverlay").classList.remove("hidden")}
function openStats(){const spins=history.length,wins=history.reduce((a,x)=>a+x.win,0),bets=history.reduce((a,x)=>a+x.bet,0);$("panelContent").innerHTML=`<div class="eyebrow gold">PLAYER STATS</div><h2>YOUR <em>SESSION</em></h2><div class="stats-big"><div><b>${spins}</b><small>SPINS</small></div><div><b>${fmt(bets)}</b><small>WAGERED</small></div><div><b>${fmt(wins)}</b><small>WON</small></div></div><h3>RECENT SPINS</h3><div class="history">${history.length?history.map(x=>`<div><span>${x.game}</span><small>${x.time}</small><b class="${x.win?'win':''}">${x.win?"+":""}${fmt(x.win-x.bet)}</b></div>`).join(""):"No spins yet."}</div>`;$("panelOverlay").classList.remove("hidden")}
function openHelp(){$("panelContent").innerHTML=`<div class="eyebrow gold">HELP</div><h2>HOW TO <em>PLAY</em></h2><div class="help"><p><b>1.</b> Každý automat má vlastní matematiku a vlastní speciální funkce.</p><p><b>2.</b> Výsledek spinu se určí před animací; animace pouze zobrazí výsledek.</p><p><b>3.</b> Zvuk můžeš vypnout vpravo nahoře.</p><p><b>4.</b> +10,000 TOKENS je pouze testovací tlačítko.</p></div>`;$("panelOverlay").classList.remove("hidden")}
function closePanel(){$("panelOverlay").classList.add("hidden")}
function claimDaily(){if(dailyClaimed){toast("DNEŠNÍ ODMĚNA UŽ BYLA VYZVEDNUTA");return}dailyClaimed=true;balance+=250;updateBalances();toast("🎁 +250 TOKENŮ — DAILY REWARD")}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2600)}
const ticker=["CJ hit a 4x Multi Wild on Neon 81","Maya triggered Sticky Free Spins on Wild Hunt","Tony found the Royal Jackpot meter","Vinnie landed a Firebird double-sided win","Sofia chained three Olympus tumbles"];let ti=0;setInterval(()=>{ti=(ti+1)%ticker.length;$("tickerText").textContent=ticker[ti]},4000);
renderGames();updateBalances();
