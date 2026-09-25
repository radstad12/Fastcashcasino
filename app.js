const games=[
{id:"los-santos",name:"Multi Vegas 81",tag:"CLASSIC",type:"hot",rtp:95,min:25,max:5000,theme:"sunset",layout:"4x3",lines:"81 WAYS",image:"multi-vegas-81.svg",symbols:["CHERRY","DOLLAR","ORANGE","PLUM","BELL","GRAPES","MELON","SEVEN","MULTI_WILD"],payouts:{SEVEN:{3:16,4:160},MELON:{3:6,4:60},GRAPES:{3:4,4:40},BELL:{3:1,4:4},PLUM:{3:1,4:4},DOLLAR:{3:1,4:4},ORANGE:{3:1,4:4},CHERRY:{3:1,4:2}}},
{id:"vinewood",name:"Vinewood Nights",tag:"NEW",type:"new",rtp:96,min:10,max:3000,theme:"pink",layout:"5x4",lines:40,image:"vinewood.jpg",symbols:["STAR","CLAP","GEM","CHAMP","SEVEN"],payouts:{SEVEN:40,GEM:20,STAR:12,CLAP:8,CHAMP:5}},
{id:"cash-cartel",name:"Cash Cartel",tag:"POPULAR",type:"hot",rtp:95,min:25,max:7500,theme:"gold",layout:"5x3",lines:25,image:"cash-cartel.jpg",symbols:["CASH","GOLD","GUN","CAR","SEVEN"],payouts:{SEVEN:50,CASH:30,GOLD:15,GUN:8,CAR:5}},
{id:"diamond",name:"Diamond Rush",tag:"JACKPOT",type:"vip",rtp:94,min:50,max:10000,theme:"blue",layout:"6x4",lines:"MEGAWAYS",image:"diamond-rush.jpg",symbols:["DIAMOND","CLUB","ACE","COIN","SEVEN"],payouts:{SEVEN:60,DIAMOND:35,COIN:15,ACE:8,CLUB:5}},
{id:"lucky",name:"Lucky Sevens",tag:"CLASSIC",type:"hot",rtp:95,min:10,max:5000,theme:"red",layout:"3x2",lines:5,image:"lucky-sevens.jpg",symbols:["SEVEN","BAR","CHERRY","BELL","LEMON"],payouts:{SEVEN:50,BAR:20,CHERRY:8,BELL:5,LEMON:3}},
{id:"street",name:"Street Racers",tag:"NEW",type:"new",rtp:96,min:10,max:4000,theme:"cyan",layout:"5x3",lines:30,image:"street-racers.jpg",symbols:["RACE","FLAG","TURBO","FIRE","SEVEN"],payouts:{SEVEN:45,RACE:25,FIRE:12,FLAG:7,TURBO:4}},
{id:"high-roller",name:"High Roller",tag:"VIP",type:"vip",rtp:93,min:100,max:20000,theme:"blackgold",layout:"4x3",lines:"3x3 BONUS",image:"high-roller.jpg",symbols:["ACE","DICE","CASH","ROYAL","SEVEN"],payouts:{SEVEN:75,CASH:30,ROYAL:15,DICE:10,ACE:5}},
{id:"fruits",name:"Blazing Fruits",tag:"POPULAR",type:"hot",rtp:96,min:5,max:2500,theme:"orange",layout:"5x4",lines:20,image:"blazing-fruits.jpg",symbols:["CHERRY","MELON","LEMON","ORANGE","SEVEN"],payouts:{SEVEN:35,MELON:15,CHERRY:8,ORANGE:5,LEMON:3}},
{id:"mafia",name:"Mafia Fortune",tag:"EXCLUSIVE",type:"vip",rtp:94,min:50,max:15000,theme:"mafia",layout:"4x3",lines:15,image:"mafia-fortune.jpg",symbols:["BOSS","CASH","CAR","WHISKY","SEVEN"],payouts:{SEVEN:70,CASH:30,BOSS:15,WHISKY:8,CAR:5}},
{id:"ocean",name:"Ocean Drive",tag:"CHILL",type:"new",rtp:96,min:10,max:5000,theme:"ocean",layout:"6x3",lines:50,image:"ocean-drive.jpg",symbols:["PALM","WAVE","ROAD","GEM","SEVEN"],payouts:{SEVEN:45,GEM:20,WAVE:12,PALM:7,ROAD:4}}
];

