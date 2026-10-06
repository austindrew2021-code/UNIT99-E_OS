import { useEffect, useMemo, useRef, useState } from "react";

type Tab = "dash" | "radio" | "stats" | "apps" | "set";
type SetPage = "display" | "map" | "audio" | "hud" | "effects" | "apps" | "obd" | "vstats" | "dev" | "system" | "about";
type ThemeName = "green" | "amber" | "white" | "blue";
type Region = "EUROPE" | "N. AMERICA" | "C. AMERICA" | "S. AMERICA" | "OCEANIA" | "FAVORITES";

const TABS: Tab[] = ["dash", "radio", "stats", "apps", "set"];
const SET_PAGES: { id: SetPage; label: string }[] = [
  { id: "display", label: "DISPLAY" },
  { id: "map", label: "MAP" },
  { id: "audio", label: "AUDIO" },
  { id: "hud", label: "HUD" },
  { id: "effects", label: "EFFECTS" },
  { id: "apps", label: "APPS" },
  { id: "obd", label: "OBD-II" },
  { id: "vstats", label: "STATS" },
  { id: "dev", label: "DEV" },
  { id: "system", label: "SYSTEM" },
  { id: "about", label: "ABOUT" },
];
const THEME_CHOICES: ThemeName[] = ["green", "amber", "white", "blue"];
const REGIONS: Region[] = ["EUROPE", "N. AMERICA", "C. AMERICA", "S. AMERICA", "OCEANIA", "FAVORITES"];

const MAPS: Record<Exclude<Region, "FAVORITES">, string[]> = {
  EUROPE: [
    "ALBANIA", "ANDORRA", "AUSTRIA", "BELARUS", "BELGIUM", "BOSNIA / HERZEGOVINA", "BULGARIA", "CROATIA", "CYPRUS",
    "CZECH REPUBLIC", "DENMARK", "ESTONIA", "FINLAND", "FRANCE", "GEORGIA", "GERMANY", "GREECE", "HUNGARY", "ICELAND",
    "IRELAND", "ITALY", "KOSOVO", "LATVIA", "LITHUANIA", "LUXEMBOURG", "MACEDONIA", "MALTA", "MOLDOVA", "MONTENEGRO",
    "NETHERLANDS", "NORWAY", "POLAND", "PORTUGAL", "ROMANIA", "SERBIA", "SLOVAKIA", "SLOVENIA", "SPAIN", "SWEDEN",
    "SWITZERLAND", "TURKEY", "UK / GREAT BRITAIN", "UKRAINE",
  ],
  "N. AMERICA": [
    "ALABAMA", "ALASKA", "ALBERTA", "ARIZONA", "ARKANSAS", "BRITISH COLUMBIA", "CALIFORNIA", "CANADA", "COLORADO",
    "CONNECTICUT", "DELAWARE", "FLORIDA", "GEORGIA", "GREENLAND", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA",
    "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MANITOBA", "MARYLAND", "MASSACHUSETTS", "MEXICO", "MICHIGAN",
    "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW BRUNSWICK", "NEW HAMPSHIRE",
    "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NEWFOUNDLAND / LABRADOR", "NORTH CAROLINA", "NORTH DAKOTA",
    "NORTHWEST TERRITORIES", "NOVA SCOTIA", "NUNAVUT", "OHIO", "OKLAHOMA", "ONTARIO", "OREGON", "PENNSYLVANIA",
    "PRINCE EDWARD ISLAND", "QUEBEC", "RHODE ISLAND", "SASKATCHEWAN", "SOUTH CAROLINA", "SOUTH DAKOTA", "TENNESSEE",
    "TEXAS", "US MIDWEST", "US NORTHEAST", "US SOUTH", "US WEST", "UTAH", "VERMONT", "VIRGINIA", "WASHINGTON",
    "WEST VIRGINIA", "WISCONSIN", "WYOMING", "YUKON",
  ],
  "C. AMERICA": [
    "BELIZE", "COSTA RICA", "CUBA", "EL SALVADOR", "GUATEMALA", "HAITI / DOMINICAN REPUBLIC", "HONDURAS", "JAMAICA",
    "NICARAGUA", "PANAMA",
  ],
  "S. AMERICA": [
    "ARGENTINA", "BOLIVIA", "BRAZIL", "CHILE", "COLOMBIA", "ECUADOR", "GUYANA", "PARAGUAY", "PERU", "SURINAME",
    "URUGUAY", "VENEZUELA",
  ],
  OCEANIA: ["AUSTRALIA", "FIJI", "NEW ZEALAND", "PAPUA NEW GUINEA", "VANUATU"],
};

const APPS = [
  "BITGET WALLET",
  "BIXBY",
  "BLUE CROSS",
  "BORROWELL",
  "BOSTON PIZZA",
  "BROWSER",
  "BURGER KING",
  "BYBIT",
  "CALCULATOR",
  "CALENDAR",
  "CAMERA",
  "CAPCUT",
  "CATACLYSM COMPANION",
  "CHECKUP",
  "CHROME",
  "CLAUDE",
  "CLOCK",
  "F-DROID",
  "FACEBOOK",
  "FAKE GPS LOCATION PROFESSIONAL",
  "FERMATA AUTO",
  "FIREFOX",
  "FLASHFOOD",
  "FOODHERO",
  "GALLERY",
  "GAMING HUB",
  "GEMINI",
  "GLOBAL GOALS",
  "GMAIL",
  "GOOGLE",
  "GOOGLE CLOUD",
  "GOOGLE TV",
  "GROK",
  "GROK BOT",
  "HARVEYS",
];

const WEB_APPS: Record<string, string> = {
  "BITGET WALLET": "https://www.bitget.com/",
  "BLUE CROSS": "https://www.medaviebc.ca/",
  BORROWELL: "https://borrowell.com/",
  "BOSTON PIZZA": "https://bostonpizza.com/",
  BROWSER: "https://www.google.com/",
  "BURGER KING": "https://www.burgerking.ca/",
  BYBIT: "https://www.bybit.com/",
  CALENDAR: "https://calendar.google.com/",
  CAPCUT: "https://www.capcut.com/",
  CHROME: "https://www.google.com/",
  CLAUDE: "https://claude.ai/",
  "F-DROID": "https://f-droid.org/",
  FACEBOOK: "https://m.facebook.com/",
  FIREFOX: "https://www.mozilla.org/firefox/",
  FLASHFOOD: "https://www.flashfood.com/",
  FOODHERO: "https://www.foodhero.com/",
  GEMINI: "https://gemini.google.com/",
  "GLOBAL GOALS": "https://www.globalgoals.org/",
  GMAIL: "https://mail.google.com/",
  GOOGLE: "https://www.google.com/",
  "GOOGLE CLOUD": "https://console.cloud.google.com/",
  "GOOGLE TV": "https://tv.google.com/",
  GROK: "https://grok.com/",
  HARVEYS: "https://www.harveys.ca/",
};

function Calc() {
  const [expr, setExpr] = useState("0");
  const press = (key: string) => {
    if (key === "C") return setExpr("0");
    if (key === "=") {
      if (!/^[\d.+\-*/]+$/.test(expr)) return setExpr("ERR");
      try {
        const value = Function(`"use strict"; return (${expr})`)();
        setExpr(Number.isFinite(value) ? String(value) : "ERR");
      } catch {
        setExpr("ERR");
      }
      return;
    }
    setExpr((value) => (value === "0" || value === "ERR" ? key : value + key));
  };
  return (
    <div className="hud-calc">
      <p>{expr}</p>
      {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "=", "+"].map((key) => (
        <button key={key} type="button" onClick={() => press(key)}>
          {key}
        </button>
      ))}
    </div>
  );
}

