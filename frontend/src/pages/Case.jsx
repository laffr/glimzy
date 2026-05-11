import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useMeasure from "react-use-measure";

const RARITY = {
  gray: {
    border: "border-gray-500/60",
    bg: "bg-gray-950",
    text: "text-gray-400",
    label: "Consumer Grade",
    accent: "#6b7280",
  },
  blue: {
    border: "border-blue-500/60",
    bg: "bg-blue-950/60",
    text: "text-blue-400",
    label: "Mil-Spec",
    accent: "#3b82f6",
  },
  purple: {
    border: "border-purple-500/60",
    bg: "bg-purple-950/60",
    text: "text-purple-400",
    label: "Restricted",
    accent: "#a855f7",
  },
  pink: {
    border: "border-pink-500/60",
    bg: "bg-pink-950/60",
    text: "text-pink-400",
    label: "Classified",
    accent: "#ec4899",
  },
  red: {
    border: "border-red-500/60",
    bg: "bg-red-950/60",
    text: "text-red-400",
    label: "Covert",
    accent: "#ef4444",
  },
  yellow: {
    border: "border-yellow-500/60",
    bg: "bg-yellow-950/60",
    text: "text-yellow-400",
    label: "Special",
    accent: "#eab308",
  },
};

const getRarity = (rare) => RARITY[rare] ?? RARITY.gray;

const ITEM_W = 198;
const ITEM_MARGIN = 5;
const ITEM_TOTAL_W = ITEM_W + ITEM_MARGIN * 2;
const VISIBLE = 9;
const WINNER_IDX = 35;
const TOTAL = 42;

function pickWinner(skins) {
  const sum = skins.reduce((a, s) => a + (parseFloat(s.chance) || 0.1), 0);
  let roll = Math.random() * sum;
  for (const s of skins) {
    roll -= parseFloat(s.chance) || 0.1;
    if (roll <= 0) return s;
  }
  return skins[skins.length - 1];
}

function makeStrip(skins, winner) {
  return Array.from({ length: TOTAL }, (_, i) => ({
    ...(i === WINNER_IDX
      ? winner
      : skins[Math.floor(Math.random() * skins.length)]),
    _uid: Math.random() + i,
  }));
}

// ZMIENIONY FRAGMENT SkinCard

function SkinCard({ skin, mini = false, index = 0 }) {
  const c = getRarity(skin.rare);
  const gridBg = index % 2 === 0 ? "bg-[#1a1c24]" : "bg-[#1e2028]";

  return (
    <div
      className={`relative flex-shrink-0 rounded-xl backdrop-blur-md ${
        mini ? `border ${c.border} bg-white/[0.03] p-2` : `${gridBg} p-3`
      }`}
      style={{
        width: mini ? ITEM_W : "100%",
        minWidth: mini ? ITEM_W : undefined,
        margin: mini ? `0 ${ITEM_MARGIN}px` : 0,
        boxSizing: "border-box",
      }}
    >
      {!mini && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
          style={{ background: c.accent, opacity: 0.7 }}
        />
      )}

      <img
        src={"http://localhost:8080" + (skin.imageUrl || skin.image_url || "")}
        alt={skin.name}
        className="w-full object-contain block"
        style={{ height: mini ? 125 : 140 }}
      />

      <div
        className="text-gray-200 font-semibold text-center mt-1 truncate"
        style={{ fontSize: mini ? 10 : 13 }}
      >
        {skin.name}
      </div>

      {!mini && (
        <div className="flex justify-between mt-1.5">
          <span className={`text-xs font-bold ${c.text}`}>{skin.price}zł</span>

          <span className="text-xs text-gray-600">{skin.chance}%</span>
        </div>
      )}
    </div>
  );
}

