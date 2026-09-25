const games=[
{id:"multi-vegas-81",name:"Multi Vegas 81",tag:"CLASSIC",type:"hot",rtp:95,min:1,max:5000,theme:"mv81",layout:"4x3",lines:81,image:"mv81/multi-vegas-81.svg",symbols:["CHERRY","DOLLAR","ORANGE","PLUM","BELL","GRAPES","MELON","SEVEN","WILD"],payouts:{CHERRY:{3:1,4:2},DOLLAR:{3:1,4:4},ORANGE:{3:1,4:4},PLUM:{3:1,4:4},BELL:{3:1,4:4},GRAPES:{3:4,4:40},MELON:{3:6,4:60},SEVEN:{3:16,4:160}}},
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

const MV81_PATTERNS_3=Array.from({length:27},(_,n)=>[Math.floor(n/9)%3,Math.floor(n/3)%3,n%3]);
const MV81_PATTERNS_4=Array.from({length:81},(_,n)=>[Math.floor(n/27)%3,Math.floor(n/9)%3,Math.floor(n/3)%3,n%3]);
const MV81_SYMBOLS={
 CHERRY:{file:"cherry.svg",label:"CHERRY"},
 DOLLAR:{file:"dollar.svg",label:"$"},
 ORANGE:{file:"orange.svg",label:"ORANGE"},
 PLUM:{file:"plum.svg",label:"PLUM"},
 BELL:{file:"bell.svg",label:"BELL"},
 GRAPES:{file:"grapes.svg",label:"GRAPES"},
 MELON:{file:"melon.svg",label:"MELON"},
 SEVEN:{file:"seven.svg",label:"7"},
 WILD:{file:"wild.svg",label:"MULTI WILD"}
};
function isMV81(){return current?.id==="multi-vegas-81"}
function symbolMarkup(s){
 if(isMV81()){
   const q=MV81_SYMBOLS[s];
   return `<span class="slot-symbol mv81-symbol" data-symbol="${s}"><img src="assets/games/mv81/${q.file}" alt="${q.label}"></span>`;
 }
 return `<span class="slot-symbol sym-${s.toLowerCase()}">${s}</span>`;
}
function setReels(r){
  const cells=[...document.querySelectorAll("#reelFrame .reel")];
  cells.forEach((el,i)=>{
    const symbol=r[i];
    el.innerHTML=symbolMarkup(symbol);
    el.dataset.symbol=symbol || "";
  });
}
function randomReels(){
 const n=+current.layout.split("x")[0]*+current.layout.split("x")[1];
 return Array.from({length:n},()=>current.symbols[Math.floor(Math.random()*current.symbols.length)]);
}
const MV81_REEL_STRIPS=[
 ["CHERRY","DOLLAR","ORANGE","PLUM","BELL","GRAPES","MELON","SEVEN","CHERRY","DOLLAR","PLUM","BELL","GRAPES","ORANGE","SEVEN","MELON","CHERRY","WILD"],
 ["DOLLAR","CHERRY","ORANGE","PLUM","BELL","GRAPES","MELON","SEVEN","DOLLAR","PLUM","CHERRY","BELL","GRAPES","ORANGE","SEVEN","MELON","DOLLAR","WILD"],
 ["ORANGE","DOLLAR","CHERRY","PLUM","BELL","GRAPES","MELON","SEVEN","ORANGE","CHERRY","PLUM","BELL","GRAPES","DOLLAR","SEVEN","MELON","ORANGE","WILD"],
 ["PLUM","DOLLAR","ORANGE","CHERRY","BELL","GRAPES","MELON","SEVEN","PLUM","CHERRY","DOLLAR","BELL","GRAPES","ORANGE","SEVEN","MELON","PLUM","WILD"]
];
function weightedSymbol(){
 if(isMV81()) return MV81_REEL_STRIPS[Math.floor(Math.random()*4)][Math.floor(Math.random()*18)];
 const weights=current.symbols.map(s=>Math.max(1,Math.round(100/(current.payouts[s]||1))));
 const total=weights.reduce((a,b)=>a+b,0);let r=Math.random()*total;
 for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0)return current.symbols[i]}
 return current.symbols.at(-1)
}
const MV81_RTP_DISTRIBUTION=[
  [0,0.798275],[1,0.11],[4,0.04],[8,0.03],[16,0.020875],[40,0.0006],[160,0.0002],[1000,0.00005]
];
const MV81_RTP_TEMPLATES={"0":[["SEVEN","PLUM","PLUM","CHERRY","GRAPES","MELON","CHERRY","BELL","BELL","GRAPES","ORANGE","PLUM"],["GRAPES","CHERRY","PLUM","CHERRY","MELON","MELON","ORANGE","PLUM","BELL","WILD","DOLLAR","MELON"],["MELON","GRAPES","MELON","MELON","GRAPES","ORANGE","DOLLAR","BELL","CHERRY","BELL","SEVEN","WILD"],["DOLLAR","ORANGE","ORANGE","PLUM","DOLLAR","CHERRY","SEVEN","MELON","SEVEN","CHERRY","GRAPES","MELON"],["DOLLAR","CHERRY","GRAPES","DOLLAR","PLUM","DOLLAR","GRAPES","CHERRY","PLUM","GRAPES","BELL","PLUM"],["CHERRY","SEVEN","MELON","CHERRY","GRAPES","ORANGE","SEVEN","BELL","MELON","PLUM","BELL","MELON"],["PLUM","DOLLAR","BELL","MELON","SEVEN","MELON","BELL","ORANGE","CHERRY","SEVEN","PLUM","BELL"],["GRAPES","BELL","ORANGE","ORANGE","MELON","SEVEN","DOLLAR","PLUM","DOLLAR","BELL","GRAPES","GRAPES"],["SEVEN","CHERRY","DOLLAR","ORANGE","CHERRY","BELL","GRAPES","CHERRY","MELON","PLUM","SEVEN","DOLLAR"],["PLUM","CHERRY","SEVEN","GRAPES","DOLLAR","MELON","ORANGE","CHERRY","PLUM","DOLLAR","GRAPES","CHERRY"],["GRAPES","SEVEN","MELON","DOLLAR","PLUM","MELON","CHERRY","MELON","DOLLAR","ORANGE","PLUM","WILD"],["GRAPES","BELL","CHERRY","BELL","BELL","PLUM","ORANGE","DOLLAR","GRAPES","PLUM","CHERRY","GRAPES"],["WILD","DOLLAR","BELL","ORANGE","PLUM","CHERRY","BELL","GRAPES","BELL","ORANGE","GRAPES","PLUM"],["DOLLAR","CHERRY","GRAPES","PLUM","PLUM","PLUM","ORANGE","GRAPES","PLUM","CHERRY","ORANGE","MELON"],["BELL","BELL","DOLLAR","DOLLAR","ORANGE","MELON","MELON","DOLLAR","BELL","BELL","DOLLAR","CHERRY"],["SEVEN","DOLLAR","ORANGE","CHERRY","DOLLAR","ORANGE","CHERRY","ORANGE","BELL","CHERRY","PLUM","WILD"],["CHERRY","ORANGE","PLUM","ORANGE","SEVEN","DOLLAR","DOLLAR","BELL","SEVEN","BELL","ORANGE","MELON"],["MELON","MELON","BELL","MELON","ORANGE","BELL","CHERRY","PLUM","SEVEN","PLUM","BELL","CHERRY"],["GRAPES","MELON","MELON","GRAPES","CHERRY","GRAPES","BELL","MELON","SEVEN","CHERRY","DOLLAR","CHERRY"],["MELON","BELL","CHERRY","DOLLAR","DOLLAR","GRAPES","SEVEN","PLUM","CHERRY","SEVEN","ORANGE","ORANGE"]],"1":[["BELL","MELON","CHERRY","GRAPES","GRAPES","DOLLAR","SEVEN","BELL","CHERRY","CHERRY","PLUM","SEVEN"],["BELL","BELL","MELON","GRAPES","MELON","ORANGE","BELL","MELON","PLUM","PLUM","SEVEN","PLUM"],["DOLLAR","BELL","BELL","PLUM","BELL","PLUM","DOLLAR","MELON","DOLLAR","GRAPES","CHERRY","SEVEN"],["CHERRY","SEVEN","CHERRY","PLUM","DOLLAR","CHERRY","BELL","DOLLAR","DOLLAR","PLUM","DOLLAR","PLUM"],["SEVEN","CHERRY","BELL","GRAPES","CHERRY","BELL","MELON","BELL","SEVEN","PLUM","CHERRY","MELON"],["GRAPES","CHERRY","BELL","GRAPES","PLUM","SEVEN","SEVEN","ORANGE","CHERRY","PLUM","CHERRY","PLUM"],["PLUM","DOLLAR","DOLLAR","DOLLAR","ORANGE","ORANGE","ORANGE","SEVEN","MELON","SEVEN","MELON","PLUM"],["CHERRY","SEVEN","CHERRY","ORANGE","BELL","CHERRY","GRAPES","DOLLAR","PLUM","GRAPES","MELON","DOLLAR"],["DOLLAR","PLUM","ORANGE","DOLLAR","PLUM","BELL","GRAPES","MELON","DOLLAR","CHERRY","PLUM","CHERRY"],["MELON","BELL","BELL","MELON","GRAPES","CHERRY","DOLLAR","CHERRY","PLUM","PLUM","PLUM","GRAPES"],["PLUM","BELL","DOLLAR","SEVEN","DOLLAR","DOLLAR","CHERRY","CHERRY","BELL","CHERRY","ORANGE","ORANGE"],["DOLLAR","SEVEN","DOLLAR","GRAPES","ORANGE","GRAPES","ORANGE","CHERRY","GRAPES","DOLLAR","SEVEN","MELON"],["GRAPES","ORANGE","GRAPES","SEVEN","DOLLAR","SEVEN","ORANGE","GRAPES","ORANGE","PLUM","DOLLAR","GRAPES"],["ORANGE","GRAPES","ORANGE","SEVEN","DOLLAR","ORANGE","SEVEN","PLUM","CHERRY","PLUM","PLUM","PLUM"],["BELL","BELL","BELL","ORANGE","DOLLAR","CHERRY","SEVEN","ORANGE","SEVEN","CHERRY","PLUM","SEVEN"],["CHERRY","CHERRY","PLUM","PLUM","MELON","ORANGE","GRAPES","DOLLAR","PLUM","SEVEN","CHERRY","PLUM"],["DOLLAR","CHERRY","ORANGE","DOLLAR","CHERRY","MELON","CHERRY","ORANGE","ORANGE","GRAPES","PLUM","MELON"],["BELL","BELL","BELL","CHERRY","MELON","DOLLAR","ORANGE","MELON","GRAPES","SEVEN","DOLLAR","PLUM"],["GRAPES","BELL","BELL","DOLLAR","GRAPES","CHERRY","ORANGE","GRAPES","BELL","MELON","PLUM","SEVEN"],["CHERRY","ORANGE","GRAPES","SEVEN","GRAPES","MELON","DOLLAR","MELON","ORANGE","SEVEN","ORANGE","CHERRY"]],"4":[["GRAPES","PLUM","PLUM","BELL","MELON","GRAPES","PLUM","PLUM","DOLLAR","DOLLAR","GRAPES","DOLLAR"],["ORANGE","ORANGE","WILD","PLUM","SEVEN","DOLLAR","GRAPES","CHERRY","CHERRY","ORANGE","PLUM","PLUM"],["DOLLAR","DOLLAR","DOLLAR","ORANGE","CHERRY","DOLLAR","BELL","SEVEN","DOLLAR","PLUM","CHERRY","MELON"],["GRAPES","PLUM","SEVEN","CHERRY","PLUM","ORANGE","CHERRY","SEVEN","MELON","GRAPES","GRAPES","DOLLAR"],["GRAPES","GRAPES","MELON","MELON","ORANGE","CHERRY","PLUM","PLUM","ORANGE","CHERRY","GRAPES","PLUM"],["BELL","BELL","ORANGE","SEVEN","DOLLAR","DOLLAR","DOLLAR","ORANGE","ORANGE","DOLLAR","DOLLAR","BELL"],["GRAPES","BELL","BELL","PLUM","PLUM","DOLLAR","SEVEN","BELL","BELL","MELON","PLUM","ORANGE"],["CHERRY","DOLLAR","BELL","SEVEN","BELL","SEVEN","BELL","DOLLAR","CHERRY","CHERRY","WILD","ORANGE"],["GRAPES","ORANGE","GRAPES","ORANGE","WILD","CHERRY","PLUM","MELON","PLUM","CHERRY","CHERRY","MELON"],["DOLLAR","GRAPES","DOLLAR","DOLLAR","GRAPES","MELON","GRAPES","DOLLAR","CHERRY","PLUM","ORANGE","PLUM"],["GRAPES","GRAPES","SEVEN","BELL","BELL","BELL","CHERRY","DOLLAR","CHERRY","MELON","BELL","SEVEN"],["CHERRY","CHERRY","MELON","PLUM","PLUM","CHERRY","MELON","GRAPES","GRAPES","PLUM","PLUM","BELL"],["WILD","MELON","ORANGE","CHERRY","WILD","BELL","BELL","GRAPES","DOLLAR","GRAPES","CHERRY","PLUM"],["DOLLAR","CHERRY","DOLLAR","MELON","ORANGE","ORANGE","ORANGE","GRAPES","GRAPES","SEVEN","PLUM","ORANGE"],["GRAPES","SEVEN","ORANGE","MELON","BELL","DOLLAR","DOLLAR","ORANGE","WILD","CHERRY","DOLLAR","BELL"],["GRAPES","PLUM","CHERRY","CHERRY","BELL","GRAPES","GRAPES","MELON","PLUM","DOLLAR","DOLLAR","PLUM"],["DOLLAR","DOLLAR","DOLLAR","PLUM","BELL","GRAPES","PLUM","DOLLAR","MELON","SEVEN","BELL","MELON"],["PLUM","CHERRY","PLUM","MELON","CHERRY","DOLLAR","BELL","PLUM","ORANGE","PLUM","GRAPES","CHERRY"],["CHERRY","GRAPES","CHERRY","SEVEN","DOLLAR","CHERRY","CHERRY","MELON","CHERRY","PLUM","DOLLAR","ORANGE"],["CHERRY","GRAPES","ORANGE","MELON","DOLLAR","ORANGE","DOLLAR","SEVEN","MELON","DOLLAR","MELON","DOLLAR"]],"8":[["PLUM","BELL","BELL","DOLLAR","GRAPES","MELON","WILD","ORANGE","CHERRY","GRAPES","SEVEN","PLUM"],["WILD","GRAPES","SEVEN","MELON","MELON","PLUM","GRAPES","CHERRY","BELL","MELON","ORANGE","ORANGE"],["WILD","BELL","BELL","DOLLAR","WILD","MELON","ORANGE","DOLLAR","SEVEN","ORANGE","PLUM","GRAPES"],["PLUM","WILD","PLUM","DOLLAR","PLUM","SEVEN","DOLLAR","MELON","MELON","WILD","BELL","GRAPES"],["DOLLAR","CHERRY","SEVEN","GRAPES","DOLLAR","SEVEN","PLUM","WILD","PLUM","PLUM","CHERRY","BELL"],["WILD","GRAPES","PLUM","DOLLAR","PLUM","SEVEN","GRAPES","PLUM","DOLLAR","CHERRY","ORANGE","DOLLAR"],["PLUM","DOLLAR","PLUM","BELL","GRAPES","PLUM","ORANGE","PLUM","ORANGE","SEVEN","PLUM","SEVEN"],["ORANGE","MELON","BELL","ORANGE","BELL","DOLLAR","SEVEN","MELON","CHERRY","WILD","GRAPES","BELL"],["DOLLAR","MELON","GRAPES","CHERRY","GRAPES","PLUM","CHERRY","SEVEN","BELL","GRAPES","GRAPES","CHERRY"],["GRAPES","MELON","DOLLAR","GRAPES","SEVEN","DOLLAR","DOLLAR","DOLLAR","DOLLAR","CHERRY","CHERRY","ORANGE"],["MELON","GRAPES","MELON","MELON","BELL","SEVEN","WILD","SEVEN","GRAPES","PLUM","PLUM","PLUM"],["DOLLAR","DOLLAR","CHERRY","SEVEN","MELON","SEVEN","DOLLAR","SEVEN","GRAPES","DOLLAR","SEVEN","DOLLAR"],["DOLLAR","GRAPES","GRAPES","WILD","PLUM","BELL","PLUM","ORANGE","SEVEN","PLUM","DOLLAR","MELON"],["SEVEN","GRAPES","PLUM","PLUM","DOLLAR","DOLLAR","ORANGE","WILD","BELL","PLUM","DOLLAR","BELL"],["ORANGE","WILD","CHERRY","CHERRY","CHERRY","DOLLAR","CHERRY","DOLLAR","MELON","DOLLAR","PLUM","MELON"],["GRAPES","BELL","ORANGE","PLUM","BELL","GRAPES","GRAPES","BELL","DOLLAR","CHERRY","BELL","CHERRY"],["BELL","ORANGE","DOLLAR","GRAPES","DOLLAR","DOLLAR","PLUM","WILD","ORANGE","ORANGE","SEVEN","ORANGE"],["GRAPES","ORANGE","DOLLAR","PLUM","ORANGE","BELL","PLUM","GRAPES","ORANGE","ORANGE","WILD","PLUM"],["SEVEN","CHERRY","DOLLAR","SEVEN","MELON","BELL","CHERRY","ORANGE","ORANGE","ORANGE","WILD","PLUM"],["SEVEN","CHERRY","CHERRY","DOLLAR","WILD","MELON","GRAPES","BELL","MELON","DOLLAR","SEVEN","WILD"]],"16":[["ORANGE","PLUM","MELON","PLUM","SEVEN","DOLLAR","ORANGE","WILD","SEVEN","WILD","PLUM","PLUM"],["SEVEN","CHERRY","DOLLAR","ORANGE","PLUM","DOLLAR","PLUM","DOLLAR","BELL","SEVEN","SEVEN","CHERRY"],["GRAPES","SEVEN","SEVEN","ORANGE","SEVEN","ORANGE","GRAPES","MELON","ORANGE","PLUM","PLUM","BELL"],["DOLLAR","DOLLAR","MELON","GRAPES","PLUM","DOLLAR","DOLLAR","DOLLAR","BELL","WILD","SEVEN","CHERRY"],["MELON","BELL","PLUM","SEVEN","PLUM","ORANGE","CHERRY","BELL","PLUM","WILD","MELON","SEVEN"],["PLUM","SEVEN","CHERRY","DOLLAR","SEVEN","BELL","SEVEN","PLUM","PLUM","CHERRY","PLUM","GRAPES"],["DOLLAR","CHERRY","DOLLAR","SEVEN","DOLLAR","CHERRY","MELON","DOLLAR","PLUM","DOLLAR","DOLLAR","MELON"],["CHERRY","ORANGE","BELL","WILD","BELL","PLUM","PLUM","MELON","ORANGE","BELL","BELL","ORANGE"],["DOLLAR","BELL","GRAPES","ORANGE","WILD","ORANGE","ORANGE","CHERRY","DOLLAR","MELON","ORANGE","SEVEN"],["SEVEN","ORANGE","BELL","DOLLAR","MELON","DOLLAR","SEVEN","ORANGE","BELL","SEVEN","PLUM","MELON"],["PLUM","BELL","DOLLAR","DOLLAR","WILD","DOLLAR","DOLLAR","ORANGE","MELON","GRAPES","ORANGE","CHERRY"],["ORANGE","CHERRY","DOLLAR","PLUM","DOLLAR","DOLLAR","BELL","DOLLAR","ORANGE","MELON","DOLLAR","DOLLAR"],["SEVEN","CHERRY","MELON","CHERRY","SEVEN","ORANGE","WILD","ORANGE","ORANGE","ORANGE","BELL","DOLLAR"],["CHERRY","ORANGE","ORANGE","WILD","ORANGE","BELL","GRAPES","SEVEN","PLUM","ORANGE","MELON","DOLLAR"],["PLUM","ORANGE","WILD","MELON","GRAPES","GRAPES","SEVEN","ORANGE","ORANGE","DOLLAR","CHERRY","BELL"],["GRAPES","CHERRY","GRAPES","BELL","DOLLAR","WILD","DOLLAR","SEVEN","ORANGE","PLUM","BELL","DOLLAR"],["BELL","ORANGE","CHERRY","BELL","GRAPES","GRAPES","GRAPES","ORANGE","BELL","GRAPES","GRAPES","DOLLAR"],["PLUM","MELON","GRAPES","WILD","BELL","DOLLAR","DOLLAR","BELL","PLUM","PLUM","PLUM","GRAPES"],["PLUM","PLUM","PLUM","MELON","PLUM","PLUM","GRAPES","PLUM","ORANGE","DOLLAR","MELON","GRAPES"],["SEVEN","DOLLAR","DOLLAR","BELL","BELL","BELL","WILD","BELL","MELON","DOLLAR","PLUM","SEVEN"]],"40":[["GRAPES","DOLLAR","BELL","GRAPES","SEVEN","GRAPES","SEVEN","ORANGE","BELL","CHERRY","GRAPES","MELON"],["GRAPES","DOLLAR","GRAPES","ORANGE","ORANGE","BELL","BELL","MELON","WILD","SEVEN","SEVEN","BELL"],["BELL","PLUM","SEVEN","GRAPES","WILD","CHERRY","MELON","CHERRY","ORANGE","SEVEN","CHERRY","CHERRY"],["BELL","CHERRY","CHERRY","DOLLAR","WILD","SEVEN","CHERRY","WILD","GRAPES","DOLLAR","DOLLAR","GRAPES"],["MELON","GRAPES","GRAPES","PLUM","CHERRY","DOLLAR","CHERRY","GRAPES","GRAPES","ORANGE","ORANGE","DOLLAR"],["MELON","SEVEN","DOLLAR","GRAPES","DOLLAR","CHERRY","GRAPES","BELL","GRAPES","GRAPES","PLUM","MELON"],["PLUM","PLUM","DOLLAR","DOLLAR","ORANGE","GRAPES","PLUM","WILD","WILD","BELL","BELL","DOLLAR"],["CHERRY","BELL","SEVEN","BELL","WILD","CHERRY","BELL","ORANGE","CHERRY","SEVEN","MELON","ORANGE"],["WILD","PLUM","CHERRY","WILD","BELL","CHERRY","MELON","WILD","ORANGE","CHERRY","MELON","CHERRY"],["SEVEN","WILD","BELL","MELON","ORANGE","GRAPES","CHERRY","PLUM","WILD","DOLLAR","PLUM","PLUM"],["BELL","GRAPES","WILD","SEVEN","WILD","CHERRY","CHERRY","DOLLAR","SEVEN","CHERRY","SEVEN","CHERRY"],["WILD","CHERRY","WILD","CHERRY","PLUM","BELL","DOLLAR","SEVEN","DOLLAR","GRAPES","DOLLAR","BELL"],["PLUM","CHERRY","GRAPES","MELON","GRAPES","GRAPES","CHERRY","GRAPES","ORANGE","MELON","CHERRY","SEVEN"],["GRAPES","SEVEN","GRAPES","GRAPES","DOLLAR","GRAPES","CHERRY","SEVEN","ORANGE","PLUM","PLUM","MELON"],["BELL","CHERRY","CHERRY","MELON","DOLLAR","GRAPES","GRAPES","BELL","GRAPES","ORANGE","ORANGE","GRAPES"],["BELL","BELL","CHERRY","WILD","WILD","CHERRY","DOLLAR","SEVEN","BELL","PLUM","BELL","PLUM"],["CHERRY","WILD","PLUM","CHERRY","GRAPES","BELL","WILD","SEVEN","GRAPES","PLUM","ORANGE","ORANGE"],["BELL","BELL","DOLLAR","DOLLAR","GRAPES","DOLLAR","PLUM","GRAPES","PLUM","GRAPES","GRAPES","ORANGE"],["GRAPES","GRAPES","GRAPES","CHERRY","CHERRY","DOLLAR","BELL","SEVEN","MELON","CHERRY","DOLLAR","GRAPES"],["GRAPES","MELON","GRAPES","PLUM","DOLLAR","SEVEN","SEVEN","GRAPES","MELON","GRAPES","ORANGE","SEVEN"]],"160":[["GRAPES","PLUM","GRAPES","DOLLAR","ORANGE","SEVEN","ORANGE","ORANGE","GRAPES","GRAPES","PLUM","WILD"],["BELL","GRAPES","ORANGE","ORANGE","BELL","GRAPES","MELON","GRAPES","GRAPES","SEVEN","WILD","ORANGE"],["DOLLAR","PLUM","ORANGE","CHERRY","ORANGE","SEVEN","SEVEN","CHERRY","SEVEN","DOLLAR","PLUM","SEVEN"],["SEVEN","GRAPES","BELL","GRAPES","CHERRY","DOLLAR","GRAPES","GRAPES","GRAPES","CHERRY","GRAPES","ORANGE"],["GRAPES","GRAPES","PLUM","WILD","DOLLAR","PLUM","WILD","BELL","CHERRY","MELON","MELON","DOLLAR"],["GRAPES","SEVEN","SEVEN","GRAPES","GRAPES","PLUM","CHERRY","SEVEN","SEVEN","ORANGE","GRAPES","CHERRY"],["MELON","BELL","WILD","ORANGE","MELON","GRAPES","DOLLAR","WILD","GRAPES","SEVEN","BELL","PLUM"],["SEVEN","GRAPES","GRAPES","PLUM","PLUM","SEVEN","CHERRY","PLUM","WILD","ORANGE","BELL","WILD"],["DOLLAR","BELL","SEVEN","SEVEN","PLUM","SEVEN","PLUM","BELL","SEVEN","DOLLAR","PLUM","ORANGE"],["DOLLAR","PLUM","WILD","DOLLAR","GRAPES","GRAPES","CHERRY","WILD","CHERRY","BELL","MELON","PLUM"],["SEVEN","DOLLAR","DOLLAR","WILD","GRAPES","SEVEN","GRAPES","ORANGE","ORANGE","GRAPES","GRAPES","PLUM"],["WILD","PLUM","BELL","GRAPES","MELON","GRAPES","GRAPES","MELON","CHERRY","ORANGE","GRAPES","BELL"],["CHERRY","DOLLAR","BELL","WILD","CHERRY","WILD","SEVEN","ORANGE","GRAPES","DOLLAR","GRAPES","SEVEN"],["SEVEN","BELL","PLUM","SEVEN","ORANGE","SEVEN","CHERRY","ORANGE","ORANGE","PLUM","SEVEN","ORANGE"],["DOLLAR","GRAPES","SEVEN","PLUM","ORANGE","GRAPES","GRAPES","MELON","GRAPES","CHERRY","GRAPES","GRAPES"],["DOLLAR","SEVEN","MELON","SEVEN","ORANGE","DOLLAR","SEVEN","PLUM","SEVEN","PLUM","CHERRY","ORANGE"],["SEVEN","DOLLAR","DOLLAR","GRAPES","GRAPES","GRAPES","PLUM","GRAPES","SEVEN","ORANGE","WILD","CHERRY"],["GRAPES","CHERRY","BELL","MELON","CHERRY","SEVEN","GRAPES","CHERRY","BELL","GRAPES","GRAPES","WILD"],["DOLLAR","SEVEN","GRAPES","SEVEN","SEVEN","DOLLAR","SEVEN","ORANGE","CHERRY","CHERRY","PLUM","CHERRY"],["GRAPES","GRAPES","SEVEN","PLUM","BELL","DOLLAR","SEVEN","WILD","BELL","MELON","WILD","SEVEN"]],"1000":[["SEVEN","WILD","MELON","ORANGE","PLUM","PLUM","SEVEN","DOLLAR","MELON","MELON","GRAPES","WILD"],["ORANGE","SEVEN","WILD","GRAPES","SEVEN","MELON","MELON","ORANGE","WILD","CHERRY","PLUM","SEVEN"],["SEVEN","WILD","SEVEN","WILD","DOLLAR","GRAPES","DOLLAR","SEVEN","ORANGE","CHERRY","ORANGE","DOLLAR"],["BELL","SEVEN","GRAPES","GRAPES","SEVEN","DOLLAR","DOLLAR","WILD","GRAPES","GRAPES","WILD","PLUM"],["PLUM","DOLLAR","WILD","ORANGE","SEVEN","SEVEN","PLUM","SEVEN","WILD","PLUM","MELON","PLUM"],["DOLLAR","GRAPES","BELL","MELON","PLUM","WILD","DOLLAR","GRAPES","WILD","PLUM","WILD","CHERRY"],["SEVEN","PLUM","ORANGE","SEVEN","WILD","PLUM","MELON","DOLLAR","MELON","WILD","SEVEN","BELL"],["SEVEN","SEVEN","MELON","ORANGE","BELL","ORANGE","WILD","WILD","MELON","MELON","CHERRY","BELL"],["SEVEN","CHERRY","WILD","GRAPES","PLUM","SEVEN","PLUM","WILD","MELON","MELON","PLUM","MELON"],["ORANGE","BELL","SEVEN","WILD","DOLLAR","SEVEN","ORANGE","SEVEN","WILD","ORANGE","BELL","DOLLAR"],["SEVEN","WILD","WILD","SEVEN","BELL","SEVEN","GRAPES","BELL","ORANGE","BELL","BELL","MELON"],["SEVEN","WILD","WILD","ORANGE","DOLLAR","MELON","BELL","GRAPES","MELON","CHERRY","SEVEN","SEVEN"],["WILD","MELON","BELL","DOLLAR","DOLLAR","WILD","SEVEN","SEVEN","CHERRY","SEVEN","MELON","PLUM"],["SEVEN","WILD","SEVEN","ORANGE","MELON","MELON","MELON","WILD","ORANGE","BELL","PLUM","BELL"],["WILD","MELON","PLUM","BELL","PLUM","PLUM","MELON","CHERRY","WILD","MELON","ORANGE","WILD"],["BELL","SEVEN","BELL","WILD","SEVEN","MELON","WILD","ORANGE","GRAPES","GRAPES","GRAPES","GRAPES"],["CHERRY","BELL","WILD","GRAPES","SEVEN","WILD","SEVEN","SEVEN","MELON","MELON","PLUM","ORANGE"],["WILD","SEVEN","WILD","SEVEN","SEVEN","ORANGE","CHERRY","DOLLAR","BELL","GRAPES","GRAPES","ORANGE"],["BELL","WILD","DOLLAR","GRAPES","SEVEN","GRAPES","WILD","SEVEN","MELON","MELON","SEVEN","CHERRY"],["SEVEN","GRAPES","MELON","PLUM","MELON","MELON","SEVEN","WILD","BELL","WILD","ORANGE","DOLLAR"]]};
function outcomeMV81(){
  let r=Math.random(), acc=0, tier=0;
  for(const [value,p] of MV81_RTP_DISTRIBUTION){ acc+=p; if(r<acc){tier=value;break;} }
  const pool=MV81_RTP_TEMPLATES[tier]||MV81_RTP_TEMPLATES[0];
  return pool[Math.floor(Math.random()*pool.length)].slice();
}
function outcome(){
 const cols=+current.layout.split("x")[0],rows=+current.layout.split("x")[1];
 if(isMV81()) return outcomeMV81();
 return Array.from({length:cols*rows},()=>weightedSymbol());
}
function getCell(r,col,row,cols){return r[row*cols+col]}
function lineMatches(r,pattern,len){
 const cols=4;
 let base=null,wilds=0;
 for(let c=0;c<len;c++){
   const s=getCell(r,c,pattern[c],cols);
   if(s==="WILD"){wilds++;continue}
   if(base===null) base=s;
   else if(s!==base)return {symbol:null,wilds};
 }
 return {symbol:base,wilds};
}
function calculateMV81(r){
 const wins=[];
 // 3-symbol wins: exactly the 27 criss-cross paths through reels 1-3.
 for(let i=0;i<MV81_PATTERNS_3.length;i++){
   const p=MV81_PATTERNS_3[i], m=lineMatches(r,p,3);
   if(!m.symbol)continue;
   const mult=current.payouts[m.symbol]?.[3]||0;
   if(!mult)continue;
   const wildMul=m.wilds===1?2:m.wilds===2?4:m.wilds===3?8:1;
   wins.push({pattern:p,cols:3,symbol:m.symbol,count:3,wilds:m.wilds,amount:bet*mult*wildMul});
 }
 // 4-symbol wins: all 81 criss-cross paths. A 4-symbol win supersedes
 // the corresponding 3-symbol path; we remove it below.
 for(let i=0;i<MV81_PATTERNS_4.length;i++){
   const p=MV81_PATTERNS_4[i], m=lineMatches(r,p,4);
   if(!m.symbol)continue;
   const mult=current.payouts[m.symbol]?.[4]||0;
   if(!mult)continue;
   const wildMul=m.wilds===1?2:m.wilds===2?4:m.wilds===3?8:1;
   wins.push({pattern:p,cols:4,symbol:m.symbol,count:4,wilds:m.wilds,amount:bet*mult*wildMul});
 }
 // Only the highest win on a winning line is valid. Each 4-reel path
 // corresponds to one of the 27 three-reel paths, so suppress the 3-way
 // entry whenever its exact first-three positions also win on reel 4.
 const fourKeys=new Set(wins.filter(w=>w.cols===4).map(w=>w.pattern.slice(0,3).join("")));
 const finalWins=wins.filter(w=>w.cols===4 || !fourKeys.has(w.pattern.join("")));
 return finalWins;
}
function calculateWin(r){
 if(isMV81())return calculateMV81(r).reduce((a,w)=>a+w.amount,0);
 const cols=+current.layout.split("x")[0], rows=+current.layout.split("x")[1];
 let wins=0;
 for(let row=0;row<rows;row++){const line=r.slice(row*cols,(row+1)*cols);if(line.length===cols&&line.every(x=>x===line[0]))wins+=bet*(current.payouts[line[0]]||0)}
 return wins;
}
function clearWinFX(){
 document.querySelectorAll(".reel-win,.mv81-hit,.mv81-path").forEach(x=>x.classList.remove("reel-win","mv81-hit","mv81-path"));
 document.querySelectorAll(".mv81-line-svg").forEach(x=>x.remove());
}
function highlightMV81Wins(r,wins){
 clearWinFX();
 const frame=$("reelFrame"), rect=frame.getBoundingClientRect();
 const cols=4, rows=3;
 const cells=[...frame.querySelectorAll(".reel")];
 wins.forEach((w,wi)=>{
   w.pattern.forEach((row,c)=>{
     const idx=row*cols+c;
     cells[idx]?.classList.add("mv81-hit");
   });
 });
 // Draw each winning path as an SVG overlay.
 if(wins.length){
   const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
   svg.classList.add("mv81-line-svg");
   svg.setAttribute("viewBox",`0 0 ${frame.clientWidth} ${frame.clientHeight}`);
   svg.setAttribute("preserveAspectRatio","none");
   wins.slice(0,12).forEach((w,wi)=>{
     const pts=w.pattern.map((row,c)=>{
       const cell=cells[row*cols+c];
       return `${cell.offsetLeft+cell.offsetWidth/2},${cell.offsetTop+cell.offsetHeight/2}`;
     }).join(" ");
     const poly=document.createElementNS("http://www.w3.org/2000/svg","polyline");
     poly.setAttribute("points",pts);poly.setAttribute("class","mv81-path");
     poly.style.animationDelay=`${wi*90}ms`;
     svg.appendChild(poly);
   });
   frame.appendChild(svg);
 }
}
function playTone(type){
 if(!sound)return;
 try{
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  const c=window.__mvAudio||(window.__mvAudio=new C());
  const o=c.createOscillator(),g=c.createGain();
  const now=c.currentTime;
  const f=type==="stop"?240:type==="win"?520:type==="bigwin"?760:120;
  o.type=type==="spin"?"sawtooth":"sine";o.frequency.setValueAtTime(f,now);
  if(type==="spin")o.frequency.exponentialRampToValueAtTime(220,now+.12);
  if(type==="win")o.frequency.exponentialRampToValueAtTime(900,now+.18);
  if(type==="bigwin")o.frequency.exponentialRampToValueAtTime(1200,now+.28);
  g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(type==="bigwin"?.08:.045,now+.01);g.gain.exponentialRampToValueAtTime(.0001,now+(type==="bigwin"?.34:.2));
  o.connect(g);g.connect(c.destination);o.start(now);o.stop(now+(type==="bigwin"?.36:.22));
 }catch(e){}
}
async function spin(){
 if(spinning)return;if(balance<bet){toast("NEMÁŠ DOSTATEK TOKENŮ");return}
 spinning=true;$("spinBtn").disabled=true;balance-=bet;updateBalances();$("machineResult").textContent="SPINNING...";
 clearWinFX(); playTone("spin");
 const reels=[...document.querySelectorAll(".reel")];
 let r=[];
 if(isMV81()){
   reels.forEach(el=>el.classList.add("reel-spin"));
   for(let round=0;round<20;round++){
     reels.forEach((el,i)=>el.innerHTML=symbolMarkup(MV81_REEL_STRIPS[i%4][Math.floor(Math.random()*18)]));
     await new Promise(r=>setTimeout(r,45+round*2));
   }
   r=outcome();setReels(r);
   for(let i=0;i<4;i++){await new Promise(r=>setTimeout(r,150)); playTone("stop");}
   reels.forEach(el=>el.classList.remove("reel-spin"));
   const wins=calculateMV81(r),win=Math.min(1000*bet,wins.reduce((a,w)=>a+w.amount,0));
   if(win){
     highlightMV81Wins(r,wins);
     $("machineResult").textContent=`WIN +${fmt(win)} TOKENS`;
     playTone(win>=bet*20?"bigwin":"win");
     if(wins.length>1) toast(`✦ ${wins.length} VÝHERNÍCH CEST • +${fmt(win)} TOKENŮ`);
     else toast(`🎉 VÝHRA +${fmt(win)} TOKENŮ`);
   } else $("machineResult").textContent="NO WIN — TRY AGAIN";
   balance+=win;
 }else{
   for(let round=0;round<18;round++){reels.forEach(el=>el.innerHTML=symbolMarkup(current.symbols[Math.floor(Math.random()*current.symbols.length)]));reels.forEach(el=>el.classList.add("reel-spin"));await new Promise(r=>setTimeout(r,45+round*3));}
   reels.forEach(el=>el.classList.remove("reel-spin"));
   r=outcome();setReels(r);const win=calculateWin(r);balance+=win;
   if(win){$("machineResult").textContent=`WIN +${fmt(win)} TOKENS`;reels.slice(0,Math.min(6,reels.length)).forEach(el=>el.classList.add("reel-win"));toast(`🎉 VÝHRA +${fmt(win)} TOKENŮ`)}else $("machineResult").textContent="NO WIN — TRY AGAIN";
 }
 history.unshift({game:current.name,bet,win: isMV81()?calculateMV81(r).reduce((a,w)=>a+w.amount,0):calculateWin(r),time:new Date().toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})});
 history=history.slice(0,25);$("lastWin").textContent=fmt(isMV81()?calculateMV81(r).reduce((a,w)=>a+w.amount,0):calculateWin(r));updateBalances();spinning=false;$("spinBtn").disabled=false;
}
function updateBalances(){$("balance").textContent=fmt(balance);$("gameBalance").textContent=fmt(balance)}
function setBet(v){if(v==="half")bet=Math.max(current.min,Math.floor(bet/2));else if(v==="min")bet=current.min;else bet=Math.min(current.max,Math.max(current.min,bet*v));updateBetUI()}
function adjustBet(dir){const step=Math.max(current.min,Math.round(bet*.25));bet=Math.max(current.min,Math.min(current.max,bet+dir*step));updateBetUI()}
function updateBetUI(){
 $("betValue").textContent=fmt(bet);$("machineBetLabel").textContent=fmt(bet);
 const maxMult=isMV81()?1000:Math.max(...Object.values(current.payouts));
 $("maxWin").textContent=fmt(bet*maxMult);
}
function toggleSound(){sound=!sound;$("soundBtn").textContent=sound?"♫":"🔇";toast(sound?"SOUND ON":"SOUND OFF")}
function toggleFullscreen(){if(!document.fullscreenElement)$("gameOverlay").requestFullscreen?.();else document.exitFullscreen?.()}
function openPaytable(){
 const g=current||games[0];$("paytableTitle").textContent=g.name.toUpperCase();
 if(isMV81()){
   const order=["CHERRY","DOLLAR","ORANGE","PLUM","BELL","GRAPES","MELON","SEVEN","WILD"];
   const rows=order.map(s=>{const p=g.payouts[s];return `<div class="pay-row mv81-pay-row"><span class="pay-symbol"><img src="assets/games/mv81/${MV81_SYMBOLS[s].file}" alt="${s}"></span><span><b>${s==="WILD"?"MULTI WILD":MV81_SYMBOLS[s].label}</b><small>3 SYMBOLS / 4 SYMBOLS</small></span><b>${p?`x${p[3]} / x${p[4]}`:"—"}</b></div>`}).join("");
   const diagrams=MV81_PATTERNS_4.map((p,i)=>`<div class="mv81-line-card"><b>${i+1}</b><div>${Array.from({length:12},(_,k)=>{const c=k%4,row=Math.floor(k/4);return `<i class="${p[c]===row?"active":""}"></i>`}).join("")}</div></div>`).join("");
   $("paytableContent").innerHTML=`<div class="mv81-info"><strong>27 CRISS-CROSS WAYS</strong> for 3 matching symbols • <strong>81 WAYS</strong> for 4 matching symbols. Wins count from left to right. Multiple winning ways add together; only the highest win on a winning way counts. Multi Wild substitutes any symbol and multiplies a winning way ×2, ×4 or ×8.</div><div class="mv81-paytable">${rows}</div><h3 class="mv81-section-title">81 CRISS-CROSS WINNING WAYS</h3><div class="mv81-diagrams">${diagrams}</div><div class="pay-note">BET = total stake for the spin • 4 reels × 3 rows • Demo mechanics based on the published Multi Vegas 81 rules • calibrated demo RTP target 95% • max win 1000× bet.</div>`;
 }else{
   $("paytableContent").innerHTML=Object.entries(g.payouts).map(([s,m])=>`<div class="pay-row"><span class="pay-symbol">${s}</span><span>3 × ${s}</span><b>x${m}</b></div>`).join("")+`<div class="pay-note">${g.layout} • ${g.lines} lines • RTP ${g.rtp}% • Min ${fmt(g.min)} • Max ${fmt(g.max)}</div>`;
 }
 $("paytableOverlay").classList.remove("hidden")
}
function closePaytable(){$("paytableOverlay").classList.add("hidden")}
function openRewards(){$("panelContent").innerHTML=`<div class="eyebrow gold">REWARDS</div><h2>FASTCASH <em>VIP</em></h2><div class="reward-level"><b>BRONZE</b><span>0 / 10,000 XP</span></div><div class="progress"><i style="width:18%"></i></div><div class="reward-grid"><div>♛<b>VIP TABLES</b><small>Coming soon</small></div><div>★<b>DAILY BONUS</b><small>250 tokens</small></div><div>◆<b>EXCLUSIVE SLOTS</b><small>Unlock at VIP</small></div></div>`;$("panelOverlay").classList.remove("hidden")}
function openStats(){const spins=history.length,wins=history.reduce((a,x)=>a+x.win,0),bets=history.reduce((a,x)=>a+x.bet,0);$("panelContent").innerHTML=`<div class="eyebrow gold">PLAYER STATS</div><h2>YOUR <em>SESSION</em></h2><div class="stats-big"><div><b>${spins}</b><small>SPINS</small></div><div><b>${fmt(bets)}</b><small>WAGERED</small></div><div><b>${fmt(wins)}</b><small>WON</small></div></div><h3>RECENT SPINS</h3><div class="history">${history.length?history.map(x=>`<div><span>${x.game}</span><small>${x.time}</small><b class="${x.win?'win':''}">${x.win?"+":""}${fmt(x.win-x.bet)}</b></div>`).join(""):"No spins yet."}</div>`;$("panelOverlay").classList.remove("hidden")}
function openHelp(){$("panelContent").innerHTML=`<div class="eyebrow gold">HELP</div><h2>HOW TO <em>PLAY</em></h2><div class="help"><p><b>1.</b> Choose a slot from the lobby.</p><p><b>2.</b> Set your bet with −/+ or quick bets.</p><p><b>3.</b> Press SPIN and complete a winning line.</p><p><b>4.</b> Use +10,000 at the top while testing the demo.</p></div>`;$("panelOverlay").classList.remove("hidden")}
function closePanel(){$("panelOverlay").classList.add("hidden")}
function claimDaily(){if(dailyClaimed){toast("DNEŠNÍ ODMĚNA UŽ BYLA VYZVEDNUTA");return}dailyClaimed=true;balance+=250;updateBalances();toast("🎁 +250 TOKENŮ — DAILY REWARD")}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2500)}
const ticker=["Mikey hit 2,500 tokens on Lucky Sevens","Vinnie won 8,000 tokens on Diamond Rush","Sofia hit a 3x jackpot on Ocean Drive","Tony just spun High Roller for 5,000","CJ won 1,250 tokens on Blazing Fruits"];let ti=0;setInterval(()=>{ti=(ti+1)%ticker.length;$("tickerText").textContent=ticker[ti]},4000);
renderGames();updateBalances();
