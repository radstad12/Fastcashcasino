let games=[];
let currentGame=null;
let playerId="demo-player";

async function login(){
  playerId=document.getElementById("playerId").value.trim();
  if(!playerId)return;
  let r=await fetch("/api/players",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:playerId})});
  const p=await r.json();
  updateBalance(p.balance);
}
function updateBalance(v){document.getElementById("balance").textContent=Number(v).toLocaleString("cs-CZ")+" tokenů";}

async function load(){
  games=await fetch("/api/games").then(r=>r.json());
  document.getElementById("games").innerHTML=games.map(g=>`
    <button class="game-card" onclick="openGame('${g.id}')">
      <div class="mini-reels">${g.symbols.slice(0,3).join(" ")}</div>
      <h3>${g.name}</h3>
      <span>${g.min_bet}–${g.max_bet} tokenů</span>
    </button>`).join("");
  login();
}
function openGame(id){
  currentGame=games.find(g=>g.id===id);
  document.getElementById("gameName").textContent=currentGame.name;
  document.getElementById("bet").min=currentGame.min_bet;
  document.getElementById("bet").max=currentGame.max_bet;
  document.getElementById("bet").value=currentGame.min_bet;
  document.getElementById("message").textContent="";
  document.getElementById("modal").classList.remove("hidden");
}
function closeGame(){document.getElementById("modal").classList.add("hidden");}
async function spin(){
  if(!currentGame)return;
  const bet=Number(document.getElementById("bet").value);
  const button=document.getElementById("spin");
  button.disabled=true;
  document.getElementById("message").textContent="Točíme...";
  for(let i=0;i<12;i++){
    await new Promise(r=>setTimeout(r,60));
    document.getElementById("r0").textContent=currentGame.symbols[Math.floor(Math.random()*currentGame.symbols.length)];
    document.getElementById("r1").textContent=currentGame.symbols[Math.floor(Math.random()*currentGame.symbols.length)];
    document.getElementById("r2").textContent=currentGame.symbols[Math.floor(Math.random()*currentGame.symbols.length)];
  }
  const r=await fetch("/api/spin",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({playerId,gameId:currentGame.id,bet})
  });
  const j=await r.json();
  button.disabled=false;
  if(!r.ok){document.getElementById("message").textContent=j.error;return;}
  document.getElementById("r0").textContent=j.reels[0];
  document.getElementById("r1").textContent=j.reels[1];
  document.getElementById("r2").textContent=j.reels[2];
  updateBalance(j.balance);
  document.getElementById("message").textContent=j.payout>0 ? `VÝHRA +${j.payout} tokenů` : "Bez výhry";
}
load();
