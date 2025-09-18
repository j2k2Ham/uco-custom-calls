export function Badge({ label }: { label: string }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full border border-brass/60 bg-brass/15 text-brass font-medium tracking-wide whitespace-nowrap group-hover:border-brass group-hover:bg-brass/25 transition-colors duration-300">
      {label}
    </span>
  );
}
