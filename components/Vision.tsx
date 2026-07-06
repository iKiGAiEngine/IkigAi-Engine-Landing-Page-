import Container from "./ui/Container";

export default function Vision() {
  return (
    <section className="bg-teal py-20 text-cream sm:py-28">
      <Container className="max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold tracking-[0.14em] text-cream/60 uppercase">
          See into your business
        </p>
        <h2 className="font-serif text-3xl leading-tight font-medium sm:text-4xl md:text-[2.75rem]">
          First, a lens for your business.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/80">
          Right now your business is a black box — even to you. You can feel
          when something&rsquo;s off, but you can&rsquo;t always point to{" "}
          <em>what</em> or <em>why</em>.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-cream/80">
          Ikigai Engine is the lens that lets you look inside. Where your
          time actually goes. Where money quietly leaks out. Which jobs make
          you money and which ones cost you. Which steps slow everything
          down.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-cream/80">
          Once you can see it, you can fix it — and once you can see it, we
          can automate it. That&rsquo;s the whole idea.
        </p>

        <p className="mt-10 font-serif text-xl text-cream sm:text-2xl">
          &ldquo;Clarity first. Then everything gets easier.&rdquo;
        </p>
      </Container>
    </section>
  );
}
