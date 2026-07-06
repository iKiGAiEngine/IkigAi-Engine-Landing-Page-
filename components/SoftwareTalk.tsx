import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default function SoftwareTalk() {
  return (
    <section className="bg-cream-dim/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="Integration"
          title="You don't have a software problem. You have a software-that-doesn't-talk problem."
          body="Most businesses run on a stack of tools — one for accounting,
            one for scheduling, one for customers, a few spreadsheets, and a
            lot of email. Each one works fine on its own. The trouble is
            they don't talk to each other, so you become the glue: copying a
            number out of one app and into another, re-entering the same
            order three times, keeping it all straight in your head."
        />

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft">
          We make your tools work together so the information moves on its
          own. Most of the time we connect what you already have — no
          ripping anything out, no learning new software. When a tool
          you&rsquo;re paying for is more headache than help, or the right
          tool simply doesn&rsquo;t exist for your industry, we can build
          you a simpler one that does exactly what you need and nothing you
          don&rsquo;t.
        </p>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft">
          Either way, the goal is the same: your apps hand information to
          each other automatically, and you stop being the middleman.
        </p>

        <div className="mt-10 rounded-3xl border border-rust/20 bg-rust-light/50 px-8 py-8 text-center sm:px-12">
          <p className="font-serif text-2xl leading-snug text-teal-dark sm:text-3xl">
            Connect what works. Replace what doesn&rsquo;t. Build
            what&rsquo;s missing.
          </p>
        </div>
      </Container>
    </section>
  );
}
