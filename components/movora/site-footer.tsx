export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-foreground">MOVORA</p>
        <p>Mobilitätsqualität transparent und vergleichbar.</p>
        <a href="#top" className="hover:text-foreground">
          Nach oben
        </a>
      </div>
    </footer>
  );
}
