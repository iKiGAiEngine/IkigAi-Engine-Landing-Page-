import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

const rows = [
  {
    before: "Numbers scattered across spreadsheets, emails, and your head",
    after: "One clear view of the whole business",
  },
  {
    before: "Hours spent rebuilding the same reports by hand",
    after: "Reports that build themselves",
  },
  {
    before: "Reading every document and quote yourself",
    after: "AI reads them and hands you the answer",
  },
  {
    before: "Errors from copying data between files",
    after: "Information flows automatically, error-free",
  },
  {
    before: '"I think we made money on that job…"',
    after: '"Here’s exactly what we made — and why"',
  },
  {
    before: "Buried in the day-to-day, no time to plan",
    after: "Time and clarity to actually run the business",
  },
];

export default function BeforeAfter() {
  return (
    <section id="before-after" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="Before & after"
          align="center"
          title="The difference clarity and automation make."
        />

        <div className="mt-14 overflow-hidden rounded-3xl border border-line">
          <div className="grid grid-cols-2 border-b border-line bg-cream-dim/60 text-sm font-semibold tracking-wide uppercase">
            <div className="px-6 py-4 text-ink-faint">Before — messy &amp; manual</div>
            <div className="px-6 py-4 text-teal">After — clear &amp; automated</div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.before}
              className={`grid grid-cols-2 ${i !== rows.length - 1 ? "border-b border-line" : ""}`}
            >
              <div className="border-r border-line px-6 py-5 text-sm leading-relaxed text-ink-soft sm:text-base">
                {row.before}
              </div>
              <div className="bg-teal-light/40 px-6 py-5 text-sm leading-relaxed font-medium text-teal-dark sm:text-base">
                {row.after}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
