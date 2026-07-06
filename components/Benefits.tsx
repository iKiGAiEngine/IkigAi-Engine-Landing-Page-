import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import { IconClock, IconCheck, IconTrendUp, IconTarget } from "./ui/icons";

const benefits = [
  {
    icon: IconClock,
    title: "Save time",
    body: "The reports, the copy-paste, the reading, the follow-ups — automated. Hours back in your week, every week.",
  },
  {
    icon: IconCheck,
    title: "Reduce errors",
    body: "When information flows automatically instead of being retyped, the mistakes stop. No more tracking down which version is right.",
  },
  {
    icon: IconTrendUp,
    title: "Improve profits",
    body: "When you can see which work actually makes money — and stop spending labor on tasks a system can do — your margins move in the right direction.",
  },
  {
    icon: IconTarget,
    title: "Gain control",
    body: "Stop reacting. Start running the business with a clear view of what's happening and systems working in the background.",
  },
];

export default function Benefits() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading kicker="Benefits" align="center" title="What changes for you." />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-line p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-light text-teal">
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
