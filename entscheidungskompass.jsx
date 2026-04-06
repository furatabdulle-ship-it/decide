import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ══════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════
const C = {
  bg: "#0B0F1A", surface: "#141824", surface2: "#1A2030",
  border: "#1E2A3A", border2: "#243040",
  accent: "#6EE7B7", accent2: "#FCD34D", accent3: "#7DD3FC",
  text: "#E2E8F0", muted: "#64748B", muted2: "#8FA0B0",
  ok: "#86EFAC", warn: "#FCD34D", danger: "#F87171",
};
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20 };

// ══════════════════════════════════════════════
// DATA — 10 OPTIONS
// ══════════════════════════════════════════════
const OPTIONS = [
  { id:"bsc-info", title:"B.Sc. Informatik", type:"Studium",
    desc:"Klassisches Informatikstudium. Breite theoretische Grundlagen, starke Gehaltsaussichten nach Abschluss.",
    duration:3.5, tte:3.5,
    riasec:[0.5,0.9,0.3,0.3,0.5,0.7],
    goals:{income:0.85,security:0.75,meaning:0.40,creativity:0.50,flexibility:0.60},
    access:{req:0.65,lang:"C1",degree:"Abitur"},
    income:{base:4200,growth:0.05,ceiling:9000,training:0},
    risk:0.30, finDemand:0.80, parallelLoad:0.40, accessLevel:"medium",
    market:{demand:0.90,growth:0.85,regional:0.80},
    funding:["BAföG möglich","Studentenjobs","Deutschlandstipendium"],
    tags:["IT","Theorie","Hoher Abschluss"],
  },
  { id:"bsc-winfo", title:"B.Sc. Wirtschaftsinformatik", type:"Studium",
    desc:"IT trifft BWL. Sehr nachgefragt in Beratung, Banking, E-Commerce. Gute Einstiegsgehälter.",
    duration:3.5, tte:3.5,
    riasec:[0.3,0.7,0.3,0.4,0.8,0.8],
    goals:{income:0.82,security:0.72,meaning:0.38,creativity:0.42,flexibility:0.62},
    access:{req:0.60,lang:"C1",degree:"Abitur"},
    income:{base:3900,growth:0.055,ceiling:8500,training:0},
    risk:0.28, finDemand:0.80, parallelLoad:0.40, accessLevel:"medium",
    market:{demand:0.88,growth:0.82,regional:0.82},
    funding:["BAföG möglich","Duales Studium möglich"],
    tags:["IT","BWL","Beratung"],
  },
  { id:"sozarbeit", title:"B.A. Soziale Arbeit", type:"Studium",
    desc:"Studium mit gesellschaftlicher Wirkung. Jugend, Migration, Beratung, Gemeinwesenarbeit.",
    duration:3.0, tte:3.0,
    riasec:[0.2,0.5,0.5,0.9,0.5,0.4],
    goals:{income:0.38,security:0.72,meaning:0.95,creativity:0.52,flexibility:0.52},
    access:{req:0.45,lang:"B2",degree:"Fachhochschulreife"},
    income:{base:2500,growth:0.025,ceiling:4200,training:0},
    risk:0.18, finDemand:0.72, parallelLoad:0.45, accessLevel:"low",
    market:{demand:0.82,growth:0.72,regional:0.88},
    funding:["BAföG möglich","Stabiler Arbeitsmarkt"],
    tags:["Soziales","Sinn","Menschen"],
  },
  { id:"fi-ae", title:"Fachinformatiker:in AE", type:"Ausbildung",
    desc:"Duale Ausbildung Anwendungsentwicklung. Gehalt ab Tag 1, anerkannter Abschluss, ~90% Übernahmequote.",
    duration:3.0, tte:0.5,
    riasec:[0.6,0.8,0.3,0.3,0.4,0.7],
    goals:{income:0.65,security:0.88,meaning:0.50,creativity:0.45,flexibility:0.42},
    access:{req:0.35,lang:"B2",degree:"Hauptschulabschluss"},
    income:{base:2800,growth:0.04,ceiling:5800,training:850},
    risk:0.18, finDemand:0.18, parallelLoad:0.60, accessLevel:"low",
    market:{demand:0.92,growth:0.88,regional:0.90},
    funding:["Ausbildungsgehalt ~700–1.100 €/Mo","Keine Studiengebühren"],
    tags:["IT","Dual","Gehalt sofort"],
  },
  { id:"kfm-it", title:"Kaufmann/-frau IT-System-Mgmt.", type:"Ausbildung",
    desc:"IT-Prozesse und kaufmännische Strukturen. Gut für Organisierte mit digitalem Interesse.",
    duration:3.0, tte:0.5,
    riasec:[0.3,0.6,0.2,0.5,0.7,0.8],
    goals:{income:0.60,security:0.82,meaning:0.40,creativity:0.30,flexibility:0.50},
    access:{req:0.35,lang:"B2",degree:"Hauptschulabschluss"},
    income:{base:2600,growth:0.038,ceiling:5200,training:800},
    risk:0.20, finDemand:0.18, parallelLoad:0.60, accessLevel:"low",
    market:{demand:0.85,growth:0.78,regional:0.88},
    funding:["Ausbildungsgehalt ~650–950 €/Mo"],
    tags:["IT","Kaufmännisch","Dual"],
  },
  { id:"pflege", title:"Pflegefachmann/-frau", type:"Ausbildung",
    desc:"Generalisierte Pflegeausbildung. Bundesweit nachgefragt, eines der besten Ausbildungsgehälter.",
    duration:3.0, tte:0.5,
    riasec:[0.5,0.5,0.2,0.9,0.4,0.5],
    goals:{income:0.45,security:0.88,meaning:0.92,creativity:0.28,flexibility:0.60},
    access:{req:0.30,lang:"B2",degree:"Hauptschulabschluss"},
    income:{base:2300,growth:0.03,ceiling:3800,training:1100},
    risk:0.12, finDemand:0.10, parallelLoad:0.80, accessLevel:"low",
    market:{demand:0.95,growth:0.90,regional:0.95},
    funding:["Ausbildungsgehalt ~1.000–1.400 €/Mo","Kostenlos"],
    tags:["Pflege","Sinn","Sicher"],
  },
  { id:"buero", title:"Kaufmann/-frau Büromanagement", type:"Ausbildung",
    desc:"Vielseitige kaufmännische Ausbildung. Breiter Einstieg in fast alle Branchen. Niedrigschwellig.",
    duration:3.0, tte:0.5,
    riasec:[0.2,0.4,0.2,0.5,0.5,0.9],
    goals:{income:0.42,security:0.80,meaning:0.32,creativity:0.22,flexibility:0.52},
    access:{req:0.30,lang:"B1",degree:"Hauptschulabschluss"},
    income:{base:2100,growth:0.025,ceiling:3500,training:700},
    risk:0.15, finDemand:0.15, parallelLoad:0.65, accessLevel:"low",
    market:{demand:0.78,growth:0.55,regional:0.92},
    funding:["Ausbildungsgehalt ~600–850 €/Mo"],
    tags:["Kaufmännisch","Niedrigschwellig","Dual"],
  },
  { id:"bootcamp", title:"Web-Dev Bootcamp + Freelance", type:"Alternative",
    desc:"Intensivkurs Webentwicklung (3–6 Monate), danach Junior-Jobs oder Freelance. Schnell, hohes Risiko.",
    duration:0.5, tte:0.8,
    riasec:[0.4,0.7,0.6,0.2,0.6,0.5],
    goals:{income:0.70,security:0.38,meaning:0.50,creativity:0.72,flexibility:0.88},
    access:{req:0.20,lang:"B1",degree:"Kein Abschluss nötig"},
    income:{base:2200,growth:0.07,ceiling:7000,training:0},
    risk:0.62, finDemand:0.55, parallelLoad:0.85, accessLevel:"low",
    market:{demand:0.72,growth:0.78,regional:0.70},
    funding:["Bildungsgutschein (Arbeitsagentur)","Einige Bootcamps kostenlos"],
    tags:["Schnell","Flexibel","Risikoreich"],
  },
  { id:"selbst", title:"Selbststudium + Open Source", type:"Alternative",
    desc:"Online-Kurse, GitHub-Projekte, Community. Maximale Freiheit — funktioniert nur mit hoher Eigenmotivation.",
    duration:1.0, tte:1.5,
    riasec:[0.3,0.8,0.5,0.2,0.6,0.4],
    goals:{income:0.55,security:0.28,meaning:0.62,creativity:0.85,flexibility:0.92},
    access:{req:0.10,lang:"A2",degree:"Kein Abschluss nötig"},
    income:{base:1800,growth:0.08,ceiling:6500,training:0},
    risk:0.78, finDemand:0.30, parallelLoad:0.30, accessLevel:"low",
    market:{demand:0.60,growth:0.70,regional:0.65},
    funding:["Kostenlose Ressourcen (freecodecamp, Coursera Audit)"],
    tags:["Maximal Flexibel","Selbstbestimmt","Hohes Risiko"],
  },
  { id:"erzieher", title:"Erzieher:in (Fachschule)", type:"Ausbildung",
    desc:"Sozialpädagogische Ausbildung. Kreativer Berufsalltag, hohe gesellschaftliche Relevanz, bundesweit gesucht.",
    duration:3.0, tte:0.5,
    riasec:[0.3,0.4,0.7,0.9,0.4,0.4],
    goals:{income:0.30,security:0.72,meaning:0.95,creativity:0.72,flexibility:0.52},
    access:{req:0.40,lang:"B2",degree:"Mittlere Reife"},
    income:{base:2200,growth:0.022,ceiling:3500,training:0},
    risk:0.15, finDemand:0.35, parallelLoad:0.55, accessLevel:"low",
    market:{demand:0.90,growth:0.85,regional:0.90},
    funding:["In manchen Bundesländern vergütet","BAföG möglich"],
    tags:["Soziales","Kreativ","Kinder","Bildung"],
  },
];

