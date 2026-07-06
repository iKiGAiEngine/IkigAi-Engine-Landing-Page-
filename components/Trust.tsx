import Container from "./ui/Container";

export default function Trust() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal font-serif text-xl font-medium text-cream">
            IE
          </span>

          <p className="mt-6 text-sm font-semibold tracking-[0.14em] text-rust uppercase">
            About
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight font-medium sm:text-4xl">
            Built by an operator, not a tech vendor.
          </h2>
        </div>

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            I didn&rsquo;t come from Silicon Valley. I came from the front
            desk and the field — years running operations in hospitality,
            then in construction, where the information is messy, the
            margins are tight, and &ldquo;the system&rdquo; is usually a
            spreadsheet and a lot of remembering.
          </p>
          <p>
            I got tired of flying blind and doing everything by hand, so I
            built tools to fix it for my own work — automations and AI
            systems that now get used every day to estimate, buy out, and
            manage real projects. Ikigai Engine is me doing the same thing
            for businesses like yours.
          </p>
          <p>
            I speak operations, not jargon. I know what it&rsquo;s like to
            be the person holding it all together. And I build things that
            work in the real world — because that&rsquo;s the only place
            I&rsquo;ve ever worked.
          </p>
        </div>
      </Container>
    </section>
  );
}
