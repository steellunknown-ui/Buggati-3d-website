"use client";
import { useState, useEffect } from "react";
import { Maximize2, Minimize2, Sliders, Menu, X } from "lucide-react";

interface Props {
  onSpecsOpen: () => void;
  scrollPct:   number;
}

export default function Navigation({ onSpecsOpen, scrollPct }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Keyboard shortcut 'F' to toggle fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  };

  const isScrolled = scrollPct > 2;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500"
      style={{
        height: 72,
        background: isScrolled
          ? "rgba(4, 8, 18, 0.75)"
          : "linear-gradient(to bottom, rgba(4, 8, 18, 0.7), transparent)",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(0, 194, 255, 0.2)" : "1px solid transparent",
        boxShadow: isScrolled ? "0 4px 30px rgba(0, 140, 255, 0.08)" : "none",
      }}
    >
      {/* Brand: Bugatti French Racing Blue emblem */}
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <div className="relative flex items-center justify-center w-9 h-9 rounded-md bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 shadow-[0_0_20px_rgba(0,194,255,0.5)] border border-cyan-300/40">
          <span className="font-mono text-xs font-black text-white tracking-widest">
            EB
          </span>
          <div className="absolute inset-0 rounded-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
              BUGATTI
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              BOLIDE
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-200/70">
            W16 // 1600 HP TRACK MONSTER
          </span>
        </div>
      </div>

      {/* Center Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {[
          { label: "EXPLODED VIEW", pct: 0 },
          { label: "AERO CARBON",   pct: 25 },
          { label: "W16 ENGINE",    pct: 52 },
          { label: "CHASSIS",       pct: 80 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
              window.scrollTo({ top: (item.pct / 100) * maxScroll, behavior: "smooth" });
            }}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-cyan-300 transition-colors py-1 relative group"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#00E5FF]" />
          </button>
        ))}
      </div>

      {/* Right Controls: Fullscreen Toggle + Technical Specs */}
      <div className="hidden md:flex items-center gap-4">
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen (Press F)"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/30 hover:bg-cyan-500/20 text-cyan-200 hover:text-white transition-all shadow-[0_0_15px_rgba(0,194,255,0.15)] group"
        >
          {isFullscreen ? (
            <Minimize2 size={13} className="text-cyan-300 group-hover:rotate-90 transition-transform" />
          ) : (
            <Maximize2 size={13} className="text-cyan-300 group-hover:scale-110 transition-transform" />
          )}
          <span className="font-mono text-[10px] tracking-widest font-semibold">
            {isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}
          </span>
          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-white/10 text-cyan-300">
            F
          </span>
        </button>

        {/* Specs Drawer Trigger */}
        <button
          onClick={onSpecsOpen}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-[11px] tracking-widest font-bold shadow-[0_0_20px_rgba(0,194,255,0.4)] hover:shadow-[0_0_30px_rgba(0,194,255,0.7)] transition-all hover:scale-105"
        >
          <Sliders size={13} className="text-white animate-pulse" />
          <span>SPECIFICATIONS</span>
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2 text-cyan-300"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-[#060B18]/95 border-b border-cyan-400/30 backdrop-blur-2xl p-6 flex flex-col gap-4 md:hidden shadow-2xl">
          {[
            { label: "EXPLODED VIEW", pct: 0 },
            { label: "AERO CARBON",   pct: 25 },
            { label: "W16 ENGINE",    pct: 52 },
            { label: "CHASSIS",       pct: 80 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo({ top: (item.pct / 100) * maxScroll, behavior: "smooth" });
                setMenuOpen(false);
              }}
              className="font-mono text-xs tracking-widest text-left text-white/80 hover:text-cyan-300 py-1"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => { toggleFullscreen(); setMenuOpen(false); }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 text-cyan-200 font-mono text-xs tracking-widest"
            >
              <Maximize2 size={14} />
              <span>{isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN MODE"}</span>
            </button>
            <button
              onClick={() => { onSpecsOpen(); setMenuOpen(false); }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs tracking-widest font-bold shadow-lg"
            >
              <Sliders size={14} />
              <span>TECHNICAL SPECIFICATIONS</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
