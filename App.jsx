import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0a0a",
  surface: "#141414",
  surfaceHover: "#1c1c1c",
  border: "#2a2a2a",
  borderLight: "#333",
  text: "#f5f5f5",
  textMuted: "#888",
  textDim: "#555",
  accent: "#FF6B00",
  accentHover: "#FF8533",
  accentDim: "rgba(255,107,0,0.1)",
  accentGlow: "rgba(255,107,0,0.15)",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.1)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.1)",
};

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
`;

const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; }
  ::selection { background: ${COLORS.accent}; color: #000; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px ${COLORS.accentGlow}; } 50% { box-shadow: 0 0 40px ${COLORS.accentGlow}, 0 0 60px rgba(255,107,0,0.08); } }
  @keyframes toastIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─── MOBILE HOOK ───
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── TOAST ───
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "success" ? COLORS.greenDim : COLORS.redDim;
  const border = type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)";
  const color = type === "success" ? COLORS.green : COLORS.red;
  const icon = type === "success" ? "✓" : "✕";

  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 999, background: COLORS.surface, border: `1px solid ${border}`,
      borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center",
      gap: 12, animation: "toastIn 0.3s ease-out", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      minWidth: 260, maxWidth: "calc(100vw - 32px)",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, fontSize: 14, fontWeight: 700, flexShrink: 0,
      }}>{icon}</div>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.text, flex: 1 }}>
        {message}
      </span>
      <span onClick={onClose} style={{ color: COLORS.textDim, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</span>
    </div>
  );
}

// ─── NAV ───
function Nav({ page, setPage, credits, email, isMobile }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${COLORS.border}`,
      padding: isMobile ? "0 16px" : "0 40px",
      height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setPage("home")}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: COLORS.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: "#000",
        }}>LP</div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>
          Lead<span style={{ color: COLORS.accent }}>Pulp</span>
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", gap: isMobile ? 8 : 16, alignItems: "center" }}>
        {!isMobile && (
          <>
            <NavLink label="How it works" onClick={() => { setPage("home"); setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }), 100); }} />
            <NavLink label="Pricing" onClick={() => { setPage("home"); setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100); }} />
          </>
        )}
        {email && credits > 0 && (
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.accent,
            background: COLORS.accentDim, padding: "4px 10px", borderRadius: 6,
            border: `1px solid rgba(255,107,0,0.2)`, whiteSpace: "nowrap",
          }}>⚡ {credits.toLocaleString()}</div>
        )}
        <button onClick={() => setPage("app")} style={{
          background: COLORS.accent, color: "#000", border: "none", borderRadius: 8,
          padding: isMobile ? "8px 14px" : "9px 20px",
          fontFamily: "'Outfit', sans-serif", fontWeight: 700,
          fontSize: isMobile ? 13 : 14, cursor: "pointer", whiteSpace: "nowrap",
        }}>
          {isMobile ? "Scrape →" : "Start Scraping"}
        </button>
      </div>
    </nav>
  );
}

function NavLink({ label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer",
        color: hovered ? COLORS.text : COLORS.textMuted, transition: "color 0.2s",
      }}>{label}</span>
  );
}

