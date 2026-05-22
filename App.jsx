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
  @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px ${COLORS.accentGlow}; } 50% { box-shadow: 0 0 40px ${COLORS.accentGlow}, 0 0 60px rgba(255,107,0,0.08); } }
`;

// ─── MOCK DATA ───
const MOCK_RESULTS = [
  { name: "Sunrise Dental Care", phone: "(214) 555-0142", email: "info@sunrisedental.com", address: "4521 Elm St, Dallas, TX 75201", rating: 4.8, reviews: 247 },
  { name: "Lone Star Family Dentistry", phone: "(214) 555-0198", email: "hello@lonestardentist.com", address: "1200 Commerce St, Dallas, TX 75202", rating: 4.6, reviews: 189 },
  { name: "Dallas Smile Studio", phone: "(214) 555-0234", email: "contact@dallassmile.com", address: "789 Oak Lawn Ave, Dallas, TX 75219", rating: 4.9, reviews: 312 },
  { name: "Pearlshine Dental", phone: "(214) 555-0167", email: "team@pearlshine.co", address: "3456 McKinney Ave, Dallas, TX 75204", rating: 4.4, reviews: 98 },
  { name: "Deep Ellum Dental Group", phone: "(214) 555-0289", email: "info@deepellumdental.com", address: "2801 Main St, Dallas, TX 75226", rating: 4.7, reviews: 156 },
  { name: "Uptown Orthodontics", phone: "(214) 555-0311", email: "smile@uptownortho.com", address: "2600 Cedar Springs Rd, Dallas, TX 75201", rating: 4.5, reviews: 203 },
  { name: "Trinity Dental Wellness", phone: "(214) 555-0345", email: "care@trinitydental.com", address: "1500 Pacific Ave, Dallas, TX 75201", rating: 4.3, reviews: 87 },
  { name: "Greenville Ave Dental", phone: "(214) 555-0378", email: "hello@greenvilledental.com", address: "5600 Greenville Ave, Dallas, TX 75206", rating: 4.8, reviews: 271 },
];

// ─── COMPONENTS ───

function Nav({ page, setPage }) {
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
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <NavLink label="How it works" onClick={() => setPage("home")} />
        <NavLink label="Pricing" onClick={() => setPage("home")} />
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

function Hero({ setPage }) {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "120px 40px 80px", textAlign: "center", position: "relative", overflow: "hidden",
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
          onMouseEnter={e => { e.target.style.background = COLORS.accentHover; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.background = COLORS.accent; e.target.style.transform = "translateY(0)"; }}
          >Try it free →</button>
          <button onClick={() => setPage("home")} style={{
            background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: "16px 40px", fontFamily: "'Outfit', sans-serif", fontWeight: 600,
            fontSize: 17, cursor: "pointer", transition: "all 0.3s",
          }}
          onMouseEnter={e => e.target.style.borderColor = COLORS.textMuted}
          onMouseLeave={e => e.target.style.borderColor = COLORS.border}
          >See pricing</button>
        </div>

        {/* Live counter */}
        <div style={{
          marginTop: 64, display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap",
        }}>
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
              color: COLORS.accentDim.replace("0.1", "0.15"), marginBottom: 20,
              WebkitTextStroke: `1px rgba(255,107,0,0.3)`,
            }}>{step.num}</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{step.title}</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing({ setPage }) {
  const plans = [
    { name: "Starter", credits: "500", price: "49", perLead: "0.098", popular: false },
    { name: "Growth", credits: "2,000", price: "149", perLead: "0.075", popular: true },
    { name: "Agency", credits: "5,000", price: "299", perLead: "0.060", popular: false },
  ];

  return (
    <section style={{
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
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "1px",
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

            <button onClick={() => setPage("app")} style={{
              width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
              background: plan.popular ? COLORS.accent : "transparent",
              color: plan.popular ? "#000" : COLORS.text,
              ...(plan.popular ? {} : { border: `1px solid ${COLORS.border}` }),
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
            >Get {plan.name}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

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
              transition: "transform 0.3s", fontSize: 22, color: COLORS.textMuted,
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

function AppPage({ setPage }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim() || !location.trim()) return;
    setLoading(true);
    setResults(null);
    setSearched(true);
    // Simulate API call
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setLoading(false);
    }, 2200);
  };

  const downloadCSV = () => {
    if (!results) return;
    const headers = ["Name", "Phone", "Email", "Address", "Rating", "Reviews"];
    const rows = results.map(r => [r.name, r.phone, r.email, r.address, r.rating, r.reviews]);
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
    <div style={{ minHeight: "100vh", paddingTop: 96, padding: "96px 40px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Search bar */}
        <div style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
          padding: 32, marginBottom: 32, animation: "fadeUp 0.5s ease-out",
        }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 8,
            letterSpacing: "-0.5px",
          }}>Pull leads</h2>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textMuted, marginBottom: 28,
          }}>Enter a business type and location to scrape Google Maps</p>

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
              onMouseEnter={e => !loading && (e.target.style.background = COLORS.accentHover)}
              onMouseLeave={e => e.target.style.background = COLORS.accent}
              >{loading ? "Scraping..." : "Scrape →"}</button>
            </div>
          </div>
        </div>

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
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Scraping Google Maps...</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.textDim }}>
              Pulling {query} in {location}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div style={{ animation: "fadeUp 0.5s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
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
                display: "grid", gridTemplateColumns: "2fr 1.2fr 1.5fr 2fr 0.6fr 0.6fr",
                padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}`,
                fontFamily: "'Space Mono', monospace", fontSize: 11, color: COLORS.textDim,
                textTransform: "uppercase", letterSpacing: "1px",
              }}>
                <span>Name</span><span>Phone</span><span>Email</span><span>Address</span><span>Rating</span><span>Reviews</span>
              </div>

              {/* Table rows */}
              {results.map((r, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "2fr 1.2fr 1.5fr 2fr 0.6fr 0.6fr",
                  padding: "16px 24px", borderBottom: i < results.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, alignItems: "center",
                  animation: `slideIn 0.3s ease-out ${i * 0.05}s both`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <span style={{ color: COLORS.textMuted }}>{r.phone}</span>
                  <span style={{ color: COLORS.accent, fontSize: 13 }}>{r.email}</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{r.address}</span>
                  <span style={{ color: "#facc15", fontFamily: "'Space Mono', monospace", fontSize: 13 }}>★ {r.rating}</span>
                  <span style={{ color: COLORS.textMuted, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>{r.reviews}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: 16, borderRadius: 10, background: COLORS.accentDim,
              border: `1px solid rgba(255,107,0,0.15)`,
              fontFamily: "'Space Mono', monospace", fontSize: 12, color: COLORS.accent, textAlign: "center",
            }}>
              ⚡ This is a demo with sample data. Connect your Apify API key to scrape live Google Maps results.
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !results && searched === false && (
          <div style={{
            background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 16,
            padding: 64, textAlign: "center", animation: "fadeUp 0.5s ease-out 0.2s both",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔍</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>Ready to scrape</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: COLORS.textDim }}>Enter a business type and location above to pull leads</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ───

export default function LeadPulp() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text }}>
      <style>{fonts}{baseStyles}</style>
      <Nav page={page} setPage={setPage} />

      {page === "home" && (
        <>
          <Hero setPage={setPage} />
          <HowItWorks />
          <Pricing setPage={setPage} />
          <FAQ />
          <Footer />
        </>
      )}

      {page === "app" && <AppPage setPage={setPage} />}
    </div>
  );
}
