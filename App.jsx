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
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      zIndex: 999, background: COLORS.surface, border: `1px solid ${border}`,
      borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center",
      gap: 12, animation: "toastIn 0.3s ease-out", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      minWidth: 280, maxWidth: 480,
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

function Nav({ page, setPage, credits }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setPage("home")}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: COLORS.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 16, color: "#000",
        }}>LP</div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "-0.5px" }}>
          Lead<span style={{ color: COLORS.accent }}>Pulp</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <NavLink label="How it works" onClick={() => setPage("home")} />
        <NavLink label="Pricing" onClick={() => { setPage("home"); setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100); }} />
        {credits > 0 && (
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.accent,
            background: COLORS.accentDim, padding: "5px 12px", borderRadius: 6,
            border: `1px solid rgba(255,107,0,0.2)`,
          }}>⚡ {credits.toLocaleString()}</div>
        )}
        <button onClick={() => setPage("app")} style={{
          background: COLORS.accent, color: "#000", border: "none", borderRadius: 8,
          padding: "10px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
        onMouseEnter={e => e.target.style.background = COLORS.accentHover}
        onMouseLeave={e => e.target.style.background = COLORS.accent}
        >Start Scraping</button>
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

function Hero({ setPage }) {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "120px 40px 80px", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: `linear-gradient(${COLORS.text} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.text} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        width: 800, height: 800, borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.accentGlow} 0%, transparent 70%)`,
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.8s ease-out" }}>
        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 100,
          background: COLORS.accentDim, border: `1px solid rgba(255,107,0,0.2)`,
          fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.accent,
          marginBottom: 32, letterSpacing: "1px", textTransform: "uppercase",
        }}>Raw, unfiltered leads</div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(48px, 7vw, 84px)",
          lineHeight: 1.05, letterSpacing: "-2px", maxWidth: 800, margin: "0 auto 24px",
        }}>
          Google Maps data.<br />
          <span style={{ color: COLORS.accent }}>Squeezed fresh.</span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 20, color: COLORS.textMuted,
          maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.6,
        }}>
          Type any business type + any city. Get every name, phone, email, and review — downloaded as a spreadsheet in seconds.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("app")} style={{
            background: COLORS.accent, color: "#000", border: "none", borderRadius: 10,
            padding: "16px 40px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17,
            cursor: "pointer", transition: "all 0.3s", animation: "glow 3s ease-in-out infinite",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.accentHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = COLORS.accent; e.currentTarget.style.transform = "translateY(0)"; }}
          >Try it free →</button>
          <button onClick={scrollToPricing} style={{
            background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: "16px 40px", fontFamily: "'Outfit', sans-serif", fontWeight: 600,
            fontSize: 17, cursor: "pointer", transition: "all 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.textMuted}
          onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
          >See pricing</button>
        </div>

        <div style={{ marginTop: 64, display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { num: "2.4M+", label: "Leads scraped" },
            { num: "< 30s", label: "Per search" },
            { num: "$0.07", label: "Per lead" },
          ].map((s, i) => (
            <div key={i} style={{ animation: `fadeUp 0.8s ease-out ${0.2 + i * 0.15}s both` }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{s.num}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textDim, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ───

function HowItWorks() {
  const steps = [
    { num: "01", title: "Type your search", desc: "Enter any business type and any city. \"Plumbers in Chicago.\" \"Yoga studios in Austin.\" Anything." },
    { num: "02", title: "We scrape Google Maps", desc: "Our engine pulls every matching business — name, phone, email, address, star rating, review count. All of it." },
    { num: "03", title: "Download your leads", desc: "Get a clean spreadsheet ready for cold calls, cold emails, or CRM import. No formatting needed." },
  ];

  return (
    <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 40, textAlign: "center",
        letterSpacing: "-1px", marginBottom: 16,
      }}>How it works</h2>
      <p style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 16, color: COLORS.textMuted,
        textAlign: "center", marginBottom: 72, maxWidth: 480, marginLeft: "auto", marginRight: "auto",
      }}>Three steps. No training. No onboarding calls. No BS.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
            padding: 40, transition: "all 0.3s", animation: `fadeUp 0.6s ease-out ${i * 0.15}s both`,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 48, fontWeight: 700,
              color: "transparent", marginBottom: 20, WebkitTextStroke: `1px rgba(255,107,0,0.3)`,
            }}>{step.num}</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{step.title}</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PRICING ───

function Pricing({ onBuyCredits }) {
  const plans = [
    { id: "starter", name: "Starter", credits: "500", price: "49", perLead: "0.098", popular: false },
    { id: "growth",  name: "Growth",  credits: "2,000", price: "149", perLead: "0.075", popular: true },
    { id: "agency",  name: "Agency",  credits: "5,000", price: "299", perLead: "0.060", popular: false },
  ];

  return (
    <section id="pricing" style={{
      padding: "100px 40px", maxWidth: 1100, margin: "0 auto",
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 40, textAlign: "center",
        letterSpacing: "-1px", marginBottom: 16,
      }}>Simple credit packs</h2>
      <p style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 16, color: COLORS.textMuted,
        textAlign: "center", marginBottom: 72, maxWidth: 480, marginLeft: "auto", marginRight: "auto",
      }}>No subscriptions. No monthly fees. Buy credits, use them whenever. They never expire.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {plans.map((plan, i) => (
          <div key={i} style={{
            background: plan.popular ? COLORS.surface : COLORS.bg,
            border: `1px solid ${plan.popular ? COLORS.accent : COLORS.border}`,
            borderRadius: 16, padding: 40, position: "relative", transition: "all 0.3s",
            animation: `fadeUp 0.6s ease-out ${i * 0.15}s both`,
            ...(plan.popular ? { boxShadow: `0 0 40px ${COLORS.accentGlow}` } : {}),
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {plan.popular && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: COLORS.accent, color: "#000", padding: "4px 16px", borderRadius: 100,
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "1px",
              }}>Most popular</div>
            )}
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 56, fontWeight: 900, letterSpacing: "-2px" }}>${plan.price}</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: COLORS.accent, marginBottom: 8 }}>{plan.credits} leads</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textDim, marginBottom: 32 }}>${plan.perLead} per lead · Never expires</div>

            <ul style={{ listStyle: "none", marginBottom: 32 }}>
              {["Google Maps scraping", "Name, phone, email, address", "Star rating & review count", "CSV download", "No subscription"].map((f, j) => (
                <li key={j} style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted,
                  padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`,
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
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Get {plan.name}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ───

function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q: "Where does the data come from?", a: "We scrape publicly available data from Google Maps in real-time. Every search gives you fresh, up-to-date results — not some stale database from 2019." },
    { q: "Do credits expire?", a: "Never. Buy them today, use them in six months. No subscriptions, no monthly charges, no \"use it or lose it\" games." },
    { q: "What data do I get per lead?", a: "Business name, phone number, email (when publicly listed), full address, Google star rating, total review count, and website URL." },
    { q: "Can I export to CSV?", a: "Yes. Every search result can be downloaded as a clean CSV file, ready to import into any CRM, email tool, or spreadsheet." },
    { q: "Is this legal?", a: "We only scrape publicly available data from Google Maps — information that anyone can see by searching Google. No private data, no hacking, no gray areas." },
  ];

  return (
    <section style={{ padding: "100px 40px", maxWidth: 700, margin: "0 auto", borderTop: `1px solid ${COLORS.border}` }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 40, textAlign: "center",
        letterSpacing: "-1px", marginBottom: 60,
      }}>FAQ</h2>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{
            padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600,
            color: open === i ? COLORS.accent : COLORS.text, transition: "color 0.2s",
          }}>
            {item.q}
            <span style={{
              transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.3s", fontSize: 22, color: COLORS.textMuted, flexShrink: 0, marginLeft: 16,
            }}>+</span>
          </div>
          {open === i && (
            <div style={{
              padding: "0 0 24px", fontFamily: "'Outfit', sans-serif", fontSize: 15,
              color: COLORS.textMuted, lineHeight: 1.7, animation: "fadeUp 0.3s ease-out",
            }}>{item.a}</div>
          )}
        </div>
      ))}
    </section>
  );
}

// ─── FOOTER ───

function Footer() {
  return (
    <footer style={{
      padding: "60px 40px", borderTop: `1px solid ${COLORS.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20,
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

function AppPage({ setPage, credits, onUseCredits, onBuyCredits }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Scraping Google Maps...");
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const timeoutRef = useRef(null);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim() || !location.trim()) return;
    if (credits === 0) {
      document.getElementById("buy-credits-prompt")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Reset state
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
        body: JSON.stringify({ query: query.trim(), location: location.trim() }),
      });

      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to start search");
      }

      const { runId } = await startRes.json();
      setLoadingMsg("Scraping Google Maps...");

      // Poll for results every 4 seconds
      const poll = async () => {
        try {
          const res = await fetch(`/api/results?runId=${runId}`);
          const data = await res.json();

          if (data.status === "success") {
            clearInterval(pollRef.current);
            clearTimeout(timeoutRef.current);
            setResults(data.results);
            setLoading(false);
            onUseCredits(data.results.length);
          } else if (data.status === "error") {
            clearInterval(pollRef.current);
            clearTimeout(timeoutRef.current);
            setLoading(false);
            setError("Scraping failed. Please try a different search.");
          }
          // If 'pending', keep polling
        } catch {
          clearInterval(pollRef.current);
          clearTimeout(timeoutRef.current);
          setLoading(false);
          setError("Connection error. Please try again.");
        }
      };

      pollRef.current = setInterval(poll, 4000);

      // Time out after 3 minutes
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

  return (
    <div style={{ minHeight: "100vh", padding: "96px 40px 60px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Search bar */}
        <div style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
          padding: 32, marginBottom: 24, animation: "fadeUp 0.5s ease-out",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.5px", marginBottom: 4 }}>Pull leads</h2>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted }}>Enter a business type and location to scrape Google Maps</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: credits > 0 ? COLORS.accent : COLORS.red }}>
                {credits.toLocaleString()}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px" }}>credits left</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Business type</label>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Dentists, Plumbers, Yoga Studios"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", padding: "14px 16px", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 10, color: COLORS.text, fontFamily: "'Outfit', sans-serif", fontSize: 15,
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = COLORS.accent}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Dallas, TX"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", padding: "14px 16px", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 10, color: COLORS.text, fontFamily: "'Outfit', sans-serif", fontSize: 15,
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = COLORS.accent}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleSearch} disabled={loading} style={{
                background: COLORS.accent, color: "#000", border: "none", borderRadius: 10,
                padding: "14px 32px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15,
                cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = COLORS.accentHover)}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.accent}
              >{loading ? "Scraping..." : "Scrape →"}</button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: COLORS.redDim, border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 12,
            padding: "16px 24px", marginBottom: 24, fontFamily: "'Outfit', sans-serif", fontSize: 14,
            color: COLORS.red, display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>⚠</span> {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
            padding: 48, textAlign: "center", animation: "fadeUp 0.4s ease-out",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: COLORS.accentDim,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", animation: "pulse 1.5s ease-in-out infinite",
            }}>
              <span style={{ fontSize: 24 }}>⚡</span>
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{loadingMsg}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.textDim }}>
              {query} · {location}
            </div>
            <div style={{ marginTop: 20, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textDim }}>
              Google Maps scraping takes 30–60 seconds. Hang tight.
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div style={{ animation: "fadeUp 0.5s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600 }}>{results.length} leads found</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.textDim, marginLeft: 12 }}>
                  {query} · {location}
                </span>
              </div>
              <button onClick={downloadCSV} style={{
                background: COLORS.greenDim, color: COLORS.green, border: `1px solid rgba(34,197,94,0.2)`,
                borderRadius: 8, padding: "10px 20px", fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                fontSize: 13, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.greenDim}
              >↓ Download CSV</button>
            </div>

            <div style={{
              background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
              overflow: "hidden",
            }}>
              {/* Table header */}
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 1.2fr 1.5fr 2fr 0.6fr 0.7fr",
                padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}`,
                fontFamily: "'Space Mono', monospace", fontSize: 11, color: COLORS.textDim,
                textTransform: "uppercase", letterSpacing: "1px",
              }}>
                <span>Name</span><span>Phone</span><span>Email</span><span>Address</span><span>Rating</span><span>Reviews</span>
              </div>

              {/* Table rows */}
              {results.map((r, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "2fr 1.2fr 1.5fr 2fr 0.6fr 0.7fr",
                  padding: "16px 24px",
                  borderBottom: i < results.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, alignItems: "center",
                  animation: `slideIn 0.3s ease-out ${i * 0.04}s both`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{r.phone || "—"}</span>
                  <span style={{ color: COLORS.accent, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.email || "—"}</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.address}</span>
                  <span style={{ color: "#facc15", fontFamily: "'Space Mono', monospace", fontSize: 13 }}>{r.rating !== "0.0" ? `★ ${r.rating}` : "—"}</span>
                  <span style={{ color: COLORS.textMuted, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>{r.reviews || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !results && !error && !searched && (
          <div style={{
            background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 16,
            padding: 64, textAlign: "center", animation: "fadeUp 0.5s ease-out 0.2s both",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔍</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>Ready to scrape</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textDim }}>
              {credits > 0
                ? "Enter a business type and location above to pull leads"
                : "Buy credits below to start scraping real Google Maps data"}
            </div>
          </div>
        )}

        {/* Buy credits prompt (shown when out of credits) */}
        {credits === 0 && (
          <div id="buy-credits-prompt" style={{
            marginTop: 32, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 16, padding: 40, animation: "fadeUp 0.6s ease-out 0.3s both",
          }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 8, letterSpacing: "-0.5px" }}>
              Get your credits
            </h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: COLORS.textMuted, marginBottom: 32 }}>
              One credit = one lead. Credits never expire. No subscriptions.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {[
                { id: "starter", name: "Starter", credits: "500", price: "$49" },
                { id: "growth",  name: "Growth",  credits: "2,000", price: "$149" },
                { id: "agency",  name: "Agency",  credits: "5,000", price: "$299" },
              ].map(plan => (
                <button key={plan.id} onClick={() => onBuyCredits(plan.id)} style={{
                  background: plan.id === "growth" ? COLORS.accent : COLORS.bg,
                  color: plan.id === "growth" ? "#000" : COLORS.text,
                  border: `1px solid ${plan.id === "growth" ? COLORS.accent : COLORS.border}`,
                  borderRadius: 12, padding: "20px 24px", cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", textAlign: "left", transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{plan.price}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, opacity: 0.8 }}>{plan.credits} credits</div>
                  <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{plan.name}</div>
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

  const [credits, setCredits] = useState(() => {
    try { return parseInt(localStorage.getItem("lp_credits") || "0", 10); }
    catch { return 0; }
  });

  // Persist credits to localStorage
  useEffect(() => {
    try { localStorage.setItem("lp_credits", String(credits)); } catch {}
  }, [credits]);

  // Handle Stripe redirect on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success") return;

    const sessionId = params.get("session_id");
    if (!sessionId) return;

    // Remove query params from URL immediately
    window.history.replaceState({}, "", "/");

    fetch(`/api/verify-payment?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setCredits(prev => prev + data.credits);
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

  const onUseCredits = (amount) => {
    setCredits(prev => Math.max(0, prev - amount));
  };

  const onBuyCredits = async (plan) => {
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
      <Nav page={page} setPage={setPage} credits={credits} />

      {page === "home" && (
        <>
          <Hero setPage={setPage} />
          <HowItWorks />
          <Pricing onBuyCredits={onBuyCredits} />
          <FAQ />
          <Footer />
        </>
      )}

      {page === "app" && (
        <AppPage
          setPage={setPage}
          credits={credits}
          onUseCredits={onUseCredits}
          onBuyCredits={onBuyCredits}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
