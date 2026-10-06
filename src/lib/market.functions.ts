import { createServerFn } from "@tanstack/react-start";
import { FUT_SYMBOLS, SPOT_SYMBOLS, type FutRow, type MarketSnapshot, type SpotRow } from "@/lib/market";

type SpotStats = {
  symbol?: string;
  last?: string | number;
  high?: string | number;
  low?: string | number;
  changeRate?: string | number;
};

type FutContract = {
  symbol?: string;
  markPrice?: string | number;
  indexPrice?: string | number;
  lastTradePrice?: string | number;
  priceChgPct?: string | number;
};

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : NaN;
}

async function pullJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`KuCoin ${res.status}`);
  return res.json();
}

export const getMarket = createServerFn({ method: "GET" }).handler(async (): Promise<MarketSnapshot> => {
  const started = Date.now();
  try {
    const [spots, futs, stamp] = await Promise.all([
      Promise.all(
        SPOT_SYMBOLS.map((symbol) =>
          pullJson(`https://api.kucoin.com/api/v1/market/stats?symbol=${symbol}`),
        ),
      ),
      Promise.all(
        FUT_SYMBOLS.map((symbol) =>
          pullJson(`https://api-futures.kucoin.com/api/v1/contracts/${symbol}`),
        ),
      ),
      pullJson("https://api.kucoin.com/api/v1/timestamp"),
    ]);

    const spot: SpotRow[] = spots.map((raw, i) => {
      const data = (raw as { data?: SpotStats }).data ?? {};
      return {
        symbol: data.symbol || SPOT_SYMBOLS[i],
        price: num(data.last),
        changePct: num(data.changeRate) * 100,
        high: num(data.high),
        low: num(data.low),
      };
    });

    const futures: FutRow[] = futs.map((raw, i) => {
      const data = (raw as { data?: FutContract }).data ?? {};
      return {
        symbol: data.symbol || FUT_SYMBOLS[i],
        mark: num(data.markPrice),
        index: num(data.indexPrice),
        last: num(data.lastTradePrice),
        changePct: num(data.priceChgPct) * 100,
      };
    });

    const serverTime = num((stamp as { data?: unknown }).data);
    return {
      ok: true,
      spot,
      futures,
      fetchedAt: Date.now(),
      pingMs: Date.now() - started,
      serverTime: Number.isFinite(serverTime) ? serverTime : null,
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      spot: [],
      futures: [],
      fetchedAt: Date.now(),
      pingMs: null,
      serverTime: null,
      error: err instanceof Error ? err.message : "FEED LOST",
    };
  }
});
