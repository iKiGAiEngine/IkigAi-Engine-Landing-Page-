import Container from "./ui/Container";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-rust-light)_0%,transparent_70%)] opacity-60"
      />

      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-cream-dim px-4 py-1.5 text-sm font-medium text-ink-soft">
            Operations clarity + automation + AI, in one place
          </p>

          <h1 className="max-w-xl font-serif text-4xl leading-[1.08] font-medium tracking-tight text-ink sm:text-5xl md:text-6xl">
            See your business clearly. Then let it run itself.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft sm:text-xl">
            Ikigai Engine turns the scattered, messy work you do by hand into
            clear answers, automated workflows, and AI tools that do the heavy
            lifting for you. First we help you <em>see</em>{" "}
            what&rsquo;s really happening. Then we take the busywork off your
            plate.
          </p>

          <div className="mt-9 flex flex-col items-start gap-3">
            <Button href="#audit">Book a free operations audit</Button>
            <p className="text-sm text-ink-faint">
              30 minutes. No tech jargon. You&rsquo;ll leave knowing exactly
              where you&rsquo;re losing time — and what we can automate
              first.
            </p>
          </div>
        </div>

        <LensGraphic />
      </Container>
    </section>
  );
}

function LensGraphic() {
  const beats = [
    { label: "See it", desc: "One clear view" },
    { label: "Automate it", desc: "Busywork gone" },
    { label: "Delegate it", desc: "AI does the reading" },
  ];

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-[14%] rounded-full border border-line" />
      <div className="absolute inset-[28%] rounded-full border border-rust/40 bg-rust-light/40" />

      <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-line bg-cream/90 px-8 py-7 text-center shadow-[0_20px_60px_-25px_rgba(33,28,22,0.35)] backdrop-blur">
        <span className="font-serif text-2xl font-medium text-teal">Clarity</span>
        <div className="flex flex-col gap-2.5">
          {beats.map((beat, i) => (
            <div key={beat.label} className="flex items-center gap-3 text-left">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rust text-xs font-semibold text-cream">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{beat.label}</p>
                <p className="text-xs text-ink-faint">{beat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