// ══════════════════════════════════════════════
// QUESTIONS
// ══════════════════════════════════════════════
const Qs = [
  { id:"activities", q:"Welche Tätigkeiten machen dir am meisten Spaß?", sub:"Wähle bis zu 2 aus — keine richtige Antwort.", type:"multi", max:2,
    opts:[
      {l:"🔧 Technisches bauen, konfigurieren, reparieren", r:[0.8,0.3,0,0,0,0.3]},
      {l:"📊 Analysieren, Recherchieren, Muster erkennen",  r:[0,0.9,0.2,0.1,0,0.3]},
      {l:"🎨 Gestalten, kreativ arbeiten, Ideen entwickeln",r:[0,0.2,0.9,0.1,0.2,0]},
      {l:"🤝 Menschen begleiten, beraten, unterstützen",    r:[0,0.1,0.2,0.9,0.2,0.1]},
      {l:"💡 Führen, Überzeugen, Projekte vorantreiben",   r:[0,0.1,0.2,0.3,0.9,0.2]},
      {l:"📋 Organisieren, Strukturen schaffen",           r:[0.2,0.2,0,0.1,0.3,0.9]},
    ],
  },
  { id:"goals", q:"Was ist dir bei deiner Zukunft am wichtigsten?", sub:"Klick in deiner Reihenfolge — 1 = wichtigstes.", type:"rank",
    opts:[
      {l:"💰 Gutes, steigendes Einkommen", k:"income"},
      {l:"🛡️ Sicherer Job, stabile Zukunft", k:"security"},
      {l:"❤️ Sinnvolle Arbeit mit Wirkung", k:"meaning"},
      {l:"✨ Kreativität und Selbstbestimmung", k:"creativity"},
      {l:"🗓️ Flexibilität in Zeit und Ort", k:"flexibility"},
    ],
  },
  { id:"duration", q:"Wie viele Jahre kannst du in Ausbildung oder Studium investieren?", sub:"Denke realistisch.", type:"single",
    opts:[
      {l:"Maximal 1 Jahr — ich brauche schnell Einkommen", v:1},
      {l:"1–3 Jahre — überschaubar und planbar", v:2.5},
      {l:"3–4 Jahre — ich denke langfristig", v:3.8},
      {l:"Mehr als 4 Jahre — wenn es sich lohnt", v:5.5},
    ],
  },
  { id:"finance", q:"Wie würdest du deine finanzielle Situation beschreiben?", sub:"Keine richtige Antwort — hilft passende Optionen zu finden.", type:"single",
    opts:[
      {l:"Ich habe gute Unterstützung oder eigene Ersparnisse", v:0.80},
      {l:"Es ist knapp — aber ich komme durch", v:0.35},
      {l:"Ich brauche so schnell wie möglich eigenes Einkommen", v:0.12},
    ],
  },
  { id:"support", q:"Hast du Menschen, die dich bei diesem Schritt unterstützen?", sub:"Emotional, praktisch oder finanziell.", type:"single",
    opts:[
      {l:"Ja — ich habe ein starkes Netzwerk", v:0.85},
      {l:"Ein bisschen — hier und da", v:0.50},
      {l:"Nicht wirklich — ich mache das alleine", v:0.20},
    ],
  },
  { id:"risk", q:"Welcher Satz passt am besten zu dir?", type:"single",
    opts:[
      {l:"🔒 Ich wähle den sicheren, bewährten Weg", v:0.20},
      {l:"⚖️ Ich gehe kalkulierte Risiken ein, wenn der Nutzen klar ist", v:0.50},
      {l:"🚀 Ich probiere Neues aus — auch wenn es unsicher ist", v:0.82},
    ],
  },
];

