export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-white/60">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} ShahiPosh — Wear Royalty.</p>
        <div className="flex gap-4">
          <a href="https://instagram.com" target="_blank">Instagram</a>
          <a href="https://facebook.com" target="_blank">Facebook</a>
          <a href="https://x.com" target="_blank">X</a>
        </div>
      </div>
    </footer>
  );
}
