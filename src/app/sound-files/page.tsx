import sounds from "@/data/sound-files.json";

export default function SoundFilesPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Sound Files</h1>
      <ul className="space-y-4">
        {sounds.map(s => (
          <li key={s.src} className="rounded border border-camo-light p-3">
            <div className="font-medium">{s.title}</div>
            <audio controls preload="none" className="w-full">
              <source src={s.src} type="audio/mpeg" />
            </audio>
          </li>
        ))}
      </ul>
    </section>
  );
}