// ══════════════════════════════════════════════
// SCORING ENGINE
// ══════════════════════════════════════════════
function cosim(a, b) {
  const dot = a.reduce((s, ai, i) => s + ai * b[i], 0);
  const ma = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const mb = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  return (!ma || !mb) ? 0 : dot / (ma * mb);
}

function buildProfile(ans) {
  let riasec = [0, 0, 0, 0, 0, 0];
  if (ans.activities?.length) {
    ans.activities.forEach(i => { const v = Qs[0].opts[i].r; riasec = riasec.map((x, j) => x + v[j]); });
    const mx = Math.max(...riasec, 0.01);
    riasec = riasec.map(x => x / mx);
  } else riasec = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

  const gw = { income:0.2, security:0.2, meaning:0.2, creativity:0.2, flexibility:0.2 };
  if (ans.goals?.length) {
    const n = ans.goals.length;
    ans.goals.forEach((k, i) => { gw[k] = (n - i) / (n * (n + 1) / 2); });
  }

  const fin = ans.finance ?? 0.5;
  return {
    riasec, gw,
    constraints: { maxDuration: ans.duration ?? 3.5, entryScore: 0.6 },
    ctx: { fin, sup: ans.support ?? 0.5, barriers: 0.20, capacity: fin < 0.25 ? 0.38 : 0.65 },
    risk: ans.risk ?? 0.5,
  };
}