let balance=10000,current=null,bet=100,spinning=false,sound=true,history=[],dailyClaimed=false;
const $=id=>document.getElementById(id),fmt=n=>Number(n).toLocaleString("cs-CZ");

function renderGames(filter="all"){
 $("gameGrid").innerHTML=games.filter(g=>filter==="all"||g.type===filter).map(g=>`
 <button class="game-card theme-${g.theme}" onclick="openGame('${g.id}')">
  <div class="card-art"><img src="assets/games/${g.image}" alt="${g.name}"><div class="card-shade"></div><div class="layout-badge">${g.layout} • ${g.lines} LINES</div><div class="badge badge-${g.type}">${g.tag}</div></div>
  <div class="card-info"><div><b>${g.name}</b><small>${g.min}–${fmt(g.max)} TOKENS • ${g.layout}</small></div><span class="play-arrow">→</span></div>
 </button>`).join("");
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderGames(btn.dataset.filter)}));

function showLobby(){closeGame();closePanel();window.scrollTo({top:0,behavior:"smooth"})}
function scrollToGames(){$("gamesSection").scrollIntoView({behavior:"smooth"})}
function addTokens(){balance+=10000;updateBalances();toast("＋10,000 TOKENŮ PŘIDÁNO");}
function openGame(id){
 current=games.find(g=>g.id===id);bet=Math.max(current.min,Math.min(current.max,bet));
 $("gameTitle").textContent=current.name.toUpperCase();$("gameTag").textContent=current.tag+" • "+current.layout+" • "+current.lines;$("gameRtp").textContent=`RTP ${current.rtp}%`;
 $("neonSign").innerHTML=current.name.split(" ").slice(0,-1).join(" ")+"<br><span>"+current.name.split(" ").at(-1).toUpperCase()+"</span>";
 $("machine").className="machine machine-"+current.theme;$("machineScene").className="machine-scene scene-"+current.theme;
 buildReels();updateBetUI();setReels(randomReels());$("machineResult").textContent="READY TO SPIN";$("gameOverlay").classList.remove("hidden");
}
function closeGame(){if(!spinning)$("gameOverlay").classList.add("hidden")}
function buildReels(){
 const match=current.layout.match(/(\d+)x(\d+)/);const cols=+match[1],rows=+match[2];const frame=$("reelFrame");frame.innerHTML="";
 frame.style.setProperty("--cols",cols);frame.style.setProperty("--rows",rows);
 for(let i=0;i<cols*rows;i++){const el=document.createElement("div");el.className="reel";el.dataset.index=i;frame.appendChild(el)}
}
function symbolMarkup(s){
 if(current?.id==="los-santos" && ["CHERRY","DOLLAR","ORANGE","PLUM","BELL","GRAPES","MELON","SEVEN","MULTI_WILD"].includes(s)){
  return `<span class="slot-symbol sym-${s.toLowerCase()}"><img src="assets/mv81/${s.toLowerCase()}.svg" alt="${s}"></span>`
 }
 const labels={SEVEN:"7",BAR:"BAR",CASH:"CASH",ROSE:"ROSE",CITY:"CITY",CHERRY:"CHERRY",BELL:"BELL",LEMON:"LEMON"};
 return `<span class="slot-symbol sym-${s.toLowerCase()}">${labels[s]||s}</span>`
}
function randomReels(){const n=+current.layout.split("x")[0]*+current.layout.split("x")[1];return Array.from({length:n},()=>current.symbols[Math.floor(Math.random()*current.symbols.length)])}
function setReels(values){document.querySelectorAll(".reel").forEach((el,i)=>{el.innerHTML=symbolMarkup(values[i%values.length]);el.classList.remove("reel-win","way-win")})}
function weightedSymbol(){
 if(current.id!=="los-santos"){
  const weights=current.symbols.map(s=>Math.max(1,Math.round(100/(typeof current.payouts[s]==="number"?current.payouts[s]:1))));
  const total=weights.reduce((a,b)=>a+b,0);let r=Math.random()*total;
  for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0)return current.symbols[i]}
  return current.symbols.at(-1)
 }
 // Multi Vegas 81: rare Multi Wild, with the remaining symbols weighted by their relative value.
 const weights={CHERRY:28,DOLLAR:18,ORANGE:18,PLUM:18,BELL:14,GRAPES:9,MELON:6,SEVEN:3,MULTI_WILD:2};
 const total=Object.values(weights).reduce((a,b)=>a+b,0);let r=Math.random()*total;
 for(const s of current.symbols){r-=weights[s]||1;if(r<=0)return s}
 return "CHERRY"
}
function outcome(){const n=+current.layout.split("x")[0]*+current.layout.split("x")[1];return Array.from({length:n},()=>weightedSymbol())}
function cellIndex(row,col,cols){return row*cols+col}
function evaluateMultiVegas(grid){
 const cols=4, rows=3, wins=[];
 const symbolsAt=(row,col)=>grid[cellIndex(row,col,cols)];
 const allRows=[0,1,2];
 const matches=(vals)=>{
  const base=vals.find(x=>x!=="MULTI_WILD");
  return base && vals.every(x=>x===base||x==="MULTI_WILD") ? base : null;
 };
 // 4-of-a-kind: all 81 possible row paths across all four reels.
 for(const r0 of allRows) for(const r1 of allRows) for(const r2 of allRows) for(const r3 of allRows){
  const pathRows=[r0,r1,r2,r3], vals=pathRows.map((r,c)=>symbolsAt(r,c)), base=matches(vals);
  if(base){
   const multCount=vals.filter(x=>x==="MULTI_WILD").length;
   wins.push({rows:pathRows,cols:[0,1,2,3],symbol:base,count:4,mult:multCount});
  }
 }
 // 3-of-a-kind: 27 paths across the first three reels, but only when that exact path does not continue on reel 4.
 for(const r0 of allRows) for(const r1 of allRows) for(const r2 of allRows){
  const pathRows=[r0,r1,r2], vals=pathRows.map((r,c)=>symbolsAt(r,c)), base=matches(vals);
  if(!base) continue;
  const fourthHasMatch=allRows.some(r3=>{
   const v=symbolsAt(r3,3);
   return v===base||v==="MULTI_WILD";
  });
  if(fourthHasMatch) continue;
  const multCount=vals.filter(x=>x==="MULTI_WILD").length;
  wins.push({rows:pathRows,cols:[0,1,2],symbol:base,count:3,mult:multCount});
 }
 const finalWins=wins.map(w=>{
  const payout=current.payouts[w.symbol]?.[w.count]||0;
  const multiplier=w.mult?Math.pow(2,w.mult):1;
  return {...w,multiplier,amount:bet*payout*multiplier};
 }).filter(w=>w.amount>0);
 return {wins:finalWins,total:finalWins.reduce((sum,w)=>sum+w.amount,0),ways3:finalWins.filter(w=>w.count===3).length,ways4:finalWins.filter(w=>w.count===4).length};
}
function calculateWin(r){
 if(current.id==="los-santos") return evaluateMultiVegas(r).total;
 const cols=+current.layout.split("x")[0], rows=+current.layout.split("x")[1];let wins=0;
 for(let row=0;row<rows;row++){const line=r.slice(row*cols,(row+1)*cols);if(line.length===cols&&line.every(x=>x===line[0]))wins+=bet*(current.payouts[line[0]]||0)}
 return wins;
}
function showMultiVegasWins(grid,result){
 document.querySelectorAll(".reel").forEach(el=>el.classList.remove("reel-win","way-win"));
 if(!result.wins.length)return;
 const unique=[];
 result.wins.forEach(w=>w.rows.forEach((row,i)=>{const idx=cellIndex(row,w.cols[i],4);if(!unique.includes(idx))unique.push(idx)}));
 unique.forEach(idx=>document.querySelectorAll(".reel")[idx]?.classList.add("reel-win"));
 let i=0;
 const flash=()=>{
  if(i>=result.wins.length)return;
  document.querySelectorAll(".reel").forEach(el=>el.classList.remove("way-win"));
  const w=result.wins[i++];w.rows.forEach((row,c)=>document.querySelectorAll(".reel")[cellIndex(row,w.cols[c],4)]?.classList.add("way-win"));
  const wildText=w.multiplier>1?` • WILD ×${w.multiplier}`:"";
  $("machineResult").textContent=`${w.symbol.replace("_"," ")} ${w.count}X • +${fmt(w.amount)}${wildText}`;
  playTone(w.multiplier>1?720:560,0.09,"triangle");
  setTimeout(flash,Math.min(850,420+result.wins.length*20));
 };
 flash();
}
let audioCtx=null;
function playTone(freq,duration=0.08,type="sine"){
 if(!sound)return;
 try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.035,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch(e){}
}
async function spin(){
 if(spinning)return;if(balance<bet){toast("NEMÁŠ DOSTATEK TOKENŮ");return}
 spinning=true;$("spinBtn").disabled=true;balance-=bet;updateBalances();$("machineResult").textContent="SPINNING...";
 const reels=[...document.querySelectorAll(".reel")];
 playTone(110,.12,"sawtooth");
 for(let round=0;round<18;round++){reels.forEach(el=>el.innerHTML=symbolMarkup(current.symbols[Math.floor(Math.random()*current.symbols.length)]));reels.forEach(el=>el.classList.add("reel-spin"));await new Promise(r=>setTimeout(r,45+round*3));}
 reels.forEach(el=>el.classList.remove("reel-spin"));
 const r=outcome();setReels(r);
 let win=0,result=null;
 if(current.id==="los-santos"){
  result=evaluateMultiVegas(r);win=result.total;
 }else win=calculateWin(r);
 balance+=win;
 if(win){
  $("machineResult").textContent=`WIN +${fmt(win)} TOKENS`;
  if(current.id==="los-santos")showMultiVegasWins(r,result);else reels.slice(0,Math.min(6,reels.length)).forEach(el=>el.classList.add("reel-win"));
  playTone(880,.16,"square");toast(`🎉 VÝHRA +${fmt(win)} TOKENŮ`)
 }else $("machineResult").textContent="NO WIN — TRY AGAIN";
 history.unshift({game:current.name,bet,win,time:new Date().toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})});history=history.slice(0,25);$("lastWin").textContent=fmt(win);updateBalances();spinning=false;$("spinBtn").disabled=false;
}
function updateBalances(){$("balance").textContent=fmt(balance);$("gameBalance").textContent=fmt(balance)}
function setBet(v){if(v==="half")bet=Math.max(current.min,Math.floor(bet/2));else if(v==="min")bet=current.min;else bet=Math.min(current.max,Math.max(current.min,bet*v));updateBetUI()}
function adjustBet(dir){const step=Math.max(current.min,Math.round(bet*.25));bet=Math.max(current.min,Math.min(current.max,bet+dir*step));updateBetUI()}
function updateBetUI(){$("betValue").textContent=fmt(bet);$("machineBetLabel").textContent=fmt(bet);const maxPayout=current?.id==="los-santos"?160:Math.max(...Object.values(current?.payouts||{0:0}));$("maxWin").textContent=fmt(bet*maxPayout)}
function toggleSound(){sound=!sound;$("soundBtn").textContent=sound?"♫":"🔇";toast(sound?"SOUND ON":"SOUND OFF")}
function toggleFullscreen(){if(!document.fullscreenElement)$("gameOverlay").requestFullscreen?.();else document.exitFullscreen?.()}
function openPaytable(){const g=current||games[0];$("paytableTitle").textContent=g.name.toUpperCase();if(g.id==="los-santos"){$("paytableContent").innerHTML=`<div class="mv81-rules"><b>81 WAYS / CRISS-CROSS</b><span>3 stejné symboly zleva = 27 cest • 4 stejné = 81 cest</span><span>Symboly nemusí být v jedné vodorovné řadě. MULTI WILD nahrazuje ostatní symboly.</span></div>`+Object.entries(g.payouts).map(([s,p])=>`<div class="pay-row"><span class="pay-symbol">${symbolMarkup(s)}</span><span>3× / 4× ${s.replace("_"," ")}</span><b>x${p[3]} / x${p[4]}</b></div>`).join("")+`<div class="pay-row"><span class="pay-symbol">${symbolMarkup("MULTI_WILD")}</span><span>1 / 2 / 3 Wildy ve výherní cestě</span><b>×2 / ×4 / ×8</b></div><div class="pay-note">4 válce × 3 řady • výhry zleva doprava • více výher se sčítá • na stejné cestě platí pouze nejvyšší výhra • RTP ${g.rtp}%</div>`}else{$("paytableContent").innerHTML=Object.entries(g.payouts).map(([s,m])=>`<div class="pay-row"><span class="pay-symbol">${s}</span><span>3 × ${s}</span><b>x${m}</b></div>`).join("")+`<div class="pay-note">${g.layout} • ${g.lines} • RTP ${g.rtp}% • Min ${fmt(g.min)} • Max ${fmt(g.max)}</div>`}$("paytableOverlay").classList.remove("hidden")}
function closePaytable(){$("paytableOverlay").classList.add("hidden")}
function openRewards(){$("panelContent").innerHTML=`<div class="eyebrow gold">REWARDS</div><h2>FASTCASH <em>VIP</em></h2><div class="reward-level"><b>BRONZE</b><span>0 / 10,000 XP</span></div><div class="progress"><i style="width:18%"></i></div><div class="reward-grid"><div>♛<b>VIP TABLES</b><small>Coming soon</small></div><div>★<b>DAILY BONUS</b><small>250 tokens</small></div><div>◆<b>EXCLUSIVE SLOTS</b><small>Unlock at VIP</small></div></div>`;$("panelOverlay").classList.remove("hidden")}
function openStats(){const spins=history.length,wins=history.reduce((a,x)=>a+x.win,0),bets=history.reduce((a,x)=>a+x.bet,0);$("panelContent").innerHTML=`<div class="eyebrow gold">PLAYER STATS</div><h2>YOUR <em>SESSION</em></h2><div class="stats-big"><div><b>${spins}</b><small>SPINS</small></div><div><b>${fmt(bets)}</b><small>WAGERED</small></div><div><b>${fmt(wins)}</b><small>WON</small></div></div><h3>RECENT SPINS</h3><div class="history">${history.length?history.map(x=>`<div><span>${x.game}</span><small>${x.time}</small><b class="${x.win?'win':''}">${x.win?"+":""}${fmt(x.win-x.bet)}</b></div>`).join(""):"No spins yet."}</div>`;$("panelOverlay").classList.remove("hidden")}
function openHelp(){$("panelContent").innerHTML=`<div class="eyebrow gold">HELP</div><h2>HOW TO <em>PLAY</em></h2><div class="help"><p><b>1.</b> Choose a slot from the lobby.</p><p><b>2.</b> Set your bet with −/+ or quick bets.</p><p><b>3.</b> Press SPIN and complete a winning line.</p><p><b>4.</b> Use +10,000 at the top while testing the demo.</p></div>`;$("panelOverlay").classList.remove("hidden")}
function closePanel(){$("panelOverlay").classList.add("hidden")}
function claimDaily(){if(dailyClaimed){toast("DNEŠNÍ ODMĚNA UŽ BYLA VYZVEDNUTA");return}dailyClaimed=true;balance+=250;updateBalances();toast("🎁 +250 TOKENŮ — DAILY REWARD")}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2500)}
const ticker=["Mikey hit 2,500 tokens on Lucky Sevens","Vinnie won 8,000 tokens on Diamond Rush","Sofia hit a 3x jackpot on Ocean Drive","Tony just spun High Roller for 5,000","CJ won 1,250 tokens on Blazing Fruits"];let ti=0;setInterval(()=>{ti=(ti+1)%ticker.length;$("tickerText").textContent=ticker[ti]},4000);
renderGames();updateBalances();