function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((next) => {
        stream = next;
        if (videoRef.current) videoRef.current.srcObject = next;
      })
      .catch(() => setBlocked(true));
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, []);
  if (blocked) return <p className="hud-note">CAMERA BLOCKED BY THIS BROWSER</p>;
  return <video className="hud-camera" ref={videoRef} autoPlay playsInline muted />;
}

function Gallery() {
  const [src, setSrc] = useState("");
  useEffect(() => () => { if (src) URL.revokeObjectURL(src); }, [src]);
  return (
    <div className="hud-gallery">
      <label className="hud-link">
        [OPEN PHOTO]
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setSrc((old) => {
              if (old) URL.revokeObjectURL(old);
              return URL.createObjectURL(file);
            });
          }}
        />
      </label>
      {src ? <img src={src} alt="" /> : <p className="hud-note">PICK A PHOTO FROM THIS PHONE</p>}
    </div>
  );
}

const ROM = [
  "*************** PIP-OS (R) V7.1.0.8 ***************",
  "",
  "",
  "",
  "COPYRIGHT 2075 ROBCO(R)",
  "LOADER VI.1",
  "EXEC VERSION U99.E",
  "264k RAM SYSTEM",
  "38911 BYTES FREE",
  "NO HOLOTAPE FOUND",
  "LOAD ROM(1): DEITRIX 303",
];

function playClip(file: string, volume = 0.35) {
  const audio = new Audio(`/unit99/sounds/${file}`);
  audio.volume = volume;
  void audio.play().catch(() => undefined);
}

const BOOT_NOISE =
  "* 1 0 0x0000A4 0x00000000000000000 start memory discovery 0 0x0000A4 0x00000000000000000 1 0 0x000014 0x00000000000000000 CPUO starting cell relocation 0 0x0000A4 0x00000000000000000 1 0 0x000009 0x00000000000000000 CPUO launch EFI 0 0x0000A4 0x00000000000000000 1 0 0x000009 0x000000000000E003D CPUO starting EFI 0 0x0000A4 0x00000000000000000 1 0 0x0000A4 0x00000000000000000 start memory discovery ";

const BOOT_FRAMES = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const p = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * p) / 2) ** 2 +
    Math.cos(lat1 * p) * Math.cos(lat2 * p) * Math.sin(((lon2 - lon1) * p) / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(a)));
}

function noiseLines() {
  return BOOT_NOISE.repeat(15);
}

type ObdReading = {
  name: string;
  speed: number | null;
  rpm: number | null;
  coolant: number | null;
  volts: number | null;
  load: number | null;
  intake: number | null;
  maf: number | null;
  dtc: string;
};

type ElmChar = {
  properties: { write: boolean; writeWithoutResponse: boolean; notify: boolean };
  writeValue: (value: BufferSource) => Promise<void>;
  writeValueWithoutResponse: (value: BufferSource) => Promise<void>;
  startNotifications: () => Promise<ElmChar>;
  addEventListener: (type: string, listener: (event: Event) => void) => void;
};

const BLE_SERVICES = [
  "0000fff0-0000-1000-8000-00805f9b34fb",
  "0000ffe0-0000-1000-8000-00805f9b34fb",
  "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
];

function pidBytes(raw: string, mode: number, pid: number) {
  const bytes = raw
    .toUpperCase()
    .replace(/SEARCHING\.\.\./g, " ")
    .split(/[^0-9A-F]+/)
    .filter((part) => part.length >= 2 && part.length % 2 === 0)
    .flatMap((part) => {
      const out: number[] = [];
      for (let i = 0; i < part.length; i += 2) out.push(Number.parseInt(part.slice(i, i + 2), 16));
      return out;
    });
  const expect = 0x40 + mode;
  for (let i = 0; i < bytes.length - 1; i += 1) {
    if (bytes[i] === expect && bytes[i + 1] === pid) return bytes.slice(i + 2);
  }
  return null;
}

async function openElm(onLog: (line: string) => void, onReading: (reading: ObdReading) => void) {
  const bluetooth = (
    navigator as Navigator & {
      bluetooth?: {
        requestDevice: (options: { acceptAllDevices: boolean; optionalServices: string[] }) => Promise<{
          name?: string;
          gatt?: {
            connect: () => Promise<{
              getPrimaryServices: () => Promise<Array<{ getCharacteristics: () => Promise<ElmChar[]> }>>;
              disconnect: () => void;
            }>;
          };
        }>;
      };
    }
  ).bluetooth;
  if (!bluetooth) throw new Error("THIS BROWSER CANNOT OPEN BLUETOOTH. USE CHROME ON THE PHONE.");
  onLog("PICK THE BLE OBD ADAPTER");
  const device = await bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: BLE_SERVICES });
  const server = await device.gatt?.connect();
  if (!server) throw new Error("ADAPTER DID NOT OPEN A GATT LINK");
  const services = await server.getPrimaryServices();
  let writeChar: ElmChar | null = null;
  let notifyChar: ElmChar | null = null;
  for (const service of services) {
    const chars = await service.getCharacteristics();
    for (const char of chars) {
      if (char.properties.notify || char.properties.write || char.properties.writeWithoutResponse) {
        if (!notifyChar && char.properties.notify) notifyChar = char;
        if (!writeChar && (char.properties.write || char.properties.writeWithoutResponse)) writeChar = char;
      }
    }
  }
  const io = writeChar ?? notifyChar;
  const notes = notifyChar ?? writeChar;
  if (!io || !notes) throw new Error("NO SERIAL CHARACTERISTIC. THIS IS NOT A BLE ELM327.");
  let buffer = "";
  let wait: ((chunk: string) => void) | null = null;
  notes.addEventListener("characteristicvaluechanged", (event) => {
    const value = (event.target as EventTarget & { value?: DataView }).value;
    if (!value) return;
    buffer += new TextDecoder().decode(value);
    if (buffer.includes(">") && wait) {
      const chunk = buffer;
      buffer = "";
      wait(chunk);
      wait = null;
    }
  });
  await notes.startNotifications();
  const ask = (cmd: string) =>
    new Promise<string>((resolve) => {
      const timer = window.setTimeout(() => {
        wait = null;
        resolve(buffer || "NO DATA");
        buffer = "";
      }, 1800);
      wait = (chunk) => {
        window.clearTimeout(timer);
        resolve(chunk);
      };
      const payload = new TextEncoder().encode(`${cmd}\r`);
      const write = io.properties.write ? io.writeValue(payload) : io.writeValueWithoutResponse(payload);
      void write.catch(() => undefined);
    });
  let stopped = false;
  onLog(`LINKED ${device.name ?? "OBD"}`);
  for (const cmd of ["ATZ", "ATE0", "ATL0", "ATS0", "ATH0", "ATSP0"]) {
    onLog((await ask(cmd)).replace(/\s+/g, " ").trim().slice(0, 80));
  }
  const reading: ObdReading = {
    name: device.name ?? "OBD-II",
    speed: null,
    rpm: null,
    coolant: null,
    volts: null,
    load: null,
    intake: null,
    maf: null,
    dtc: "○ CONNECT OBD-II TO VIEW DIAGNOSTICS",
  };
  onReading(reading);
  const commands = ["010C", "010D", "0105", "0142", "0104", "010F", "0110", "03"];
  const loop = async () => {
    while (!stopped) {
      for (const cmd of commands) {
        if (stopped) return;
        const raw = await ask(cmd);
        if (cmd === "010C") {
          const data = pidBytes(raw, 1, 0x0c);
          if (data && data.length >= 2) reading.rpm = Math.round(((data[0] * 256) + data[1]) / 4);
        } else if (cmd === "010D") {
          const data = pidBytes(raw, 1, 0x0d);
          if (data) reading.speed = data[0];
        } else if (cmd === "0105") {
          const data = pidBytes(raw, 1, 0x05);
          if (data) reading.coolant = data[0] - 40;
        } else if (cmd === "0142") {
          const data = pidBytes(raw, 1, 0x42);
          if (data && data.length >= 2) reading.volts = Math.round(((data[0] * 256) + data[1]) / 10) / 100;
        } else if (cmd === "0104") {
          const data = pidBytes(raw, 1, 0x04);
          if (data) reading.load = Math.round((data[0] * 100) / 255);
        } else if (cmd === "010F") {
          const data = pidBytes(raw, 1, 0x0f);
          if (data) reading.intake = data[0] - 40;
        } else if (cmd === "0110") {
          const data = pidBytes(raw, 1, 0x10);
          if (data && data.length >= 2) reading.maf = Math.round(((data[0] * 256) + data[1]) / 100);
        } else if (raw.includes("43") && !/NO DATA|UNABLE|ERROR/i.test(raw)) {
          reading.dtc = raw.replace(/[^0-9A-F ]/gi, "").includes("43 00") || /43\s*$/.test(raw)
            ? "● NO TROUBLE CODES"
            : "⚠ DIAGNOSTIC TROUBLE CODES";
        }
        onReading({ ...reading });
      }
    }
  };
  void loop();
  return () => {
    stopped = true;
    server.disconnect();
  };
}

