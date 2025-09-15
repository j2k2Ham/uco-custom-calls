import Link from "next/link";

export function Nav() {
  const links = [
    { href: "/category/duck", label: "Duck Calls" },
    { href: "/category/goose", label: "Goose Calls" },
    { href: "/category/lanyards", label: "Paracord Lanyards" },
    { href: "/sound-files", label: "Sound Files" },
    { href: "/custom", label: "Custom Calls" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];
  return (
    <nav aria-label="Primary">
      <ul className="hidden md:flex gap-6">
        {links.map(l => (
          <li key={l.href}>
            <Link className="hover:text-brass" href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
