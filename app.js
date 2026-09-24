const games=[
{id:"los-santos",name:"Los Santos Legends",tag:"HOT",type:"hot",rtp:95,min:25,max:5000,theme:"sunset",layout:"5x3",lines:20,image:"los-santos.jpg",symbols:["SEVEN","BAR","CASH","ROSE","CITY"],payouts:{SEVEN:50,BAR:25,CASH:15,ROSE:8,CITY:5}},
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
 $("gameTitle").textContent=current.name.toUpperCase();$("gameTag").textContent=current.tag+" • "+current.layout+" • "+current.lines+" LINES";$("gameRtp").textContent=`RTP ${current.rtp}%`;
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
function symbolMarkup(s){return `<span class="slot-symbol sym-${s.toLowerCase()}">${s}</span>`}
function randomReels(){const n=+current.layout.split("x")[0]*+current.layout.split("x")[1];return Array.from({length:n},()=>current.symbols[Math.floor(Math.random()*current.symbols.length)])}
function setReels(values){document.querySelectorAll(".reel").forEach((el,i)=>{el.innerHTML=symbolMarkup(values[i%values.length]);el.classList.remove("reel-win")})}
function weightedSymbol(){const weights=current.symbols.map(s=>Math.max(1,Math.round(100/(current.payouts[s]||1))));const total=weights.reduce((a,b)=>a+b,0);let r=Math.random()*total;for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0)return current.symbols[i]}return current.symbols.at(-1)}
function outcome(){return Array.from({length:+current.layout.split("x")[0]*+current.layout.split("x")[1]},()=>weightedSymbol())}
function calculateWin(r){
 const cols=+current.layout.split("x")[0], rows=+current.layout.split("x")[1];
 let wins=0;
 for(let row=0;row<rows;row++){const line=r.slice(row*cols,(row+1)*cols);if(line.length===cols&&line.every(x=>x===line[0]))wins+=bet*(current.payouts[line[0]]||0)}
 return wins;
}
async function spin(){
 if(spinning)return;if(balance<bet){toast("NEMÁŠ DOSTATEK TOKENŮ");return}
 spinning=true;$("spinBtn").disabled=true;balance-=bet;updateBalances();$("machineResult").textContent="SPINNING...";
 const reels=[...document.querySelectorAll(".reel")];
 for(let round=0;round<18;round++){reels.forEach(el=>el.innerHTML=symbolMarkup(current.symbols[Math.floor(Math.random()*current.symbols.length)]));reels.forEach(el=>el.classList.add("reel-spin"));await new Promise(r=>setTimeout(r,45+round*3));}
 reels.forEach(el=>el.classList.remove("reel-spin"));
 const r=outcome();setReels(r);const win=calculateWin(r);balance+=win;
 if(win){$("machineResult").textContent=`WIN +${fmt(win)} TOKENS`;reels.slice(0,Math.min(6,reels.length)).forEach(el=>el.classList.add("reel-win"));toast(`🎉 VÝHRA +${fmt(win)} TOKENŮ`)}else $("machineResult").textContent="NO WIN — TRY AGAIN";
 history.unshift({game:current.name,bet,win,time:new Date().toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})});history=history.slice(0,25);$("lastWin").textContent=fmt(win);updateBalances();spinning=false;$("spinBtn").disabled=false;
}
function updateBalances(){$("balance").textContent=fmt(balance);$("gameBalance").textContent=fmt(balance)}
function setBet(v){if(v==="half")bet=Math.max(current.min,Math.floor(bet/2));else if(v==="min")bet=current.min;else bet=Math.min(current.max,Math.max(current.min,bet*v));updateBetUI()}
function adjustBet(dir){const step=Math.max(current.min,Math.round(bet*.25));bet=Math.max(current.min,Math.min(current.max,bet+dir*step));updateBetUI()}
function updateBetUI(){$("betValue").textContent=fmt(bet);$("machineBetLabel").textContent=fmt(bet);$("maxWin").textContent=fmt(bet*Math.max(...Object.values(current.payouts)))}
function toggleSound(){sound=!sound;$("soundBtn").textContent=sound?"♫":"🔇";toast(sound?"SOUND ON":"SOUND OFF")}
function toggleFullscreen(){if(!document.fullscreenElement)$("gameOverlay").requestFullscreen?.();else document.exitFullscreen?.()}
function openPaytable(){const g=current||games[0];$("paytableTitle").textContent=g.name.toUpperCase();$("paytableContent").innerHTML=Object.entries(g.payouts).map(([s,m])=>`<div class="pay-row"><span class="pay-symbol">${s}</span><span>3 × ${s}</span><b>x${m}</b></div>`).join("")+`<div class="pay-note">${g.layout} • ${g.lines} lines • RTP ${g.rtp}% • Min ${fmt(g.min)} • Max ${fmt(g.max)}</div>`;$("paytableOverlay").classList.remove("hidden")}
function closePaytable(){$("paytableOverlay").classList.add("hidden")}
function openRewards(){$("panelContent").innerHTML=`<div class="eyebrow gold">REWARDS</div><h2>FASTCASH <em>VIP</em></h2><div class="reward-level"><b>BRONZE</b><span>0 / 10,000 XP</span></div><div class="progress"><i style="width:18%"></i></div><div class="reward-grid"><div>♛<b>VIP TABLES</b><small>Coming soon</small></div><div>★<b>DAILY BONUS</b><small>250 tokens</small></div><div>◆<b>EXCLUSIVE SLOTS</b><small>Unlock at VIP</small></div></div>`;$("panelOverlay").classList.remove("hidden")}
function openStats(){const spins=history.length,wins=history.reduce((a,x)=>a+x.win,0),bets=history.reduce((a,x)=>a+x.bet,0);$("panelContent").innerHTML=`<div class="eyebrow gold">PLAYER STATS</div><h2>YOUR <em>SESSION</em></h2><div class="stats-big"><div><b>${spins}</b><small>SPINS</small></div><div><b>${fmt(bets)}</b><small>WAGERED</small></div><div><b>${fmt(wins)}</b><small>WON</small></div></div><h3>RECENT SPINS</h3><div class="history">${history.length?history.map(x=>`<div><span>${x.game}</span><small>${x.time}</small><b class="${x.win?'win':''}">${x.win?"+":""}${fmt(x.win-x.bet)}</b></div>`).join(""):"No spins yet."}</div>`;$("panelOverlay").classList.remove("hidden")}
function openHelp(){$("panelContent").innerHTML=`<div class="eyebrow gold">HELP</div><h2>HOW TO <em>PLAY</em></h2><div class="help"><p><b>1.</b> Choose a slot from the lobby.</p><p><b>2.</b> Set your bet with −/+ or quick bets.</p><p><b>3.</b> Press SPIN and complete a winning line.</p><p><b>4.</b> Use +10,000 at the top while testing the demo.</p></div>`;$("panelOverlay").classList.remove("hidden")}
function closePanel(){$("panelOverlay").classList.add("hidden")}
function claimDaily(){if(dailyClaimed){toast("DNEŠNÍ ODMĚNA UŽ BYLA VYZVEDNUTA");return}dailyClaimed=true;balance+=250;updateBalances();toast("🎁 +250 TOKENŮ — DAILY REWARD")}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2500)}
const ticker=["Mikey hit 2,500 tokens on Lucky Sevens","Vinnie won 8,000 tokens on Diamond Rush","Sofia hit a 3x jackpot on Ocean Drive","Tony just spun High Roller for 5,000","CJ won 1,250 tokens on Blazing Fruits"];let ti=0;setInterval(()=>{ti=(ti+1)%ticker.length;$("tickerText").textContent=ticker[ti]},4000);
renderGames();updateBalances();

