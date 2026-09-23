import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT || 3000);
const DB_FILE = process.env.DATABASE_FILE || "./data/casino.sqlite";
const INITIAL = Number(process.env.INITIAL_CASINO_BANKROLL || 500000);
const RESERVE = Number(process.env.MINIMUM_CASINO_RESERVE || 0);

fs.mkdirSync(path.dirname(path.resolve(DB_FILE)), {recursive:true});
const db = new Database(DB_FILE);
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS casino (
 id INTEGER PRIMARY KEY CHECK(id=1),
 bankroll INTEGER NOT NULL,
 reserve INTEGER NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS players (
 id TEXT PRIMARY KEY,
 balance INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS games (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 min_bet INTEGER NOT NULL,
 max_bet INTEGER NOT NULL,
 symbols TEXT NOT NULL,
 payouts TEXT NOT NULL,
 rtp REAL NOT NULL,
 enabled INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS transactions (
 id TEXT PRIMARY KEY,
 player_id TEXT,
 type TEXT NOT NULL,
 amount INTEGER NOT NULL,
 payout INTEGER NOT NULL DEFAULT 0,
 player_balance_after INTEGER,
 casino_bankroll_after INTEGER,
 game_id TEXT,
 reels TEXT,
 created_at TEXT NOT NULL
);
`);

const now=()=>new Date().toISOString();
const id=()=>crypto.randomUUID();

if(!db.prepare("SELECT id FROM casino WHERE id=1").get()){
  db.prepare("INSERT INTO casino VALUES(1,?,?,?)").run(INITIAL,RESERVE,now());
}

const configs=[
["ruby","Ruby Sevens",10,5000,["7","BAR","🍒","🍋","🔔"],{"7":50,"BAR":15,"🍒":8,"🍋":5,"🔔":3},0.95],
["diamond","Diamond BAR",10,5000,["💎","BAR","7","🍒","🍋"],{"💎":40,"BAR":15,"7":8,"🍒":5,"🍋":3},0.95],
["fruits","Neon Fruits",5,2500,["🍒","🍋","🍊","🍉","7"],{"7":35,"🍉":12,"🍊":8,"🍋":5,"🍒":3},0.96],
["777","Lucky 777",25,10000,["7","BAR","🍒","🍋","7"],{"7":30,"BAR":10,"🍒":4},0.95],
["gold","Gold Rush",10,5000,["🪙","💰","7","BAR","🍋"],{"💰":25,"🪙":12,"7":8,"BAR":5,"🍋":3},0.95],
["royal","Royal Crown",20,7500,["👑","💎","7","BAR","🔔"],{"👑":30,"💎":15,"7":8,"BAR":5,"🔔":3},0.95],
["club","Night Club",5,3000,["💜","💙","💚","7","BAR"],{"💜":20,"💙":10,"💚":7,"7":5,"BAR":3},0.95],
["west","Wild West",10,5000,["🤠","⭐","7","BAR","🍒"],{"🤠":25,"⭐":12,"7":7,"BAR":5,"🍒":3},0.95],
["space","Space Cash",10,5000,["🚀","🪐","👽","7","💎"],{"🚀":30,"🪐":15,"👽":8,"7":5,"💎":3},0.95],
["royale","Casino Royale",50,20000,["♠️","♥️","♦️","♣️","7"],{"7":50,"♠️":12,"♥️":8,"♦️":6,"♣️":4},0.95]
];
const ins=db.prepare(`INSERT OR IGNORE INTO games VALUES(?,?,?,?,?,?,?,1)`);
for(const g of configs) ins.run(g[0],g[1],g[2],g[3],JSON.stringify(g[4]),JSON.stringify(g[5]),g[6]);

function casino(){return db.prepare("SELECT * FROM casino WHERE id=1").get()}
function player(pid){return db.prepare("SELECT * FROM players WHERE id=?").get(pid)}
function game(gid){return db.prepare("SELECT * FROM games WHERE id=? AND enabled=1").get(gid)}
function tx(pid,type,amount,payout,pbal,cbal,gid,reels){
 db.prepare(`INSERT INTO transactions VALUES(?,?,?,?,?,?,?,?,?,?)`)
 .run(id(),pid,type,amount,payout,pbal,cbal,gid,reels?JSON.stringify(reels):null,now());
}

function pick(g){
 const sy=JSON.parse(g.symbols), pay=JSON.parse(g.payouts);
 // Higher payouts are rarer. This is a simple configurable slot model.
 const weights=sy.map(s=>Math.max(1,Math.round(100/(pay[s]||1))));
 const total=weights.reduce((a,b)=>a+b,0);
 let r=Math.random()*total;
 for(let i=0;i<sy.length;i++){r-=weights[i];if(r<=0)return sy[i]}
 return sy.at(-1);
}
function reels(g){return [pick(g),pick(g),pick(g)]}
function payout(g,bet,r){
 if(r[0]!==r[1]||r[1]!==r[2]) return 0;
 return bet*(JSON.parse(g.payouts)[r[0]]||0);
}

const app=express();
app.use(cors());
app.use(express.json());

app.get("/api/health",(req,res)=>res.json({ok:true}));
app.get("/api/casino",(req,res)=>{
 const c=casino(); res.json({bankroll:c.bankroll,reserve:c.reserve,available:c.bankroll-c.reserve});
});
app.get("/api/games",(req,res)=>{
 const rows=db.prepare("SELECT id,name,min_bet,max_bet,symbols,payouts,rtp FROM games WHERE enabled=1").all();
 res.json(rows.map(x=>({...x,symbols:JSON.parse(x.symbols),payouts:JSON.parse(x.payouts)})));
});
app.post("/api/players",(req,res)=>{
 const pid=String(req.body?.id||"").trim();
 if(!pid||pid.length>80)return res.status(400).json({error:"Invalid player id"});
 let p=player(pid);
 if(!p){db.prepare("INSERT INTO players VALUES(?,?,?)").run(pid,0,now());p=player(pid)}
 res.json(p);
});
app.get("/api/players/:id",(req,res)=>{
 const p=player(req.params.id); if(!p)return res.status(404).json({error:"Player not found"}); res.json(p);
});

// Development-only economy endpoint. Authenticate FiveM server-to-server before production use.
app.post("/api/players/:id/deposit",(req,res)=>{
 const amount=Math.floor(Number(req.body?.amount)), pid=req.params.id;
 if(!player(pid)||!Number.isSafeInteger(amount)||amount<=0)return res.status(400).json({error:"Invalid deposit"});
 const result=db.transaction(()=>{
   const p=player(pid), c=casino(), b=p.balance+amount;
   db.prepare("UPDATE players SET balance=?,updated_at=? WHERE id=?").run(b,now(),pid);
   tx(pid,"DEPOSIT",amount,0,b,c.bankroll,null,null);
   return b;
 })();
 res.json({playerId:pid,balance:result});
});

app.post("/api/spin",(req,res)=>{
 const pid=String(req.body?.playerId||"").trim();
 const gid=String(req.body?.gameId||"").trim();
 const bet=Math.floor(Number(req.body?.bet));
 try{
  const result=db.transaction(()=>{
    const p=player(pid), g=game(gid), c=casino();
    if(!p)throw Error("PLAYER_NOT_FOUND");
    if(!g)throw Error("GAME_NOT_FOUND");
    if(!Number.isSafeInteger(bet)||bet<g.min_bet||bet>g.max_bet)throw Error("INVALID_BET");
    if(p.balance<bet)throw Error("INSUFFICIENT_BALANCE");

    const afterBet=p.balance-bet;
    const bankrollAfterBet=c.bankroll+bet;
    const r=reels(g);
    let win=payout(g,bet,r);

    // Absolute invariant: final casino bankroll >= reserve.
    win=Math.min(win,Math.max(0,bankrollAfterBet-c.reserve));
    const finalBalance=afterBet+win;
    const finalBankroll=bankrollAfterBet-win;

    db.prepare("UPDATE players SET balance=?,updated_at=? WHERE id=?").run(finalBalance,now(),pid);
    db.prepare("UPDATE casino SET bankroll=?,updated_at=? WHERE id=1").run(finalBankroll,now());
    tx(pid,"SPIN",bet,win,finalBalance,finalBankroll,gid,r);

    return {reels:r,payout:win,balance:finalBalance,casinoBankroll:finalBankroll,bet};
  })();
  res.json(result);
 }catch(e){
  const map={PLAYER_NOT_FOUND:["Player not found",404],GAME_NOT_FOUND:["Game not found",404],INVALID_BET:["Invalid bet",400],INSUFFICIENT_BALANCE:["Not enough tokens",400]};
  const [message,status]=map[e.message]||["Spin failed",500];
  res.status(status).json({error:message});
 }
});

function auth(req,res,next){
 const expected=process.env.ADMIN_USERNAME||"chicano", pass=process.env.ADMIN_PASSWORD||"CHANGE_ME_NOW";
 const h=String(req.headers.authorization||"");
 if(!h.startsWith("Basic "))return res.status(401).json({error:"Authentication required"});
 const [u,...rest]=Buffer.from(h.slice(6),"base64").toString().split(":");
 if(u!==expected||rest.join(":")!==pass)return res.status(403).json({error:"Forbidden"});
 next();
}
app.get("/api/admin/transactions",auth,(req,res)=>{
 res.json(db.prepare("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 300").all());
});
app.post("/api/admin/casino/adjust",auth,(req,res)=>{
 const amount=Math.floor(Number(req.body?.amount));
 try{
  const b=db.transaction(()=>{
    const c=casino(), next=c.bankroll+amount;
    if(!Number.isSafeInteger(amount)||next<c.reserve)throw Error();
    db.prepare("UPDATE casino SET bankroll=?,updated_at=? WHERE id=1").run(next,now());
    tx(null,"ADMIN_ADJUSTMENT",amount,0,null,next,null,null);
    return next;
  })();
  res.json({bankroll:b});
 }catch{res.status(400).json({error:"Invalid adjustment"});}
});

app.listen(PORT,()=>console.log(`FastCash backend listening on ${PORT}`));
