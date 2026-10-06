import { useEffect, useMemo, useRef, useState } from "react";
import { getMarket } from "@/lib/market.functions";
import {
  MIRAMICHI,
  PAGES_URL,
  atlanticClock,
  money,
  osmEmbed,
  signedPct,
  type MarketSnapshot,
} from "@/lib/market";

type TabId = "stat" | "kucoin" | "map" | "apps" | "setup";
type Book = "spot" | "futures";
type Fix = { lat: number; lon: number; source: "chart" | "phone" };

const TABS: { id: TabId; label: string }[] = [
  { id: "stat", label: "STAT" },
  { id: "kucoin", label: "KUCOIN" },
  { id: "map", label: "MAP" },
  { id: "apps", label: "APPS" },
  { id: "setup", label: "SETUP" },
];

const APPS = [
  { href: "https://www.kucoin.com/trade/BTC-USDT", label: "KUCOIN TRADE", hint: "BTC-USDT ticket on the phone" },
  { href: "https://m.youtube.com", label: "YOUTUBE", hint: "Opens the player" },
  { href: "https://open.spotify.com", label: "SPOTIFY", hint: "Web player" },
  {
    href: "https://www.google.com/maps/search/?api=1&query=Miramichi,+NB",
    label: "GOOGLE MAPS",
    hint: "Miramichi, NB",
  },
];

const STEPS: { id: string; title: string; body: string }[] = [
  {
    id: "pages",
    title: "1 · DEPLOY  ·  2 MIN",
    body: "This cabin page is already on its own GitHub Pages repo. The strategy desk was not changed. Bookmark the address below on the S23 Ultra.",
  },
  {
    id: "dev",
    title: "2 · S23 ULTRA DEVELOPER  ·  2 MIN",
    body: "Settings → About phone → Software information → tap Build number 7 times. Open the Android Auto app → About → tap the version 10 times → Developer settings → turn on Unknown sources.",
  },
  {
    id: "aaad",
    title: "3 · AAAD + FERMATA  ·  2 MIN",
    body: "Install AAAD only from github.com/shmykelsa/AAAD. Other download sites are not the official app. In AAAD, install Fermata Auto and Fermata Control, then AABrowser so the 8-inch screen can open this page.",
  },
  {
    id: "car",
    title: "4 · SENTRA SR + KUCOIN  ·  3 MIN",
    body: "Use a data USB cable from the S23 Ultra to the 2025 Sentra SR. Accept Android Auto on the 8-inch display. Sign into KuCoin on the phone. This terminal only reads public prices. It never asks for your password or API keys.",
  },
  {
    id: "dual",
    title: "5 · BOOKMARK + DUAL SCREEN  ·  1 MIN",
    body: "On the car display, open AABrowser (or Fermata’s browser), load the Pages address, and bookmark it. Leave the KuCoin app on the phone. The 8-inch screen runs SR-LINK. Pull over before you send an order.",
  },
];

