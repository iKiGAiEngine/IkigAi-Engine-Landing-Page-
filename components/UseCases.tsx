import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import {
  IconGrid,
  IconLoop,
  IconDocument,
  IconTools,
  IconCompass,
} from "./ui/icons";

const useCases = [
  {
    icon: IconGrid,
    title: "Dashboards & reporting",
    body: "One screen that shows the health of your business at a glance — and the reports you dread building by hand, generated automatically.",
  },
  {
    icon: IconLoop,
    title: "Workflow automation",
    body: "The whole process, from first inquiry to final invoice, connected and flowing instead of stitched together by memory and manual handoffs.",
  },
  {
    icon: IconDocument,
    title: "AI document & data tools",
    body: "Custom tools that read your quotes, emails, and documents and pull out exactly what you need — in seconds, not hours.",
  },
  {
    icon: IconTools,
    title: "Custom internal tools",
    body: "The thing you wish existed but no off-the-shelf software does — built for the way you actually work.",
  },
  {
    icon: IconCompass,
    title: "Operations consulting",
    body: "Sometimes the fix isn't software, it's a smarter process. We'll tell you the truth either way.",
  },
];

export default function UseCases() {
  return (
    <section id="what-we-build" className="bg-cream-dim/60 py-20 sm:py-28">
      <Container>
        <SectionHeading kicker="What we build" align="center" title="What we build for you." />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-line bg-cream p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rust-light text-rust">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-serif text-lg font-medium text-ink">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
