export function Footer() {
  return (
    <footer className="border-t border-camo-light mt-12">
      <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold">UCO Custom Calls</div>
          <p className="text-sky/80 mt-2">Handcrafted duck & goose calls. Made in Pennsylvania.</p>
        </div>
        <ul className="space-y-1">
          <li><a className="hover:text-brass" href="/about">About</a></li>
          <li><a className="hover:text-brass" href="/custom">Custom Calls</a></li>
          <li><a className="hover:text-brass" href="/contact">Contact</a></li>
        </ul>
        <div className="text-sky/80">
          © {new Date().getFullYear()} UCO Custom Calls — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
