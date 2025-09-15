import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-[url('/images/hero-marsh.jpg')] bg-cover bg-center">
      <div className="bg-black/50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Handcrafted Duck & Goose Calls
          </h1>
          <p className="mt-3 max-w-xl text-sky">
            Tuned by waterfowlers, field-tested in Pennsylvania winters.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/category/duck" className="px-4 py-2 bg-brass text-black rounded-md">Shop Duck</Link>
            <Link href="/category/goose" className="px-4 py-2 border border-brass rounded-md">Shop Goose</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