function score(opt, p) {
  const iF = (cosim(p.riasec, opt.riasec) + 1) / 2;
  const dims = ["income","security","meaning","creativity","flexibility"];
  const ws = dims.reduce((s, d) => s + p.gw[d], 0) || 1;
  const gF = dims.reduce((s, d) => s + p.gw[d] * opt.goals[d], 0) / ws;
  const durOk = opt.duration <= p.constraints.maxDuration ? 1 : Math.max(0, 1 - (opt.duration - p.constraints.maxDuration) / opt.duration);
  const accOk = p.constraints.entryScore >= opt.access.req ? 1 : Math.max(0, 1 - (opt.access.req - p.constraints.entryScore) / opt.access.req);
  const finOk = Math.min(1, p.ctx.fin / Math.max(0.1, opt.finDemand));
  const cF = durOk * 0.4 + accOk * 0.35 + finOk * 0.25;
  const mF = 0.5 * opt.market.demand + 0.3 * opt.market.growth + 0.2 * opt.market.regional;
  const raw = p.ctx.fin * (1 - opt.finDemand) * 0.35 + p.ctx.sup * 0.25 + (1 - p.ctx.barriers) * 0.25 + p.ctx.capacity * (1 - opt.parallelLoad) * 0.15;
  let pen = 1.0;
  if (opt.duration > 3 && p.ctx.fin < 0.30) pen = 0.65;
  const ctF = Math.min(1, raw * pen);
  const total = 0.25 * iF + 0.25 * gF + 0.20 * cF + 0.15 * mF + 0.15 * ctF;

  const flags = [];
  if (opt.duration > 3 && p.ctx.fin < 0.30) flags.push({ t:"risk", m:"Lange Ausbildungszeit + begrenzte Mittel: BAföG vorab prüfen." });
  if (opt.risk > 0.55) flags.push({ t:"warn", m:"Höhere Marktunsicherheit — Plan B empfehlenswert." });
  if (opt.income.training > 0) flags.push({ t:"ok", m:`Ausbildungsgehalt: ~${opt.income.training} €/Mo.` });
  if (opt.finDemand < 0.25) flags.push({ t:"ok", m:"Geringe Eigenkosten — gut bei begrenzten Mitteln." });

  return {
    opt, total: Math.round(total * 100) / 100,
    bd: { Interesse: Math.round(iF * 100) / 100, Ziele: Math.round(gF * 100) / 100, Machbarkeit: Math.round(cF * 100) / 100, Markt: Math.round(mF * 100) / 100, Kontext: Math.round(ctF * 100) / 100 },
    flags,
  };
}

function explain(sc, p) {
  const { opt, bd } = sc;
  const gl = { income:"Einkommen", security:"Sicherheit", meaning:"Sinn", creativity:"Kreativität", flexibility:"Flexibilität" };
  const topGoal = Object.entries(p.gw).sort((a, b) => b[1] - a[1])[0][0];
  const lines = [];
  if (bd["Interesse"] > 0.70) lines.push({ t:"ok", m:"Dein Interessenprofil deckt sich gut mit dem, was in diesem Bereich gefragt ist." });
  else if (bd["Interesse"] < 0.48) lines.push({ t:"warn", m:"Inhaltlich weicht dieser Bereich etwas von deinen Interessen ab — überleg, ob du dich damit langfristig beschäftigen möchtest." });
  if (bd["Ziele"] > 0.65) lines.push({ t:"ok", m:`${opt.title} passt gut zu deiner wichtigsten Priorität: ${gl[topGoal]}.` });
  if (p.ctx.fin < 0.30) {
    if (opt.income.training > 0) lines.push({ t:"ok", m:`Wichtig unter deinen Rahmenbedingungen: Gehalt ab Beginn (~${opt.income.training} €/Mo).` });
    else if (opt.finDemand > 0.60) lines.push({ t:"warn", m:"Kein Einkommen während der Ausbildungszeit — Finanzierungsplan vorab klären." });
  }
  if (bd["Markt"] > 0.80) lines.push({ t:"ok", m:"Starker Arbeitsmarkt: hohe Nachfrage, gute Perspektiven." });
  if (opt.risk > 0.55) lines.push({ t:"warn", m:"Überdurchschnittliches Marktrisiko — ein Alternativplan ist sinnvoll." });
  if (!lines.length) lines.push({ t:"neutral", m:"Solide Option für dein Profil. Die Detailwerte zeigen Stärken und Unsicherheiten." });
  return lines;
}

function simData(opts) {
  return Array.from({ length: 11 }, (_, t) => {
    const row = { year: t === 0 ? "Jetzt" : `J+${t}` };
    opts.forEach(o => {
      row[o.id] = t < o.tte ? o.income.training : Math.round(o.income.base * Math.pow(1 + o.income.growth, t - o.tte));
    });
    return row;
  });
}

// ══════════════════════════════════════════════
// UI COMPONENTS
// ══════════════════════════════════════════════
const SIM_COLORS = ["#6EE7B7", "#7DD3FC", "#FCD34D"];

