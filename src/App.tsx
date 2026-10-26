import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import kapaImage from "./assets/kapa.png";
import mikeImage from "./assets/mike.png";
import rozImage from "./assets/roz.png";
import sulleyImage from "./assets/sulley.png";

const SCREEN_COUNT = 8;
const CYCLE_SECONDS = 24;
const SECONDARY_START_SCREEN = 4;
const SECONDARY_START_PHASE = (SECONDARY_START_SCREEN - 1) / SCREEN_COUNT;

function getScreenFromUrl(): number {
  const raw = Number(new URLSearchParams(window.location.search).get("screen") ?? "1");
  return Number.isInteger(raw) && raw >= 1 && raw <= SCREEN_COUNT ? raw : 1;
}

export default function App() {
  const sceneRef = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState(getScreenFromUrl);
  const [now, setNow] = useState(Date.now());
  const [secondaryStarted, setSecondaryStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 40);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => setScreen(getScreenFromUrl());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === sceneRef.current);
      setFullscreenError("");
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const cycleMs = CYCLE_SECONDS * 1000;
  const phase = ((now % cycleMs) + cycleMs) % cycleMs / cycleMs;

  useEffect(() => {
    if (phase >= SECONDARY_START_PHASE) {
      setSecondaryStarted(true);
    }
  }, [phase]);

  function goToNextScreen() {
    const nextScreen = screen % SCREEN_COUNT + 1;
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("screen", String(nextScreen));
    window.history.pushState({}, "", nextUrl);
    setScreen(nextScreen);
  }

  function goToPreviousScreen() {
    const previousScreen = (screen - 2 + SCREEN_COUNT) % SCREEN_COUNT + 1;
    const previousUrl = new URL(window.location.href);
    previousUrl.searchParams.set("screen", String(previousScreen));
    window.history.pushState({}, "", previousUrl);
    setScreen(previousScreen);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === sceneRef.current) {
        await document.exitFullscreen();
      } else if (sceneRef.current?.requestFullscreen) {
        await sceneRef.current.requestFullscreen();
      } else {
        setFullscreenError("Full screen is not supported by this browser.");
      }
    } catch {
      setFullscreenError("Unable to change full screen mode.");
    }
  }

  const totalWidth = window.innerWidth * SCREEN_COUNT;
  const characterX = phase * totalWidth;
  const localX = characterX - (screen - 1) * window.innerWidth;
  const visible = localX > -640 && localX < window.innerWidth + 640;
  const bounce = Math.sin((phase * Math.PI * 2 * totalWidth) / 220) * 7;
  const secondaryPhase = (phase - SECONDARY_START_PHASE + 1) % 1;
  const secondaryCharacterX = secondaryPhase * totalWidth;
  const secondaryLocalX = secondaryCharacterX - (screen - 1) * window.innerWidth;
  const secondaryVisible = secondaryLocalX > -640 && secondaryLocalX < window.innerWidth + 640;
  const secondaryBounce = Math.sin((secondaryPhase * Math.PI * 2 * totalWidth) / 220) * 7;
  const testMode = new URLSearchParams(location.search).has("test");

  return (
    <main ref={sceneRef} className={`scene ${testMode ? "scene--test" : ""}`}>
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

      {secondaryStarted && secondaryVisible && (
        <div
          className="runner runner--secondary"
          aria-hidden="true"
          style={{
            left: `${secondaryLocalX}px`,
            transform: `translateY(${secondaryBounce}px)`,
          }}
        >
          <img className="runner-character runner-character--roz" src={rozImage} alt="" />
          <img className="runner-character runner-chaser runner-chaser--kapa" src={kapaImage} alt="" />
        </div>
      )}

      <div className="bottom-vignette" />
      <div className="screen-label">SCREEN {screen} / {SCREEN_COUNT}</div>
      <button
        className="fullscreen-toggle"
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        title={isFullscreen ? "Exit full screen" : "Enter full screen"}
      >
        {isFullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
      </button>
      {fullscreenError && <div className="fullscreen-error" role="status">{fullscreenError}</div>}
      <button className="screen-navigation screen-navigation--previous" type="button" onClick={goToPreviousScreen} aria-label="Go to previous screen">
        &lt;
      </button>
      <button className="screen-navigation screen-navigation--next" type="button" onClick={goToNextScreen} aria-label="Go to next screen">
        &gt;
      </button>
    </main>
  );
}