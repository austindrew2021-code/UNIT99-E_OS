export const PAGES_URL = "https://austindrew2021-code.github.io/";

export const SPOT_SYMBOLS = ["BTC-USDT", "ETH-USDT", "SOL-USDT", "KCS-USDT"] as const;
export const FUT_SYMBOLS = ["XBTUSDTM", "ETHUSDTM", "SOLUSDTM"] as const;

export const MIRAMICHI = { lat: 47.028, lon: -65.465, source: "chart" as const };

export type SpotRow = {
  symbol: string;
  price: number;
  changePct: number;
  high: number;
  low: number;
};

export type FutRow = {
  symbol: string;
  mark: number;
  index: number;
  last: number;
  changePct: number;
};

export type MarketSnapshot = {
  ok: boolean;
  spot: SpotRow[];
  futures: FutRow[];
  fetchedAt: number;
  pingMs: number | null;
  serverTime: number | null;
  error: string | null;
};

export function money(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1000) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (n >= 1) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

export function signedPct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const v = n.toFixed(2);
  return `${n >= 0 ? "+" : ""}${v}%`;
}

export function atlanticClock(d = new Date()): string {
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Moncton",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
  const zone =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Moncton",
      timeZoneName: "short",
    })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value ?? "AT";
  return `${time} ${zone}`;
}

export function osmEmbed(lat: number, lon: number): string {
  const dLat = 0.09;
  const dLon = 0.14;
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].map((n) => n.toFixed(4)).join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat.toFixed(4)}%2C${lon.toFixed(4)}`;
}
