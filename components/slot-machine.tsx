"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spinSlotMachine, type SlotMachineResult } from "@/app/actions/spin";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "💎", "7️⃣"];
const STARTING_BALANCE = 100;
const DEFAULT_BET = 5;
const MIN_BET = 1;
const MAX_BET = 100;
const SPIN_INTERVAL_MS = 80;
const MIN_SPIN_DURATION = 1200;
const REEL_SETTLE_DELAYS = [0, 260, 520] as const;
const FINAL_SETTLE_EXTRA = 580;

const PAY_TABLE = [
  { display: "💎 💎 💎", name: "Diamonds", payout: "1000×" },
  { display: "7️⃣ 7️⃣ 7️⃣", name: "Sevens", payout: "500×" },
  { display: "⭐ ⭐ ⭐", name: "Stars", payout: "250×" },
  { display: "🔔 🔔 🔔", name: "Bells", payout: "100×" },
  { display: "🍇 🍇 🍇", name: "Grapes", payout: "50×" },
  { display: "🍊 🍊 🍊", name: "Oranges", payout: "25×" },
  { display: "🍋 🍋 🍋", name: "Lemons", payout: "15×" },
  { display: "🍒 🍒 🍒", name: "Cherries", payout: "10×" },
  { display: "💎 💎 ✕", name: "Two Diamonds", payout: "20×" },
  { display: "7️⃣ 7️⃣ ✕", name: "Two Sevens", payout: "15×" },
  { display: "⭐ ⭐ ✕", name: "Two Stars", payout: "10×" },
  { display: "🔔 🔔 ✕", name: "Two Bells", payout: "5×" },
  { display: "🍒 🍒 ✕", name: "Two Cherries", payout: "2×" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "spinning" | "settling";

interface Reel {
  sym: string;
  key: string;
}

interface HistoryEntry {
  id: string;
  reels: string[];
  bet: number;
  winAmount: number;
  isWin: boolean;
  combination?: string;
  balanceAfter: number;
}

function randomSymbol(): string {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// ─── ReelCell ─────────────────────────────────────────────────────────────────

interface ReelCellProps {
  reel: Reel;
  isSpinning: boolean;
  isWin: boolean;
}

function ReelCell({ reel, isSpinning, isWin }: ReelCellProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden w-20 h-24 rounded-xl border-2 bg-card flex items-center justify-center select-none",
        isWin
          ? "border-yellow-400/70 shadow-[0_0_14px_rgba(234,179,8,0.3)]"
          : "border-border/60",
      )}
      animate={isWin ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.span
          key={reel.key}
          className="absolute text-4xl"
          initial={{ y: -44, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 44, opacity: 0 }}
          transition={
            isSpinning
              ? { duration: 0.07, ease: "linear" }
              : { type: "spring", stiffness: 280, damping: 24 }
          }
          aria-label={reel.sym}
        >
          {reel.sym}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SlotMachine ──────────────────────────────────────────────────────────────

export function SlotMachine() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [bet, setBet] = useState(DEFAULT_BET);
  const [reels, setReels] = useState<Reel[]>([
    { sym: "🎰", key: "init-0" },
    { sym: "🎰", key: "init-1" },
    { sym: "🎰", key: "init-2" },
  ]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lastResult, setLastResult] = useState<SlotMachineResult | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [showPayTable, setShowPayTable] = useState(false);

  const counterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleSpin = useCallback(async () => {
    if (phase !== "idle" || isGameOver) return;
    const currentBalance = balance;
    const currentBet = Math.min(bet, currentBalance);
    if (currentBet <= 0) return;

    setLastResult(null);
    setLastError(null);
    setPhase("spinning");

    intervalRef.current = setInterval(() => {
      const c = ++counterRef.current;
      setReels([
        { sym: randomSymbol(), key: `s${c}-0` },
        { sym: randomSymbol(), key: `s${c}-1` },
        { sym: randomSymbol(), key: `s${c}-2` },
      ]);
    }, SPIN_INTERVAL_MS);

    let spinResult: { result?: SlotMachineResult; error?: string };
    try {
      const [apiResult] = await Promise.all([
        spinSlotMachine(currentBet),
        new Promise<void>((resolve) => setTimeout(resolve, MIN_SPIN_DURATION)),
      ]);
      spinResult = apiResult;
    } catch (err) {
      stopInterval();
      setLastError(err instanceof Error ? err.message : "Connection error");
      setPhase("idle");
      return;
    }

    stopInterval();

    const { result, error } = spinResult;

    if (error || !result) {
      setLastError(error ?? "No result received");
      setPhase("idle");
      return;
    }

    setPhase("settling");

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Stagger each reel to its final symbol
    REEL_SETTLE_DELAYS.forEach((delay, i) => {
      const t = setTimeout(() => {
        const c = ++counterRef.current;
        setReels((prev) => {
          const next = [...prev];
          next[i] = { sym: result.reels[i], key: `f${c}-${i}` };
          return next;
        });
      }, delay);
      timeouts.push(t);
    });

    // Commit balance + history after all reels have settled
    const commitDelay =
      REEL_SETTLE_DELAYS[REEL_SETTLE_DELAYS.length - 1] + FINAL_SETTLE_EXTRA;

    const finalT = setTimeout(() => {
      const newBalance = currentBalance - currentBet + result.winAmount;
      setLastResult(result);
      setBalance(newBalance);
      setSpinCount((prev) => prev + 1);
      setHistory((prev) =>
        [
          {
            id: result.spinId,
            reels: result.reels,
            bet: currentBet,
            winAmount: result.winAmount,
            isWin: result.isWin,
            combination: result.combination,
            balanceAfter: newBalance,
          },
          ...prev,
        ].slice(0, 10),
      );
      if (newBalance <= 0) {
        setIsGameOver(true);
      }
      setPhase("idle");
    }, commitDelay);

    timeouts.push(finalT);
    timeoutsRef.current = timeouts;
  }, [phase, isGameOver, bet, balance, stopInterval]);

  const handleReset = useCallback(() => {
    stopInterval();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    counterRef.current = 0;
    setBalance(STARTING_BALANCE);
    setBet(DEFAULT_BET);
    setReels([
      { sym: "🎰", key: "reset-0" },
      { sym: "🎰", key: "reset-1" },
      { sym: "🎰", key: "reset-2" },
    ]);
    setPhase("idle");
    setLastResult(null);
    setLastError(null);
    setHistory([]);
    setIsGameOver(false);
    setSpinCount(0);
  }, [stopInterval]);

  const isBusy = phase !== "idle";
  const isSpinning = phase === "spinning";
  const showWin = !!lastResult?.isWin && phase === "idle";
  const effectiveBet = Math.min(bet, balance);

  return (
    <div className="flex flex-col items-start gap-6 w-full max-w-sm mx-auto min-h-dvh p-4">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between w-full">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          slot_machine_api — live demo
        </p>
        <div className="flex items-center gap-3">
          <motion.div
            className={cn(
              "font-mono text-sm font-bold px-3 py-1 rounded-lg border",
              balance <= 20 && balance > 0
                ? "border-red-400/40 text-red-400 bg-red-400/5"
                : "border-border/60 text-foreground bg-card",
            )}
            animate={
              balance <= 20 && balance > 0
                ? { opacity: [1, 0.45, 1] }
                : { opacity: 1 }
            }
            transition={
              balance <= 20 && balance > 0
                ? { repeat: Infinity, duration: 1.4, ease: "easeInOut" }
                : {}
            }
          >
            ${balance.toFixed(0)}
          </motion.div>
          <button
            onClick={handleReset}
            disabled={isBusy}
            className="p-1.5 rounded-lg border border-border/60 bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Reset game to $100"
            title="Reset to $100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Machine Body ──────────────────────────────────────────── */}
      <div className="relative w-full">
        {/* Reels */}
        <div className="flex gap-3 justify-center py-8 px-6 rounded-2xl border border-border/40 bg-card/30">
          {reels.map((reel, i) => (
            <ReelCell
              key={i}
              reel={reel}
              isSpinning={isSpinning}
              isWin={showWin}
            />
          ))}
        </div>

        {/* Result line */}
        <div className="h-8 mt-2 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {lastError && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-400 font-medium"
              >
                {lastError}
              </motion.p>
            )}
            {lastResult && phase === "idle" && !isGameOver && (
              <motion.p
                key={`result-${lastResult.spinId}`}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "text-sm font-bold tracking-wide",
                  lastResult.isWin
                    ? "text-yellow-400"
                    : "text-muted-foreground/60",
                )}
              >
                {lastResult.isWin
                  ? `${lastResult.combination ?? "Win"}!  +$${lastResult.winAmount}`
                  : "No win — spin again"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Game Over overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 bg-background/88 backdrop-blur-sm"
            >
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                game over
              </p>
              <p className="text-2xl font-black tracking-tight text-foreground">
                {spinCount} {spinCount === 1 ? "spin" : "spins"}
              </p>
              <p className="text-xs text-muted-foreground">
                You spun until you went bust
              </p>
              <motion.button
                onClick={handleReset}
                whileTap={{ scale: 0.95 }}
                className="mt-1 px-6 py-2 rounded-xl bg-foreground text-background text-sm font-bold tracking-wide hover:opacity-80 transition-opacity"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls ──────────────────────────────────────────────── */}
      {!isGameOver && (
        <div className="flex items-center gap-3 w-full">
          {/* Bet stepper */}
          <div className="flex items-center rounded-xl border border-border/60 bg-card overflow-hidden">
            <button
              onClick={() => setBet((b) => Math.max(MIN_BET, b - 1))}
              disabled={isBusy || bet <= MIN_BET}
              className="w-9 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-lg leading-none border-r border-border/40"
              aria-label="Decrease bet by 1"
            >
              −
            </button>
            <span className="w-16 text-center font-mono text-sm font-bold text-foreground select-none">
              ${effectiveBet}
            </span>
            <button
              onClick={() =>
                setBet((b) => Math.min(Math.min(MAX_BET, balance), b + 1))
              }
              disabled={isBusy || bet >= balance}
              className="w-9 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-lg leading-none border-l border-border/40"
              aria-label="Increase bet by 1"
            >
              +
            </button>
          </div>

          {/* Spin button */}
          <motion.button
            onClick={handleSpin}
            disabled={isBusy || balance <= 0}
            whileTap={!isBusy ? { scale: 0.96 } : undefined}
            className="flex-1 h-10 rounded-xl bg-foreground text-background text-sm font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {phase === "spinning"
              ? "Spinning…"
              : phase === "settling"
                ? "Settling…"
                : "Spin  🎰"}
          </motion.button>
        </div>
      )}

      {/* ── Pay Table ─────────────────────────────────────────────── */}
      <div className="w-full">
        <button
          onClick={() => setShowPayTable((v) => !v)}
          className="flex items-center gap-2 text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors w-full text-left"
        >
          <motion.span
            animate={{ rotate: showPayTable ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block"
          >
            ▶
          </motion.span>
          Pay Table
        </button>

        <AnimatePresence>
          {showPayTable && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-border/40 bg-card/30 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left px-3 py-2 text-muted-foreground font-medium">
                        Symbols
                      </th>
                      <th className="text-left px-3 py-2 text-muted-foreground font-medium hidden sm:table-cell">
                        Combination
                      </th>
                      <th className="text-right px-3 py-2 text-muted-foreground font-medium">
                        Payout
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAY_TABLE.map((row, i) => (
                      <tr
                        key={i}
                        className={cn(
                          "border-b border-border/20 last:border-0",
                          i % 2 !== 0 && "bg-muted/5",
                        )}
                      >
                        <td className="px-3 py-1.5 font-mono text-sm tracking-wide">
                          {row.display}
                        </td>
                        <td className="px-3 py-1.5 text-muted-foreground hidden sm:table-cell">
                          {row.name}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-green-400">
                          {row.payout}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-3 py-2 text-[0.6rem] text-muted-foreground/40 border-t border-border/20">
                  Payouts are multipliers of your bet.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── History ───────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="w-full">
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            History
          </p>
          <div className="flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {history.map((entry) => {
                const net = entry.winAmount - entry.bet;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 bg-card/20 text-xs"
                  >
                    {/* Reels */}
                    <span className="font-mono text-sm shrink-0 w-18">
                      {entry.reels.join("")}
                    </span>
                    {/* Bet */}
                    <span className="text-muted-foreground/60 shrink-0">
                      −${entry.bet}
                    </span>
                    {/* Net change */}
                    <span
                      className={cn(
                        "font-mono font-bold ml-auto shrink-0",
                        net > 0 ? "text-green-400" : "text-muted-foreground/40",
                      )}
                    >
                      {net > 0 ? `+$${net}` : `−$${Math.abs(net)}`}
                    </span>
                    {/* Balance after */}
                    <span className="font-mono text-muted-foreground/60 shrink-0 w-10 text-right">
                      ${entry.balanceAfter}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
