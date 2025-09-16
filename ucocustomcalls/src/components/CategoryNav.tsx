"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/products";

export function CategoryNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Product Categories" className="mb-6 overflow-x-auto">
      <ul className="flex gap-3 min-w-max">
        {CATEGORIES.map(c => {
          const href = `/category/${c.handle}`;
          const active = pathname === href;
          return (
            <li key={c.handle}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "px-3 py-1 rounded-md text-sm whitespace-nowrap transition-colors border",
                  active ? "bg-brass text-black border-brass" : "border-camo-light hover:bg-camo-light"
                ].join(" ")}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}