/* ===== FASTCASH TEXAS HOLD'EM DEMO =====
   Browser demo uses play-money TOKENS. For real shared multiplayer,
   move this engine to the authoritative backend before deployment.
*/
const pokerSuits=["♠","♥","♦","♣"], pokerRanks=["2","3","4","5","6","7","8","9","T","J","Q","K","A"];
const pokerState={
  seats:[{name:"YOU",human:true,stack:20000},{name:"Mikey",human:false,stack:20000},{name:"Vinnie",human:false,stack:20000},{name:"Sofia",human:false,stack:20000}],
  dealer:0, smallBlind:100,bigBlind:200, deck:[],board:[],pot:0,currentBet:0,minRaise:200,currentSeat:null,
  street:"waiting",handNo:0,actionToken:0,started:false
};
function pokerCard(code){return {r:code.slice(0,-1),s:code.slice(-1)}}
function pokerMakeDeck(){return pokerRanks.flatMap(r=>pokerSuits.map(s=>({r,s})));}
function pokerShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pokerRankValue(r){return pokerRanks.indexOf(r)+2}
function pokerCardHTML(c,back=false){
  if(back)return '<div class="poker-card back">✦</div>';
  const red=c.s==="♥"||c.s==="♦";
  return `<div class="poker-card ${red?"red":""}"><span>${c.r}</span><span class="suit">${c.s}</span></div>`;
}
function pokerNext(seat,includeFolded=false){
  for(let i=1;i<=pokerState.seats.length;i++){const n=(seat+i)%4,p=pokerState.seats[n];if(p.stack>0&&!p.allIn&&(includeFolded||!p.folded))return n}
  return null;
}
function pokerActive(){return pokerState.seats.filter(p=>!p.folded)}
function pokerCanAct(){return pokerState.seats.filter(p=>!p.folded&&!p.allIn&&p.stack>=0)}
function pokerBestFive(cards){
  if(cards.length<5)return {rank:0,name:"High Card",score:[0]};
  let best=null;
  for(let a=0;a<cards.length-4;a++)for(let b=a+1;b<cards.length-3;b++)for(let c=b+1;c<cards.length-2;c++)for(let d=c+1;d<cards.length-1;d++)for(let e=d+1;e<cards.length;e++){
    const five=[cards[a],cards[b],cards[c],cards[d],cards[e]], vals=five.map(x=>pokerRankValue(x.r)).sort((x,y)=>y-x);
    const counts={}; vals.forEach(v=>counts[v]=(counts[v]||0)+1);
    const groups=Object.entries(counts).map(([v,n])=>({v:+v,n})).sort((x,y)=>y.n-x.n||y.v-x.v);
    const suits=five.map(x=>x.s); const flush=suits.every(s=>s===suits[0]);
    const unique=[...new Set(vals)].sort((x,y)=>y-x); let straightHigh=0;
    if(unique.includes(14))unique.push(1);
    for(let i=0;i<=unique.length-5;i++){if(unique.slice(i,i+5).every((v,j)=>v===unique[i]-j)){straightHigh=unique[i];break}}
    let rank=0,score=[];
    if(straightHigh&&flush){rank=8;score=[8,straightHigh]}
    else if(groups[0].n===4){rank=7;score=[7,groups[0].v,...groups.slice(1).map(g=>g.v)]}
    else if(groups[0].n===3&&groups.some(g=>g.n===2)){rank=6;const tr=groups.find(g=>g.n===3).v,pa=groups.find(g=>g.n===2).v;score=[6,tr,pa]}
    else if(flush){rank=5;score=[5,...vals]}
    else if(straightHigh){rank=4;score=[4,straightHigh]}
    else if(groups[0].n===3){rank=3;score=[3,groups[0].v,...groups.filter(g=>g.n===1).map(g=>g.v).sort((x,y)=>y-x)]}
    else {const pairs=groups.filter(g=>g.n===2).sort((x,y)=>y.v-x.v);if(pairs.length>=2){rank=2;score=[2,pairs[0].v,pairs[1].v,...groups.filter(g=>g.n===1).map(g=>g.v)]}else if(pairs.length===1){rank=1;score=[1,pairs[0].v,...groups.filter(g=>g.n===1).map(g=>g.v).sort((x,y)=>y-x)]}else{rank=0;score=[0,...vals]}}
    if(!best||pokerCompareScore(score,best.score)>0)best={rank,name:pokerHandName(rank),score,bestFive:five};
  }
  return best;
}
function pokerCompareScore(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const x=a[i]||0,y=b[i]||0;if(x!==y)return x>y?1:-1}return 0}
function pokerHandName(r){return ["High Card","Pair","Two Pair","Three of a Kind","Straight","Flush","Full House","Four of a Kind","Straight Flush"][r]||"High Card"}
function pokerBuildPots(){
  const levels=[...new Set(pokerState.seats.map(p=>p.totalBet).filter(x=>x>0))].sort((a,b)=>a-b);let prev=0;
  return levels.map(level=>{const contributors=pokerState.seats.filter(p=>p.totalBet>=level);const amount=(level-prev)*contributors.length;const eligible=contributors.filter(p=>!p.folded);prev=level;return {amount,eligible}})
}
function pokerDealOne(){return pokerState.deck.pop()}
function pokerStartVisual(){
  pokerState.deck=pokerShuffle(pokerMakeDeck());pokerState.board=[];pokerState.pot=0;pokerState.currentBet=0;pokerState.minRaise=pokerState.bigBlind;
  pokerState.seats.forEach(p=>{p.hole=[];p.folded=p.stack<=0;p.allIn=false;p.streetBet=0;p.totalBet=0;p.lastAction=""});
  pokerState.dealer=(pokerState.dealer+1)%4;
  const sb=(pokerState.dealer+1)%4,bb=(pokerState.dealer+2)%4;
  pokerState.seats.forEach(p=>p.handStartStack=p.stack);
  for(let i=0;i<4;i++){const p=pokerState.seats[i];if(!p.folded){p.hole=[pokerDealOne(),pokerDealOne()]}}
  pokerPostBlind(sb,pokerState.smallBlind);pokerPostBlind(bb,pokerState.bigBlind);
  pokerState.currentBet=pokerState.bigBlind;pokerState.minRaise=pokerState.bigBlind;pokerState.street="preflop";pokerState.handNo++;
  pokerState.currentSeat=pokerFindFirstToAct((bb+1)%4);
  pokerState.started=true;pokerState.actionToken++;
  pokerRender();pokerSay("Cards are in. Good luck.");pokerRunAI();
}
function pokerPostBlind(seat,amount){const p=pokerState.seats[seat];if(p.folded)return;const pay=Math.min(amount,p.stack);p.stack-=pay;p.streetBet=pay;p.totalBet=pay;p.allIn=p.stack===0;p.lastAction=amount===pokerState.bigBlind?"BIG BLIND":"SMALL BLIND"}
function pokerFindFirstToAct(start){
  for(let i=0;i<4;i++){const n=(start+i)%4,p=pokerState.seats[n];if(!p.folded&&!p.allIn)return n}
  return null;
}
function pokerResetStreet(){pokerState.seats.forEach(p=>p.streetBet=0);pokerState.currentBet=0;pokerState.minRaise=pokerState.bigBlind}
function pokerBurn(){if(pokerState.deck.length)pokerState.deck.pop()}
function pokerAdvanceStreet(){
  const order={preflop:"flop",flop:"turn",turn:"river",river:"showdown"};const next=order[pokerState.street];
  if(next==="showdown"){pokerShowdown();return}
  pokerBurn();
  const count=next==="flop"?3:1;for(let i=0;i<count;i++)pokerState.board.push(pokerDealOne());
  pokerResetStreet();pokerState.street=next;pokerState.currentSeat=pokerFindFirstToAct((pokerState.dealer+1)%4);
  pokerState.actionToken++;pokerRender();pokerSay(next==="flop"?"Flop is out.":next==="turn"?"Turn card.":"River.");pokerRunAI();
}
function pokerRoundComplete(){
  const live=pokerState.seats.filter(p=>!p.folded);
  if(live.length<=1)return true;
  return live.every(p=>p.allIn||p.streetBet===pokerState.currentBet);
}
function pokerMaybeAdvance(){
  const live=pokerState.seats.filter(p=>!p.folded);
  if(live.length<=1){pokerShowdown();return}
  if(pokerRoundComplete())pokerAdvanceStreet();
}
function pokerCommit(p,amount){
  const pay=Math.max(0,Math.min(amount,p.stack));p.stack-=pay;p.streetBet+=pay;p.totalBet+=pay;
  if(p.stack===0)p.allIn=true;pokerState.pot=pokerState.seats.reduce((s,x)=>s+x.totalBet,0);return pay;
}
function pokerAction(action,forcedAmount=null){
  const p=pokerState.seats[pokerState.currentSeat];
  if(!p||!p.human||p.folded||p.allIn||pokerState.currentSeat!==0)return;
  const toCall=Math.max(0,pokerState.currentBet-p.streetBet);
  if(action==="fold"){p.folded=true;p.lastAction="FOLD";pokerSay("Fold.");}
  else if(action==="check"){if(toCall>0){toast("CHECK NENÍ MOŽNÝ");return}p.lastAction="CHECK";pokerSay("Check.");}
  else if(action==="call"){if(toCall<=0){p.lastAction="CHECK"}else{pokerCommit(p,toCall);p.lastAction="CALL";pokerSay("Call.");}}
  else if(action==="raise"){
    let target=Number(forcedAmount||$("raiseAmount").value);if(!Number.isFinite(target))return;
    const minTarget=pokerState.currentBet+pokerState.minRaise;
    target=Math.max(target,minTarget);target=Math.min(target,p.streetBet+p.stack);
    const add=target-p.streetBet;if(add<=0){toast("NEPLATNÁ SÁZKA");return}
    pokerCommit(p,add);const raiseSize=target-pokerState.currentBet;pokerState.currentBet=target;if(raiseSize>0)pokerState.minRaise=raiseSize;p.lastAction="RAISE";pokerSay(`Raise na ${fmt(target)}.`);
  }else if(action==="allin"){
    const target=p.streetBet+p.stack;const old=pokerState.currentBet;pokerCommit(p,p.stack);if(target>old){const raiseSize=target-old;pokerState.currentBet=target;if(raiseSize>=pokerState.minRaise)pokerState.minRaise=raiseSize}p.lastAction="ALL-IN";pokerSay("All-in.");}
  pokerState.pot=pokerState.seats.reduce((s,x)=>s+x.totalBet,0);
  if(pokerState.currentSeat!==null){pokerState.currentSeat=pokerFindFirstToAct((pokerState.currentSeat+1)%4)}
  pokerState.actionToken++;pokerRender();pokerMaybeAdvance();if(pokerState.started)pokerRunAI();
}
function pokerAIAction(seat){
  const p=pokerState.seats[seat];if(!p||p.folded||p.allIn)return;
  const toCall=Math.max(0,pokerState.currentBet-p.streetBet);
  const seven=pokerBestFive([...p.hole,...pokerState.board]).rank;
  const roll=Math.random();
  if(toCall>p.stack){pokerCommit(p,p.stack);p.allIn=true;p.lastAction="ALL-IN"}
  else if(seven>=5&&roll<.58){const target=Math.min(p.streetBet+p.stack,pokerState.currentBet+pokerState.minRaise*2);const add=target-p.streetBet;pokerCommit(p,add);if(target>pokerState.currentBet){const rs=target-pokerState.currentBet;pokerState.currentBet=target;if(rs>=pokerState.minRaise)pokerState.minRaise=rs}p.lastAction="RAISE"}
  else if(seven>=2&&roll<.78){if(toCall>0)pokerCommit(p,toCall);p.lastAction=toCall>0?"CALL":"CHECK"}
  else if(toCall===0||roll<.36){p.lastAction="CHECK"}
  else {p.folded=true;p.lastAction="FOLD"}
  pokerState.pot=pokerState.seats.reduce((s,x)=>s+x.totalBet,0);
  pokerState.currentSeat=pokerFindFirstToAct((seat+1)%4);pokerState.actionToken++;pokerRender();
}
let pokerAITimer=null;
function pokerRunAI(){
  clearTimeout(pokerAITimer);if(!pokerState.started)return;
  if(pokerState.currentSeat===null){pokerMaybeAdvance();return}
  const p=pokerState.seats[pokerState.currentSeat];
  if(!p||p.folded||p.allIn){pokerState.currentSeat=pokerFindFirstToAct((pokerState.currentSeat+1)%4);pokerRunAI();return}
  if(p.human){pokerUpdateControls();return}
  const token=pokerState.actionToken;pokerAITimer=setTimeout(()=>{if(token!==pokerState.actionToken)return;pokerAIAction(pokerState.currentSeat);pokerMaybeAdvance();pokerRunAI()},650+Math.random()*700);
}
function pokerShowdown(){
  clearTimeout(pokerAITimer);pokerState.street="showdown";pokerState.currentSeat=null;pokerState.pot=pokerState.seats.reduce((s,x)=>s+x.totalBet,0);
  const live=pokerState.seats.filter(p=>!p.folded);
  if(live.length===1){const w=live[0];w.stack+=pokerState.pot;pokerState.pot=0;pokerSay(`${w.name} wins by fold.`);pokerState.started=false;pokerRender();$("pokerLastResult").textContent=`${w.name} won ${fmt(w.totalBet+live.reduce((s,x)=>s+x.totalBet,0))} TOKENS`;setTimeout(()=>pokerPrepareStacks(),2200);return}
  const pots=pokerBuildPots();const winners=[];
  pots.forEach(pot=>{
    const scored=pot.eligible.map(p=>({p,hand:pokerBestFive([...p.hole,...pokerState.board])}));let best=scored[0].hand;
    scored.slice(1).forEach(x=>{if(pokerCompareScore(x.hand.score,best.score)>0)best=x.hand});
    const ws=scored.filter(x=>pokerCompareScore(x.hand.score,best.score)===0).map(x=>x.p);
    let share=Math.floor(pot.amount/ws.length),rem=pot.amount-share*ws.length;ws.forEach(w=>{w.stack+=share;w.payout=(w.payout||0)+share});for(let i=0;i<ws.length&&rem>0;i++,rem--)ws[(pokerState.dealer+1+i)%ws.length].stack+=1;
    winners.push(...ws.map(w=>({name:w.name,amount:Math.floor(pot.amount/ws.length),hand:best.name})));
  });
  const unique={};winners.forEach(w=>unique[w.name]=w);const text=Object.values(unique).map(w=>`${w.name}: ${w.hand} +${fmt(w.amount)}`).join(" • ");
  $("pokerLastResult").textContent=text;pokerSay(Object.values(unique).map(w=>`${w.name} wins with ${w.hand}`).join(" / "));pokerState.pot=0;pokerState.started=false;pokerRender();
  setTimeout(()=>pokerPrepareStacks(),2600);
}
function pokerPrepareStacks(){pokerState.seats.forEach(p=>{p.stack=Math.max(0,p.stack);p.payout=0});if(pokerState.seats[0].stack<200){pokerState.seats[0].stack+=10000;toast("＋10,000 TOKENS doplněno pro poker demo");}pokerState.started=false;pokerState.street="waiting";pokerRender()}
function pokerSay(text){const el=$("dealerSpeech");if(el)el.textContent=text}
function pokerRender(){
  const st=pokerState.street.toUpperCase();$("pokerStreet").textContent=st;$("pokerPot").textContent=fmt(pokerState.pot);$("pokerStack").textContent=fmt(pokerState.seats[0].stack);
  $("communityCards").innerHTML=pokerState.board.map(c=>pokerCardHTML(c)).join("");
  pokerState.seats.forEach((p,i)=>{
    const el=$("seat"+i);if(!el)return;
    const reveal=i===0||pokerState.street==="showdown";
    el.className=`seat seat-${i} ${p.folded?"folded":""} ${pokerState.currentSeat===i?"active":""}`;
    const hole=p.hole.length?p.hole.map(c=>pokerCardHTML(c,!reveal)).join(""):"";
    const hand=(pokerState.street==="showdown"&&!p.folded)?pokerBestFive([...p.hole,...pokerState.board]).name:"";
    el.innerHTML=`<div class="seat-name"><span>${p.name}${p.human?" <small>(YOU)</small>":""}</span><small>${p.lastAction||"READY"}</small></div><div class="seat-stack">${fmt(p.stack)} TOKENS</div><div class="hole-cards">${hole}</div>${hand?`<div style="font-size:8px;color:#f7c84a;margin-top:4px">${hand}</div>`:""}<div class="seat-bet">${p.streetBet?fmt(p.streetBet):""}</div>`;
  });
  $("dealer3d").classList.toggle("active",pokerState.currentSeat===0);
  pokerUpdateControls();
}
function pokerUpdateControls(){
  const p=pokerState.seats[0],myTurn=pokerState.started&&pokerState.currentSeat===0&&!p.folded&&!p.allIn;
  const toCall=Math.max(0,pokerState.currentBet-p.streetBet);$("pokerToCall").textContent=fmt(toCall);$("callAmount").textContent=fmt(toCall);
  $("pokerActionText").textContent=myTurn?(toCall?"YOUR MOVE":"CHECK OR RAISE"):(pokerState.started?"DEALER / OPPONENT":"WAITING");
  ["foldBtn","checkBtn","callBtn","raiseBtn","allinBtn"].forEach(id=>$(id).disabled=!myTurn);
  $("checkBtn").textContent=toCall?"CHECK": "CHECK";$("callBtn").textContent=toCall?`CALL ${fmt(toCall)}`:"CHECK";
  const minRaise=pokerState.currentBet+pokerState.minRaise;$("raiseAmount").min=minRaise;$("raiseAmount").value=Math.max(minRaise,Number($("raiseAmount").value)||minRaise);
}
function openPoker(){ $("pokerOverlay").classList.remove("hidden");pokerPrepareStacks();if(!pokerState.started)startPokerHand(false)}
function closePoker(){clearTimeout(pokerAITimer);$("pokerOverlay").classList.add("hidden")}
function startPokerHand(force=false){
  if(pokerState.started&&!force)return;
  if(force){clearTimeout(pokerAITimer);pokerState.started=false;pokerState.seats.forEach(p=>{if(p.stack<200)p.stack+=10000})}
  pokerStartVisual();
}