function Btn({ children, onClick, ghost = false, small = false }) {
  const base = { border:"none", borderRadius:6, cursor:"pointer", fontWeight:500, transition:"opacity .15s", fontFamily:"inherit",
    padding: small ? "7px 14px" : "11px 22px", fontSize: small ? 12 : 14 };
  const style = ghost
    ? { ...base, background:"transparent", color:C.accent, border:`1px solid ${C.accent}` }
    : { ...base, background:C.accent, color:C.bg };
  return <button style={style} onClick={onClick} onMouseEnter={e=>e.target.style.opacity=".8"} onMouseLeave={e=>e.target.style.opacity="1"}>{children}</button>;
}

function TypeBadge({ type }) {
  const colors = { Studium:["#0c1a3a","#7DD3FC","#1e3a5f"], Ausbildung:["#0a2a14","#86EFAC","#14532d"], Alternative:["#2a1a0a","#FCD34D","#713f12"] };
  const [bg, fg, border] = colors[type] || colors.Alternative;
  return <span style={{ ...mono, fontSize:9, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", padding:"2px 8px", borderRadius:3, background:bg, color:fg, border:`1px solid ${border}` }}>{type}</span>;
}

function Bar({ val, color = C.accent }) {
  return (
    <div style={{ background:"#1E2A3A", borderRadius:3, height:5, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${Math.round(val * 100)}%`, background:color, borderRadius:3, transition:"width .5s ease" }} />
    </div>
  );
}

function ScoreRow({ label, val }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:12, color:C.muted2 }}>{label}</span>
        <span style={{ ...mono, fontSize:11, color:C.text }}>{Math.round(val * 100)}%</span>
      </div>
      <Bar val={val} />
    </div>
  );
}

function FlagChip({ flag }) {
  const cfg = { ok:["#0a2a14","#86EFAC","#14532d"], warn:["#1c1408","#FCD34D","#713f12"], risk:["#2a0a0a","#F87171","#7f1d1d"], neutral:["#1A2030",C.muted2,C.border] };
  const [bg, fg, border] = cfg[flag.t] || cfg.neutral;
  return <div style={{ padding:"9px 12px", borderRadius:6, fontSize:12, lineHeight:1.6, background:bg, border:`1px solid ${border}`, color:fg, marginBottom:6 }}>{flag.m}</div>;
}

// ── WELCOME ──
function Welcome({ onStart }) {
  return (
    <div style={{ paddingTop:48 }}>
      <div style={{ ...mono, fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:C.accent, marginBottom:8 }}>Iftiin Flow · Innovara</div>
      <h1 style={{ fontSize:26, fontWeight:300, letterSpacing:"-.02em", marginBottom:8, lineHeight:1.2, color:C.text }}>
        Dein <span style={{ fontWeight:600, color:C.accent }}>Entscheidungskompass</span>
      </h1>
      <p style={{ color:C.muted2, maxWidth:480, marginBottom:36, fontSize:14, lineHeight:1.7 }}>
        6 Fragen · ca. 4 Minuten · Matching mit 10 Wegen nach Studium oder Schule — mit transparenter Begründung, kein Blackbox-Ergebnis.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:36, maxWidth:480 }}>
        {[["Intersektionaler Ansatz","Dein Kontext fließt ein — ohne zu determinieren"],
          ["Score + Simulation","Matching-Score und Einkommensverlauf über 10 Jahre"],
          ["Keine Falschantworten","Das System passt sich deiner Situation an"],
          ["Ergebnis erklärbar","Jede Empfehlung mit Begründung und Trade-offs"]
        ].map(([h, t]) => (
          <div key={h} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:14 }}>
            <div style={{ fontSize:12, fontWeight:500, color:C.text, marginBottom:3 }}>{h}</div>
            <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{t}</div>
          </div>
        ))}
      </div>
      <Btn onClick={onStart}>Kompass starten →</Btn>
      <p style={{ color:"#3a4a5a", fontSize:11, marginTop:14 }}>Beta · Keine Datenspeicherung · Ergebnisse sind Orientierung</p>
    </div>
  );
}

// ── ASSESSMENT ──
function Assessment({ answers, setAnswers, onFinish }) {
  const [qi, setQi] = useState(0);
  const q = Qs[qi];
  const ans = answers[q.id];

  const canNext = q.type === "multi" ? (ans?.length || 0) >= 1
    : q.type === "rank" ? (ans?.length || 0) === q.opts.length
    : ans !== undefined && ans !== null;

  function next() { qi < Qs.length - 1 ? setQi(qi + 1) : onFinish(); }
  function prev() { if (qi > 0) setQi(qi - 1); }

  function toggleMulti(i) {
    const cur = ans || [];
    if (cur.includes(i)) setAnswers({ ...answers, [q.id]: cur.filter(x => x !== i) });
    else if (cur.length < q.max) setAnswers({ ...answers, [q.id]: [...cur, i] });
  }

  function addRank(k) { if (!(ans||[]).includes(k)) setAnswers({ ...answers, [q.id]: [...(ans||[]), k] }); }
  function rmRank(k) { setAnswers({ ...answers, [q.id]: (ans||[]).filter(x => x !== k) }); }

  const optStyle = (sel) => ({
    padding:"12px 16px", borderRadius:8, cursor:"pointer", fontSize:14, transition:"all .15s",
    background: sel ? "#0a2a14" : C.surface,
    border:`1px solid ${sel ? C.accent : C.border}`,
    color: sel ? C.text : C.muted2, marginBottom:6,
  });

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ ...mono, fontSize:10, color:C.muted, letterSpacing:".08em" }}>FRAGE {qi+1} / {Qs.length}</span>
          <span style={{ ...mono, fontSize:10, color:C.accent }}>{Math.round((qi+1)/Qs.length*100)}%</span>
        </div>
        <div style={{ background:"#1E2A3A", borderRadius:3, height:3 }}>
          <div style={{ height:"100%", width:`${(qi+1)/Qs.length*100}%`, background:C.accent, borderRadius:3, transition:"width .4s ease" }} />
        </div>
      </div>

      <h2 style={{ fontSize:18, fontWeight:400, marginBottom:6, lineHeight:1.4, color:C.text }}>{q.q}</h2>
      {q.sub && <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>{q.sub}</p>}

      {q.type === "multi" && (
        <div style={{ marginBottom:24 }}>
          {q.opts.map((o, i) => (
            <div key={i} style={optStyle((ans||[]).includes(i))} onClick={() => toggleMulti(i)}>{o.l}</div>
          ))}
        </div>
      )}

      {q.type === "rank" && (() => {
        const ranked = ans || [];
        const remaining = q.opts.filter(o => !ranked.includes(o.k));
        return (
          <div style={{ marginBottom:24 }}>
            {ranked.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ ...mono, fontSize:9, color:C.accent, letterSpacing:".08em", marginBottom:8 }}>DEINE REIHENFOLGE</div>
                {ranked.map((k, i) => {
                  const opt = q.opts.find(o => o.k === k);
                  return (
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ ...mono, fontSize:11, color:C.accent, minWidth:18 }}>{i+1}.</span>
                      <div style={{ flex:1, background:"#0a2a14", border:`1px solid ${C.accent}`, borderRadius:6, padding:"8px 12px", fontSize:13, color:C.text }}>{opt.l}</div>
                      <button onClick={() => rmRank(k)} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:18 }}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
            {remaining.length > 0 && (
              <div>
                <div style={{ ...mono, fontSize:9, color:C.muted, letterSpacing:".08em", marginBottom:8 }}>KLICKEN ZUM HINZUFÜGEN</div>
                {remaining.map(o => (
                  <div key={o.k} style={optStyle(false)} onClick={() => addRank(o.k)}>{o.l}</div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {q.type === "single" && (
        <div style={{ marginBottom:24 }}>
          {q.opts.map((o, i) => (
            <div key={i} style={optStyle(ans === o.v)} onClick={() => setAnswers({ ...answers, [q.id]: o.v })}>{o.l}</div>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:10 }}>
        <div style={{ opacity: canNext ? 1 : 0.4 }}>
          <Btn onClick={canNext ? next : undefined}>{qi < Qs.length - 1 ? "Weiter →" : "Ergebnisse →"}</Btn>
        </div>
        {qi > 0 && <Btn ghost onClick={prev}>← Zurück</Btn>}
      </div>
    </div>
  );
}

// ── RESULTS ──
function Results({ scored, profile, onDetail, onSim }) {
  return (
    <div>
      <div style={{ ...mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, marginBottom:6 }}>Deine Ergebnisse</div>
      <h2 style={{ fontSize:22, fontWeight:300, marginBottom:4, color:C.text }}>Top-Empfehlungen</h2>
      <p style={{ color:C.muted, fontSize:13, marginBottom:28 }}>Basierend auf Interesse, Zielen, Rahmenbedingungen und Marktdaten.</p>

      {scored.slice(0, 4).map((sc, i) => {
        const { opt, total, bd, flags } = sc;
        return (
          <div key={opt.id} style={{ ...card, marginBottom:12, border:`1px solid ${i===0 ? C.accent : C.border}`, position:"relative" }}>
            {i === 0 && (
              <div style={{ position:"absolute", top:-10, left:14, background:C.accent, color:C.bg, ...mono, fontSize:9, fontWeight:600, letterSpacing:".1em", padding:"2px 10px", borderRadius:3 }}>BESTE PASSUNG</div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:14 }}>
              <div>
                <TypeBadge type={opt.type} />
                <h3 style={{ fontSize:15, fontWeight:500, color:C.text, marginTop:6, marginBottom:3 }}>{opt.title}</h3>
                <p style={{ fontSize:12, color:C.muted, lineHeight:1.5, maxWidth:380 }}>{opt.desc}</p>
              </div>
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ ...mono, fontSize:26, fontWeight:600, color: i===0 ? C.accent : C.text, lineHeight:1 }}>{Math.round(total*100)}%</div>
                <div style={{ ...mono, fontSize:9, color:C.muted, marginTop:2 }}>MATCH</div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:12 }}>
              {Object.entries(bd).map(([lbl, val]) => (
                <div key={lbl}>
                  <div style={{ ...mono, fontSize:9, color:C.muted, marginBottom:3 }}>{lbl}</div>
                  <Bar val={val} />
                </div>
              ))}
            </div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              {flags.filter(f => f.t==="ok").map((f, j) => (
                <span key={j} style={{ ...mono, fontSize:9, padding:"2px 8px", borderRadius:3, background:"#0a2a14", color:C.ok, border:`1px solid #14532d` }}>{f.m.split(":")[0]}</span>
              ))}
              {flags.filter(f => f.t!=="ok").map((f, j) => (
                <span key={j} style={{ ...mono, fontSize:9, padding:"2px 8px", borderRadius:3, background:"#1c1408", color:C.warn, border:`1px solid #713f12` }}>⚠ {f.t==="risk" ? "Finanzrisiko" : f.m.substring(0,30)}</span>
              ))}
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <Btn small onClick={() => onDetail(sc)}>Details & Erklärung →</Btn>
              {i < 3 && <Btn small ghost onClick={onSim}>Simulation</Btn>}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop:8, padding:14, background:"#0d1520", border:`1px solid ${C.border}`, borderRadius:8, fontSize:11, color:C.muted, lineHeight:1.6 }}>
        Scores sind Orientierungswerte — keine Garantie. Alle Optionen bleiben offen. Die Simulation zeigt Näherungen, keine Vorhersagen.
      </div>
    </div>
  );
}

