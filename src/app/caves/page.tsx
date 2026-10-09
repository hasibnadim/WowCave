"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Clock3, Compass, Search, Sparkles, X } from "lucide-react";
import { caves, type Cave } from "@/lib/caves";

const subjects = ["All caves", ...Array.from(new Set(caves.map((cave) => cave.subject)))];

export default function CavesPage() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All caves");
  const [activeCave, setActiveCave] = useState<Cave | null>(null);
  const [eventIndex, setEventIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const journeyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeCave) journeyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeCave]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCaves = caves.filter((cave) => {
    const matchesSubject = subject === "All caves" || cave.subject === subject;
    const matchesQuery = !normalizedQuery || [cave.title, cave.subject, cave.summary, cave.description]
      .some((value) => value.toLowerCase().includes(normalizedQuery));
    return matchesSubject && matchesQuery;
  });

  const currentEvent = activeCave?.events[eventIndex];
  const isComplete = Boolean(activeCave && eventIndex >= activeCave.events.length);

  const startCave = (cave: Cave) => {
    setActiveCave(cave);
    setEventIndex(0);
    setSelectedAnswer(null);
  };

  const closeCave = () => {
    setActiveCave(null);
    setSelectedAnswer(null);
  };

  return (
    <main className="flex-1">
      <section className="border-b border-border bg-card/50 px-4 pb-10 pt-14 sm:px-6 sm:pt-16">
        <div className="container mx-auto">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Compass className="size-4" /> The cave archive
          </p>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Choose a trail to follow.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Every cave is a sequence of clues and choices, shaped around something real. Follow your curiosity; the field notes are part of the adventure.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary">
                <Sparkles className="size-4" />
              </span>
              <span><strong className="text-foreground">{caves.length}</strong> trails to explore</span>
            </div>
          </div>
        </div>
      </section>

      <section id="featured-caves" className="container mx-auto scroll-mt-24 px-4 py-10 sm:px-6 md:py-14">
        {activeCave ? (
          <section ref={journeyRef} className="mb-12 scroll-mt-24 overflow-hidden rounded-md border border-primary/30 bg-card">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-52 bg-muted md:min-h-full">
                <Image src={activeCave.image} alt={activeCave.imageAlt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Now exploring</p>
                    <h2 className="mt-1 text-2xl font-bold">{activeCave.title}</h2>
                  </div>
                  <button type="button" onClick={closeCave} aria-label="Close cave" className="rounded-full border border-white/30 bg-black/30 p-2 transition hover:bg-black/60">
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Field event</p>
                  {!isComplete ? <p className="text-xs text-muted-foreground">{eventIndex + 1} of {activeCave.events.length}</p> : null}
                </div>

                {!isComplete && currentEvent ? (
                  <>
                    <div className="mb-5 h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={activeCave.events.length} aria-valuenow={eventIndex + 1}>
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((eventIndex + 1) / activeCave.events.length) * 100}%` }} />
                    </div>
                    <h3 className="max-w-2xl text-xl font-bold leading-snug text-foreground sm:text-2xl">{currentEvent.prompt}</h3>
                    <div className="mt-5 grid gap-2">
                      {currentEvent.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = selectedAnswer !== null && option.correct;
                        return (
                          <button
                            key={option.label}
                            type="button"
                            disabled={selectedAnswer !== null}
                            onClick={() => setSelectedAnswer(index)}
                            className={`flex min-h-12 items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition disabled:cursor-default ${
                              isCorrect
                                ? "border-primary/60 bg-primary/10 text-foreground"
                                : isSelected
                                  ? "border-accent/50 bg-accent/10 text-foreground"
                                  : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                            }`}
                          >
                            <span>{option.label}</span>
                            {isCorrect ? <Check className="size-4 shrink-0 text-primary" /> : null}
                          </button>
                        );
                      })}
                    </div>
                    {selectedAnswer !== null ? (
                      <div className="mt-5 rounded-md border border-border bg-background/70 p-4" aria-live="polite">
                        <p className="text-sm font-semibold text-primary">
                          {currentEvent.options[selectedAnswer]?.correct ? "Clue understood" : "The cave leaves another clue"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{currentEvent.insight}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setEventIndex((index) => index + 1);
                            setSelectedAnswer(null);
                          }}
                          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:brightness-110"
                        >
                          Continue <ArrowRight className="size-4" />
                        </button>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Trail complete</p>
                    <h3 className="mt-3 text-2xl font-bold text-foreground">You found your way through.</h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                      You followed {activeCave.events.length} field events through {activeCave.title}. Pick another trail and see what it teaches you.
                    </p>
                    <button type="button" onClick={closeCave} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary">
                      Return to the archive <ArrowRight className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All caves</h2>
            <p className="mt-1 text-sm text-muted-foreground">Search by place, subject, or the question you want to follow.</p>
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search caves or subjects"
              aria-label="Search caves or subjects"
              className="h-11 w-full rounded-md border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-1" aria-label="Filter caves by subject">
          {subjects.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={subject === item}
              onClick={() => setSubject(item)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                subject === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredCaves.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCaves.map((cave) => (
              <article id={cave.slug} key={cave.slug} className="group grid overflow-hidden rounded-md border border-border bg-card transition hover:border-primary/40 sm:grid-cols-[0.8fr_1.2fr]">
                <div className="relative min-h-48 bg-muted sm:min-h-full">
                  <Image src={cave.image} alt={cave.imageAlt} fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
                  <a href={cave.photographerUrl} target="_blank" rel="noreferrer" className="absolute bottom-2 left-3 text-[10px] text-white/75 hover:text-white">
                    Photo: {cave.photographer}
                  </a>
                </div>
                <div className="flex flex-col p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    <span>{cave.subject}</span>
                    <span className="size-1 rounded-full bg-muted-foreground" />
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock3 className="size-3" />{cave.duration}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-foreground">{cave.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{cave.summary}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{cave.difficulty} · {cave.events.length} events</span>
                    <button type="button" onClick={() => startCave(cave)} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-xs font-bold text-primary-foreground transition hover:brightness-110">
                      Enter cave <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border bg-card/50 px-5 py-14 text-center">
            <p className="text-lg font-semibold text-foreground">No caves match that search.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try another subject or clear the search to see every trail.</p>
            <button type="button" onClick={() => { setQuery(""); setSubject("All caves"); }} className="mt-5 text-sm font-semibold text-primary hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}