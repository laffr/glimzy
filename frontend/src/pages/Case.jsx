import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useMeasure from "react-use-measure";

// === RARITY — kolory dostosowane do niebieskiego motywu ===
const RARITY = {
  gray: {
    bg: "bg-blue-950",
    text: "text-blue-300",
    label: "Consumer Grade",
    accent: "#64748b",
  },
  blue: {
    bg: "bg-blue-900",
    text: "text-blue-300",
    label: "Mil-Spec",
    accent: "#3b82f6",
  },
  purple: {
    bg: "bg-purple-900",
    text: "text-purple-300",
    label: "Restricted",
    accent: "#a855f7",
  },
  pink: {
    bg: "bg-pink-900",
    text: "text-pink-300",
    label: "Classified",
    accent: "#ec4899",
  },
  red: {
    bg: "bg-red-900",
    text: "text-red-300",
    label: "Covert",
    accent: "#ef4444",
  },
  yellow: {
    bg: "bg-yellow-900",
    text: "text-yellow-300",
    label: "Special",
    accent: "#eab308",
  },
};

const getRarity = (rare) => RARITY[rare] ?? RARITY.gray;

// Główne kolory motywu
const THEME = {
  bgPrimary: "#020f1c",
  bgSecondary: "#031828",
  bgCard: "#042236",
  bgCardHover: "#05294a",
  accent: "#016396",
  accentBright: "#0284c7",
  accentGlow: "#0ea5e9",
  border: "rgba(1,99,150,0.3)",
  borderBright: "rgba(14,165,233,0.5)",
  text: "#e0f2fe",
  textMuted: "#7ab8d4",
  textDim: "#3b7ea1",
};

const ITEM_W = 198;
const ITEM_MARGIN = 0;
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

