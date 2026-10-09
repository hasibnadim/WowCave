import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Clock3, Compass, Sparkles } from "lucide-react";
import { caves } from "@/lib/caves";

const featuredCaves = caves.slice(0, 3);

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative isolate flex min-h-[min(740px,86svh)] items-center overflow-hidden bg-[#111512] text-white">
        <Image
          src="/cave-hero.jpg"
          alt="A limestone cavern opens into a still underground pool."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#111512] via-transparent to-black/25" />

        <div className="container relative mx-auto px-4 pb-14 pt-28 sm:px-6 md:pb-20 md:pt-32">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#b7d6b5]">
              <span className="size-2 rounded-full bg-[#c3e6a8] shadow-[0_0_14px_#c3e6a8]" />
              A curious kind of adventure
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.04] text-white sm:text-6xl md:text-7xl">
              The deeper you go, the more you discover.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Follow clues through living caves. Make choices, uncover hidden events, and leave each descent knowing something new about our world.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/caves"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-[#c3e6a8] px-5 text-sm font-bold text-[#172016] transition hover:bg-white"
              >
                Find your first cave <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/caves#featured-caves"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/35 bg-black/20 px-5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Meet the caves <ArrowDownRight className="size-4" />
              </Link>
            </div>
          </div>
          <a
            href="https://unsplash.com/@andrewlancaster"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-5 right-4 text-[11px] text-white/55 transition hover:text-white sm:right-6"
          >
            Cave photograph by Andrew Lancaster / Unsplash
          </a>
        </div>
      </section>

      <section id="featured-caves" className="scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Start somewhere</p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Featured caves</h2>
              <p className="mt-3 max-w-xl text-base leading-6 text-muted-foreground">
                Each descent is a trail of events: notice a clue, choose what to do, and learn what the cave is telling you.
              </p>
            </div>
            <Link href="/caves" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Browse every cave <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredCaves.map((cave) => (
              <Link
                key={cave.slug}
                href={`/caves#${cave.slug}`}
                className="group overflow-hidden rounded-md border border-border bg-card transition hover:border-primary/50"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-muted">
                  <Image
                    src={cave.image}
                    alt={cave.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
                    {cave.subject}
                  </span>
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-xs text-white/80">
                    <Clock3 className="size-3.5" /> {cave.duration}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-foreground">{cave.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{cave.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Read the first clue <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 px-4 py-12 sm:px-6">
        <div className="container mx-auto grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-4" /> Curiosity is your compass
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">An adventure with something to take back.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Follow the story at your own pace. The clues draw you forward; the field notes connect each discovery to science, nature, and history.
            </p>
          </div>
          <Link href="/caves" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary">
            <Compass className="size-4" /> Explore the cave archive
          </Link>
        </div>
      </section>
    </main>
  );
}