// ─── HERO ───
function Hero({ setPage, isMobile }) {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section style={{
      minHeight: isMobile ? "auto" : "100vh",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "100px 20px 60px" : "120px 40px 80px",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: `linear-gradient(${COLORS.text} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.text} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
        width: isMobile ? 400 : 800, height: isMobile ? 400 : 800, borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.accentGlow} 0%, transparent 70%)`,
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.8s ease-out", width: "100%" }}>
        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 100,
          background: COLORS.accentDim, border: `1px solid rgba(255,107,0,0.2)`,
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: COLORS.accent,
          marginBottom: isMobile ? 20 : 32, letterSpacing: "1px", textTransform: "uppercase",
        }}>Raw, unfiltered leads</div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 900,
          fontSize: isMobile ? "clamp(38px, 10vw, 56px)" : "clamp(48px, 7vw, 84px)",
          lineHeight: 1.05, letterSpacing: "-2px", maxWidth: 800, margin: "0 auto",
          marginBottom: isMobile ? 16 : 24,
        }}>
          Google Maps data.<br />
          <span style={{ color: COLORS.accent }}>Squeezed fresh.</span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 400,
          fontSize: isMobile ? 16 : 20, color: COLORS.textMuted,
          maxWidth: 520, margin: "0 auto", marginBottom: isMobile ? 32 : 48, lineHeight: 1.6,
        }}>
          Type any business type + any city. Get every name, phone, email, and review — downloaded as a spreadsheet in seconds.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("app")} style={{
            background: COLORS.accent, color: "#000", border: "none", borderRadius: 10,
            padding: isMobile ? "14px 32px" : "16px 40px",
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: isMobile ? 15 : 17, cursor: "pointer",
            animation: "glow 3s ease-in-out infinite",
          }}>Try it free →</button>
          <button onClick={scrollToPricing} style={{
            background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: isMobile ? "14px 32px" : "16px 40px",
            fontFamily: "'Outfit', sans-serif", fontWeight: 600,
            fontSize: isMobile ? 15 : 17, cursor: "pointer",
          }}>See pricing</button>
        </div>

        <div style={{
          marginTop: isMobile ? 48 : 64,
          display: "flex", gap: isMobile ? 32 : 48,
          justifyContent: "center", flexWrap: "wrap",
        }}>
          {[
            { num: "2.4M+", label: "Leads scraped" },
            { num: "< 30s", label: "Per search" },
            { num: "$0.07", label: "Per lead" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: isMobile ? 22 : 28, fontWeight: 700, color: COLORS.accent }}>{s.num}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ───
function HowItWorks({ isMobile }) {
  const steps = [
    { num: "01", title: "Type your search", desc: "Enter any business type and any city. \"Plumbers in Chicago.\" \"Yoga studios in Austin.\" Anything." },
    { num: "02", title: "We scrape Google Maps", desc: "Our engine pulls every matching business — name, phone, email, address, star rating, review count. All of it." },
    { num: "03", title: "Download your leads", desc: "Get a clean spreadsheet ready for cold calls, cold emails, or CRM import. No formatting needed." },
  ];

  return (
    <section id="how-it-works" style={{ padding: isMobile ? "60px 20px" : "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 800,
        fontSize: isMobile ? 30 : 40, textAlign: "center",
        letterSpacing: "-1px", marginBottom: 12,
      }}>How it works</h2>
      <p style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 15, color: COLORS.textMuted,
        textAlign: "center", marginBottom: isMobile ? 40 : 72,
        maxWidth: 480, marginLeft: "auto", marginRight: "auto",
      }}>Three steps. No training. No onboarding calls. No BS.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
            padding: isMobile ? 28 : 40,
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: isMobile ? 36 : 48, fontWeight: 700,
              color: "transparent", marginBottom: 16, WebkitTextStroke: `1px rgba(255,107,0,0.3)`,
            }}>{step.num}</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, marginBottom: 10 }}>{step.title}</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PRICING ───
