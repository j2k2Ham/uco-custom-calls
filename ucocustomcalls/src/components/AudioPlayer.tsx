"use client";
export function AudioPlayer({ src, label }: Readonly<{ src: string; label: string }>) {
  return (
    <div className="rounded border border-camo-light p-3">
      <div className="text-sm mb-1">{label}</div>
      <audio controls preload="none" className="w-full">
        <source src={src} type="audio/mpeg" />
        <track kind="captions" src="/captions/blank.vtt" label="English" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
