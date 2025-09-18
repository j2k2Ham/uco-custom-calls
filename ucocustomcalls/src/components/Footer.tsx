export function Footer() {
  return (
    <footer className="border-t border-camo-light mt-12">
      <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-semibold">UCO Custom Calls</div>
          <p className="text-sky/80 mt-2">Handcrafted duck & goose calls. Made in Pennsylvania.</p>
        </div>
        <ul className="space-y-1">
          <li><a className="hover:text-brass" href="/about">About</a></li>
          <li><a className="hover:text-brass" href="/custom">Custom Calls</a></li>
          <li><a className="hover:text-brass" href="/contact">Contact</a></li>
        </ul>
        <div>
          <div className="font-semibold mb-2">Connect</div>
          <ul className="flex gap-4 items-center" aria-label="Social links">
            <li>
              <a
                href="https://www.facebook.com/Ucoutfitters/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="hover:text-brass inline-flex"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.675 0H1.325A1.327 1.327 0 0 0 0 1.325v21.35C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.41c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.765v2.317h3.587l-.467 3.622h-3.12V24h6.116A1.327 1.327 0 0 0 24 22.675V1.325A1.327 1.327 0 0 0 22.675 0"/></svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/ucocustomcalls/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="hover:text-brass inline-flex"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15a3.5 3.5 0 0 0 0-7Zm5.25-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/></svg>
              </a>
            </li>
            <li>
              <a
                href="mailto:and360900@gmail.com"
                aria-label="Email"
                title="Email"
                className="hover:text-brass inline-flex"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4.75A2.75 2.75 0 0 1 5.75 2h12.5A2.75 2.75 0 0 1 21 4.75v14.5A2.75 2.75 0 0 1 18.25 22H5.75A2.75 2.75 0 0 1 3 19.25V4.75Zm2.75-1.25A1.25 1.25 0 0 0 4.5 4.75v.341l7.5 5.077 7.5-5.077V4.75A1.25 1.25 0 0 0 18.25 3.5H5.75ZM19.5 6.632l-6.93 4.689a.75.75 0 0 1-.84 0L4.5 6.632v12.618c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V6.632Z"/></svg>
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sky/80 col-span-full md:col-span-1 md:col-start-1 md:row-start-2">
          © {new Date().getFullYear()} UCO Custom Calls — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