function beep(ctx: AudioContext | null, freq = 880) {
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

export function SrLink() {
  const [tab, setTab] = useState<TabId>("stat");
  const [theme, setTheme] = useState<"green" | "amber">("green");
  const [clock, setClock] = useState("00:00:00 AT");
  const [book, setBook] = useState<Book>("spot");
  const [snap, setSnap] = useState<MarketSnapshot | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [fix, setFix] = useState<Fix>(MIRAMICHI);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [booting, setBooting] = useState(true);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sr-link-theme");
    if (savedTheme === "amber" || savedTheme === "green") setTheme(savedTheme);
    try {
      const raw = localStorage.getItem("sr-link-steps");
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore bad local state */
    }
    const boot = window.setTimeout(() => setBooting(false), 1100);
    return () => window.clearTimeout(boot);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("amber", theme === "amber");
    localStorage.setItem("sr-link-theme", theme);
  }, [theme]);

  useEffect(() => {
    const tick = () => setClock(atlanticClock());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    const pull = async () => {
      try {
        const next = await getMarket();
        if (!alive) return;
        if (next.ok) {
          setSnap(next);
          setFeedError(null);
        } else if (next.error) {
          setFeedError(next.error);
          setSnap((prev) => prev ?? next);
        }
      } catch (err) {
        if (!alive) return;
        setFeedError(err instanceof Error ? err.message : "FEED LOST");
      }
    };
    void pull();
    const id = window.setInterval(() => void pull(), 10000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  const arm = () => {
    if (!audio.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) audio.current = new Ctx();
    }
  };

  const selectTab = (id: TabId) => {
    arm();
    beep(audio.current, 980);
    setTab(id);
  };

  const feedLabel = feedError
    ? `FEED ${feedError}`
    : snap?.ok
      ? `FEED LIVE ${atlanticClock(new Date(snap.fetchedAt))}`
      : "FEED LINKING";

  const mapSrc = useMemo(() => osmEmbed(fix.lat, fix.lon), [fix]);

  const toggleStep = (id: string) => {
    arm();
    beep(audio.current, 640);
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("sr-link-steps", JSON.stringify(next));
      return next;
    });
  };

  const copyUrl = async () => {
    arm();
    beep(audio.current, 720);
    try {
      await navigator.clipboard.writeText(PAGES_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const phoneFix = () => {
    arm();
    beep(audio.current, 540);
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setFix({ lat: pos.coords.latitude, lon: pos.coords.longitude, source: "phone" }),
      () => setFix(MIRAMICHI),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  };

  return (
    <div className="crt">
      {booting ? (
        <div className="boot" role="status">
          <p>SR-LINK 3000 MK IV</p>
          <p>CABIN BUS ................ OK</p>
          <p>S23 ULTRA BRIDGE ......... STANDBY</p>
          <p className="blink">KUCOIN PUBLIC FEED .... LINKING</p>
        </div>
      ) : null}
      <div className="bezel">
        <header className="topbar">
          <div>
            <div className="brand-mark">SR-LINK 3000</div>
            <div className="brand-sub">SENTRA SR · MK IV · DREW, AUSTIN</div>
          </div>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              arm();
              beep(audio.current, 620);
              setTheme((t) => (t === "green" ? "amber" : "green"));
            }}
          >
            COLOR {theme === "green" ? "GREEN" : "AMBER"}
          </button>
        </header>

        <nav className="tabs" aria-label="Cabin sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "tab is-on" : "tab"}
              aria-pressed={tab === item.id}
              onClick={() => selectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <main className="stage">
          {tab === "stat" ? (
            <StatPanel
              clock={clock}
              feedState={feedError ? "LOST" : snap?.ok ? "LIVE" : "LINKING"}
              pingMs={snap?.pingMs ?? null}
            />
          ) : null}
          {tab === "kucoin" ? (
            <KuCoinPanel
              book={book}
              snap={snap}
              feedError={feedError}
              onBook={(next) => {
                arm();
                beep(audio.current, 760);
                setBook(next);
              }}
            />
          ) : null}
          {tab === "map" ? (
            <MapPanel fix={fix} mapSrc={mapSrc} onFix={phoneFix} />
          ) : null}
          {tab === "apps" ? (
            <AppsPanel
              onOpen={() => {
                arm();
                beep(audio.current, 840);
              }}
            />
          ) : null}
          {tab === "setup" ? (
            <SetupPanel done={done} copied={copied} onToggle={toggleStep} onCopy={() => void copyUrl()} />
          ) : null}
        </main>

        <footer className="foot">
          <span>{clock}</span>
          <span className={feedError ? "down" : "blink"}>{feedLabel}</span>
          <span>S23 ULTRA · FERMATA TARGET</span>
        </footer>
      </div>
    </div>
  );
}

function StatPanel({ clock, feedState, pingMs }: { clock: string; feedState: string; pingMs: number | null }) {
  return (
    <section>
      <p className="kicker">STATUS</p>
      <h2 className="h-block">SENTRA SR CABIN</h2>
      <div className="stat-grid">
        <div className="plate">
          <div className="row"><span>OPERATOR</span><b>DREW, AUSTIN</b></div>
          <div className="row"><span>VEHICLE</span><b>2025 NISSAN SENTRA SR</b></div>
          <div className="row"><span>DISPLAY</span><b>8 INCH + S23 ULTRA USB</b></div>
          <div className="row"><span>CHART CENTRE</span><b>MIRAMICHI, NB</b></div>
          <div className="row"><span>LOCAL</span><b>{clock}</b></div>
        </div>
        <div className="meter">
          <div className="row">
            <span>LINK</span>
            <span className="bar" aria-hidden><i /></span>
          </div>
          <div className="row"><span>INTEGRITY</span><b>100</b></div>
          <div className="row"><span>RADS</span><b>0</b></div>
          <div className="row"><span>AP</span><b>110 / 110</b></div>
          <div className="row"><span>POWER</span><b>ONLINE</b></div>
          <div className="row"><span>ROUND TRIP</span><b>{pingMs == null ? "—" : `${pingMs} MS`}</b></div>
          <div className="row"><span>KUCOIN</span><b className={feedState === "LOST" ? "down" : undefined}>{feedState}</b></div>
        </div>
      </div>
    </section>
  );
}

function KuCoinPanel({
  book,
  snap,
  feedError,
  onBook,
}: {
  book: Book;
  snap: MarketSnapshot | null;
  feedError: string | null;
  onBook: (book: Book) => void;
}) {
  const rows = book === "spot" ? snap?.spot ?? [] : [];
  const futs = book === "futures" ? snap?.futures ?? [] : [];
  const empty = book === "spot" ? rows.length === 0 : futs.length === 0;
  return (
    <section>
      <div className="toolbar">
        <div>
          <p className="kicker">PUBLIC TAPE</p>
          <h2 className="h-block">KUCOIN</h2>
        </div>
        <div className="tabs">
          <button type="button" className={book === "spot" ? "tab is-on" : "tab"} onClick={() => onBook("spot")}>
            SPOT
          </button>
          <button type="button" className={book === "futures" ? "tab is-on" : "tab"} onClick={() => onBook("futures")}>
            FUTURES
          </button>
        </div>
      </div>
      <div className="tape-scroll">
        {book === "spot" ? (
          <table className="tape">
            <thead>
              <tr>
                <th>PAIR</th>
                <th>PRICE</th>
                <th>24H</th>
                <th>HIGH</th>
                <th>LOW</th>
              </tr>
            </thead>
            <tbody>
              {empty ? (
                <tr>
                  <td colSpan={5}>{feedError ? `> ${feedError}` : "> CONNECTING TO KUCOIN"}</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.symbol}>
                    <td><b>{row.symbol}</b></td>
                    <td>${money(row.price)}</td>
                    <td className={row.changePct < 0 ? "down" : undefined}>{signedPct(row.changePct)}</td>
                    <td>${money(row.high)}</td>
                    <td>${money(row.low)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="tape">
            <thead>
              <tr>
                <th>CONTRACT</th>
                <th>MARK</th>
                <th>INDEX</th>
                <th>LAST</th>
                <th>24H</th>
              </tr>
            </thead>
            <tbody>
              {empty ? (
                <tr>
                  <td colSpan={5}>{feedError ? `> ${feedError}` : "> CONNECTING TO KUCOIN FUTURES"}</td>
                </tr>
              ) : (
                futs.map((row) => (
                  <tr key={row.symbol}>
                    <td><b>{row.symbol}</b></td>
                    <td>${money(row.mark)}</td>
                    <td>${money(row.index)}</td>
                    <td>${money(row.last)}</td>
                    <td className={row.changePct < 0 ? "down" : undefined}>{signedPct(row.changePct)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <p className="muted note">
        Public market data only. Orders stay in the KuCoin app on the phone.
      </p>
    </section>
  );
}

function MapPanel({ fix, mapSrc, onFix }: { fix: Fix; mapSrc: string; onFix: () => void }) {
  return (
    <section>
      <div className="toolbar">
        <div>
          <p className="kicker">LOCAL RECON</p>
          <h2 className="h-block">MIRAMICHI GRID</h2>
        </div>
        <button type="button" className="ghost" onClick={onFix}>
          PHONE FIX
        </button>
      </div>
      <p>
        {fix.lat >= 0 ? fix.lat.toFixed(4) : Math.abs(fix.lat).toFixed(4)}° {fix.lat >= 0 ? "N" : "S"} ·{" "}
        {Math.abs(fix.lon).toFixed(4)}° {fix.lon >= 0 ? "E" : "W"} · {fix.source === "phone" ? "PHONE GPS" : "CITY CENTRE"}
      </p>
      <div className="map-wrap">
        <iframe title="Miramichi recon map" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}

function AppsPanel({ onOpen }: { onOpen: () => void }) {
  return (
    <section>
      <p className="kicker">QUICK LAUNCH</p>
      <h2 className="h-block">CABIN APPS</h2>
      <div className="app-grid">
        {APPS.map((app) => (
          <a key={app.href} className="app-card" href={app.href} target="_blank" rel="noreferrer" onClick={onOpen}>
            <b>[ {app.label} ]</b>
            <small>{app.hint}</small>
          </a>
        ))}
      </div>
    </section>
  );
}

function SetupPanel({
  done,
  copied,
  onToggle,
  onCopy,
}: {
  done: Record<string, boolean>;
  copied: boolean;
  onToggle: (id: string) => void;
  onCopy: () => void;
}) {
  return (
    <section>
      <p className="kicker">S23 ULTRA → SENTRA SR</p>
      <h2 className="h-block">BRIDGE CHECKLIST</h2>
      <div className="url-line">
        <code>{PAGES_URL}</code>
        <button type="button" className="ghost" onClick={onCopy}>
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <div className="setup-grid">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            className={done[step.id] ? "step is-done" : "step"}
            onClick={() => onToggle(step.id)}
          >
            <span className="box" aria-hidden>{done[step.id] ? "X" : ""}</span>
            <span>
              <b>{step.title}</b>
              <br />
              <small>{step.body}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
