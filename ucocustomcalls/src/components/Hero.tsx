"use client";
import Link from "next/link";
import Image from 'next/image';
import React from 'react';

export function Hero() {
  const [loaded, setLoaded] = React.useState(false);
  const [showAmbient, setShowAmbient] = React.useState(false);

  React.useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setShowAmbient(true), 400);
      return () => clearTimeout(t);
    }
  }, [loaded]);

  return (
    <section className="relative h-[60vh] min-h-[460px] flex items-stretch overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/images/waterfowl-lab-splash-page.jpg"
          alt="Marsh waterfowl habitat"
          fill
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M+BFwADJgGI1CyMgQAAAABJRU5ErkJggg=="
          className={`object-cover object-center transition-transform duration-[3500ms] ease-out ${loaded ? 'scale-105' : 'scale-[1.18]'}`}
          sizes="100vw"
          onLoad={() => setLoaded(true)}
        />
        {!loaded && <div className="absolute inset-0 shimmer" aria-hidden />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" aria-hidden />
      {showAmbient && <div className="fog-layer pointer-events-none" aria-hidden />}
      {showAmbient && <div className="birds-layer pointer-events-none" aria-hidden />}
      <div className="relative z-10 flex items-center w-full">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 fade-in">
          <h1 className="hero-heading text-5xl md:text-6xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
            Handcrafted Duck & Goose Calls
          </h1>
          <p className="mt-4 max-w-xl text-sky text-lg md:text-xl">
            Tuned by waterfowlers. Field-tested in harsh Pennsylvania winters.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/category/duck" className="px-5 py-2.5 bg-brass text-black rounded-md shadow-sm shadow-black/40 hover:shadow-md font-medium">Shop Duck</Link>
            <Link href="/category/goose" className="px-5 py-2.5 border border-brass rounded-md font-medium hover:bg-brass/10">Shop Goose</Link>
            <Link href="/custom" className="px-5 py-2.5 border border-camo-light rounded-md font-medium hover:bg-camo-light/60">Custom Orders</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