function SkinCard({ skin, mini = false, index = 0 }) {
  const c = getRarity(skin.rare);

  // Subtelniejszy gradient - mniej intensywny kolor rare
  const gradientBg = `linear-gradient(160deg, ${THEME.bgCard} 0%, ${c.accent}22 60%, ${c.accent}44 100%)`;
  const glowShadow = `0 0 18px 2px ${c.accent}22, inset 0 0 24px 0px ${c.accent}18`;

  return (
    <div
      className={`relative flex-shrink-0 ${mini ? "p-2" : "p-3"}`}
      style={{
        width: mini ? ITEM_W : "100%",
        minWidth: mini ? ITEM_W : undefined,
        margin: mini ? `0 ${ITEM_MARGIN}px` : 0,
        boxSizing: "border-box",
        background: gradientBg,
        boxShadow: glowShadow,
        borderRadius: mini ? 0 : 12,
      }}
    >
      {/* Pasek koloru na górze */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 3,
          background: `linear-gradient(90deg, transparent, ${c.accent}cc, transparent)`,
          borderRadius: mini ? 0 : "12px 12px 0 0",
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: mini ? 0 : 12,
          boxShadow: `inset 0 0 30px 0 ${c.accent}08`,
        }}
      />

      <img
        src={"http://localhost:8080" + (skin.imageUrl || skin.image_url || "")}
        alt={skin.name}
        className="w-full object-contain block relative z-10"
        style={{ height: mini ? 190 : 210 }}
      />

      <div
        className="font-semibold text-center mt-1 truncate relative z-10"
        style={{ fontSize: mini ? 10 : 13, color: THEME.text }}
      >
        {skin.name}
      </div>

      {!mini && (
        <div className="flex justify-between mt-1.5 relative z-10">
          <span className={`text-xs font-bold ${c.text}`}>{skin.price}zł</span>
          <span className="text-xs" style={{ color: THEME.textDim }}>
            {skin.chance}%
          </span>
        </div>
      )}
    </div>
  );
}

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
                className="flex-shrink-0"
                style={{
                  width: ITEM_W,
                  minWidth: ITEM_W,
                  height: 144,
                  margin: `0 ${ITEM_MARGIN}px`,
                  background: "rgba(1,99,150,0.08)",
                  border: "1.5px solid #38bdf8",
                  borderRadius: 0,
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
      style={{
        background: "rgba(1,10,22,0.95)",
        backdropFilter: "blur(16px)",
      }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center"
        style={{ animation: "popIn .38s cubic-bezier(.34,1.56,.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="text-[10px] tracking-[6px] uppercase mb-8"
          style={{ color: THEME.textDim }}
        >
          Wylosowano
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {results.map((skin, i) => {
            const c = getRarity(skin.rare);
            return (
              <div
                key={i}
                className={`relative rounded-2xl p-5 text-center w-48 ${c.bg}`}
                style={{
                  border: `1px solid ${c.accent}50`,
                  boxShadow: `0 0 40px ${c.accent}28`,
                }}
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
                <p
                  className="font-bold text-sm mt-3"
                  style={{ color: THEME.text }}
                >
                  {skin.name}
                </p>
                <p className={`text-xl font-black mt-1 ${c.text}`}>
                  {skin.price}zł
                </p>
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-10 px-16 py-3 rounded-lg font-bold tracking-[5px] uppercase transition-all duration-200"
          style={{
            border: "1.5px solid #38bdf8",
            background: `rgba(1,99,150,0.15)`,
            color: THEME.accentGlow,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = `rgba(1,99,150,0.3)`)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = `rgba(1,99,150,0.15)`)
          }
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
      style={{
        background: "rgba(1,10,22,0.9)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
          maxHeight: "80vh",
          background: THEME.bgCard,
          border: "1.5px solid #38bdf8",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid ${THEME.border}` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-black text-lg"
              style={{ color: THEME.accentGlow }}
            >
              %
            </span>
            <span
              className="font-black tracking-[3px] uppercase text-sm"
              style={{ color: THEME.text }}
            >
              Zakres Szans
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{
              border: "1.5px solid #38bdf8",
              background: "rgba(1,99,150,0.1)",
              color: THEME.textMuted,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = THEME.text)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = THEME.textMuted)
            }
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
        <div
          className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3"
          style={{ borderBottom: `1px solid rgba(1,99,150,0.12)` }}
        >
          <span
            className="text-[10px] tracking-[3px] uppercase"
            style={{ color: THEME.textDim }}
          >
            Przedmiot
          </span>
          <span
            className="text-[10px] tracking-[3px] uppercase text-right"
            style={{ color: THEME.textDim }}
          >
            Cena
          </span>
          <span
            className="text-[10px] tracking-[3px] uppercase text-right"
            style={{ color: THEME.textDim }}
          >
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
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-3 transition-colors"
                style={{ borderBottom: `1px solid rgba(1,99,150,0.08)` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(1,99,150,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden ${c.bg}`}
                    style={{ border: `1px solid ${c.accent}40` }}
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
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: THEME.text }}
                    >
                      {skin.name}
                    </p>
                    <p className={`text-[10px] ${c.text}`}>{c.label}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold whitespace-nowrap"
                  style={{ color: THEME.accentGlow }}
                >
                  {skin.price}zł
                </span>
                <span
                  className="text-xs font-bold whitespace-nowrap text-right"
                  style={{ color: THEME.textMuted }}
                >
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

  useEffect(() => {
    if (skins.length > 0 && strips[0].length > 0 && !spinning) {
      const centerOfView = trackViewW / 2;
      const winnerCenter = WINNER_IDX * ITEM_TOTAL_W + ITEM_MARGIN + ITEM_W / 2;
      const targetX = -(winnerCenter - centerOfView);

      refs.slice(0, count).forEach((r) => {
        if (!r.current) return;
        r.current.style.transition = "none";
        r.current.style.transform = `translateX(${targetX}px)`;
      });
    }
  }, [strips, trackViewW, count]);

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

        setTimeout(async () => {
          setSpinning(false);
          setResults(winners);
          setShowResult(true);

          try {
            for (const skin of winners) {
              await fetch("http://localhost:8080/inventory/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  userId: userProfile.id,
                  skinId: skin.id,
                }),
              });
            }
          } catch (err) {
            console.error(err);
          }
        }, baseDur + 350);
      }),
    );
  };

  if (error)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: THEME.bgPrimary }}
      >
        <p className="font-mono text-sm" style={{ color: "#ef4444" }}>
          Blad: {error}
        </p>
      </div>
    );

  return (
    <div
      className="min-h-screen px-7 py-10"
      style={{
        background: `linear-gradient(160deg, ${THEME.bgPrimary} 0%, #011929 50%, ${THEME.bgPrimary} 100%)`,
        fontFamily: "'Rajdhani', sans-serif",
      }}
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
          className="flex items-center gap-2 group transition-colors"
          style={{ color: THEME.textDim }}
          onMouseEnter={(e) => (e.currentTarget.style.color = THEME.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = THEME.textDim)}
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
            Powrot do skrzynek
          </span>
        </button>
        <div className="w-px h-6" style={{ background: THEME.border }} />
        <h1
          className="text-2xl font-black tracking-[3px] uppercase"
          style={{ color: THEME.text }}
        >
          {name} CASE
        </h1>
      </div>

      {/* Roulette wrapper */}
      <div
        ref={wrapperRef}
        className="w-full mb-10"
        style={{ position: "relative" }}
      >
        {/* Gradient border wrapper */}
        <div
          style={{
            width: trackViewW,
            padding: "3px",
            borderRadius: 16,
            background:
              "linear-gradient(90deg, #38bdf8 0%, rgba(56,189,248,0.85) 18%, rgba(2,132,199,0.32) 40%, rgba(2,132,199,0.32) 60%, rgba(56,189,248,0.85) 82%, #38bdf8 100%)",
            boxShadow:
              "0 0 40px 8px #38bdf822, 0 0 80px 16px #0284c714, 0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: "100%",
              background: THEME.bgSecondary,
              borderRadius: 14,
            }}
          >
            {/* Tło tracka */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "#010e1c" }}
            />

            {/* Gradient lewy - ciemno po bokach, przejście do środka */}
            <div
              className="absolute top-0 left-0 h-full z-20 pointer-events-none"
              style={{
                width: "38%",
                background:
                  "linear-gradient(to right, rgba(1,8,20,0.98) 0%, rgba(1,8,20,0.85) 45%, rgba(1,8,20,0.4) 75%, transparent 100%)",
              }}
            />

            {/* Gradient prawy - ciemno po bokach, przejście do środka */}
            <div
              className="absolute top-0 right-0 h-full z-20 pointer-events-none"
              style={{
                width: "38%",
                background:
                  "linear-gradient(to left, rgba(1,8,20,0.98) 0%, rgba(1,8,20,0.85) 45%, rgba(1,8,20,0.4) 75%, transparent 100%)",
              }}
            />

            {/* Kreska środkowa - grubsza i jaśniejsza */}
            {count > 1 && (
              <div
                className="absolute top-0 bottom-0 z-30 pointer-events-none"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 3,
                  background: THEME.accentBright,
                  boxShadow: `0 0 16px 4px ${THEME.accentBright}cc`,
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
        </div>

        {/* Strzałka górna - grubsza */}
        <div
          className="pointer-events-none"
          style={{
            position: "absolute",
            top: -8,
            left: trackViewW / 2,
            transform: "translateX(-50%)",
            zIndex: 40,
            width: 30,
            height: 18,
            background: THEME.accentBright,
            clipPath: "polygon(50% 100%, 0 0, 100% 0)",
            filter: `drop-shadow(0 0 8px ${THEME.accentBright})`,
          }}
        />
        {/* Strzałka dolna - grubsza */}
        <div
          className="pointer-events-none"
          style={{
            position: "absolute",
            bottom: -8,
            left: trackViewW / 2,
            transform: "translateX(-50%)",
            zIndex: 40,
            width: 30,
            height: 18,
            background: THEME.accentBright,
            clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
            filter: `drop-shadow(0 0 8px ${THEME.accentBright})`,
          }}
        />
      </div>

      {/* Kontrolki */}
      <div className="flex flex-col items-center gap-4">
        {userProfile && (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 rounded-xl p-1"
              style={{
                background: "rgba(1,99,150,0.08)",
                border: "1.5px solid #38bdf8",
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => handleCountChange(n)}
                  disabled={spinning}
                  className="w-10 h-9 rounded-lg text-sm font-bold transition-all duration-150"
                  style={
                    count === n
                      ? {
                          background: `rgba(2,132,199,0.2)`,
                          color: THEME.accentGlow,
                          border: `1px solid ${THEME.accentBright}50`,
                        }
                      : {
                          color: THEME.textDim,
                          border: "1px solid transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (count !== n)
                      e.currentTarget.style.color = THEME.textMuted;
                  }}
                  onMouseLeave={(e) => {
                    if (count !== n)
                      e.currentTarget.style.color = THEME.textDim;
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              ref={openBtnRef}
              onClick={openCase}
              disabled={spinning || loading || skins.length === 0}
              className="h-11 px-10 rounded-xl text-[10px] font-black tracking-[4px] uppercase transition-all duration-200"
              style={
                spinning
                  ? {
                      border: "1.5px solid #38bdf8",
                      background: "transparent",
                      color: THEME.textDim,
                      cursor: "not-allowed",
                    }
                  : {
                      border: `1px solid ${THEME.accentBright}66`,
                      background: `rgba(2,132,199,0.12)`,
                      color: THEME.accentGlow,
                    }
              }
              onMouseEnter={(e) => {
                if (!spinning)
                  e.currentTarget.style.background = `rgba(2,132,199,0.22)`;
              }}
              onMouseLeave={(e) => {
                if (!spinning)
                  e.currentTarget.style.background = `rgba(2,132,199,0.12)`;
              }}
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
            className="flex items-center justify-center gap-3 px-8 py-3 rounded-lg transition-all duration-200 active:scale-[0.98] font-semibold tracking-wide uppercase mx-auto"
            style={{
              background: "rgba(1,99,150,0.15)",
              border: `1px solid ${THEME.accentBright}60`,
              color: THEME.text,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(1,99,150,0.28)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(1,99,150,0.15)";
              e.currentTarget.style.color = THEME.text;
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
              className="w-5 h-5 opacity-90"
            />
            <span>Zaloguj się przez Steam</span>
          </button>
        )}
      </div>

      {/* Zawartość skrzynki */}
      <div className="pt-8">
        <div className="relative flex items-center justify-between mb-1 gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <p
              className="text-base font-black tracking-[2px] uppercase whitespace-nowrap relative z-10 pr-4"
              style={{ color: THEME.text, background: THEME.bgPrimary }}
            >
              Zawartosc skrzynki {name}
            </p>
            <div
              className="h-px flex-1 hidden sm:block"
              style={{ background: THEME.border }}
            />
          </div>
          <button
            onClick={() => setShowOdds(true)}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[3px] uppercase px-3 sm:px-4 py-2 rounded-lg transition-all duration-150 flex-shrink-0"
            style={{
              border: "1.5px solid #38bdf8",
              background: "rgba(1,99,150,0.08)",
              color: THEME.text,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(1,99,150,0.2)";
              e.currentTarget.style.borderColor = THEME.accentBright + "50";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(1,99,150,0.08)";
              e.currentTarget.style.borderColor = THEME.border;
            }}
          >
            <span
              className="font-black text-sm leading-none"
              style={{ color: THEME.accentGlow }}
            >
              %
            </span>
            <span className="hidden sm:inline">Sprawdz szanse</span>
          </button>
        </div>

        <p
          className="text-[10px] tracking-[2px] uppercase mb-6"
          style={{ color: THEME.textDim }}
        >
          Sprawdz co mozesz zdobyc i jakie sa twoje szanse!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl h-44 animate-pulse"
                  style={{ background: "rgba(1,99,150,0.08)" }}
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