// ── DETAIL ──
function Detail({ sc, profile, onBack, onSim }) {
  const { opt, bd, flags, total } = sc;
  const exp = explain(sc, profile);
  const expColor = { ok:C.ok, warn:C.warn, risk:C.danger, neutral:C.muted2 };

  return (
    <div>
      <button onClick={onBack} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:13, marginBottom:20, padding:0 }}>← Ergebnisse</button>
      <TypeBadge type={opt.type} />
      <h2 style={{ fontSize:22, fontWeight:400, marginTop:8, marginBottom:4, color:C.text }}>{opt.title}</h2>
      <p style={{ color:C.muted2, marginBottom:24, lineHeight:1.6 }}>{opt.desc}</p>

      <div style={{ ...card, marginBottom:16 }}>
        <div style={{ ...mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, marginBottom:14 }}>Score-Breakdown</div>
        {Object.entries(bd).map(([l, v]) => <ScoreRow key={l} label={l} val={v} />)}
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:4, display:"flex", justifyContent:"space-between" }}>
          <span style={{ ...mono, fontSize:10, color:C.muted, textTransform:"uppercase" }}>Gesamt</span>
          <span style={{ ...mono, fontSize:18, fontWeight:600, color:C.accent }}>{Math.round(total*100)}%</span>
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ ...mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, marginBottom:12 }}>Warum passt das zu dir?</div>
        {exp.map((e, i) => (
          <div key={i} style={{ display:"flex", gap:10, padding:"11px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, marginBottom:8 }}>
            <span style={{ fontSize:13 }}>{e.t==="ok"?"✦":e.t==="warn"?"⚠":"—"}</span>
            <span style={{ fontSize:13, color:expColor[e.t]||C.muted2, lineHeight:1.6 }}>{e.m}</span>
          </div>
        ))}
      </div>

      {flags.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ ...mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, marginBottom:10 }}>Kontext-Hinweise</div>
          {flags.map((f, i) => <FlagChip key={i} flag={f} />)}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        {[
          ["Dauer", opt.duration <= 1 ? "< 1 Jahr" : `${opt.duration} Jahre`],
          ["Einstieg (brutto)", `~${opt.income.base.toLocaleString("de")} €/Mo`],
          ["Marktrisiko", opt.risk < 0.25 ? "Niedrig" : opt.risk < 0.55 ? "Mittel" : "Hoch"],
        ].map(([l, v]) => (
          <div key={l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:14 }}>
            <div style={{ ...mono, fontSize:9, color:C.muted, letterSpacing:".08em", marginBottom:4, textTransform:"uppercase" }}>{l}</div>
            <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ ...mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, marginBottom:10 }}>Finanzierungsmöglichkeiten</div>
        {opt.funding.map((f, i) => (
          <div key={i} style={{ fontSize:12, color:C.muted2, padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>→ {f}</div>
        ))}
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:28 }}>
        {opt.tags.map(t => <span key={t} style={{ ...mono, background:C.surface2, color:C.muted2, border:`1px solid ${C.border}`, fontSize:10, padding:"3px 8px", borderRadius:3 }}>{t}</span>)}
      </div>

      <div style={{ display:"flex", gap:10 }}>
        <Btn onClick={onSim}>Simulation →</Btn>
        <Btn ghost onClick={onBack}>← Zurück</Btn>
      </div>
    </div>
  );
}

