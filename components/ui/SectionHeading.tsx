import type { ReactNode } from "react";

export default function SectionHeading({
  kicker,
  title,
  body,
  align = "left",
  tone = "ink",
}: {
  kicker?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "cream";
}) {
  const alignClass = align === "center" ? "mx-auto text-center" : "text-left";
  const kickerColor = tone === "cream" ? "text-cream/70" : "text-rust";
  const bodyColor = tone === "cream" ? "text-cream/80" : "text-ink-soft";

  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {kicker && (
        <p
          className={`mb-3 text-sm font-semibold tracking-[0.14em] uppercase ${kickerColor}`}
        >
          {kicker}
        </p>
      )}
      <h2 className="font-serif text-3xl leading-tight font-medium sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {body && (
        <p className={`mt-5 text-lg leading-relaxed ${bodyColor}`}>{body}</p>
      )}
    </div>
  );
}