function Pricing({ onBuyCredits, isMobile }) {
  const plans = [
    { id: "starter", name: "Starter", credits: "500", price: "49", perLead: "0.098", popular: false },
    { id: "growth",  name: "Growth",  credits: "2,000", price: "149", perLead: "0.075", popular: true },
    { id: "agency",  name: "Agency",  credits: "5,000", price: "299", perLead: "0.060", popular: false },
  ];

  return (
    <section id="pricing" style={{
      padding: isMobile ? "60px 20px" : "100px 40px",
      maxWidth: 1100, margin: "0 auto",
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 800,
        fontSize: isMobile ? 30 : 40, textAlign: "center",
        letterSpacing: "-1px", marginBottom: 12,
      }}>Simple credit packs</h2>
      <p style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 15, color: COLORS.textMuted,
        textAlign: "center", marginBottom: isMobile ? 40 : 72,
        maxWidth: 480, marginLeft: "auto", marginRight: "auto",
      }}>No subscriptions. No monthly fees. Buy credits, use them whenever. They never expire.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {plans.map((plan, i) => (
          <div key={i} style={{
            background: plan.popular ? COLORS.surface : COLORS.bg,
            border: `1px solid ${plan.popular ? COLORS.accent : COLORS.border}`,
            borderRadius: 16, padding: isMobile ? 28 : 40, position: "relative",
            ...(plan.popular ? { boxShadow: `0 0 40px ${COLORS.accentGlow}` } : {}),
          }}>
            {plan.popular && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: COLORS.accent, color: "#000", padding: "4px 16px", borderRadius: 100,
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap",
              }}>Most popular</div>
            )}
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 48 : 56, fontWeight: 900, letterSpacing: "-2px" }}>${plan.price}</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: COLORS.accent, marginBottom: 6 }}>{plan.credits} leads</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textDim, marginBottom: 24 }}>${plan.perLead} per lead · Never expires</div>

            <ul style={{ listStyle: "none", marginBottom: 28 }}>
              {["Google Maps scraping", "Name, phone, email, address", "Star rating & review count", "CSV download", "No subscription"].map((f, j) => (
                <li key={j} style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted,
                  padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ color: COLORS.green, fontSize: 16 }}>✓</span> {f}
                </li>
              ))}
            </ul>

            <button onClick={() => onBuyCredits(plan.id)} style={{
              width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
              background: plan.popular ? COLORS.accent : "transparent",
              color: plan.popular ? "#000" : COLORS.text,
              ...(plan.popular ? {} : { border: `1px solid ${COLORS.border}` }),
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
            }}>Get {plan.name}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ───
function FAQ({ isMobile }) {
  const [open, setOpen] = useState(null);
  const items = [
    { q: "Where does the data come from?", a: "We scrape publicly available data from Google Maps in real-time. Every search gives you fresh, up-to-date results — not some stale database from 2019." },
    { q: "Do credits expire?", a: "Never. Buy them today, use them in six months. No subscriptions, no monthly charges, no \"use it or lose it\" games." },
    { q: "What data do I get per lead?", a: "Business name, phone number, email (when publicly listed), full address, Google star rating, total review count, and website URL." },
    { q: "Can I export to CSV?", a: "Yes. Every search result can be downloaded as a clean CSV file, ready to import into any CRM, email tool, or spreadsheet." },
    { q: "Is this legal?", a: "We only scrape publicly available data from Google Maps — information that anyone can see by searching Google. No private data, no hacking, no gray areas." },
  ];

  return (
    <section style={{
      padding: isMobile ? "60px 20px" : "100px 40px",
      maxWidth: 700, margin: "0 auto",
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 800,
        fontSize: isMobile ? 30 : 40, textAlign: "center",
        letterSpacing: "-1px", marginBottom: isMobile ? 36 : 60,
      }}>FAQ</h2>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{
            padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            fontSize: isMobile ? 15 : 17, fontWeight: 600,
            color: open === i ? COLORS.accent : COLORS.text,
          }}>
            <span style={{ paddingRight: 16 }}>{item.q}</span>
            <span style={{
              transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.3s", fontSize: 22, color: COLORS.textMuted, flexShrink: 0,
            }}>+</span>
          </div>
          {open === i && (
            <div style={{
              padding: "0 0 20px", fontFamily: "'Outfit', sans-serif", fontSize: 14,
              color: COLORS.textMuted, lineHeight: 1.7,
            }}>{item.a}</div>
          )}
        </div>
      ))}
    </section>
  );
}

// ─── FOOTER ───
function Footer({ isMobile }) {
  return (
    <footer style={{
      padding: isMobile ? "40px 20px" : "60px 40px",
      borderTop: `1px solid ${COLORS.border}`,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between", alignItems: "center",
      gap: 16, textAlign: isMobile ? "center" : "left",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6, background: COLORS.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 11, color: "#000",
        }}>LP</div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 15, color: COLORS.textMuted }}>LeadPulp</span>
      </div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textDim }}>
        © 2026 LeadPulp. All rights reserved.
      </div>
    </footer>
  );
}