// Pojedynczy track — tylko overflow + ref, bez własnego tła/borderu/kresek
function RouletteTrack({ strip, trackRef, viewW }) {
  return (
    <div
      style={{
        overflow: "hidden",
        width: viewW,
        position: "relative",
      }}
    >
      <div ref={trackRef} className="flex" style={{ willChange: "transform" }}>
        {strip.length > 0
          ? strip.map((skin, i) => (
              <SkinCard key={skin._uid || i} skin={skin} mini />
            ))
          : Array.from({ length: VISIBLE }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.03] border border-white/5 flex-shrink-0"
                style={{
                  width: ITEM_W,
                  minWidth: ITEM_W,
                  height: 144,
                  margin: `0 ${ITEM_MARGIN}px`,
                }}
              />
            ))}
      </div>
    </div>
  );
}

function ResultModal({ results, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center"
        style={{ animation: "popIn .38s cubic-bezier(.34,1.56,.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-600 text-[10px] tracking-[6px] uppercase mb-8">
          Wylosowano
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {results.map((skin, i) => {
            const c = getRarity(skin.rare);
            return (
              <div
                key={i}
                className={`relative rounded-2xl border p-5 text-center w-48 ${c.border} ${c.bg}`}
                style={{ boxShadow: `0 0 40px ${c.accent}28` }}
              >
                <p
                  className={`text-[9px] tracking-[3px] uppercase mb-2 ${c.text}`}
                >
                  {c.label}
                </p>
                <img
                  src={
                    "http://localhost:8080" +
                    (skin.imageUrl || skin.image_url || "")
                  }
                  alt={skin.name}
                  className="w-full h-28 object-contain"
                />
                <p className="text-white font-bold text-sm mt-3">{skin.name}</p>
                <p className={`text-xl font-black mt-1 ${c.text}`}>
                  {skin.price}zł
                </p>
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-10 px-16 py-3 rounded-lg border border-white/10 bg-white/5 text-white text-[10px] font-bold tracking-[5px] uppercase hover:bg-white/10 transition-all duration-200"
        >
          Kontynuuj
        </button>
      </div>
      <style>{`@keyframes popIn { from{opacity:0;transform:scale(.84)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

function OddsModal({ skins, onClose }) {
  const sorted = [...skins].sort(
    (a, b) => (parseFloat(b.chance) || 0) - (parseFloat(a.chance) || 0),
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#16171D] overflow-hidden"
        style={{
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
          maxHeight: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-black text-lg">%</span>
            <span className="text-white font-black tracking-[3px] uppercase text-sm">
              Zakres Szans
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 border-b border-white/[0.04]">
          <span className="text-gray-600 text-[10px] tracking-[3px] uppercase">
            Przedmiot
          </span>
          <span className="text-gray-600 text-[10px] tracking-[3px] uppercase text-right">
            Cena
          </span>
          <span className="text-gray-600 text-[10px] tracking-[3px] uppercase text-right">
            Szansa
          </span>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 112px)" }}
        >
          {sorted.map((skin, i) => {
            const c = getRarity(skin.rare);
            return (
              <div
                key={skin.id || i}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg border ${c.border} ${c.bg} flex items-center justify-center overflow-hidden`}
                  >
                    <img
                      src={
                        "http://localhost:8080" +
                        (skin.imageUrl || skin.image_url || "")
                      }
                      alt={skin.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate">
                      {skin.name}
                    </p>
                    <p className={`text-[10px] ${c.text}`}>{c.label}</p>
                  </div>
                </div>
                <span className="text-green-400 text-xs font-bold whitespace-nowrap">
                  {skin.price}zł
                </span>
                <span className="text-gray-300 text-xs font-bold whitespace-nowrap text-right">
                  {parseFloat(skin.chance).toFixed(3)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes popIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

const Case = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [count, setCount] = useState(1);
  const [strips, setStrips] = useState([[], [], [], [], []]);
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showOdds, setShowOdds] = useState(false);

  const openBtnRef = useRef(null);

  const [wrapperRef, { width: wrapperWidth }] = useMeasure();
  const trackViewW =
    wrapperWidth > 0
      ? Math.min(wrapperWidth, ITEM_TOTAL_W * VISIBLE)
      : ITEM_TOTAL_W * VISIBLE;

  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    fetch("http://localhost:8080/auth/me", { credentials: "include" })
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((u) => {
        if (u?.steamId) setUserProfile(u);
      })
      .catch(() => setUserProfile(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8080/api/skins", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) =>
        setSkins(
          data.filter((s) => s.weapon?.toUpperCase() === name?.toUpperCase()),
        ),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [name]);

  useEffect(() => {
    if (skins.length > 0 && strips[0].length === 0) {
      setStrips(
        Array.from({ length: 5 }, () =>
          Array.from({ length: TOTAL }, () => ({
            ...skins[Math.floor(Math.random() * skins.length)],
            _uid: Math.random(),
          })),
        ),
      );
    }
  }, [skins, strips]);

  const handleCountChange = (n) => {
    if (spinning) return;
    setCount(n);
    setTimeout(
      () =>
        openBtnRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      50,
    );
  };

  const openCase = () => {
    if (spinning || !userProfile || skins.length === 0) return;
    setShowResult(false);
    setResults(null);

    const winners = Array.from({ length: count }, () => pickWinner(skins));
    setStrips(winners.map((w) => makeStrip(skins, w)));

    refs.slice(0, count).forEach((r) => {
      if (!r.current) return;
      r.current.style.transition = "none";
      r.current.style.transform = "translateX(0)";
    });
    setSpinning(true);

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const centerOfView = trackViewW / 2;
        const winnerCenter =
          WINNER_IDX * ITEM_TOTAL_W + ITEM_MARGIN + ITEM_W / 2;
        const targetX = -(winnerCenter - centerOfView);
        const baseDur = 5000;

        refs.slice(0, count).forEach((r) => {
          if (!r.current) return;
          r.current.style.transition = `transform ${baseDur}ms cubic-bezier(0.04,0.82,0.16,1.0)`;
          r.current.style.transform = `translateX(${targetX}px)`;
        });

        setTimeout(() => {
          setSpinning(false);
          setResults(winners);
          setShowResult(true);
        }, baseDur + 350);
      }),
    );
  };

  if (error)
    return (
      <div className="min-h-screen bg-[#16171D] flex items-center justify-center">
        <p className="text-red-400 font-mono text-sm">Blad: {error}</p>
      </div>
    );
  return (
    <div
      className="min-h-screen bg-[#16171D] px-7 py-10"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      {showResult && results && (
        <ResultModal results={results} onClose={() => setShowResult(false)} />
      )}
      {showOdds && skins.length > 0 && (
        <OddsModal skins={skins} onClose={() => setShowOdds(false)} />
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="text-[12px] uppercase tracking-[1px]">
            Powrot do strony glownej
          </span>
        </button>
        <div className="w-px h-6 bg-white/10" />
        <h1 className="text-white text-2xl font-black tracking-[3px] uppercase">
          {name} CASE
        </h1>
      </div>

      {/* Outer div do mierzenia + kotwica dla strzałek */}
      <div
        ref={wrapperRef}
        className="w-full mb-10"
        style={{ position: "relative" }}
      >
        {/* Jeden wspólny kontener dla wszystkich tracków */}
        <div
          className="
    relative
    overflow-hidden
    rounded-2xl
    py-4
    border
    border-white/10
    bg-white/[0.04]
    backdrop-blur-2xl
    shadow-[0_10px_40px_rgba(0,0,0,0.45)]
  "
          style={{
            width: trackViewW,
          }}
        >
          {/* SHINE OVERLAY */}
          <div
            className="
      absolute
      inset-0
      pointer-events-none
      bg-gradient-to-b
      from-white/[0.10]
      via-white/[0.03]
      to-white/[0.01]
    "
          />

          {/* Gradient lewy */}
          <div
            className="absolute top-0 left-0 h-full w-48 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(9,10,15,.96) 0%, rgba(9,10,15,.58) 35%, transparent 100%)",
            }}
          />

          {/* Gradient prawy */}
          <div
            className="absolute top-0 right-0 h-full w-48 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(9,10,15,.96) 0%, rgba(9,10,15,.58) 35%, transparent 100%)",
            }}
          />

          {/* Kreska */}
          {count > 1 && (
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                width: 2,
                background: "#22c55e",
                boxShadow: "0 0 12px 1px rgba(34,197,94,0.7)",
              }}
            />
          )}

          {/* Tracki */}
          <div
            className="flex flex-col gap-2.5"
            style={{ position: "relative", zIndex: 10 }}
          >
            {Array.from({ length: count }).map((_, i) => (
              <RouletteTrack
                key={i}
                strip={strips[i] || []}
                trackRef={refs[i]}
                viewW={trackViewW}
              />
            ))}
          </div>
        </div>

        <div
          className="pointer-events-none"
          style={{
            position: "absolute",
            top: -4,
            left: trackViewW / 2,
            transform: "translateX(-50%)",
            zIndex: 40,
            width: 24,
            height: 14,
            background: "#22c55e",
            clipPath: "polygon(50% 100%, 0 0, 100% 0)",
            filter: "drop-shadow(0 0 5px rgba(34,197,94,0.9))",
          }}
        />

        <div
          className="pointer-events-none"
          style={{
            position: "absolute",
            bottom: -4,
            left: trackViewW / 2,
            transform: "translateX(-50%)",
            zIndex: 40,
            width: 24,
            height: 14,
            background: "#22c55e",
            clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
            filter: "drop-shadow(0 0 5px rgba(34,197,94,0.9))",
          }}
        />
      </div>

      {/*Controls*/}
      <div className="flex flex-col items-center gap-4">
        {userProfile && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => handleCountChange(n)}
                  disabled={spinning}
                  className={`w-10 h-9 rounded-lg text-sm font-bold transition-all duration-150 ${
                    count === n
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              ref={openBtnRef}
              onClick={openCase}
              disabled={spinning || loading || skins.length === 0}
              className={`h-11 px-10 rounded-xl text-[10px] font-black tracking-[4px] uppercase transition-all duration-200 ${
                spinning
                  ? "border border-white/5 bg-transparent text-gray-700 cursor-not-allowed"
                  : "border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:border-green-500/60"
              }`}
            >
              {spinning ? "Losowanie..." : `Otworz x${count}`}
            </button>
          </div>
        )}

        {!userProfile && (
          <button
            onClick={() => {
              window.location.href = `http://localhost:8080/auth/steam/login?returnUrl=${encodeURIComponent(
                "http://localhost:5173" + window.location.pathname,
              )}`;
            }}
            className="flex items-center justify-center gap-3 bg-[#003406]/20 border border-[#00B809]/70 text-[#d6ffe0] hover:bg-[#0f7a16]/40 hover:text-white px-8 py-3 rounded-lg transition-all duration-200 active:scale-[0.98] font-semibold tracking-wide uppercase mx-auto"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
              className="w-5 h-5 opacity-90"
            />
            <span>Zaloguj się przez Steam</span>
          </button>
        )}
      </div>

      {/* Case contents */}
      <div className="pt-8">
        <div className="relative flex items-center justify-between mb-1 gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <p className="text-white text-base font-black tracking-[2px] uppercase whitespace-nowrap relative z-10 pr-4 bg-[#16171D]">
              Zawartosc skrzynki {name}
            </p>
            <div className="h-px bg-white/[0.07] flex-1 hidden sm:block" />
          </div>
          <button
            onClick={() => setShowOdds(true)}
            className="flex items-center gap-2 border border-white/10 bg-white/[0.04] hover:bg-green-500/10 hover:border-green-500/30 text-white text-[10px] font-bold tracking-[3px] uppercase px-3 sm:px-4 py-2 rounded-lg transition-all duration-150 flex-shrink-0"
          >
            <span className="text-green-400 font-black text-sm leading-none">
              %
            </span>
            <span className="hidden sm:inline">Sprawdz szanse</span>
          </button>
        </div>

        <p className="text-gray-600 text-[10px] tracking-[2px] uppercase mb-6">
          Sprawdz co mozesz zdobyc i jakie sa twoje szanse!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/[0.02] h-44 animate-pulse"
                />
              ))
            : skins.map((skin, i) => (
                <div
                  key={skin.id}
                  className="transition-all duration-300 hover:-translate-y-1"
                >
                  <SkinCard skin={skin} index={i} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Case;
