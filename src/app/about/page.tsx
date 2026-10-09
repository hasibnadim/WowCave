import Link from "next/link";
import { Eye, Flame, Heart, Target } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "MISSION",
    desc: "Build a single universe where every game, world and player journey connects — no fragmentation, just one seamless reality.",
    color: "#00ff88",
  },
  {
    icon: Eye,
    title: "VISION",
    desc: "A platform where the boundaries between games, stories and communities dissolve into one living dimension.",
    color: "#00aaff",
  },
  {
    icon: Heart,
    title: "VALUES",
    desc: "Player-first design, fearless experimentation, and worlds that respect your time and imagination.",
    color: "#ff00aa",
  },
  {
    icon: Flame,
    title: "PASSION",
    desc: "We obsess over atmosphere, motion and mystery — every pixel and system exists to pull you deeper.",
    color: "#ffaa00",
  },
];

const milestones = [
  { year: "2024", label: "PROJECT BORN" },
  { year: "2025", label: "FIRST WORLDS" },
  { year: "2026", label: "THE HORIZON" },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <Hero />
      <Values />
      <Timeline />
      <Team />
      <CTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative py-28 px-4 overflow-hidden" style={{
      background: `
        radial-gradient(ellipse at 80% 10%, rgba(255,0,170,0.1) 0%, transparent 40%),
        radial-gradient(ellipse at 20% 90%, rgba(0,255,136,0.1) 0%, transparent 45%),
        var(--surface-deep)
      `,
    }}>
      <div className="container mx-auto relative z-10">
        <p className="text-sm font-mono text-primary tracking-widest mb-4">WHO WE ARE</p>
        <h1 className="font-black tracking-wider mb-6" style={{
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 55%, var(--foreground)) 40%, var(--foreground) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          WE BUILD WORLDS.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          WowCave is a gaming dimension built for explorers. We fuse classic arcade
          energy with mystery-driven, ARG-style worlds — every corner hides a story,
          every puzzle bends a rule of reality. Our mission is simple: make gaming
          feel limitless again.
        </p>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-center text-4xl md:text-5xl font-bold font-heading tracking-wider mb-14">
          WHAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">DRIVES US</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {values.map((v) => (
            <div
              key={v.title}
              className="group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: `radial-gradient(ellipse at 80% 0%, ${v.color}12 0%, transparent 55%)`,
              }} />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: `${v.color}1a`,
                  border: `1px solid ${v.color}40`,
                }}
              >
                <v.icon className="w-6 h-6" style={{ color: v.color }} />
              </div>
              <h3 className="font-bold font-heading tracking-widest mb-3" style={{ color: v.color }}>
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="relative py-24 px-4 border-t border-primary/20" style={{
      background: "linear-gradient(180deg, transparent, rgba(0,255,136,0.03) 50%, transparent)",
    }}>
      <div className="container mx-auto">
        <h2 className="text-center text-4xl font-bold font-heading tracking-wider mb-14">
          THE <span className="text-primary">JOURNEY</span>
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-0 max-w-3xl mx-auto">
          {milestones.map((m, i) => (
            <div key={m.year} className="flex-1 flex items-center gap-4 md:block md:text-center">
              <div className="hidden md:block w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-4" />
              <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 border-primary/40 bg-card mx-auto mb-3"
                style={{ boxShadow: "0 0 20px rgba(0,255,136,0.25)" }}>
                <span className="text-primary font-bold font-mono">{i + 1}</span>
              </div>
              <div>
                <p className="font-mono text-primary tracking-widest">{m.year}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold font-heading tracking-wider mb-4">
          A SMALL CREW, <span className="text-accent">A BIG VOID</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12">
          We're a compact team of builders, artists and storytellers crafting
          experiences we'd want to be lost inside ourselves.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-12 px-10 text-base font-bold rounded-xl text-primary-foreground transition-all hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, #000))" }}
        >
          JOIN THE ADVENTURE
        </Link>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-20 px-4 border-t border-accent/20" style={{
      background: "radial-gradient(ellipse at 50% 0%, rgba(255,0,170,0.08) 0%, transparent 55%)",
    }}>
      <div className="container mx-auto text-center">
        <p className="text-sm font-mono text-muted-foreground tracking-widest mb-2">HAVE A QUESTION?</p>
        <p className="text-2xl font-bold font-heading tracking-wider mb-6">
          LET'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">TALK</span>
        </p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The void is vast — find your way in, and find your way around.
        </p>
      </div>
    </section>
  );
}