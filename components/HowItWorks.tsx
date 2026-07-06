import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import { IconCompass, IconLoop, IconChat } from "./ui/icons";

const beats = [
  {
    icon: IconCompass,
    label: "Beat 1",
    title: "See it.",
    body: "No rip-and-replace. We map how you actually work today and pull your scattered information into one clear place. For the first time, you can see the whole business at a glance.",
  },
  {
    icon: IconLoop,
    label: "Beat 2",
    title: "Automate it.",
    body: "The repetitive tasks you do by hand — data entry, reports, follow-ups, moving files around — we connect and automate. The busywork starts to disappear, and the errors go with it.",
  },
  {
    icon: IconChat,
    label: "Beat 3",
    title: "Let AI handle the heavy lifting.",
    body: "We add AI tools that read your documents, quotes, and emails and pull out exactly what you need in seconds. Work that used to eat your day gets done while you focus on the decisions only you can make.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker="How it works"
          align="center"
          title="Three beats: see your business → automate the busywork → let AI do the heavy lifting."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {beats.map(({ icon: Icon, label, title, body }, i) => (
            <div key={title} className="relative flex flex-col gap-4 rounded-3xl border border-line bg-cream-dim/50 p-8">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rust-light text-rust">
                  <Icon />
                </span>
                <span className="text-sm font-semibold text-ink-faint">{label}</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-ink">{title}</h3>
              <p className="text-base leading-relaxed text-ink-soft">{body}</p>

              {i < beats.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-1/2 -right-4 hidden h-px w-8 -translate-y-1/2 border-t border-dashed border-ink/20 lg:block"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-line bg-teal px-8 py-8 text-center sm:px-12">
          <p className="text-sm font-semibold tracking-[0.14em] text-cream/60 uppercase">
            The result
          </p>
          <p className="mx-auto mt-3 max-w-2xl font-serif text-xl leading-snug text-cream sm:text-2xl">
            You stop guessing and stop grinding. You run the business with a
            clear view and systems doing the work behind you.
          </p>
        </div>
      </Container>
    </section>
  );
}
