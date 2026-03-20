"use client";

import { useState } from "react";
import { Info, X, AlertTriangle, Shield, Activity, TrendingUp, Clock, Database } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
   Static data
   ──────────────────────────────────────────────────────────────────────────── */

const DIMENSIONS = [
  {
    key: "Q", name: "Quality", weight: 30, color: "emerald", icon: Activity,
    description: "Parametric & statistical quality — fully computable during ingestion.",
    subs: [
      { code: "S", label: "Schema Integrity",   detail: "Types, null rules, schema drift — measured as % schema violations." },
      { code: "C", label: "Completeness",        detail: "Missing data in critical fields — measured as weighted null %." },
      { code: "A", label: "Accuracy / Sanity",   detail: "Valid ranges, impossible values — measured as % invalid rows." },
      { code: "U", label: "Uniqueness",           detail: "Duplicate rows/keys — measured as duplication ratio." },
      { code: "D", label: "Distribution Health", detail: "Outliers, spikes, skew — measured via PSI/Z-score flags." },
    ],
  },
  {
    key: "L", name: "Legal & Compliance", weight: 25, color: "blue", icon: Shield, gate: true,
    description: "A gate, not just a score. If L < 60 the dataset is NOT sellable regardless of final score.",
    subs: [
      { code: "O", label: "Ownership",         detail: "Clear resale rights — unverifiable ownership results in automatic failure." },
      { code: "R", label: "Resale Permission", detail: "Sub-licensing allowed by the original source." },
      { code: "P", label: "PII Risk",          detail: "Re-identification probability — personal data without consent leads to automatic failure." },
      { code: "J", label: "Jurisdiction Fit",  detail: "Indian DPDP / IT Act alignment — scraped data violating TOS leads to automatic failure." },
    ],
  },
  {
    key: "P", name: "Provenance", weight: 20, color: "purple", icon: Database,
    description: "Honest disclosure increases score. Hidden uncertainty penalises it.",
    subs: [
      { code: "M", label: "Methodology Clarity",    detail: "How data was collected — undocumented methods score low." },
      { code: "S", label: "Source Type",             detail: "Primary > licensed > scraped — primary sources score highest." },
      { code: "T", label: "Transformation Lineage", detail: "Cleaning and aggregation transparency." },
      { code: "B", label: "Bias Disclosure",         detail: "Known gaps disclosed — concealed gaps heavily penalised." },
    ],
  },
  {
    key: "U", name: "Usability", weight: 15, color: "amber", icon: TrendingUp,
    description: "Directly affects sales velocity — buyers pay a premium for data they can use immediately.",
    subs: [
      { code: "J", label: "Joinability",            detail: "Can it link with public datasets via shared keys or IDs." },
      { code: "N", label: "Naming & Documentation", detail: "Clear columns and a data dictionary." },
      { code: "D", label: "Delivery Readiness",     detail: "Query-ready format vs raw dump." },
      { code: "I", label: "Integration Ease",       detail: "API / CSV / Parquet availability and consistency." },
    ],
  },
  {
    key: "F", name: "Freshness", weight: 10, color: "rose", icon: Clock,
    description: "Static datasets can still score high if correctly labelled and their temporal scope is documented.",
    subs: [
      { code: "R", label: "Refresh Reliability", detail: "Past update consistency." },
      { code: "L", label: "Latency",             detail: "Time elapsed since last update." },
      { code: "H", label: "Historical Depth",    detail: "Total time coverage of the dataset." },
    ],
  },
];

const TRUST_BANDS = [
  { range: "85–100", label: "Production-Grade", meaning: "Safe for ML, analytics & ops",       bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-700/40" },
  { range: "70–84",  label: "Business-Ready",   meaning: "Good for decision support",           bg: "bg-blue-50 dark:bg-blue-900/20",       text: "text-blue-700 dark:text-blue-300",     border: "border-blue-200 dark:border-blue-700/40"    },
  { range: "55–69",  label: "Experimental",     meaning: "Research / exploration only",         bg: "bg-amber-50 dark:bg-amber-900/20",     text: "text-amber-700 dark:text-amber-300",   border: "border-amber-200 dark:border-amber-700/40"  },
  { range: "< 55",   label: "Restricted",       meaning: "Not recommended for production use",  bg: "bg-red-50 dark:bg-red-900/20",         text: "text-red-700 dark:text-red-300",       border: "border-red-200 dark:border-red-700/40"      },
];

const DIM_COLORS: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  blue:    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  purple:  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  amber:   "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  rose:    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-700",
};
const DIM_BAR: Record<string, string> = {
  emerald: "bg-emerald-500", blue: "bg-blue-500", purple: "bg-purple-500", amber: "bg-amber-500", rose: "bg-rose-500",
};

/* ────────────────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────────────────── */

