const games = [
  {id:"los-santos",name:"Los Santos Legends",tag:"HOT",type:"hot",rtp:95,min:25,max:5000,theme:"sunset",symbols:["🚔","💵","🔫","🌴","7"],payouts:{"7":50,"💵":25,"🔫":15,"🌴":8,"🚔":5}},
  {id:"vinewood",name:"Vinewood Nights",tag:"NEW",type:"new",rtp:96,min:10,max:3000,theme:"pink",symbols:["💋","🎬","💎","🍸","7"],payouts:{"7":40,"💎":20,"💋":12,"🎬":8,"🍸":5}},
  {id:"cash-cartel",name:"Cash Cartel",tag:"POPULAR",type:"hot",rtp:95,min:25,max:7500,theme:"gold",symbols:["💰","💵","🔫","🚘","7"],payouts:{"7":50,"💰":30,"💵":15,"🔫":8,"🚘":5}},
  {id:"diamond",name:"Diamond Rush",tag:"JACKPOT",type:"vip",rtp:94,min:50,max:10000,theme:"blue",symbols:["💎","♣️","♦️","🪙","7"],payouts:{"7":60,"💎":35,"🪙":15,"♦️":8,"♣️":5}},
  {id:"lucky",name:"Lucky Sevens",tag:"CLASSIC",type:"hot",rtp:95,min:10,max:5000,theme:"red",symbols:["7","7","BAR","🍒","🔔"],payouts:{"7":50,"BAR":20,"🍒":8,"🔔":5}},
  {id:"street",name:"Street Racers",tag:"NEW",type:"new",rtp:96,min:10,max:4000,theme:"cyan",symbols:["🏎️","🏁","💨","🔥","7"],payouts:{"7":45,"🏎️":25,"🔥":12,"🏁":7,"💨":4}},
  {id:"high-roller",name:"High Roller",tag:"VIP",type:"vip",rtp:93,min:100,max:20000,theme:"blackgold",symbols:["🥂","🎲","💰","♠️","7"],payouts:{"7":75,"💰":30,"🥂":15,"🎲":10,"♠️":5}},
  {id:"fruits",name:"Blazing Fruits",tag:"POPULAR",type:"hot",rtp:96,min:5,max:2500,theme:"orange",symbols:["🍒","🍉","🍋","🍊","7"],payouts:{"7":35,"🍉":15,"🍒":8,"🍊":5,"🍋":3}},
  {id:"mafia",name:"Mafia Fortune",tag:"EXCLUSIVE",type:"vip",rtp:94,min:50,max:15000,theme:"mafia",symbols:["🕶️","💰","🚘","🥃","7"],payouts:{"7":70,"💰":30,"🕶️":15,"🥃":8,"🚘":5}},
  {id:"ocean",name:"Ocean Drive",tag:"CHILL",type:"new",rtp:96,min:10,max:5000,theme:"ocean",symbols:["🌴","🌊","🚘","💎","7"],payouts:{"7":45,"💎":20,"🌊":12,"🌴":7,"🚘":4}}
];

let balance=10000;
let current=null;
let bet=100;
let spinning=false;
let sound=true;
let history=[];
let dailyClaimed=false;

const $=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString("cs-CZ");

function renderGames(filter="all"){
  $("gameGrid").innerHTML=games.filter(g=>filter==="all"||g.type===filter).map((g,i)=>`
    <button class="game-card theme-${g.theme}" onclick="openGame('${g.id}')">
      <div class="card-art">
        <div class="city-glow"></div>
        <div class="card-symbols">${g.symbols.slice(0,3).join(" ")}</div>
        <div class="card-label">${g.name.toUpperCase()}</div>
        <div class="badge badge-${g.type}">${g.tag}</div>
      </div>
      <div class="card-info">
        <div><b>${g.name}</b><small>${g.min}–${fmt(g.max)} TOKENS</small></div>
        <span class="play-arrow">→</span>
      </div>
    </button>`).join("");
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); renderGames(btn.dataset.filter);
}));

