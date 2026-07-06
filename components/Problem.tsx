import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import { IconCheck } from "./ui/icons";

const items = [
  "Rebuilding the same report by hand, every week",
  "Copying the same numbers between files (and praying you didn't fat-finger one)",
  "Reading every quote, email, and document yourself because no one else can",
  'Chasing answers to simple questions like "Are we actually making money on this?"',
  "Doing the work instead of running the business — because there's no time left to think",
];

export default function Problem() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="The problem"
          title={
            <>
              You&rsquo;re running the business. But can you actually{" "}
              <em>see</em> it — and how much of it are you doing by hand?
            </>
          }
          body="Most owners are flying half-blind and buried in busywork at the same
            time. The numbers live in one spreadsheet, the orders in another,
            the real story in your inbox — and the rest is just in your
            head."
        />

        <p className="mt-10 text-lg font-medium text-ink">So you spend your days:</p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-line bg-cream-dim/60 p-5"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rust-light text-rust">
                <IconCheck className="h-3.5 w-3.5" />
              </span>
              <span className="text-base leading-snug text-ink-soft">{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink-soft">
          It&rsquo;s not that you&rsquo;re disorganized. It&rsquo;s that
          nobody ever built you the tools to <em>see</em> clearly or the
          systems to stop doing it all manually.{" "}
          <span className="font-semibold text-ink">
            That&rsquo;s both things we fix.
          </span>
        </p>
      </Container>
    </section>
  );
}