export function KdtsInfoModal() {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);   // drives CSS transition
  const [active, setActive]   = useState("Q");

  const current = DIMENSIONS.find(d => d.key === active)!;

  function handleOpen() {
    setOpen(true);
    // Two rAF ticks so the element has been painted before we add the class
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }
  function handleClose() {
    setVisible(false);
    setTimeout(() => setOpen(false), 200);
  }

  return (
    <>
      {/* ─ Trigger ─ */}
      <button
        onClick={handleOpen}
        aria-label="Learn about KDTS scoring"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240]/60 dark:text-white/50 hover:bg-[#1a2240]/20 dark:hover:bg-white/20 hover:text-[#1a2240] dark:hover:text-white transition-all duration-150"
      >
        <Info className="w-3 h-3" />
      </button>

      {/* ─ Modal ─ */}
      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel — no max-h, no overflow */}
          <div
            className={`relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0f1729] border border-[#1a2240]/10 dark:border-white/10 shadow-2xl transition-all duration-200 ${
              visible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-3"
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[#1a2240]/8 dark:border-white/8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#1a2240] dark:bg-white/10 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-[#1a2240] dark:text-white">
                    Kuinbee Data Trust Score (KDTS)
                  </h2>
                </div>
                <p className="text-xs text-[#4e5a7e] dark:text-white/55">
                  A composite 0–100 score quantifying how safe, reliable, and usable a dataset is — before you buy.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[#4e5a7e] dark:text-white/50 hover:bg-[#1a2240]/8 dark:hover:bg-white/8 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-3">
              {/* Dimension tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {DIMENSIONS.map(d => (
                  <button
                    key={d.key}
                    onClick={() => setActive(d.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${
                      active === d.key
                        ? DIM_COLORS[d.color]
                        : "bg-transparent text-[#4e5a7e] dark:text-white/50 border-[#1a2240]/10 dark:border-white/10 hover:border-[#1a2240]/20 dark:hover:border-white/20"
                    }`}
                  >
                    {d.key}
                    <span className="hidden sm:inline opacity-70 font-normal">{d.weight}%</span>
                  </button>
                ))}
              </div>

              {/* Active dimension */}
              <div className="rounded-xl border border-[#1a2240]/10 dark:border-white/10 bg-[#f8f9fc] dark:bg-white/3 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <current.icon className="w-3.5 h-3.5 text-[#4e5a7e] dark:text-white/50 flex-shrink-0" />
                    <h3 className="font-bold text-[#1a2240] dark:text-white text-sm">
                      {current.key} — {current.name}
                      {current.gate && (
                        <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700/40">
                          <AlertTriangle className="w-2.5 h-2.5" /> Gate
                        </span>
                      )}
                    </h3>
                  </div>
                  <span className="flex-shrink-0 text-xs font-bold text-[#1a2240] dark:text-white bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-[#1a2240]/10 dark:border-white/10">
                    {current.weight}%
                  </span>
                </div>

                <p className="text-xs text-[#4e5a7e] dark:text-white/55 mb-2">{current.description}</p>

                {/* Weight bar */}
                <div className="h-1 bg-[#1a2240]/8 dark:bg-white/8 rounded-full mb-3 overflow-hidden">
                  <div className={`h-full ${DIM_BAR[current.color]} rounded-full transition-all duration-500`} style={{ width: `${current.weight}%` }} />
                </div>

                {/* Sub-scores — 2 col grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {current.subs.map(s => (
                    <div key={s.code} className="flex items-start gap-2">
                      <span className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border ${DIM_COLORS[current.color]}`}>
                        {s.code}
                      </span>
                      <p className="text-xs text-[#4e5a7e] dark:text-white/60 min-w-0">
                        <span className="font-semibold text-[#1a2240] dark:text-white">{s.label}: </span>
                        {s.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust bands + overrides — side by side */}
              <div className="grid grid-cols-2 gap-3">
                {/* Trust bands */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4e5a7e] dark:text-white/40 mb-1.5">Trust Bands</p>
                  <div className="space-y-1">
                    {TRUST_BANDS.map(b => (
                      <div key={b.label} className={`rounded-lg border ${b.bg} ${b.border} px-2.5 py-1.5`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold ${b.text}`}>{b.label}</span>
                          <span className={`text-[10px] font-mono ${b.text} opacity-70`}>{b.range}</span>
                        </div>
                        <p className={`text-[10px] ${b.text} opacity-60 leading-snug`}>{b.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-negotiable overrides */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4e5a7e] dark:text-white/40 mb-1.5">Non-Negotiable Overrides</p>
                  <div className="rounded-xl border border-red-200 dark:border-red-700/40 bg-red-50 dark:bg-red-900/10 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <p className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">Automatic action</p>
                    </div>
                    <ul className="space-y-1.5">
                      {[
                        "PII leak → immediate delist",
                        "Legal ambiguity → immediate delist",
                        "False provenance → supplier blacklist",
                        "Repeated quality drift → tier downgrade",
                      ].map(item => (
                        <li key={item} className="flex items-start gap-1.5 text-[11px] text-red-700/80 dark:text-red-300/70">
                          <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