function showLobby(){closeGame();closePanel();window.scrollTo({top:0,behavior:"smooth"})}
function scrollToGames(){$("gamesSection").scrollIntoView({behavior:"smooth"})}

function openGame(id){
  current=games.find(g=>g.id===id);
  bet=Math.max(current.min,Math.min(current.max,bet));
  $("gameTitle").textContent=current.name.toUpperCase();
  $("gameTag").textContent=current.tag+" • SLOT GAME";
  $("gameRtp").textContent=`RTP ${current.rtp}%`;
  $("neonSign").innerHTML=current.name.split(" ").slice(0,-1).join(" ")+"<br><span>"+current.name.split(" ").at(-1).toUpperCase()+"</span>";
  $("betValue").textContent=fmt(bet);
  $("machineBetLabel").textContent=fmt(bet);
  $("gameBalance").textContent=fmt(balance);
  $("maxWin").textContent=fmt(bet*Math.max(...Object.values(current.payouts)));
  setReels([current.symbols[0],current.symbols[1],current.symbols[2]]);
  $("machineResult").textContent="READY TO SPIN";
  $("gameOverlay").classList.remove("hidden");
}
function closeGame(){if(!spinning)$("gameOverlay").classList.add("hidden")}
function setBet(mult){
  bet=Math.round(Math.max(current.min,Math.min(current.max,(mult===1?current.min:bet*mult)))/5)*5;
  if(bet<current.min)bet=current.min;
  updateBetUI();
}
function adjustBet(dir){
  const step=Math.max(current.min,Math.round(bet*.25));
  bet=Math.max(current.min,Math.min(current.max,bet+dir*step)); updateBetUI();
}
function updateBetUI(){
  $("betValue").textContent=fmt(bet);$("machineBetLabel").textContent=fmt(bet);
  $("maxWin").textContent=fmt(bet*Math.max(...Object.values(current.payouts)));
}
function weightedSymbol(){
  const weights=current.symbols.map(s=>Math.max(1,Math.round(100/(current.payouts[s]||1))));
  const total=weights.reduce((a,b)=>a+b,0);let r=Math.random()*total;
  for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0)return current.symbols[i]}
  return current.symbols.at(-1);
}
function outcome(){
  const r=[weightedSymbol(),weightedSymbol(),weightedSymbol()];
  return r;
}
function calculateWin(r){
  if(r[0]!==r[1]||r[1]!==r[2])return 0;
  return bet*(current.payouts[r[0]]||0);
}
function setReels(r){
  r.forEach((v,i)=>{const el=$("reel"+i);el.textContent=v;el.classList.remove("reel-win")})
}
async function spin(){
  if(spinning)return;
  if(balance<bet){toast("NEMÁŠ DOSTATEK TOKENŮ");return}
  spinning=true;$("spinBtn").disabled=true;
  balance-=bet;updateBalances();
  $("machineResult").textContent="SPINNING...";
  const reelEls=[$("reel0"),$("reel1"),$("reel2")];
  for(let round=0;round<20;round++){
    reelEls.forEach(el=>{el.classList.add("reel-spin");el.textContent=current.symbols[Math.floor(Math.random()*current.symbols.length)]});
    await new Promise(r=>setTimeout(r,45+round*4));
  }
  const r=outcome(); setReels(r);
  const win=calculateWin(r);
  balance+=win;
  if(win){
    $("machineResult").textContent=`WIN +${fmt(win)} TOKENS`;
    r.forEach((x,i)=>{$("reel"+i).classList.add("reel-win")});
    toast(`🎉 VÝHRA +${fmt(win)} TOKENŮ`);
  }else $("machineResult").textContent="NO WIN — TRY AGAIN";
  history.unshift({game:current.name,bet,win,time:new Date().toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})});
  history=history.slice(0,25);
  $("lastWin").textContent=fmt(win); updateBalances();
  spinning=false;$("spinBtn").disabled=false;
}
function updateBalances(){
  $("balance").textContent=fmt(balance);$("gameBalance").textContent=fmt(balance);
}
function toggleSound(){sound=!sound;$("soundBtn").textContent=sound?"♫":"🔇";toast(sound?"SOUND ON":"SOUND OFF")}
function toggleFullscreen(){
  const el=$("gameOverlay"); if(!document.fullscreenElement)el.requestFullscreen?.();else document.exitFullscreen?.();
}
function openPaytable(){
  $("paytableTitle").textContent=current?current.name.toUpperCase():"PAYTABLE";
  const g=current||games[0];
  $("paytableContent").innerHTML=Object.entries(g.payouts).map(([s,m])=>`<div class="pay-row"><span class="pay-symbol">${s}</span><span>3 × ${s}</span><b>x${m}</b></div>`).join("")+`<div class="pay-note">RTP ${g.rtp}% • Min bet ${fmt(g.min)} • Max bet ${fmt(g.max)}</div>`;
  $("paytableOverlay").classList.remove("hidden");
}
function closePaytable(){$("paytableOverlay").classList.add("hidden")}
function openRewards(){
  $("panelContent").innerHTML=`<div class="eyebrow gold">REWARDS</div><h2>FASTCASH <em>VIP</em></h2><div class="reward-level"><b>BRONZE</b><span>0 / 10,000 XP</span></div><div class="progress"><i style="width:18%"></i></div><div class="reward-grid"><div>🎁<b>Daily Bonus</b><small>250 tokens</small></div><div>♛<b>VIP Tables</b><small>Coming soon</small></div><div>💎<b>Exclusive Slots</b><small>Unlocked at VIP</small></div></div>`;
  $("panelOverlay").classList.remove("hidden");
}
function openStats(){
  const spins=history.length, wins=history.reduce((a,x)=>a+x.win,0), bets=history.reduce((a,x)=>a+x.bet,0);
  $("panelContent").innerHTML=`<div class="eyebrow gold">PLAYER STATS</div><h2>YOUR <em>SESSION</em></h2><div class="stats-big"><div><b>${spins}</b><small>SPINS</small></div><div><b>${fmt(bets)}</b><small>WAGERED</small></div><div><b>${fmt(wins)}</b><small>WON</small></div></div><h3>RECENT SPINS</h3><div class="history">${history.length?history.map(x=>`<div><span>${x.game}</span><small>${x.time}</small><b class="${x.win?'win':''}">${x.win?"+":""}${fmt(x.win-x.bet)}</b></div>`).join(""):"No spins yet."}</div>`;
  $("panelOverlay").classList.remove("hidden");
}
function openHelp(){
  $("panelContent").innerHTML=`<div class="eyebrow gold">HELP</div><h2>HOW TO <em>PLAY</em></h2><div class="help"><p><b>1.</b> Choose a slot from the lobby.</p><p><b>2.</b> Set your bet using −/+ or quick bets.</p><p><b>3.</b> Press SPIN and match three symbols for a payout.</p><p><b>4.</b> The real online version will later connect these actions to the shared casino server.</p></div>`;
  $("panelOverlay").classList.remove("hidden");
}
function closePanel(){$("panelOverlay").classList.add("hidden")}
function claimDaily(){
  if(dailyClaimed){toast("DNEŠNÍ ODMĚNA UŽ BYLA VYZVEDNUTA");return}
  dailyClaimed=true;balance+=250;updateBalances();toast("🎁 +250 TOKENŮ — DAILY REWARD");
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2600)}

const ticker=["Mikey hit 2,500 tokens on Lucky Sevens","Vinnie won 8,000 tokens on Diamond Rush","Sofia hit a 3x jackpot on Ocean Drive","Tony just spun High Roller for 5,000","CJ won 1,250 tokens on Blazing Fruits"];
let ti=0;setInterval(()=>{ti=(ti+1)%ticker.length;$("tickerText").textContent=ticker[ti]},4000);

renderGames();
updateBalances();
