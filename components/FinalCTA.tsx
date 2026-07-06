import Container from "./ui/Container";
import Button from "./ui/Button";

export default function FinalCTA() {
  return (
    <section id="audit" className="py-20 sm:py-28">
      <Container>
        <div className="rounded-[2.5rem] bg-teal px-8 py-16 text-center text-cream sm:px-16">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight font-medium sm:text-4xl md:text-[2.75rem]">
            Let&rsquo;s see what&rsquo;s hiding in your business — and what
            we can automate first.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/80">
            Start with a free operations audit. In 30 minutes, we&rsquo;ll
            find the spots where you&rsquo;re losing time, repeating
            yourself, or guessing when you should know — and point to the
            work we can take off your plate first. No pressure, no jargon —
            just a clear picture of what&rsquo;s possible.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="#audit" variant="inverse">
              Book your free audit
            </Button>
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <span className="text-sm text-cream/70">
                Prefer to talk it through first?
              </span>
              <a
                href="#audit"
                className="text-base font-semibold text-cream underline underline-offset-4 hover:text-cream/80"
              >
                Schedule a consult
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