// ── SIMULATION ──
function Simulation({ scored, onBack }) {
  const top3 = scored.slice(0, 3);
  const [yr, setYr] = useState(5);
  const data = useMemo(() => simData(top3.map(s => s.opt)), []);

  return (
    <div>
      <button onClick={onBack} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:13, marginBottom:20, padding:0 }}>← Ergebnisse</button>
      <div style={{ ...mono, fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:C.accent, marginBottom:6 }}>Szenario-Simulation</div>
      <h2 style={{ fontSize:22, fontWeight:300, marginBottom:4, color:C.text }}>Einkommensverlauf über 10 Jahre</h2>
      <p style={{ color:C.muted, fontSize:12, marginBottom:20 }}>Base-Szenario, brutto. Näherungswerte — keine Vorhersage.</p>

      <div style={{ display:"flex", flexWrap:"wrap", gap:16, marginBottom:20 }}>
        {top3.map((sc, i) => (
          <div key={sc.opt.id} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:20, height:3, background:SIM_COLORS[i], borderRadius:2 }} />
            <span style={{ fontSize:12, color:C.muted2 }}>{sc.opt.title}</span>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom:16 }}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top:8, right:16, bottom:8, left:16 }}>
            <CartesianGrid stroke="#1E2A3A" strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fill:C.muted, fontSize:10, fontFamily:"monospace" }} stroke={C.border} />
            <YAxis tickFormatter={v => `${(v/1000).toFixed(1)}k`} tick={{ fill:C.muted, fontSize:10, fontFamily:"monospace" }} stroke={C.border} />
            <Tooltip
              contentStyle={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:6, fontSize:12 }}
              labelStyle={{ color:C.accent, ...mono, fontSize:10 }}
              itemStyle={{ color:C.text }}
              formatter={(v) => [`${v.toLocaleString("de")} €`, ""]}
            />
            {top3.map((sc, i) => (
              <Line key={sc.opt.id} type="monotone" dataKey={sc.opt.id} stroke={SIM_COLORS[i]} strokeWidth={2} dot={{ r:3, fill:SIM_COLORS[i] }} name={sc.opt.title} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...card, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <span style={{ fontSize:13, color:C.muted2 }}>Werte bei Jahr</span>
          <select value={yr} onChange={e => setYr(+e.target.value)}
            style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:4, color:C.text, padding:"4px 8px", fontSize:13, fontFamily:"inherit" }}>
            {Array.from({length:11},(_,i)=>i).map(y => <option key={y} value={y}>+{y}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${top3.length},1fr)`, gap:10 }}>
          {top3.map((sc, i) => (
            <div key={sc.opt.id} style={{ background:C.surface2, borderRadius:6, padding:14, borderTop:`3px solid ${SIM_COLORS[i]}` }}>
              <div style={{ ...mono, fontSize:9, color:C.muted, letterSpacing:".08em", marginBottom:4 }}>{sc.opt.title.substring(0,20).toUpperCase()}</div>
              <div style={{ ...mono, fontSize:18, fontWeight:500, color:SIM_COLORS[i] }}>
                {data[yr]?.[sc.opt.id] ? `${data[yr][sc.opt.id].toLocaleString("de")} €` : "—"}
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>/Monat brutto</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:12, background:"#0d1520", border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, color:C.muted, lineHeight:1.6 }}>
        Werte basieren auf Marktdurchschnittswerten (Bundesagentur, Stepstone, Gehalt.de, BIBB). Realverläufe weichen ab — Unsicherheitsband ca. ±20%. Keine Finanzberatung.
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [scored, setScored] = useState([]);
  const [profile, setProfile] = useState(null);
  const [detail, setDetail] = useState(null);

  function finish() {
    const p = buildProfile(answers);
    const results = OPTIONS.map(o => score(o, p)).sort((a, b) => b.total - a.total);
    setProfile(p);
    setScored(results);
    setScreen("results");
  }

  function reset() {
    setScreen("welcome"); setAnswers({}); setScored([]); setProfile(null); setDetail(null);
  }

  const screens = { welcome:"Kompass", assessment:"Assessment", results:"Ergebnisse", detail:"Detail", simulation:"Simulation" };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"'IBM Plex Sans', system-ui, sans-serif", fontSize:14, lineHeight:1.65 }}>
      {/* Header */}
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:C.bg, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={reset}>
          <div style={{ width:22, height:22, borderRadius:4, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:C.bg, fontWeight:700, fontSize:11 }}>↗</span>
          </div>
          <span style={{ ...mono, fontSize:11, color:C.accent, letterSpacing:".05em" }}>Entscheidungskompass</span>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {screen !== "welcome" && <Btn small ghost onClick={reset}>Neu starten</Btn>}
          <span style={{ ...mono, fontSize:10, color:"#2a3a4a" }}>Beta</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:640, margin:"0 auto", padding:"0 20px 80px" }}>
        {screen === "welcome" && <Welcome onStart={() => setScreen("assessment")} />}
        {screen === "assessment" && <Assessment answers={answers} setAnswers={setAnswers} onFinish={finish} />}
        {screen === "results" && scored.length > 0 && (
          <Results scored={scored} profile={profile}
            onDetail={sc => { setDetail(sc); setScreen("detail"); }}
            onSim={() => setScreen("simulation")} />
        )}
        {screen === "detail" && detail && (
          <Detail sc={detail} profile={profile}
            onBack={() => setScreen("results")}
            onSim={() => setScreen("simulation")} />
        )}
        {screen === "simulation" && scored.length > 0 && (
          <Simulation scored={scored} onBack={() => setScreen("results")} />
        )}
      </div>
    </div>
  );
}
