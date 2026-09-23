const API=window.CASINO_API;
let games=[],current=null,playerId="demo-player",busy=false;
const $=id=>document.getElementById(id);
async function api(path,opt){const r=await fetch(API+path,opt);const j=await r.json();if(!r.ok)throw Error(j.error||"Chyba");return j}
async function connect(){playerId=$("playerId").value.trim();if(!playerId)return;try{const p=await api("/api/players",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:playerId})});$("balance").textContent=p.balance.toLocaleString("cs-CZ")}catch(e){alert(e.message)}}
function render(){ $("games").innerHTML=games.map(g=>`<button class="card" onclick="openGame('${g.id}')"><div class="art">${g.symbols.slice(0,3).join(" ")}</div><h3>${g.name}</h3><p>${g.min_bet}–${g.max_bet.toLocaleString("cs-CZ")} tokenů</p><span>RTP ${Math.round(g.rtp*100)} %</span></button>`).join("")}
function openGame(id){current=games.find(x=>x.id===id);$("gameName").textContent=current.name;$("gameSub").textContent="MINI JACKPOT SLOT";$("bet").min=current.min_bet;$("bet").max=current.max_bet;$("bet").value=current.min_bet;$("result").textContent="Připraveno";$("modal").classList.remove("hidden")}
function closeGame(){if(!busy)$("modal").classList.add("hidden")}
function changeBet(dir){let v=Number($("bet").value),step=Math.max(current.min_bet,Math.ceil(v*.25));v+=dir*step;v=Math.max(current.min_bet,Math.min(current.max_bet,v));$("bet").value=v}
async function spin(){
 if(busy)return;busy=true;$("result").textContent="TOČÍME…";
 for(let i=0;i<14;i++){await new Promise(r=>setTimeout(r,45));$("r0").textContent=current.symbols[Math.floor(Math.random()*current.symbols.length)];$("r1").textContent=current.symbols[Math.floor(Math.random()*current.symbols.length)];$("r2").textContent=current.symbols[Math.floor(Math.random()*current.symbols.length)]}
 try{
  const j=await api("/api/spin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({playerId,gameId:current.id,bet:Number($("bet").value)})});
  $("r0").textContent=j.reels[0];$("r1").textContent=j.reels[1];$("r2").textContent=j.reels[2];$("balance").textContent=j.balance.toLocaleString("cs-CZ");$("result").textContent=j.payout?`VÝHRA +${j.payout.toLocaleString("cs-CZ")} TOKENŮ`:"Bez výhry";
 }catch(e){$("result").textContent=e.message}
 busy=false;
}
(async()=>{try{games=await api("/api/games");render();await connect()}catch(e){$("games").innerHTML=`<div class="offline">Backend není připojený.<br><small>Nastav frontend/config.js na adresu svého backendu.</small></div>`}})();