// ─── APP / SEARCH PAGE ───
function AppPage({ setPage, email, onEmailSet, credits, onCreditsUpdate, onBuyCredits, isMobile }) {
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Scraping Google Maps...");
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(pollRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Email registration
  const handleEmailSubmit = async () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailLoading(true);
    setEmailError("");
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      onEmailSet(trimmed, data.credits ?? 0, data.isNew);
    } catch {
      setEmailError("Could not connect. Please try again.");
    }
    setEmailLoading(false);
  };

  const handleSearch = async () => {
    if (!query.trim() || !location.trim()) return;
    if (!email) return;
    if (credits <= 0) {
      document.getElementById("buy-credits-prompt")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    clearInterval(pollRef.current);
    clearTimeout(timeoutRef.current);
    setLoading(true);
    setResults(null);
    setSearched(true);
    setError(null);
    setLoadingMsg("Starting search...");

    try {
      const startRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), location: location.trim(), email }),
      });

      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        if (startRes.status === 402) {
          setLoading(false);
          setError("No credits remaining. Buy more credits to continue.");
          return;
        }
        throw new Error(err.error || "Failed to start search");
      }

      const { runId } = await startRes.json();
      setLoadingMsg("Scraping Google Maps...");

      const poll = async () => {
        try {
          const res = await fetch(`/api/results?runId=${runId}&email=${encodeURIComponent(email)}`);
          const data = await res.json();

          if (data.status === "success") {
            clearInterval(pollRef.current);
            clearTimeout(timeoutRef.current);
            setResults(data.results);
            setLoading(false);
            // Update credits with server-side balance
            if (data.credits !== null && data.credits !== undefined) {
              onCreditsUpdate(data.credits);
            }
          } else if (data.status === "error") {
            clearInterval(pollRef.current);
            clearTimeout(timeoutRef.current);
            setLoading(false);
            setError("Scraping failed. Please try a different search.");
          }
        } catch {
          clearInterval(pollRef.current);
          clearTimeout(timeoutRef.current);
          setLoading(false);
          setError("Connection error. Please try again.");
        }
      };

      pollRef.current = setInterval(poll, 4000);
      timeoutRef.current = setTimeout(() => {
        clearInterval(pollRef.current);
        setLoading(false);
        setError("Search timed out. Please try again.");
      }, 180000);

    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const downloadCSV = () => {
    if (!results) return;
    const headers = ["Name", "Phone", "Email", "Address", "Rating", "Reviews", "Website"];
    const rows = results.map(r => [
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.address || "").replace(/"/g, '""')}"`,
      r.rating,
      r.reviews,
      `"${(r.website || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leadpulp_${query.replace(/\s/g, "_")}_${location.replace(/\s/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = {
    width: "100%", padding: "13px 14px", background: COLORS.bg,
    border: `1px solid ${COLORS.border}`, borderRadius: 10,
    color: COLORS.text, fontFamily: "'Outfit', sans-serif", fontSize: 15,
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", padding: isMobile ? "72px 16px 48px" : "96px 40px 60px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Email capture — shown until email is set */}
        {!email && (
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
            padding: isMobile ? 24 : 36, marginBottom: 16, textAlign: "center",
          }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⚡</div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: isMobile ? 22 : 28, letterSpacing: "-0.5px", marginBottom: 8,
            }}>Get 3 free searches</h2>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted,
              marginBottom: 24, maxWidth: 400, margin: "0 auto 24px",
            }}>
              Enter your email to claim your free credits. No credit card required.
            </p>
            <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto", flexDirection: isMobile ? "column" : "row" }}>
              <input
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                placeholder="you@example.com"
                type="email"
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = COLORS.accent}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={emailLoading}
                style={{
                  background: COLORS.accent, color: "#000", border: "none", borderRadius: 10,
                  padding: "13px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                  fontSize: 14, cursor: emailLoading ? "wait" : "pointer",
                  opacity: emailLoading ? 0.7 : 1, whiteSpace: "nowrap",
                }}
              >
                {emailLoading ? "..." : "Get Free Credits →"}
              </button>
            </div>
            {emailError && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.red, marginTop: 10 }}>
                {emailError}
              </p>
            )}
          </div>
        )}

        {/* Search card — shown once email is set */}
        {email && (
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
            padding: isMobile ? 20 : 32, marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: isMobile ? 22 : 28, letterSpacing: "-0.5px", marginBottom: 2 }}>Pull leads</h2>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textMuted }}>Business type + location → real leads</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: isMobile ? 18 : 20, fontWeight: 700, color: credits > 0 ? COLORS.accent : COLORS.red }}>
                  {credits.toLocaleString()}
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px" }}>credits</div>
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Business type</label>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Dentists, Plumbers..."
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = COLORS.accent}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Miami, FL"
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = COLORS.accent}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button onClick={handleSearch} disabled={loading || credits <= 0} style={{
                  background: credits > 0 ? COLORS.accent : COLORS.border,
                  color: credits > 0 ? "#000" : COLORS.textDim,
                  border: "none", borderRadius: 10,
                  padding: "13px 28px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15,
                  cursor: loading ? "wait" : credits <= 0 ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  width: isMobile ? "100%" : "auto", marginTop: isMobile ? 4 : 0,
                }}>{loading ? "Scraping..." : "Scrape →"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: COLORS.redDim, border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 12,
            padding: "14px 20px", marginBottom: 16, fontFamily: "'Outfit', sans-serif", fontSize: 14,
            color: COLORS.red, display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>⚠</span> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
            padding: isMobile ? 36 : 48, textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: COLORS.accentDim,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", animation: "pulse 1.5s ease-in-out infinite",
            }}>
              <span style={{ fontSize: 24 }}>⚡</span>
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{loadingMsg}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.textDim }}>
              {query} · {location}
            </div>
            <div style={{ marginTop: 16, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textDim }}>
              Takes 30–90 seconds. Hang tight.
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600 }}>{results.length} leads found</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: COLORS.textDim, marginLeft: 10 }}>
                  {query} · {location}
                </span>
              </div>
              <button onClick={downloadCSV} style={{
                background: COLORS.greenDim, color: COLORS.green, border: `1px solid rgba(34,197,94,0.2)`,
                borderRadius: 8, padding: "9px 16px", fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                fontSize: 13, cursor: "pointer",
              }}>↓ Download CSV</button>
            </div>

            {/* Table — horizontally scrollable on mobile */}
            <div style={{
              background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
              overflow: "hidden",
            }}>
              <div style={{ overflowX: "auto" }}>
                {/* Header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "180px 130px 140px 80px" : "2fr 1.2fr 1.5fr 2fr 0.6fr 0.7fr",
                  padding: "12px 20px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  fontFamily: "'Space Mono', monospace", fontSize: 10, color: COLORS.textDim,
                  textTransform: "uppercase", letterSpacing: "1px",
                  minWidth: isMobile ? "530px" : "auto",
                }}>
                  <span>Name</span>
                  <span>Phone</span>
                  {isMobile ? null : <span>Email</span>}
                  <span>Address</span>
                  <span>Rating</span>
                  {isMobile ? null : <span>Reviews</span>}
                </div>

                {/* Rows */}
                {results.map((r, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "180px 130px 140px 80px" : "2fr 1.2fr 1.5fr 2fr 0.6fr 0.7fr",
                    padding: "14px 20px",
                    borderBottom: i < results.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    fontFamily: "'Outfit', sans-serif", fontSize: 13, alignItems: "center",
                    minWidth: isMobile ? "530px" : "auto",
                  }}>
                    <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{r.name}</span>
                    <span style={{ color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{r.phone || "—"}</span>
                    {isMobile ? null : <span style={{ color: COLORS.accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{r.email || "—"}</span>}
                    <span style={{ color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{r.address || "—"}</span>
                    <span style={{ color: "#facc15", fontFamily: "'Space Mono', monospace" }}>{r.rating !== "0.0" ? `★ ${r.rating}` : "—"}</span>
                    {isMobile ? null : <span style={{ color: COLORS.textMuted, fontFamily: "'Space Mono', monospace" }}>{r.reviews || "—"}</span>}
                  </div>
                ))}
              </div>
            </div>
            {isMobile && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: COLORS.textDim, textAlign: "center", marginTop: 8 }}>
                ← Scroll table to see more · Download CSV for all columns
              </p>
            )}
          </div>
        )}

        {/* Empty state */}
        {email && !loading && !results && !error && !searched && (
          <div style={{
            background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 16,
            padding: isMobile ? 48 : 64, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>🔍</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>Ready to scrape</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textDim }}>
              {credits > 0
                ? `You have ${credits} credit${credits === 1 ? "" : "s"} — enter a business type and location above`
                : "Buy credits below to start scraping"}
            </div>
          </div>
        )}

        {/* Buy credits prompt */}
        {email && credits === 0 && (
          <div id="buy-credits-prompt" style={{
            marginTop: 24, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 16, padding: isMobile ? 24 : 40,
          }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: isMobile ? 20 : 24, marginBottom: 8, letterSpacing: "-0.5px" }}>
              Get more credits
            </h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
              One credit = one search (up to 50 leads). Credits never expire. No subscriptions.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {[
                { id: "starter", name: "Starter", credits: "500", price: "$49" },
                { id: "growth",  name: "Growth",  credits: "2,000", price: "$149" },
                { id: "agency",  name: "Agency",  credits: "5,000", price: "$299" },
              ].map(plan => (
                <button key={plan.id} onClick={() => onBuyCredits(plan.id)} style={{
                  background: plan.id === "growth" ? COLORS.accent : COLORS.bg,
                  color: plan.id === "growth" ? "#000" : COLORS.text,
                  border: `1px solid ${plan.id === "growth" ? COLORS.accent : COLORS.border}`,
                  borderRadius: 12, padding: "18px 20px", cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", textAlign: "left",
                }}>
                  <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{plan.price}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, opacity: 0.8 }}>{plan.credits} credits</div>
                  <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{plan.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function LeadPulp() {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const isMobile = useIsMobile();

  // Email: stored in localStorage (it's just an identifier, not sensitive)
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem("lp_email") || ""; } catch { return ""; }
  });

  // Credits: always from server (Redis), never from localStorage
  const [credits, setCredits] = useState(0);

  // Fetch server-side balance on mount if email is known
  useEffect(() => {
    if (!email) return;
    fetch(`/api/credits?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => { if (data.credits !== undefined) setCredits(data.credits); })
      .catch(() => {});
  }, []);

  // Handle payment success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success") return;
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    window.history.replaceState({}, "", "/");
    fetch(`/api/verify-payment?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Use server balance if returned, otherwise add credits to current
          if (data.balance !== null && data.balance !== undefined) {
            setCredits(data.balance);
          } else {
            setCredits(prev => prev + data.credits);
          }
          // Also sync email from Stripe if we don't have it yet
          if (!email && data.email) {
            try { localStorage.setItem("lp_email", data.email); } catch {}
            setEmail(data.email);
          }
          setPage("app");
          setToast({ type: "success", message: `${data.credits.toLocaleString()} credits added! Start scraping.` });
        } else {
          setToast({ type: "error", message: "Payment verification failed. Please contact support." });
        }
      })
      .catch(() => {
        setToast({ type: "error", message: "Could not verify payment. Please contact support." });
      });
  }, []);

  // Called when user submits email in AppPage
  const handleEmailSet = (newEmail, serverCredits, isNew) => {
    try { localStorage.setItem("lp_email", newEmail); } catch {}
    setEmail(newEmail);
    setCredits(serverCredits ?? 0);
    if (isNew) {
      setToast({ type: "success", message: "Welcome! You have 3 free credits to start." });
    }
  };

  // Called when results return with a fresh server balance
  const onCreditsUpdate = (newBalance) => {
    setCredits(newBalance);
  };

  const onBuyCredits = async (plan) => {
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      if (!res.ok) throw new Error("Failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setToast({ type: "error", message: "Could not open checkout. Please try again." });
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text }}>
      <style>{fonts}{baseStyles}</style>
      <Nav page={page} setPage={setPage} credits={credits} email={email} isMobile={isMobile} />

      {page === "home" && (
        <>
          <Hero setPage={setPage} isMobile={isMobile} />
          <HowItWorks isMobile={isMobile} />
          <Pricing onBuyCredits={onBuyCredits} isMobile={isMobile} />
          <FAQ isMobile={isMobile} />
          <Footer isMobile={isMobile} />
        </>
      )}

      {page === "app" && (
        <AppPage
          setPage={setPage}
          email={email}
          onEmailSet={handleEmailSet}
          credits={credits}
          onCreditsUpdate={onCreditsUpdate}
          onBuyCredits={onBuyCredits}
          isMobile={isMobile}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
