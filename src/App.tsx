import { useEffect, useMemo, useState } from "react";
import mikeImage from "./assets/mike.png";
import sulleyImage from "./assets/sulley.png";

const SCREEN_COUNT = 8;
const CYCLE_SECONDS = 24;

function getScreenFromUrl(): number {
  const raw = Number(new URLSearchParams(window.location.search).get("screen") ?? "1");
  return Number.isInteger(raw) && raw >= 1 && raw <= SCREEN_COUNT ? raw : 1;
}

export default function App() {
  const screen = useMemo(getScreenFromUrl, []);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 40);
    return () => window.clearInterval(timer);
  }, []);

  const cycleMs = CYCLE_SECONDS * 1000;
  const phase = ((now % cycleMs) + cycleMs) % cycleMs / cycleMs;
  const totalWidth = window.innerWidth * SCREEN_COUNT;
  const characterX = phase * totalWidth;
  const localX = characterX - (screen - 1) * window.innerWidth;
  const visible = localX > -640 && localX < window.innerWidth + 640;
  const bounce = Math.sin((phase * Math.PI * 2 * totalWidth) / 220) * 7;
  const testMode = new URLSearchParams(location.search).has("test");

  return (
    <main className={`scene ${testMode ? "scene--test" : ""}`}>
      <div className="sky" />
      <div className="moon"><span /></div>
      <div className="stars stars--one" />
      <div className="stars stars--two" />
      <div className="cloud cloud--one" />
      <div className="cloud cloud--two" />

      <div className="campus campus--far">
        <div className="tower tower--one"><i /><i /><i /></div>
        <div className="tower tower--two"><i /><i /><i /></div>
        <div className="main-building">
          <div className="roof" />
          <div className="building-label">
            <span>FED MOBILE</span>
            <strong>MONSTER UNIVERSITY</strong>
          </div>
          <div className="columns"><i /><i /><i /><i /><i /></div>
          <div className="steps" />
        </div>
        <div className="tower tower--three"><i /><i /><i /></div>
      </div>

      <div className="hills hills--back" />
      <div className="hills hills--front" />
      <div className="path" />
      <div className="grass grass--left" />
      <div className="grass grass--right" />
      <div className="pumpkin pumpkin--one"><i /></div>
      <div className="pumpkin pumpkin--two"><i /></div>
      <div className="sign"><span>SCREAMS &</span><strong>DREAMS</strong><small>UNIVERSITY</small></div>

      {visible && (
        <div
          className="runner"
          aria-hidden="true"
          style={{
            left: `${localX}px`,
            transform: `translateY(${bounce}px)`,
          }}
        >
          <img className="runner-character" src={mikeImage} alt="" />
          <img className="runner-character runner-chaser" src={sulleyImage} alt="" />
        </div>
      )}

      <div className="bottom-vignette" />
      <div className="screen-label">SCREEN {screen} / {SCREEN_COUNT}</div>
    </main>
  );
}