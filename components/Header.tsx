"use client";

import { useState } from "react";
import Container from "./ui/Container";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#what-we-build", label: "What we build" },
  { href: "#before-after", label: "Before & after" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/90 backdrop-blur-sm">
      <Container className="flex h-18 items-center justify-between py-4">
        <a href="#top" className="font-serif text-xl font-medium tracking-tight text-ink">
          Ikigai Engine
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#audit"
          className="hidden rounded-full bg-rust px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-rust-dark md:inline-flex"
        >
          Book free audit
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <div className="border-t border-line/70 bg-cream md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-ink/[0.03] hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#audit"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-rust px-5 py-3 text-center text-sm font-semibold text-cream"
            >
              Book free audit
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
