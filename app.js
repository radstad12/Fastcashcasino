const $=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString("cs-CZ");
const SYMBOLS={
 cherry:{name:"CHERRY",img:"assets/sym-cherry.svg",pay:2},
 lemon:{name:"LEMON",img:"assets/sym-lemon.svg",pay:2},
 orange:{name:"ORANGE",img:"assets/sym-orange.svg",pay:4},
 plum:{name:"PLUM",img:"assets/sym-plum.svg",pay:5},
 grapes:{name:"GRAPES",img:"assets/sym-grapes.svg",pay:8},
 watermelon:{name:"WATERMELON",img:"assets/sym-watermelon.svg",pay:10},
 bell:{name:"BELL",img:"assets/sym-bell.svg",pay:15},
 bar:{name:"BAR",img:"assets/sym-bar.svg",pay:20},
 seven:{name:"SEVEN",img:"assets/sym-seven.svg",pay:40},
 wild:{name:"WILD",img:"assets/sym-wild.svg",pay:60},
 bonus:{name:"BONUS",img:"assets/sym-bonus.svg",pay:0}
};
const regular=["cherry","lemon","orange","plum","grapes","watermelon","bell","bar","seven"];
const reels=[
 ["bonus","cherry","lemon","orange","plum","grapes","wild","watermelon","bell","bar","seven","cherry","lemon","orange","plum","grapes","watermelon","bell","bar","seven"],
 ["cherry","lemon","orange","plum","grapes","watermelon","bell","wild","bar","seven","cherry","lemon","orange","plum","grapes","watermelon","bell","bar","seven","bonus"],
 ["lemon","orange","plum","grapes","watermelon","bell","bar","seven","wild","cherry","lemon","orange","plum","grapes","watermelon","bell","bar","seven","bonus","cherry"]
];
const state={balance:10000,bet:50,spinning:false,sound:true,history:[],auto:false,turbo:false,lastResult:null};

