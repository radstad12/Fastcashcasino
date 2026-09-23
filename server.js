import express from "express";
import Database from "better-sqlite3";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const DATABASE_FILE = process.env.DATABASE_FILE || "./data/casino.sqlite";
const INITIAL_BANKROLL = Number(process.env.INITIAL_CASINO_BANKROLL || 500000);
const MIN_RESERVE = Number(process.env.MINIMUM_CASINO_RESERVE || 0);

fs.mkdirSync(path.dirname(path.resolve(DATABASE_FILE)), { recursive: true });

const db = new Database(DATABASE_FILE);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS casino (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  bankroll INTEGER NOT NULL,
  minimum_reserve INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  min_bet INTEGER NOT NULL,
  max_bet INTEGER NOT NULL,
  house_edge REAL NOT NULL,
  symbols_json TEXT NOT NULL,
  payouts_json TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  player_id TEXT,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  player_balance_after INTEGER,
  casino_bankroll_after INTEGER,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);
`);

const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();

const casinoExists = db.prepare("SELECT id FROM casino WHERE id=1").get();
if (!casinoExists) {
  db.prepare(`
    INSERT INTO casino(id, bankroll, minimum_reserve, created_at, updated_at)
    VALUES(1, ?, ?, ?, ?)
  `).run(INITIAL_BANKROLL, MIN_RESERVE, now(), now());
}

const games = [
  ["ruby-seven", "Ruby Sevens", 10, 5000, 0.05, ["7","BAR","🍒","🍋","🔔"], {"7":50,"BAR":15,"🍒":8,"🍋":5,"🔔":3}],
  ["diamond-bar", "Diamond BAR", 10, 5000, 0.05, ["💎","BAR","7","🍒","🍋"], {"💎":40,"BAR":15,"7":8,"🍒":5,"🍋":3}],
  ["neon-fruits", "Neon Fruits", 5, 2500, 0.05, ["🍒","🍋","🍊","🍉","7"], {"7":35,"🍉":12,"🍊":8,"🍋":5,"🍒":3}],
  ["lucky-777", "Lucky 777", 25, 10000, 0.05, ["7","7","7","BAR","🍒"], {"7":30,"BAR":10,"🍒":4}],
  ["gold-rush", "Gold Rush", 10, 5000, 0.05, ["🪙","💰","7","BAR","🍋"], {"💰":25,"🪙":12,"7":8,"BAR":5,"🍋":3}],
  ["royal-crown", "Royal Crown", 20, 7500, 0.05, ["👑","💎","7","BAR","🔔"], {"👑":30,"💎":15,"7":8,"BAR":5,"🔔":3}],
  ["night-club", "Night Club", 5, 3000, 0.05, ["💜","💙","💚","7","BAR"], {"💜":20,"💙":10,"💚":7,"7":5,"BAR":3}],
  ["wild-west", "Wild West", 10, 5000, 0.05, ["🤠","⭐","7","BAR","🍒"], {"🤠":25,"⭐":12,"7":7,"BAR":5,"🍒":3}],
  ["space-cash", "Space Cash", 10, 5000, 0.05, ["🚀","🪐","👽","7","💎"], {"🚀":30,"🪐":15,"👽":8,"7":5,"💎":3}],
  ["casino-royale", "Casino Royale", 50, 20000, 0.05, ["♠️","♥️","♦️","♣️","7"], {"7":50,"♠️":12,"♥️":8,"♦️":6,"♣️":4}]
];

const insertGame = db.prepare(`
  INSERT OR IGNORE INTO games
  (id,name,min_bet,max_bet,house_edge,symbols_json,payouts_json,enabled)
  VALUES(?,?,?,?,?,?,?,1)