function Choice({
  on,
  label,
  tone,
  onClick,
}: {
  on: boolean;
  label: string;
  tone?: ThemeName;
  onClick: () => void;
}) {
  return (
    <button type="button" className={tone ? `hud-choice is-${tone}` : "hud-choice"} onClick={onClick}>
      <span>{on ? "[•]" : "[ ]"}</span> {label}
    </button>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  read,
  onChange,
}: {
  label?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  read: string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="hud-slider">
      {label ? (
        <span className="hud-slider-top">
          <span>{label}</span>
          <span>{read}</span>
        </span>
      ) : null}
      <span className="hud-slider-row">
        <span className="hud-slider-track">
          <span className="hud-slider-fill" style={{ width: `${pct}%` }} />
          <span className="hud-slider-knob" style={{ left: `${pct}%` }} />
        </span>
        {!label ? <span className="hud-slider-read">{read}</span> : null}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </span>
    </label>
  );
}

function Blocks() {
  return (
    <div className="hud-blocks" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

function Transport({ onPrev, onPlay, onNext }: { onPrev: () => void; onPlay: () => void; onNext: () => void }) {
  return (
    <div className="hud-transport">
      <button type="button" aria-label="Previous" onClick={onPrev}>
        |◀
      </button>
      <button type="button" aria-label="Play" onClick={onPlay}>
        ▶
      </button>
      <button type="button" aria-label="Next" onClick={onNext}>
        ▶|
      </button>
    </div>
  );
}

export function Unit99() {
  const [booting, setBooting] = useState(true);
  const [bootRun, setBootRun] = useState(0);
  const [bootPhase, setBootPhase] = useState(0);
  const [bootFrame, setBootFrame] = useState(0);
  const [rom, setRom] = useState(0);
  const [tab, setTab] = useState<Tab>("dash");
  const [page, setPage] = useState<SetPage>("display");
  const [theme, setTheme] = useState<ThemeName>("green");
  const [autoTheme, setAutoTheme] = useState(false);
  const [dayColor, setDayColor] = useState<ThemeName>("green");
  const [nightColor, setNightColor] = useState<ThemeName>("amber");
  const [dayStart, setDayStart] = useState(7);
  const [nightStart, setNightStart] = useState(20);
  const [textSize, setTextSize] = useState(100);
  const [uiScale, setUiScale] = useState(100);
  const [pipSeconds, setPipSeconds] = useState(10);
  const [pipScale, setPipScale] = useState(100);
  const [fxVolume, setFxVolume] = useState(80);
  const [ducking, setDucking] = useState(false);
  const [liveWave, setLiveWave] = useState(false);
  const [sensitivity, setSensitivity] = useState(1);
  const [waveHeight, setWaveHeight] = useState(100);
  const [noiseGate, setNoiseGate] = useState(4);
  const [attack, setAttack] = useState(1.8);
  const [release, setRelease] = useState(1.6);
  const [equalizerBars, setEqualizerBars] = useState(20);
  const [vizRefresh, setVizRefresh] = useState(15);
  const [widgets, setWidgets] = useState({ speed: true, gps: true, bt: true, cpu: false, mem: false });
  const [crtBleed, setCrtBleed] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [roadside, setRoadside] = useState(true);
  const [roadsideSize, setRoadsideSize] = useState(200);
  const [sonarFps, setSonarFps] = useState(30);
  const [phosphor, setPhosphor] = useState(false);
  const [phosphorChance, setPhosphorChance] = useState(15);
  const [phosphorFlash, setPhosphorFlash] = useState(false);
  const [showBoy, setShowBoy] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showName, setShowName] = useState(true);
  const [watermarkSize, setWatermarkSize] = useState(100);
  const [watermarkOpacity, setWatermarkOpacity] = useState(100);
  const [showRecents, setShowRecents] = useState(true);
  const [jumpRecent, setJumpRecent] = useState(false);
  const [systemRecents, setSystemRecents] = useState(false);
  const [openAuto, setOpenAuto] = useState(false);
  const [openCarplay, setOpenCarplay] = useState(false);
  const [autoconnect, setAutoconnect] = useState(false);
  const [retrySeconds, setRetrySeconds] = useState(10);
  const [obdLog, setObdLog] = useState("NO LOGS YET...");
  const [radiation, setRadiation] = useState(true);
  const [ramp, setRamp] = useState(1.5);
  const [rpmRed, setRpmRed] = useState(5200);
  const [voltLow, setVoltLow] = useState(12);
  const [vegas, setVegas] = useState(false);
  const [demoObd, setDemoObd] = useState(false);
  const [bootDebug, setBootDebug] = useState(false);
  const [primary, setPrimary] = useState<string | null>(null);
  const [mapNote, setMapNote] = useState("");
  const [region, setRegion] = useState<Region>("EUROPE");
  const [installed, setInstalled] = useState<string[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [clock, setClock] = useState("00:00");
  const [gpsKph, setGpsKph] = useState<number | null>(null);
  const [gpsReady, setGpsReady] = useState(false);
  const [gpsAsk, setGpsAsk] = useState(0);
  const [obdLive, setObdLive] = useState<ObdReading | null>(null);
  const obdStop = useRef<(() => void) | null>(null);
  const [radioItem, setRadioItem] = useState<"player" | "mix">("player");
  const [appView, setAppView] = useState<{ title: string; url?: string; local?: "calculator" | "clock" | "camera" | "gallery" } | null>(null);
  const [appNote, setAppNote] = useState("");
  const [tracks, setTracks] = useState<{ name: string; url: string }[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const radioRef = useRef<HTMLAudioElement | null>(null);
  const trackUrls = useRef<string[]>([]);
  const [demo, setDemo] = useState({ s: 0, p: 0, e: 0, c: 0, i: 0, a: 0, l: 0 });
  const noise = useMemo(noiseLines, []);

  useEffect(() => {
    if (booting || !navigator.geolocation) return;
    let last: { lat: number; lon: number; t: number } | null = null;
    const samples: number[] = [];
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        let mps = speed != null && speed >= 0 ? speed : null;
        if (last && pos.timestamp - last.t > 400) {
          const derived = haversine(last.lat, last.lon, latitude, longitude) / ((pos.timestamp - last.t) / 1000);
          if (mps == null || mps < 0.3) mps = derived;
        }
        last = { lat: latitude, lon: longitude, t: pos.timestamp };
        if (mps == null || mps < 0.6) mps = 0;
        samples.push(mps * 3.6);
        if (samples.length > 3) samples.shift();
        const kph = Math.round(samples.reduce((sum, n) => sum + n, 0) / samples.length);
        setGpsKph(kph);
        setGpsReady(true);
      },
      () => {
        setGpsReady(false);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 12000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [booting, gpsAsk]);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
          timeZone: "America/Moncton",
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 10000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!booting) return;
    playClip("UI_PipBoy_BootSequence_A.ogg", 0.4);
    const timers = [
      window.setTimeout(() => setBootPhase(1), 5890),
      window.setTimeout(() => playClip("UI_PipBoy_BootSequence_B.ogg", 0.35), 5890),
      window.setTimeout(() => setBootPhase(2), 10800),
      window.setTimeout(() => setBootPhase(3), 15500),
      window.setTimeout(() => playClip("UI_PipBoy_BootSequence_C.ogg", 0.35), 15500),
      window.setTimeout(() => setBooting(false), 15500 + 1500 + BOOT_FRAMES.length * 125 + 300),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [booting, bootRun]);

  useEffect(() => {
    if (!booting || bootPhase < 3) return;
    let step = 0;
    setBootFrame(BOOT_FRAMES[0]);
    const id = window.setInterval(() => {
      step += 1;
      if (step >= BOOT_FRAMES.length) {
        window.clearInterval(id);
        return;
      }
      setBootFrame(BOOT_FRAMES[step]);
    }, 125);
    return () => window.clearInterval(id);
  }, [booting, bootPhase]);

  useEffect(() => {
    if (!booting || bootPhase !== 1) return;
    setRom(1);
    const id = window.setInterval(() => setRom((n) => Math.min(ROM.length, n + 1)), 420);
    return () => window.clearInterval(id);
  }, [booting, bootPhase]);

  useEffect(() => {
    let hiddenAt = 0;
    const replay = () => {
      setBootPhase(0);
      setBootFrame(0);
      setRom(0);
      setBooting(true);
      setBootRun((n) => n + 1);
    };
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt = Date.now();
        return;
      }
      if (hiddenAt && Date.now() - hiddenAt > 1500) replay();
      hiddenAt = 0;
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) replay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  const liveKph = obdLive?.speed ?? gpsKph ?? 0;
  const arc = obdLive?.rpm != null ? Math.min(obdLive.rpm / 8000, 1) : Math.min(liveKph / 200, 1);
  const hour = Number(clock.slice(0, 2));
  const activeTheme =
    autoTheme && !Number.isNaN(hour) ? (hour >= dayStart && hour < nightStart ? dayColor : nightColor) : theme;
  const maps = region === "FAVORITES" ? favs : MAPS[region];
  const toggleWidget = (key: keyof typeof widgets) => setWidgets((w) => ({ ...w, [key]: !w[key] }));

  useEffect(() => {
    if (!demoObd) return;
    const id = window.setInterval(() => {
      const t = Date.now() / 1000;
      setDemo({
        s: Math.round(40 + Math.sin(t) * 30),
        p: Math.round(1800 + Math.sin(t * 1.3) * 900),
        e: Math.round(80 + Math.sin(t * 0.4) * 8),
        c: Math.round((13.4 + Math.sin(t * 0.6) * 0.4) * 10) / 10,
        i: Math.round(28 + Math.sin(t * 0.5) * 6),
        a: Math.round(12 + Math.sin(t * 0.8) * 8),
        l: Math.round(30 + Math.sin(t * 0.7) * 20),
      });
    }, 400);
    return () => window.clearInterval(id);
  }, [demoObd]);

  const openTab = (id: Tab) => {
    playClip("UI_Pipboy_OK.ogg", 0.25);
    if (phosphor && Math.random() * 100 < phosphorChance) {
      setPhosphorFlash(true);
      window.setTimeout(() => setPhosphorFlash(false), 420);
      playClip("UI_PipBoy_BurstStatic_01.ogg", 0.2);
    }
    setTab(id);
  };

  const pickSpeed = (action: "recents" | "jump" | "system" | "auto" | "carplay") => {
    setShowRecents(action === "recents");
    setJumpRecent(action === "jump");
    setSystemRecents(action === "system");
    setOpenAuto(action === "auto");
    setOpenCarplay(action === "carplay");
  };

  const openApp = (name: string) => {
    playClip("UI_Pipboy_OK.ogg", 0.25);
    if (name === "FERMATA AUTO") {
      setAppNote("FERMATA AUTO IS ALREADY THIS SCREEN");
      return;
    }
    if (name === "CALCULATOR") return setAppView({ title: name, local: "calculator" });
    if (name === "CLOCK") return setAppView({ title: name, local: "clock" });
    if (name === "CAMERA") return setAppView({ title: name, local: "camera" });
    if (name === "GALLERY") return setAppView({ title: name, local: "gallery" });
    const url = WEB_APPS[name];
    if (!url) {
      setAppNote(`${name} HAS NO PAGE THIS SCREEN CAN OPEN`);
      return;
    }
    setAppNote("");
    setAppView({ title: name, url });
  };

  const onImport = (file: File | undefined, kind: "files" | "pipcar") => {
    if (!file) return;
    const ok = /\.(map|poi)$/i.test(file.name);
    setMapNote(
      ok
        ? kind === "pipcar"
          ? "PIPCAR RADIO CUSTOM MAP/POI IMPORT COMPLETE"
          : "CUSTOM MAP/POI IMPORT COMPLETE"
        : "CUSTOM LOAD FAILED: SELECT .MAP OR .POI FILES",
    );
  };

  const loadTracks = (list: FileList | null) => {
    if (!list?.length) return;
    trackUrls.current.forEach((url) => URL.revokeObjectURL(url));
    const next = Array.from(list)
      .filter((file) => file.type.startsWith("audio/") || /\.(mp3|ogg|wav|flac|m4a)$/i.test(file.name))
      .map((file) => ({ name: file.name.replace(/\.[^.]+$/, "").toUpperCase(), url: URL.createObjectURL(file) }));
    trackUrls.current = next.map((track) => track.url);
    setTracks(next);
    setTrackIndex(0);
    setRadioItem("mix");
  };

  const showTrack = (index: number) => {
    if (!tracks.length) return;
    setTrackIndex((index + tracks.length) % tracks.length);
  };

  const toggleRadio = () => {
    const audio = radioRef.current;
    if (!audio || !tracks.length) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  };

  useEffect(() => {
    const audio = radioRef.current;
    const track = tracks[trackIndex];
    if (!audio || !track) return;
    audio.src = track.url;
    void audio.play().catch(() => undefined);
  }, [tracks, trackIndex]);

  useEffect(() => () => trackUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  return (
    <div
      className={phosphorFlash ? "hud is-glow is-flash" : crtBleed && !lowPower ? "hud is-glow is-bleed" : "hud is-glow"}
      data-theme={activeTheme}
      style={{
        fontSize: `${textSize}%`,
        zoom: uiScale / 100,
        ["--wm" as string]: watermarkSize / 100,
        ["--wm-op" as string]: Math.min(watermarkOpacity / 100, 1),
      }}
    >
      {lowPower ? null : crtBleed ? <div className="hud-scan" /> : null}
      {booting ? null : showLogo ? <img className="hud-gear" src="/unit99/apk/gearvaultboy.png" alt="" /> : null}
      {booting ? null : showBoy ? <img className="hud-boy-mark" src="/unit99/apk/boot_frame_8.png" alt="" /> : null}
      {booting ? null : showName ? <img className="hud-vault" src="/unit99/apk/vaulttecname.png" alt="" /> : null}

      {booting ? null : (
        <>
      <header className="hud-top">
        <div className="hud-clock">
          <img className="hud-mark" src="/unit99/apk/vaultteclogo.png" alt="" />
          <span>{clock}</span>
        </div>
        <div className="hud-mph">
          <button type="button" onClick={() => setGpsAsk((n) => n + 1)}>
            {widgets.speed ? `${liveKph} KM/H` : ""}
          </button>
        </div>
        <div className="hud-pips">
          {widgets.cpu ? <span>CPU: --</span> : null}
          {widgets.mem ? <span>MEM: --</span> : null}
          {widgets.gps ? <span>{gpsReady ? "● GPS" : "○ GPS"}</span> : null}
          {widgets.bt ? <span>{obdLive ? "● BT" : "○ BT"}</span> : null}
        </div>
      </header>

      <main className="hud-main">
        {tab === "dash" && (
          <section className="hud-dash">
            <div className="hud-gauge">
              <svg viewBox="0 0 220 120" aria-hidden="true">
                <path d="M18 108 A 92 92 0 0 1 202 108" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2 8" opacity="0.45" />
                <path
                  d="M18 108 A 92 92 0 0 1 202 108"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${arc * 289} 289`}
                />
              </svg>
              <span className="hud-rpm">{obdLive?.rpm != null ? `${obdLive.rpm} RPM` : "RPM"}</span>
              <div className="hud-meters">
                {(
                  [
                    ["VOL", obdLive?.volts != null ? Math.round(((obdLive.volts - 11) / 4) * 10) : 6],
                    ["CRUISE", obdLive?.speed != null ? Math.round(Math.min(obdLive.speed, 120) / 12) : 4],
                    ["POWER", obdLive?.load != null ? Math.round(obdLive.load / 10) : 8],
                    ["RES", obdLive?.coolant != null ? Math.round(Math.min(Math.max(obdLive.coolant, 0), 120) / 12) : 3],
                  ] as const
                ).map(([name, n]) => {
                  const level = Math.max(0, Math.min(10, n));
                  return (
                  <div key={name}>
                    <i>
                      {Array.from({ length: 10 }, (_, i) => (
                        <b key={i} className={i < level ? "is-on" : ""} />
                      ))}
                    </i>
                    <span>{name}</span>
                  </div>
                  );
                })}
              </div>
            </div>
            <div className="hud-signal">
              <img src="/unit99/apk/boot_frame_2.png" alt="" />
              <p>NO SIGNAL</p>
              <p>UNKNOWN</p>
              <Transport onPrev={() => showTrack(trackIndex - 1)} onPlay={toggleRadio} onNext={() => showTrack(trackIndex + 1)} />
            </div>
          </section>
        )}

        {tab === "radio" && (
          <section className="hud-radio">
            <h1>RADIO</h1>
            <div className="hud-radio-body">
              <div className="hud-radio-side">
                <button type="button" className={radioItem === "player" ? "is-on" : ""} onClick={() => setRadioItem("player")}>
                  {radioItem === "player" ? "> " : ""}EXTERNAL MUSIC PLAYER
                </button>
                <button type="button" className={radioItem === "mix" ? "is-on" : ""} onClick={() => setRadioItem("mix")}>
                  {radioItem === "mix" ? "> " : ""}FAVOURITE RADIO MIX
                </button>
              </div>
              <div className="hud-wave">
                <div className="hud-grid" />
                <i />
                <audio ref={radioRef} onEnded={() => showTrack(trackIndex + 1)} />
                {tracks.length ? (
                  <p>
                    FAVOURITE RADIO MIX
                    <br />
                    {tracks[trackIndex]?.name}
                    <br />
                    {trackIndex + 1} / {tracks.length}
                  </p>
                ) : (
                  <p>
                    NO SIGNAL DETECTED
                    <br />
                    TO ADD RADIO STATIONS:
                    <br />
                    LOAD .MP3 .OGG .WAV .FLAC .M4A
                    <br />
                    FROM THIS PHONE
                  </p>
                )}
              </div>
            </div>
            <label className="hud-link">
              [LOAD AUDIO]
              <input hidden type="file" accept="audio/*,.mp3,.ogg,.wav,.flac,.m4a" multiple onChange={(event) => loadTracks(event.target.files)} />
            </label>
            <a className="hud-link" href="/unit99/sounds/silent-loop.wav" download="silent-loop.wav">
              [SAVE SILENT LOOP]
            </a>
            <Transport onPrev={() => showTrack(trackIndex - 1)} onPlay={toggleRadio} onNext={() => showTrack(trackIndex + 1)} />
          </section>
        )}

        {tab === "stats" && (
          <section className="hud-stats">
            <header className="hud-page-head">
              <h1>VEHICLE STATUS</h1>
              <span>{obdLive ? obdLive.name : "NO DEVICE"}</span>
            </header>
            <p className="hud-note">{obdLive ? "● OBD-II LINKED" : demoObd ? "○ DEMO OBD FEED" : "○ NO OBD LINK"}</p>
            <div className="hud-spec">
              <div>
                {(
                  [
                    ["S", "SPEED", obdLive?.speed ?? (demoObd ? demo.s : gpsReady ? gpsKph : null)],
                    ["P", "POWER", obdLive?.rpm ?? (demoObd ? demo.p : null)],
                    ["E", "ENGINE", obdLive?.coolant ?? (demoObd ? demo.e : null)],
                    ["C", "CHARGE", obdLive?.volts ?? (demoObd ? demo.c : null)],
                  ] as Array<[string, string, number | null]>
                ).map(([letter, name, value]) => (
                  <div key={letter} className="hud-spec-row">
                    <b>{letter}</b>
                    <span>{name}</span>
                    <em>{value == null ? "---" : value}</em>
                    <Blocks />
                  </div>
                ))}
              </div>
              <img className="hud-car" src="/unit99/apk/hyundaiaccentstats.png" alt="" />
              <div>
                {(
                  [
                    ["INTAKE", "I", obdLive?.intake ?? (demoObd ? demo.i : null)],
                    ["AIRFLOW", "A", obdLive?.maf ?? (demoObd ? demo.a : null)],
                    ["LOAD", "L", obdLive?.load ?? (demoObd ? demo.l : null)],
                  ] as Array<[string, string, number | null]>
                ).map(([name, letter, value]) => (
                  <div key={letter} className="hud-spec-row is-right">
                    <em>{value == null ? "---" : value}</em>
                    <span>{name}</span>
                    <b>{letter}</b>
                    <Blocks />
                  </div>
                ))}
              </div>
            </div>
            <p className="hud-note">{obdLive?.dtc ?? "○ CONNECT OBD-II TO VIEW DIAGNOSTICS"}</p>
          </section>
        )}

        {tab === "apps" && (
          <section className="hud-apps">
            <header className="hud-page-head">
              <h1>APPLICATIONS</h1>
            </header>
            <p className="hud-count">{APPS.length} ITEMS</p>
            {appNote ? <p className="hud-note">{appNote}</p> : null}
            {appView ? (
              <div className="hud-stage">
                <header>
                  <button type="button" onClick={() => setAppView(null)}>
                    [BACK]
                  </button>
                  <span>{appView.title}</span>
                  {appView.url ? (
                    <a href={appView.url}>[FULL]</a>
                  ) : null}
                </header>
                {appView.url ? <iframe title={appView.title} src={appView.url} /> : null}
                {appView.local === "calculator" ? <Calc /> : null}
                {appView.local === "clock" ? <p className="hud-stage-clock">{clock}</p> : null}
                {appView.local === "camera" ? <Camera /> : null}
                {appView.local === "gallery" ? <Gallery /> : null}
              </div>
            ) : (
            <div className="hud-app-grid">
              {APPS.map((name) => (
                <button key={name} type="button" onClick={() => openApp(name)}>
                  {name}
                </button>
              ))}
            </div>
            )}
          </section>
        )}

        {tab === "set" && (
          <section className="hud-settings">
            <header className="hud-page-head">
              <h1>SETTINGS</h1>
              <span className="hud-donate">DONATE</span>
              <span>V1.2.16</span>
            </header>
            <div className="hud-set">
              <nav>
                {SET_PAGES.map((item) => (
                  <button key={item.id} type="button" className={page === item.id ? "is-on" : ""} onClick={() => setPage(item.id)}>
                    {page === item.id ? "> " : ""}
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="hud-panel">
                {page === "display" && (
                  <>
                    <p className="hud-kicker">THEME</p>
                    <div className="hud-row">
                      {THEME_CHOICES.map((name) => (
                        <Choice key={name} tone={name} on={theme === name} label={name.toUpperCase()} onClick={() => setTheme(name)} />
                      ))}
                    </div>
                    <p className="hud-kicker">AUTO THEME</p>
                    <Choice on={autoTheme} label="ENABLE TIME COLORS" onClick={() => setAutoTheme((v) => !v)} />
                    <p className="hud-kicker">DAY COLOR</p>
                    <div className="hud-row">
                      {THEME_CHOICES.map((name) => (
                        <Choice key={name} tone={name} on={dayColor === name} label={name.toUpperCase()} onClick={() => setDayColor(name)} />
                      ))}
                    </div>
                    <p className="hud-kicker">NIGHT COLOR</p>
                    <div className="hud-row">
                      {THEME_CHOICES.map((name) => (
                        <Choice key={name} tone={name} on={nightColor === name} label={name.toUpperCase()} onClick={() => setNightColor(name)} />
                      ))}
                    </div>
                    <div className="hud-time">
                      <span>DAY START</span>
                      <button type="button" onClick={() => setDayStart((n) => (n + 23) % 24)}>
                        [-]
                      </button>
                      <b>{String(dayStart).padStart(2, "0")}:00</b>
                      <button type="button" onClick={() => setDayStart((n) => (n + 1) % 24)}>
                        [+]
                      </button>
                    </div>
                    <div className="hud-time">
                      <span>NIGHT START</span>
                      <button type="button" onClick={() => setNightStart((n) => (n + 23) % 24)}>
                        [-]
                      </button>
                      <b>{String(nightStart).padStart(2, "0")}:00</b>
                      <button type="button" onClick={() => setNightStart((n) => (n + 1) % 24)}>
                        [+]
                      </button>
                    </div>
                    <p className="hud-kicker">TEXT SIZE</p>
                    <Slider min={70} max={140} step={5} value={textSize} read={`${textSize}%`} onChange={setTextSize} />
                    <p className="hud-kicker">UI SCALE</p>
                    <Slider min={80} max={120} step={5} value={uiScale} read={`${uiScale}%`} onChange={setUiScale} />
                    <p className="hud-kicker">VAULT BOY PIP</p>
                    <p className="hud-help">SECONDS BETWEEN IMAGE CHANGES</p>
                    <Slider min={0.5} max={10} step={0.5} value={pipSeconds} read={`${pipSeconds.toFixed(1)}s`} onChange={setPipSeconds} />
                    <p className="hud-help">IMAGE SCALE</p>
                    <Slider min={100} max={150} step={5} value={pipScale} read={`${pipScale}%`} onChange={setPipScale} />
                  </>
                )}

                {page === "map" && (
                  <>
                    <p className="hud-kicker">MAP CATALOG</p>
                    <div className="hud-row">
                      {REGIONS.map((name) => (
                        <button key={name} type="button" className={region === name ? "hud-chip is-on" : "hud-chip"} onClick={() => setRegion(name)}>
                          {region === name ? `[${name}]` : name}
                        </button>
                      ))}
                    </div>
                    <p className="hud-kicker">COUNTRIES</p>
                    <ul className="hud-maps">
                      {maps.length === 0 ? <li className="hud-help">NO FAVORITE PACKAGES MARKED</li> : null}
                      {maps.map((name) => {
                        const on = installed.includes(name);
                        const fav = favs.includes(name);
                        return (
                          <li key={name}>
                            <div>
                              <strong>{name}</strong>
                              <span>{on ? "INSTALLED" : "NOT INSTALLED"}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setInstalled((list) => (on ? list : [...list, name]));
                                setMapNote("NO OFFLINE PACKAGE");
                              }}
                            >
                              [GET]
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!on) {
                                  setMapNote("LOAD FAILED: SELECT .MAP OR .POI FILES");
                                  return;
                                }
                                setPrimary(name);
                                setMapNote(`PRIMARY ${name} / 1 ACTIVE / PACKAGE INCOMPLETE`);
                              }}
                            >
                              [LOAD]
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInstalled((list) => list.filter((item) => item !== name));
                                if (primary === name) setPrimary(null);
                                setMapNote("PACKAGE DELETED");
                              }}
                            >
                              [DEL]
                            </button>
                            <button
                              type="button"
                              onClick={() => setFavs((list) => (fav ? list.filter((item) => item !== name) : [...list, name]))}
                            >
                              [FAV]
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <button type="button" className="hud-link" onClick={() => document.getElementById("map-files")?.click()}>
                      {">"} IMPORT CUSTOM FILES
                    </button>
                    <button type="button" className="hud-link" onClick={() => document.getElementById("map-pipcar")?.click()}>
                      {">"} IMPORT PIPCAR RADIO/CUSTOM_MAPS
                    </button>
                    <input id="map-files" hidden type="file" accept=".map,.poi" onChange={(event) => onImport(event.target.files?.[0], "files")} />
                    <input id="map-pipcar" hidden type="file" accept=".map,.poi" onChange={(event) => onImport(event.target.files?.[0], "pipcar")} />
                    <p className="hud-kicker">PRIMARY / ACTIVE SET</p>
                    <p className="hud-help">{primary ? `PRIMARY ${primary} / 1 ACTIVE / PACKAGE INCOMPLETE` : "NO FAVORITE PACKAGES MARKED"}</p>
                    <p className="hud-help">{mapNote}</p>
                    <p className="hud-kicker">PACKAGE CONTENTS</p>
                    <p className="hud-help">NO .MAP/.POI FILES IN PIPCAR RADIO/CUSTOM_MAPS</p>
                  </>
                )}

                {page === "audio" && (
                  <>
                    <p className="hud-kicker">FX VOLUME</p>
                    <Slider min={0} max={100} step={1} value={fxVolume} read={`${fxVolume}%`} onChange={setFxVolume} />
                    <p className="hud-kicker">HEAD UNIT COMPATIBILITY</p>
                    <Choice on={ducking} label="MUSIC DUCKING COMPATIBILITY" onClick={() => setDucking((v) => !v)} />
                    <p className="hud-help">
                      ENABLE IF PIP-BOY FX LOWER MUSIC VOLUME. ROUTES FX AS MEDIA AUDIO; SOME OEM AUDIO POLICIES MAY STILL OVERRIDE IT.
                    </p>
                    <p className="hud-kicker">RADIO + MUSIC VISUALIZER</p>
                    <Choice on={liveWave} label="LIVE RADIO WAVEFORM" onClick={() => setLiveWave((v) => !v)} />
                    <Slider label="VISUALIZER REFRESH:" min={5} max={60} step={1} value={vizRefresh} read={`${vizRefresh} FPS`} onChange={setVizRefresh} />
                    <p className="hud-help">LIVE WAVEFORM USES AUDIO CAPTURE AND EXTRA CPU. SETTINGS APPLY TO RADIO AND DASHBOARD VISUALIZERS.</p>
                    <p className="hud-kicker">VISUALIZER TUNING</p>
                    <Slider label="SENSITIVITY" min={0.2} max={2} step={0.05} value={sensitivity} read={`${sensitivity.toFixed(2)}x`} onChange={setSensitivity} />
                    <Slider label="WAVEFORM HEIGHT" min={20} max={100} step={1} value={waveHeight} read={`${waveHeight}%`} onChange={setWaveHeight} />
                    <Slider label="NOISE GATE" min={0} max={40} step={1} value={noiseGate} read={`${noiseGate}%`} onChange={setNoiseGate} />
                    <Slider label="ATTACK SPEED" min={0.2} max={3} step={0.05} value={attack} read={`${attack.toFixed(2)}x`} onChange={setAttack} />
                    <Slider label="RELEASE SPEED" min={0.2} max={3} step={0.05} value={release} read={`${release.toFixed(2)}x`} onChange={setRelease} />
                    <Slider label="EQUALIZER BARS" min={4} max={48} step={1} value={equalizerBars} read={`${equalizerBars}`} onChange={setEqualizerBars} />
                    <button
                      type="button"
                      className="hud-link"
                      onClick={() => {
                        setSensitivity(1);
                        setWaveHeight(100);
                        setNoiseGate(4);
                        setAttack(1.8);
                        setRelease(1.6);
                        setEqualizerBars(20);
                        setVizRefresh(15);
                      }}
                    >
                      RESET VISUALIZER TUNING
                    </button>
                  </>
                )}

                {page === "hud" && (
                  <>
                    <p className="hud-kicker">TOP BAR WIDGETS</p>
                    <Choice on={widgets.speed} label="SPEED" onClick={() => toggleWidget("speed")} />
                    <Choice on={widgets.gps} label="GPS COORDINATES" onClick={() => toggleWidget("gps")} />
                    <Choice on={widgets.bt} label="BLUETOOTH" onClick={() => toggleWidget("bt")} />
                    <Choice on={widgets.cpu} label="CPU USAGE" onClick={() => toggleWidget("cpu")} />
                    <Choice on={widgets.mem} label="MEMORY USAGE" onClick={() => toggleWidget("mem")} />
                  </>
                )}

                {page === "effects" && (
                  <>
                    <Choice on={crtBleed} label="CRT SCREEN BLEED" onClick={() => setCrtBleed((v) => !v)} />
                    <Choice on={lowPower} label="LOW POWER MODE" onClick={() => setLowPower((v) => !v)} />
                    <p className="hud-help">SCREEN BLEED ADDS FAINT GLASS BLOOM.</p>
                    <p className="hud-help">LOW POWER REDUCES VIGNETTE AND BLEED.</p>
                    <Choice on={roadside} label="ROADSIDE PIP-BOYS" onClick={() => setRoadside((v) => !v)} />
                    <Slider label="ROADSIDE PIP-BOY SIZE:" min={50} max={300} step={10} value={roadsideSize} read={`${roadsideSize}%`} onChange={setRoadsideSize} />
                    <Slider label="GPS SONAR REFRESH:" min={12} max={60} step={1} value={sonarFps} read={`${sonarFps} FPS`} onChange={setSonarFps} />
                    <p className="hud-help">LOWER VALUES REDUCE CPU/GPU LOAD FOR THE GPS RADAR SWEEP.</p>
                    <Choice on={phosphor} label="RANDOM SECTION PHOSPHOR" onClick={() => setPhosphor((v) => !v)} />
                    <Slider label="PROBABILITY:" min={0} max={100} step={1} value={phosphorChance} read={`${phosphorChance}%`} onChange={setPhosphorChance} />
                    <p className="hud-help">CHANCE OF A PHOSPHOR BURST WHEN CHANGING SECTIONS.</p>
                    <p className="hud-kicker">BACKGROUND LOGOS</p>
                    <Choice on={showBoy} label="VAULT BOY WATERMARK" onClick={() => setShowBoy((v) => !v)} />
                    <Choice on={showLogo} label="VAULT-TEC LOGO WATERMARK" onClick={() => setShowLogo((v) => !v)} />
                    <Choice on={showName} label="VAULT-TEC NAME WATERMARK" onClick={() => setShowName((v) => !v)} />
                    <Slider label="MIDDLE WATERMARK SIZE" min={40} max={200} step={10} value={watermarkSize} read={`${watermarkSize}%`} onChange={setWatermarkSize} />
                    <Slider label="OPACITY" min={0} max={200} step={10} value={watermarkOpacity} read={`${watermarkOpacity}%`} onChange={setWatermarkOpacity} />
                  </>
                )}

                {page === "apps" && (
                  <>
                    <p className="hud-kicker">TOP BAR SHORTCUTS (VAULT-TEC LOGO)</p>
                    <p className="hud-help">4 QUICK-LAUNCH APPS IN TOP-LEFT DROPDOWN</p>
                    {["SLOT 1", "SLOT 2", "SLOT 3", "SLOT 4"].map((slot) => (
                      <p key={slot} className="hud-help">
                        {slot}: EMPTY
                      </p>
                    ))}
                    <p className="hud-kicker">SPEED TOUCH ACTION</p>
                    <Choice on={showRecents} label="SHOW RECENTS MENU" onClick={() => pickSpeed("recents")} />
                    <Choice on={jumpRecent} label="JUMP TO LAST RECENT APP" onClick={() => pickSpeed("jump")} />
                    <Choice on={systemRecents} label="OPEN SYSTEM RECENTS" onClick={() => pickSpeed("system")} />
                    <p className="hud-help">ENABLE PIP-OS SYSTEM RECENTS CONTROL IN ANDROID ACCESSIBILITY SETTINGS.</p>
                    <Choice on={openAuto} label="OPEN ANDROID AUTO" onClick={() => pickSpeed("auto")} />
                    <p className="hud-help">LAUNCHES COM.IMOTOR.PHONECONNECT.ANDROIDAUTO.</p>
                    <Choice on={openCarplay} label="OPEN CARPLAY" onClick={() => pickSpeed("carplay")} />
                    <p className="hud-help">LAUNCHES COM.IMOTOR.PHONECONNECT.CARPLAY.</p>
                  </>
                )}

                {page === "obd" && (
                  <>
                    <Choice on={autoconnect} label="AUTOCONNECT ON LAUNCH" onClick={() => setAutoconnect((v) => !v)} />
                    <Slider label="SECONDS" min={5} max={15} step={1} value={retrySeconds} read={`${retrySeconds}s`} onChange={setRetrySeconds} />
                    <p className="hud-kicker">NEARBY BLUETOOTH DEVICES:</p>
                    <p className="hud-help">BLE ADAPTER ONLY. A CLASSIC BLUETOOTH ELM327 WILL NOT APPEAR. TIRE PRESSURE IS NOT ON STANDARD OBD-II FOR A SENTRA.</p>
                    <button
                      type="button"
                      className="hud-link"
                      onClick={() => {
                        void openElm(
                          (line) => setObdLog(line),
                          (reading) => setObdLive(reading),
                        ).then(
                          (stop) => {
                            obdStop.current?.();
                            obdStop.current = stop;
                          },
                          (error: unknown) => setObdLog(error instanceof Error ? error.message : "BLUETOOTH SCAN FAILED"),
                        );
                      }}
                    >
                      [SCAN]
                    </button>
                    <p className="hud-kicker">DEBUG TERMINAL</p>
                    <p className="hud-help">{obdLog}</p>
                    <p className="hud-help">PREFERRED DEVICE: NONE</p>
                  </>
                )}

                {page === "vstats" && (
                  <>
                    <Choice on={radiation} label="RADIATION RED ALERT AUDIO" onClick={() => setRadiation((v) => !v)} />
                    <p className="hud-help">
                      PIP-BOY RADIATION CLIPS RAMP FROM LOW TO HIGH ON ANY SCREEN WHEN RPM, COOLANT, VOLTAGE, OR DTC WARNINGS ENTER RED.
                    </p>
                    <Slider label="RAMP MULTIPLIER:" min={0.5} max={3} step={0.1} value={ramp} read={`${ramp.toFixed(1)}X`} onChange={setRamp} />
                    <Slider label="RPM RED WARNING:" min={3000} max={8000} step={100} value={rpmRed} read={`${rpmRed}`} onChange={setRpmRed} />
                    <Slider label="VOLTAGE LOW WARNING:" min={10} max={14} step={0.1} value={voltLow} read={`${voltLow.toFixed(1)}V`} onChange={setVoltLow} />
                  </>
                )}

                {page === "dev" && (
                  <>
                    <Choice on={vegas} label="LAS VEGAS CITY" onClick={() => setVegas((v) => !v)} />
                    <p className="hud-help">NO MOCK ROUTE ACTIVE</p>
                    <p className="hud-kicker">OBD SIMULATION</p>
                    <Choice on={demoObd} label="DEMO OBD DATA" onClick={() => setDemoObd((v) => !v)} />
                    <p className="hud-help">SIMULATES LOW-TO-HIGH OBD VALUES WHEN NO ADAPTER IS CONNECTED</p>
                    <p className="hud-kicker">BOOT ANIMATION</p>
                    <Choice on={bootDebug} label="SHOW BOOT DEBUG OVERLAY" onClick={() => setBootDebug((v) => !v)} />
                    <p className="hud-help">SHOWS STARTUP PHASES, PRELOADED DESTINATIONS AND TIMESTAMPS DURING BOOT</p>
                    <p className="hud-help">OPTIONAL STARTUP OVERLAY FOR TRACKING WHAT THE APP ITSELF LOADS DURING BOOT</p>
                  </>
                )}

                {page === "system" && (
                  <>
                    <p className="hud-help">ALLOW ALL FILES ACCESS</p>
                    <p className="hud-help">USAGE ACCESS REQUIRED</p>
                    <p className="hud-help">APP VERSION 1.2.16</p>
                    <p className="hud-link">GITHUB RELEASES</p>
                    <p className="hud-link">EXIT TO SYSTEM</p>
                  </>
                )}

                {page === "about" && (
                  <>
                    <img className="hud-about-mark" src="/unit99/apk/gearvaultboy.png" alt="" />
                    <p className="hud-about-title">UNIT 99-E</p>
                    <p className="hud-help">VAULT MAINTENANCE UNIT</p>
                    <p className="hud-kicker">PROJECT</p>
                    <p className="hud-help">VAULT MAINTENANCE UNIT 99-E IS A FAN-MADE PROJECT BY SHADC.</p>
                    <p className="hud-help">PIP-OS / PIPCAR IS A PERSONAL FAN LAUNCHER INSPIRED BY RETROFUTURE TERMINAL INTERFACES AND THE FALLOUT SERIES.</p>
                    <p className="hud-link">{">"} REDDIT: U/SHADOWCIMMER</p>
                    <p className="hud-link">{">"} INSTAGRAM: @UNIT99E</p>
                    <p className="hud-link">{">"} TIKTOK: @UNIT99E</p>
                    <p className="hud-kicker">THANKS</p>
                    <p className="hud-help">
                      SPECIAL THANKS TO ZAPWIZARD'S PYPBOY PROJECT ON GITHUB FOR HELPING START THIS PROJECT, INCLUDING REFERENCE MATERIAL, ASSETS, SOUNDS, AND IDEAS THAT SHAPED THE EARLY BUILD.
                    </p>
                    <p className="hud-kicker">SAFETY AND WARRANTY</p>
                    <p className="hud-help">
                      THIS LAUNCHER IS INTENDED FOR PARKED, PASSENGER, OR SAFE HANDS-FREE USE. DO NOT OPERATE OR CONFIGURE THE APP IN A WAY THAT DISTRACTS YOU WHILE DRIVING.
                    </p>
                    <p className="hud-help">
                      ALWAYS PAY ATTENTION TO THE ROAD, TRAFFIC CONDITIONS, VEHICLE CONTROLS, AND LOCAL LAWS. THE DRIVER IS RESPONSIBLE FOR SAFE AND LEGAL USE OF ANY DASHBOARD OR HEAD UNIT SOFTWARE.
                    </p>
                    <p className="hud-help">
                      THIS FAN-MADE PROJECT IS PROVIDED AS-IS, WITHOUT WARRANTIES OF ANY KIND. NO GUARANTEE IS MADE THAT FEATURES, DATA, MAPS, MEDIA CONTROLS, OBD-II READINGS, OR SYSTEM INTEGRATIONS WILL WORK PERFECTLY OR BE ERROR-FREE.
                    </p>
                    <p className="hud-kicker">MATERIALS AND RIGHTS</p>
                    <p className="hud-help">
                      FALLOUT, VAULT BOY, VAULT-TEC, PIP-BOY, RELATED NAMES, ARTWORK, LOGOS, AND GAME MATERIALS ARE TRADEMARKS OR COPYRIGHTS OF BETHESDA SOFTWORKS LLC, BETHESDA GAME STUDIOS, ZENIMAX MEDIA INC., MICROSOFT, AND/OR THEIR RESPECTIVE OWNERS.
                    </p>
                    <p className="hud-help">
                      THIS PROJECT IS NOT AFFILIATED WITH, ENDORSED BY, SPONSORED BY, OR APPROVED BY BETHESDA, ZENIMAX, MICROSOFT, OR ANY RIGHTS HOLDER.
                    </p>
                    <p className="hud-help">
                      NO OWNERSHIP IS CLAIMED OVER ANY REFERENCED FALLOUT-RELATED MATERIALS. THEY ARE INCLUDED ONLY AS PART OF A NON-COMMERCIAL FAN PROJECT.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <nav className="hud-tabs">
        {TABS.map((id) => (
          <button key={id} type="button" className={tab === id ? "is-on" : ""} onClick={() => openTab(id)}>
            {tab === id ? `[ ${id.toUpperCase()} ]` : id.toUpperCase()}
          </button>
        ))}
      </nav>
        </>
      )}

      {booting ? (
        <button type="button" className={`hud-boot is-${bootPhase}`} onClick={() => setBooting(false)} aria-label="Skip boot">
          {bootPhase === 0 ? <pre className="boot-noise">{noise}</pre> : null}
          {bootPhase === 1 || bootPhase === 2 ? (
            <pre className={bootPhase === 2 ? "boot-rom is-out" : "boot-rom"}>
              {ROM.slice(0, rom).join("\n")}
              <span className="boot-caret">█</span>
            </pre>
          ) : null}
          {bootPhase >= 3 ? (
            <div className="boot-boy">
              <i className="boot-vline" />
              <img src={`/unit99/apk/boot_frame_${bootFrame + 1}.png`} alt="" />
              {bootPhase === 3 ? <p>INITIATING...</p> : null}
            </div>
          ) : null}
          <i className="boot-hline" />
        </button>
      ) : null}
    </div>
  );
}
