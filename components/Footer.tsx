import Container from "./ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <a href="#top" className="font-serif text-lg font-medium text-ink">
          Ikigai Engine
        </a>
        <p className="text-sm text-ink-faint">
          &copy; {new Date().getFullYear()} Ikigai Engine. Clarity first.
          Then everything gets easier.
        </p>
      </Container>
    </footer>
  );
}