`);
for (const g of games) insertGame.run(g[0],g[1],g[2],g[3],g[4],JSON.stringify(g[5]),JSON.stringify(g[6]));

function getCasino() {
  return db.prepare("SELECT * FROM casino WHERE id=1").get();
}
function getPlayer(id) {
  return db.prepare("SELECT * FROM players WHERE id=?").get(id);
}
function getGame(id) {
  return db.prepare("SELECT * FROM games WHERE id=? AND enabled=1").get(id);
}
function addTransaction(playerId, type, amount, playerBalanceAfter, casinoBankrollAfter, metadata={}) {
  db.prepare(`
    INSERT INTO transactions
    (id,player_id,type,amount,player_balance_after,casino_bankroll_after,metadata_json,created_at)
    VALUES(?,?,?,?,?,?,?,?)
  `).run(uid(), playerId, type, amount, playerBalanceAfter, casinoBankrollAfter, JSON.stringify(metadata), now());
}

function weightedSymbol(game) {
  // Simple weighted pool. Higher-paying symbols are intentionally rarer.
  const weights = game.symbols.map(s => {
    const p = JSON.parse(game.payouts_json)[s] || 1;
    return Math.max(1, Math.round(100 / p));
  });
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  for (let i=0;i<game.symbols.length;i++) {
    r -= weights[i];
    if (r <= 0) return game.symbols[i];
  }
  return game.symbols.at(-1);
}

function spinOutcome(game) {
  return [weightedSymbol(game), weightedSymbol(game), weightedSymbol(game)];
}

function calculatePayout(game, bet, reels) {
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    const multiplier = JSON.parse(game.payouts_json)[reels[0]] || 0;
    return Math.floor(bet * multiplier);
  }
  // Small consolation for two matching symbols, if configured.
  if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
    const s = reels[0] === reels[1] ? reels[0] : (reels[1] === reels[2] ? reels[1] : reels[0]);
    const multiplier = Math.floor((JSON.parse(game.payouts_json)[s] || 0) / 5);
    return Math.floor(bet * multiplier);
  }
  return 0;
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/games", (req,res) => {
  const rows = db.prepare("SELECT id,name,min_bet,max_bet,house_edge,symbols_json,payouts_json FROM games WHERE enabled=1").all();
  res.json(rows.map(r => ({...r, symbols: JSON.parse(r.symbols_json), payouts: JSON.parse(r.payouts_json)})));
});

app.post("/api/players", (req,res) => {
  const id = String(req.body?.id || "").trim();
  if (!id || id.length > 80) return res.status(400).json({error:"Invalid player id"});
  const existing = getPlayer(id);
  if (existing) return res.json(existing);

  const t = now();
  db.prepare("INSERT INTO players(id,balance,created_at,updated_at) VALUES(?,?,?,?)").run(id,0,t,t);
  addTransaction(id,"PLAYER_CREATED",0,0,getCasino().bankroll);
  res.json(getPlayer(id));
});

app.get("/api/players/:id", (req,res) => {
  const p = getPlayer(req.params.id);
  if (!p) return res.status(404).json({error:"Player not found"});
  res.json(p);
});

// Development/game-economy deposit endpoint.
// Protect this with server-to-server auth before connecting FiveM.
app.post("/api/players/:id/deposit", (req,res) => {
  const amount = Math.floor(Number(req.body?.amount));
  const p = getPlayer(req.params.id);
  if (!p || !Number.isFinite(amount) || amount <= 0 || amount > 1000000) {
    return res.status(400).json({error:"Invalid deposit"});
  }

  const tx = db.transaction(() => {
    const player = getPlayer(req.params.id);
    const balance = player.balance + amount;
    db.prepare("UPDATE players SET balance=?,updated_at=? WHERE id=?").run(balance,now(),req.params.id);
    addTransaction(req.params.id,"DEPOSIT",amount,balance,getCasino().bankroll);
    return balance;
  });
  res.json({playerId:req.params.id,balance:tx()});
});

app.get("/api/casino", (req,res) => {
  const c = getCasino();
  res.json({
    bankroll:c.bankroll,
    minimumReserve:c.minimum_reserve,
    safeAvailable:c.bankroll - c.minimum_reserve
  });
});

app.post("/api/spin", (req,res) => {
  const playerId = String(req.body?.playerId || "").trim();
  const gameId = String(req.body?.gameId || "").trim();
  const bet = Math.floor(Number(req.body?.bet));

  if (!playerId || !gameId || !Number.isFinite(bet) || !Number.isInteger(bet)) {
    return res.status(400).json({error:"Invalid spin request"});
  }

  const result = db.transaction(() => {
    const player = getPlayer(playerId);
    const game = getGame(gameId);
    let casino = getCasino();

    if (!player) throw new Error("PLAYER_NOT_FOUND");
    if (!game) throw new Error("GAME_NOT_FOUND");
    if (bet < game.min_bet || bet > game.max_bet) throw new Error("INVALID_BET");
    if (player.balance < bet) throw new Error("INSUFFICIENT_PLAYER_BALANCE");

    // The stake enters the casino first.
    const balanceAfterBet = player.balance - bet;
    const bankrollAfterBet = casino.bankroll + bet;

    // Generate the result server-side.
    const reels = spinOutcome(game);
    let payout = calculatePayout(game, bet, reels);

    // Hard bankroll invariant:
    // casino bankroll can NEVER fall below the configured reserve.
    const maxSafePayout = Math.max(0, bankrollAfterBet - casino.minimum_reserve);
    if (payout > maxSafePayout) payout = maxSafePayout;

    const finalBalance = balanceAfterBet + payout;
    const finalBankroll = bankrollAfterBet - payout;

    db.prepare("UPDATE players SET balance=?,updated_at=? WHERE id=?")
      .run(finalBalance,now(),playerId);
    db.prepare("UPDATE casino SET bankroll=?,updated_at=? WHERE id=1")
      .run(finalBankroll,now());

    addTransaction(playerId,"SPIN",bet,finalBalance,finalBankroll,{
      gameId, reels, payout, houseEdge: game.house_edge
    });

    return {reels,bet,payout,balance:finalBalance,casinoBankroll:finalBankroll};
  });

  try {
    res.json(result());
  } catch (e) {
    const errors = {
      PLAYER_NOT_FOUND:["Player not found",404],
      GAME_NOT_FOUND:["Game not found",404],
      INVALID_BET:["Invalid bet",400],
      INSUFFICIENT_PLAYER_BALANCE:["Not enough tokens",400]
    };
    const [msg,status] = errors[e.message] || ["Spin failed",500];
    res.status(status).json({error:msg});
  }
});

function adminAuth(req,res,next) {
  const expectedUser = process.env.ADMIN_USERNAME || "chicano";
  const expectedPass = process.env.ADMIN_PASSWORD || "change-this-password";
  const auth = String(req.headers.authorization || "");
  if (!auth.startsWith("Basic ")) return res.status(401).json({error:"Admin authentication required"});
  const decoded = Buffer.from(auth.slice(6),"base64").toString("utf8");
  const [user,...rest] = decoded.split(":");
  const pass = rest.join(":");
  if (user !== expectedUser || pass !== expectedPass) return res.status(403).json({error:"Forbidden"});
  next();
}

app.get("/api/admin/transactions", adminAuth, (req,res) => {
  const rows = db.prepare("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 200").all();
  res.json(rows);
});

app.post("/api/admin/casino/adjust", adminAuth, (req,res) => {
  const amount = Math.floor(Number(req.body?.amount));
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) return res.status(400).json({error:"Invalid amount"});

  const result = db.transaction(() => {
    const c = getCasino();
    const newBankroll = c.bankroll + amount;
    if (newBankroll < c.minimum_reserve) throw new Error("RESERVE_VIOLATION");

    db.prepare("UPDATE casino SET bankroll=?,updated_at=? WHERE id=1").run(newBankroll,now());
    addTransaction(null,"ADMIN_BANKROLL_ADJUSTMENT",amount,null,newBankroll,{});
    return newBankroll;
  });

  try {
    res.json({bankroll:result()});
  } catch {
    res.status(400).json({error:"Adjustment would violate minimum reserve"});
  }
});

app.get("/admin.html", (req,res) => {
  res.sendFile(path.join(__dirname,"public","admin.html"));
});

app.listen(PORT, () => {
  console.log(`Casino running on http://localhost:${PORT}`);
});
