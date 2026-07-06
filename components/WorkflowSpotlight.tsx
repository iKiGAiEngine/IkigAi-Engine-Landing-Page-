import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import { IconLoop, IconChat, IconArrowRight } from "./ui/icons";

export default function WorkflowSpotlight() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="Automation + AI"
          title="The busywork doesn't have to be yours."
          body="Every business is full of work that has to happen but doesn't need
            a human — retyping numbers, formatting reports, reading the same
            kinds of documents over and over, sending the same follow-ups.
            That work quietly eats your week and burns out your team."
        />

        <p className="mt-8 text-lg font-medium text-ink">
          We take it off your plate two ways:
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-cream-dim/50 p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rust-light text-rust">
              <IconLoop />
            </span>
            <h3 className="mt-5 font-serif text-xl font-medium text-ink">
              Workflow automation
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              We connect the tools and steps you already use so information
              flows on its own. The handoffs that used to depend on someone
              remembering? Automatic. The report you rebuild every Monday? It
              builds itself. The data you copy between files? It moves
              itself, without the typos.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-cream-dim/50 p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rust-light text-rust">
              <IconChat />
            </span>
            <h3 className="mt-5 font-serif text-xl font-medium text-ink">
              AI integration
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              We bring AI in where it actually helps — reading and
              understanding your documents, quotes, and messages, then
              pulling out the exact information you need. Think of it as a
              tireless assistant that handles the reading, sorting, and
              first-pass work, so your people only touch the parts that need
              real judgment.
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
          You don&rsquo;t need to understand the technology. You just need
          the work done — accurately, and without you in the middle of it.
        </p>

        <a
          href="#audit"
          className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-rust hover:text-rust-dark"
        >
          Curious what we could automate first? That&rsquo;s exactly what
          the free audit shows you.
          <IconArrowRight className="h-4 w-4" />
        </a>
      </Container>
    </section>
  );
}
