// FastCash Texas Hold'em — local 5-seat playable table. For true cross-device multiplayer, replace the local transport with WebSocket/server state.
const poker={
  maxSeats:5, blinds:{small:50,big:100}, phase:'waiting', pot:0, currentBet:0, dealer:0, turn:0,
  deck:[], community:[], players:[], hero:0, handNo:0, lastRaise:200, timer:null, busy:false
};
const RANKS=[2,3,4,5,6,7,8,9,10,11,12,13,14], SUITS=['♠','♥','♦','♣'];
const RANK_NAME={14:'A',13:'K',12:'Q',11:'J',10:'10'};
const p$=id=>document.getElementById(id);
const money=n=>Number(n).toLocaleString('cs-CZ');
function cardLabel(c){return `${RANK_NAME[c.r]||c.r}${c.s}`}
function makeDeck(){const d=[];for(const s of SUITS)for(const r of RANKS)d.push({r,s});return d}
function shuffle(d){for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d}
function sortDesc(a){return [...a].sort((x,y)=>y-x)}
function straightHigh(ranks){const u=[...new Set(ranks)].sort((a,b)=>b-a);if(u.includes(14))u.push(1);for(let i=0;i<=u.length-5;i++){if(u.slice(i,i+5).every((x,j)=>x===u[i]-j))return u[i]}return 0}
function combinations(arr,k){const out=[];function rec(start,cur){if(cur.length===k){out.push(cur.slice());return}for(let i=start;i<=arr.length-(k-cur.length);i++){cur.push(arr[i]);rec(i+1,cur);cur.pop()}}rec(0,[]);return out}
function eval5(cs){
  const rs=sortDesc(cs.map(c=>c.r)), counts={};rs.forEach(r=>counts[r]=(counts[r]||0)+1);
  const groups=Object.entries(counts).map(([r,n])=>({r:+r,n})).sort((a,b)=>b.n-a.n||b.r-a.r);
  const flush=cs.every(c=>c.s===cs[0].s), sh=straightHigh(rs);
  if(flush&&sh)return {cat:8,name:sh===14?'Royal Flush':'Straight Flush',v:[8,sh]};
  const quads=groups.filter(g=>g.n===4);if(quads.length)return {cat:7,name:'Four of a Kind',v:[7,quads[0].r,...rs.filter(r=>r!==quads[0].r)]};
  const trips=groups.filter(g=>g.n===3), pairs=groups.filter(g=>g.n===2);if(trips.length&&(pairs.length||trips.length>1)){const t=trips[0].r,p=(pairs[0]||trips[1]).r;return {cat:6,name:'Full House',v:[6,t,p]}}
  if(flush)return {cat:5,name:'Flush',v:[5,...rs]};if(sh)return {cat:4,name:'Straight',v:[4,sh]};
  if(trips.length){const t=trips[0].r;return {cat:3,name:'Three of a Kind',v:[3,t,...rs.filter(r=>r!==t).slice(0,2)]}}
  if(pairs.length>=2){const ps=pairs.map(x=>x.r).sort((a,b)=>b-a);return {cat:2,name:'Two Pair',v:[2,ps[0],ps[1],rs.find(r=>r!==ps[0]&&r!==ps[1])]}}
  if(pairs.length===1){const p=pairs[0].r;return {cat:1,name:'One Pair',v:[1,p,...rs.filter(r=>r!==p).slice(0,3)]};}
  return {cat:0,name:'High Card',v:[0,...rs]}
}
function cmp(a,b){for(let i=0;i<Math.max(a.v.length,b.v.length);i++){if((a.v[i]||0)!==(b.v[i]||0))return (a.v[i]||0)-(b.v[i]||0)}return 0}
function bestHand(cs){return combinations(cs,5).map(eval5).sort(cmp).at(-1)}
function createPlayers(){
  const names=['YOU','Rico','Mia','Vince','Nora'];
  poker.players=names.map((name,i)=>({id:i,name,bot:i!==0,seat:i,stack:i===0?2000:2000,committed:0,hand:[],folded:false,allin:false,acted:false,inHand:true,role:'',connected:true}));
}
function resetStreet(){poker.currentBet=Math.max(...poker.players.map(p=>p.committed));poker.players.forEach(p=>p.acted=false)}
function contribute(p,amount){const a=Math.min(amount,p.stack);p.stack-=a;p.committed+=a;poker.pot+=a;return a}
function seatMarkup(p){const hero=p.id===0;return `<div class="player-bubble ${hero?'hero-seat':''} ${p.folded?'folded':''} ${p.id===poker.turn?'turn-seat':''}"><div class="player-avatar">${hero?'MC':p.name.slice(0,2).toUpperCase()}</div><div class="player-meta"><b>${p.name}</b><small>${p.folded?'FOLDED':p.allin?'ALL IN':money(p.stack)+' CHIPS'}</small></div><div class="seat-badge">${p.role||''}</div><div class="mini-hole">${p.hand.length?(hero||p.show? p.hand.map(cardFace).join(''): '<i></i><i></i>'):''}</div></div>`}
function cardFace(c,hidden=false){if(hidden)return `<div class="playing-card back"><span>♠</span></div>`;return `<div class="playing-card ${c.s==='♥'||c.s==='♦'?'red':''}"><b>${RANK_NAME[c.r]||c.r}</b><span>${c.s}</span></div>`}
function renderPoker(){
  poker.players.forEach(p=>{const el=p$('seat'+p.id);if(el)el.innerHTML=seatMarkup(p)});
  p$('community').innerHTML=poker.community.map(c=>cardFace(c)).join('');p$('potAmount').textContent=money(poker.pot);p$('heroChips').textContent=money(poker.players[0]?.stack||0);
  const hero=poker.players[0];p$('holeCards').innerHTML=hero.hand.map(c=>cardFace(c)).join('');
  if(hero.hand.length&&poker.community.length>=3)p$('handRank').textContent=bestHand([...hero.hand,...poker.community]).name;else p$('handRank').textContent='—';
  const call=Math.max(0,poker.currentBet-hero.committed);p$('callAmount').textContent=money(call);p$('toCall').textContent=call?`CALL ${money(call)}`:'CHECK';p$('roundLabel').textContent=poker.phase==='waiting'?'WAITING':poker.phase.toUpperCase();p$('raiseLabel').textContent=money(+p$('raiseRange').value);p$('raiseAmount').textContent=money(+p$('raiseRange').value);
  document.querySelectorAll('.poker-action').forEach(b=>b.disabled=poker.phase==='waiting'||poker.turn!==0||poker.busy||hero.folded||hero.allin);
}
function dealer(text){p$('dealerLine').textContent=text;p$('dealer-avatar')?.classList.add('dealer-talk');clearTimeout(poker.dealerTimer);poker.dealerTimer=setTimeout(()=>{},2000)}
function openPokerLobby(){p$('pokerOverlay').classList.remove('hidden');if(poker.phase==='waiting')startPokerTable()}
function closePoker(){if(poker.busy)return;p$('pokerOverlay').classList.add('hidden')}
function toggleFullscreenPoker(){const e=p$('pokerOverlay');if(!document.fullscreenElement)e.requestFullscreen?.();else document.exitFullscreen?.()}
function openPokerRules(){p$('pokerRulesOverlay').classList.remove('hidden')};function closePokerRules(){p$('pokerRulesOverlay').classList.add('hidden')}
function startPokerTable(){
  createPlayers();poker.handNo=0;poker.dealer=0;poker.phase='waiting';poker.pot=0;poker.community=[];renderPoker();
  dealer('Seats are filled for this local demo. Five seats maximum.');setTimeout(startHand,900)
}
function startHand(){
  poker.handNo++;poker.busy=true;poker.deck=shuffle(makeDeck());poker.community=[];poker.pot=0;poker.phase='preflop';poker.dealer=(poker.dealer+1)%5;
  poker.players.forEach((p,i)=>{p.committed=0;p.folded=false;p.allin=false;p.acted=false;p.inHand=true;p.hand=[poker.deck.pop(),poker.deck.pop()];p.role=i===poker.dealer?'DEALER':i===(poker.dealer+1)%5?'SMALL BLIND':i===(poker.dealer+2)%5?'BIG BLIND':'';});
  contribute(poker.players[(poker.dealer+1)%5],poker.blinds.small);contribute(poker.players[(poker.dealer+2)%5],poker.blinds.big);poker.currentBet=100;poker.turn=(poker.dealer+3)%5;
  p$('raiseRange').max='2000';p$('raiseRange').value='200';renderPoker();dealer(`Hand #${poker.handNo}. Blinds ${poker.blinds.small}/${poker.blinds.big}. Your cards are ready.`);poker.busy=false;
  if(poker.turn!==0)botTurn();
}
function active(){return poker.players.filter(p=>p.inHand&&!p.folded)}
function nextTurn(){let idx=poker.turn;for(let n=0;n<5;n++){idx=(idx+1)%5;const p=poker.players[idx];if(p.inHand&&!p.folded&&!p.allin){poker.turn=idx;return true}}return false}
function allMatched(){const a=active().filter(p=>!p.allin);return a.every(p=>p.committed===poker.currentBet&&p.acted)}
function advance(){
  if(active().length===1){award(active()[0]);return}
  const street=poker.phase;
  if(street==='preflop'){poker.community.push(poker.deck.pop(),poker.deck.pop(),poker.deck.pop());poker.phase='flop'}
  else if(street==='flop'){poker.community.push(poker.deck.pop());poker.phase='turn'}
  else if(street==='turn'){poker.community.push(poker.deck.pop());poker.phase='river'}
  else {showdown();return}
  poker.players.forEach(p=>{p.committed=0;p.acted=false});poker.currentBet=0;poker.turn=(poker.dealer+1)%5;renderPoker();dealer(street==='preflop'?'Flop is on the table.':street==='flop'?'Turn card.': 'River card.');if(poker.turn!==0)botTurn()
}
function award(winner){poker.busy=true;winner.stack+=poker.pot;dealer(`${winner.name} takes the pot — ${money(poker.pot)} chips.`);poker.phase='showdown';renderPoker();setTimeout(()=>{poker.busy=false;startHand()},2600)}
function showdown(){poker.phase='showdown';const contenders=active();const scored=contenders.map(p=>({p,score:bestHand([...p.hand,...poker.community])})).sort((a,b)=>cmp(b.score,a.score));const best=scored[0].score;const winners=scored.filter(x=>cmp(x.score,best)===0);const share=Math.floor(poker.pot/winners.length);winners.forEach(w=>w.p.stack+=share);poker.busy=true;renderPoker();dealer(winners.length>1?`Split pot: ${winners.map(w=>w.p.name).join(' & ')} — ${money(share)} each.`:`${winners[0].p.name} wins with ${best.name}.`);setTimeout(()=>{poker.busy=false;startHand()},3000)}
function pokerAction(type){if(poker.turn!==0||poker.busy)return;const p=poker.players[0];const call=Math.max(0,poker.currentBet-p.committed);if(type==='fold'){p.folded=true;p.acted=true;dealer('You fold. The dealer moves the action on.')}else if(type==='check'){if(call>0){toast('You need to call, raise or fold.');return}p.acted=true}else if(type==='call'){contribute(p,call);p.acted=true}else if(type==='raise'){const raise=Math.max(100,+p$('raiseRange').value);const target=poker.currentBet+raise;contribute(p,Math.max(0,target-p.committed));poker.currentBet=p.committed;poker.players.forEach(x=>{if(x.id!==0&&x.inHand&&!x.folded)x.acted=false});p.acted=true}else if(type==='allin'){contribute(p,p.stack);p.allin=true;p.acted=true;poker.currentBet=Math.max(poker.currentBet,p.committed)}renderPoker();afterAction()}
function afterAction(){if(active().length===1){award(active()[0]);return}if(active().filter(p=>!p.allin).length===0){advance();return}if(allMatched()){advance();return}if(nextTurn()){renderPoker();if(poker.turn!==0)botTurn()}}
function botTurn(){if(poker.busy||poker.turn===0)return;const p=poker.players[poker.turn];if(!p||p.folded||p.allin){afterAction();return}poker.busy=true;setTimeout(()=>{poker.busy=false;const call=Math.max(0,poker.currentBet-p.committed);const strength=bestHand([...p.hand,...poker.community]).cat;const r=Math.random();if(call>p.stack){contribute(p,p.stack);p.allin=true}else if(strength>=2&&r<.55){const raise=Math.min(p.stack,Math.max(100,Math.floor((poker.currentBet||100)*(.6+r))));contribute(p,Math.max(0,poker.currentBet+raise-p.committed));poker.currentBet=p.committed;p.acted=true;dealer(`${p.name} raises.`);poker.players.forEach(x=>{if(x.id!==p.id&&x.inHand&&!x.folded)x.acted=false})}else if(strength>=1||r<.78){contribute(p,call);p.acted=true;dealer(`${p.name} calls.`)}else{p.folded=true;p.acted=true;dealer(`${p.name} folds.`)}renderPoker();afterAction()},650+Math.random()*550)}
function updateRaiseLabel(){if(p$('raiseLabel')){p$('raiseLabel').textContent=money(+p$('raiseRange').value);p$('raiseAmount').textContent=money(+p$('raiseRange').value)}}
window.openPokerLobby=openPokerLobby;window.closePoker=closePoker;window.toggleFullscreenPoker=toggleFullscreenPoker;window.openPokerRules=openPokerRules;window.closePokerRules=closePokerRules;window.pokerAction=pokerAction;window.updateRaiseLabel=updateRaiseLabel;