function beep(freq=440,dur=.08,type="sine",gain=.035){
 if(!state.sound)return;
 try{
  const c=beep.ctx||(beep.ctx=new (window.AudioContext||window.webkitAudioContext)());
  const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+dur);
 }catch{}
}
function sfx(kind){
 if(!state.sound)return;
 const map={click:[180,.04],stop:[110,.09],win:[620,.13],big:[860,.16],bonus:[180,.12],coin:[980,.05]};
 const [f,d]=map[kind]||map.click;beep(f,d,kind==="bonus"?"sawtooth":"triangle",kind==="big"?.06:.035);
 if(kind==="win"){setTimeout(()=>beep(f*1.25,.1,"triangle",.04),90)}
 if(kind==="big"){[1,1.25,1.5,2].forEach((m,i)=>setTimeout(()=>beep(f*m,.14,"sawtooth",.045),i*95))}
}
function setBalance(){ $("balance").textContent=fmt(state.balance);$("gameBalance").textContent=fmt(state.balance); }
function toast(t){const x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function symbolHTML(id){const s=SYMBOLS[id];return `<div class="symbol"><img src="${s.img}" alt="${s.name}"></div>`}
function buildReels(){
 const f=$("reelFrame");f.innerHTML="";
 for(let i=0;i<9;i++){const cell=document.createElement("div");cell.className="reel-cell";cell.dataset.pos=i;f.appendChild(cell)}
}
function weighted(reel){
 const r=reels[reel];return r[Math.floor(Math.random()*r.length)];
}
function randomGrid(){
 const g=[];
 for(let i=0;i<9;i++){const c=i%3;g.push(weighted(c))}
 return g;
}
function renderGrid(g,clear=true){
 [...document.querySelectorAll(".reel-cell")].forEach((c,i)=>{c.innerHTML=symbolHTML(g[i]);if(clear)c.classList.remove("win-cell","bonus-cell","wild-cell")});
}
function payways(grid){
 let total=0,lines=[];
 // 27 ways: any one symbol position per reel, left-to-right.
 for(const sym of regular.concat(["wild"])){
  const cols=[0,1,2].map(col=>[grid[col],grid[3+col],grid[6+col]]);
  // For each column count positions matching sym or wild. Need at least one in each reel.
  const counts=cols.map(col=>col.filter(x=>x===sym||x==="wild").length);
  if(counts.every(Boolean)){
    const ways=counts[0]*counts[1]*counts[2];
    const base=SYMBOLS[sym].pay;
    const amount=state.bet*base*ways;
    if(amount>0){total+=amount;lines.push({sym,ways,amount})}
  }
 }
 // Avoid paying WILD as a separate combination when it only substituted; keep explicit wild top prize only.
 const wildCols=[0,1,2].map(col=>[grid[col],grid[3+col],grid[6+col]]);
 if(wildCols.every(col=>col.some(x=>x==="wild"))){
   const ways=wildCols.reduce((a,col)=>a*col.filter(x=>x==="wild").length,1);
   total+=state.bet*SYMBOLS.wild.pay*ways;
   lines.push({sym:"wild",ways,amount:state.bet*SYMBOLS.wild.pay*ways});
 }
 return {total,lines};
}
function triggerBonus(grid){return grid.filter(x=>x==="bonus").length>=3}
function stopAnimation(){
 [...document.querySelectorAll(".reel-cell")].forEach(c=>c.classList.remove("spinning"));
}
async function spin(){
 if(state.spinning)return;
 if(state.balance<state.bet){toast("NEDOSTATEK TOKENŮ");return}
 state.spinning=true;$("spinBtn").disabled=true;state.balance-=state.bet;setBalance();
 $("status").textContent="SPINNING";$("featureText").textContent="GOOD LUCK";sfx("click");
 const cells=[...document.querySelectorAll(".reel-cell")];
 cells.forEach(c=>c.classList.add("spinning"));
 const final=randomGrid(); state._currentGrid=final;
 const duration=state.turbo?380:1050;
 for(let col=0;col<3;col++){
  const colCells=[0,1,2].map(r=>cells[r*3+col]);
  await new Promise(r=>setTimeout(r,duration+(state.turbo?0:col*260)));
  colCells.forEach(c=>c.classList.remove("spinning"));sfx("stop");
  for(const c of colCells)c.innerHTML=symbolHTML(regular[Math.floor(Math.random()*regular.length)]);
 }
 renderGrid(final);
 const {total,lines}=payways(final);
 const bonus=triggerBonus(final);
 [...cells].forEach((c,i)=>{if(final[i]==="bonus")c.classList.add("bonus-cell");if(final[i]==="wild")c.classList.add("wild-cell")});
 let win=total;
 if(total>0){
   await highlightWins(lines, cells, final);
   state.balance+=total;setBalance();$("lastWin").textContent=fmt(total);
   $("status").textContent=total>=state.bet*20?"BIG WIN!":"WIN!";
   sfx(total>=state.bet*20?"big":"win");
   burst(total>=state.bet*20);
   toast(`VÝHRA +${fmt(total)} TOKENŮ`);
 }else{$("lastWin").textContent="0";$("status").textContent="NO WIN";sfx("stop")}
 state.history.unshift({bet:state.bet,win,bonus,time:new Date().toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})});
 state.history=state.history.slice(0,40);
 state.lastResult={final,total,bonus};
 if(bonus){await new Promise(r=>setTimeout(r,500));await openBonus()}
 state.spinning=false;$("spinBtn").disabled=false;
 if(state.auto&&state.balance>=state.bet){setTimeout(spin,state.turbo?250:800)}
}
async function highlightWins(lines,cells,grid){
 const indexes=new Set();
 for(const line of lines){
   for(let col=0;col<3;col++){
     for(let row=0;row<3;row++){
       const v=grid[row*3+col];
       if(v===line.sym||v==="wild")indexes.add(row*3+col);
     }
   }
 }
 cells.forEach((c,i)=>{if(indexes.has(i))c.classList.add("win-cell")});
 await new Promise(r=>setTimeout(r,850));
 cells.forEach(c=>c.classList.remove("win-cell"));
}
async function openBonus(){
 $("bonusOverlay").classList.remove("hidden");$("bonusResult").classList.add("hidden");$("continueBonus").classList.add("hidden");
 $("chips").innerHTML="";
 const values=[25,40,55,70,85,100].sort(()=>Math.random()-.5).slice(0,3);
 values.forEach(v=>{
  const b=document.createElement("button");b.className="bonus-chip";b.innerHTML=`<img src="assets/sym-bonus.svg"><span>?</span>`;b.dataset.value=v;
  b.addEventListener("click",()=>{
   [...$("chips").children].forEach(x=>x.disabled=true);sfx("bonus");
   const prize=state.bet*v;state.balance+=prize;setBalance();$("lastWin").textContent=fmt(prize);
   b.classList.add("chosen");b.innerHTML=`<img src="assets/sym-bonus.svg"><strong>x${v}</strong>`;
   $("bonusResult").textContent=`BONUS WIN  +${fmt(prize)} TOKENS`;$("bonusResult").classList.remove("hidden");$("continueBonus").classList.remove("hidden");burst(true);
  });
  $("chips").appendChild(b);
 });
 await new Promise(r=>{ $("continueBonus").onclick=()=>{$("bonusOverlay").classList.add("hidden");r()}})
}
function burst(big=false){
 const scene=document.querySelector(".machine-scene");scene.classList.remove("flash");void scene.offsetWidth;scene.classList.add("flash");
 if(big){for(let i=0;i<22;i++){const p=document.createElement("i");p.className="particle";p.style.left=(35+Math.random()*30)+"%";p.style.top=(25+Math.random()*45)+"%";p.style.setProperty("--dx",(Math.random()*240-120)+"px");p.style.setProperty("--dy",(Math.random()*-220-40)+"px");scene.appendChild(p);setTimeout(()=>p.remove(),1000)}}
}
function changeBet(dir){const steps=[10,25,50,100,250,500,1000,2500];let i=steps.findIndex(x=>x>=state.bet);if(dir<0)i=Math.max(0,(i<0?steps.length-1:i-1));else i=Math.min(steps.length-1,(i<0?0:i+1));state.bet=steps[i];$("betValue").textContent=fmt(state.bet)}
function openGame(){ $("gameOverlay").classList.remove("hidden");buildReels();renderGrid(randomGrid());setBalance();$("betValue").textContent=fmt(state.bet);$("lastWin").textContent="0";$("status").textContent="PRESS SPIN";$("featureText").textContent="READY" }
function closeGame(){if(!state.spinning)$("gameOverlay").classList.add("hidden")}
function toggleSound(){state.sound=!state.sound;$("soundBtn").textContent=state.sound?"♫ SOUND":"🔇 MUTED";$("soundMini").textContent=state.sound?"♫":"🔇";toast(state.sound?"SOUND ON":"SOUND OFF")}
function openPay(){ $("paytableOverlay").classList.remove("hidden");$("paytableList").innerHTML=regular.map(k=>`<div><img src="${SYMBOLS[k].img}"><span>${SYMBOLS[k].name}</span><b>x${SYMBOLS[k].pay}</b></div>`).join("")+`<div><img src="${SYMBOLS.wild.img}"><span>WILD JOKER</span><b>x${SYMBOLS.wild.pay}</b></div>`}
function openStats(){const spins=state.history.length,w=state.history.reduce((a,x)=>a+x.win,0),b=state.history.reduce((a,x)=>a+x.bet,0);$("statsContent").innerHTML=`<div class="stats-grid"><div><b>${spins}</b><small>SPINS</small></div><div><b>${fmt(b)}</b><small>WAGERED</small></div><div><b>${fmt(w)}</b><small>WON</small></div></div>`;$("statsOverlay").classList.remove("hidden")}
$("playHero").onclick=openGame;$("gameCard").onclick=openGame;$("backBtn").onclick=closeGame;$("paytableBtn").onclick=openPay;$("paytableMini").onclick=openPay;$("payClose").onclick=()=>$("paytableOverlay").classList.add("hidden");$("statsBtn").onclick=openStats;$("statsClose").onclick=()=>$("statsOverlay").classList.add("hidden");$("soundBtn").onclick=toggleSound;$("soundMini").onclick=toggleSound;$("spinBtn").onclick=spin;$("betDown").onclick=()=>changeBet(-1);$("betUp").onclick=()=>changeBet(1);$("addBtn").onclick=()=>{state.balance+=10000;setBalance();toast("+10,000 TOKENS")};$("homeBtn").onclick=closeGame;$("slotsBtn").onclick=()=>document.querySelector("#gamesSection").scrollIntoView({behavior:"smooth"});$("autoBtn").onclick=()=>{state.auto=!state.auto;$("autoBtn").classList.toggle("active",state.auto);toast(state.auto?"AUTO ON":"AUTO OFF");if(state.auto&&!state.spinning)spin()};$("turboBtn").onclick=()=>{state.turbo=!state.turbo;$("turboBtn").classList.toggle("active",state.turbo);toast(state.turbo?"TURBO ON":"TURBO OFF")};
setBalance();
