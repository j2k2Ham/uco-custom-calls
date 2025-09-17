export function Highlights() {
  const items = [
    {
      title: 'Field-Tested Durability',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 6l9 4 9-4-9-4Z" /><path d="m3 6 9 4 9-4" /><path d="M3 10l9 4 9-4" /><path d="M3 14l9 4 9-4" /></svg>
      ),
      body: 'Built to perform in freezing slush, early teal heat, and everything between.'
    },
    {
      title: 'Hand-Tuned Sound',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5" /><path d="M5 18V9" /><path d="M15 18V9" /><path d="M19 18V5" /></svg>
      ),
      body: 'Authentic rasp & crack; every call tested before it leaves the bench.'
    },
    {
      title: 'Custom Craftsmanship',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 7 8.89 5.26a2 2 0 0 0 2.04 0L23 7" /><path d="M3 17l8.89-5.26a2 2 0 0 1 2.04 0L23 17" /><path d="M3 12l8.89 5.26a2 2 0 0 0 2.04 0L23 12" /></svg>
      ),
      body: 'Colorways, engraving, and tuning tailored to how—and where—you hunt.'
    }
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 -mt-12 relative z-10">
      <div className="highlight-grid">
        {items.map(i => (
          <div key={i.title} className="highlight-card">
            <div className="highlight-icon text-brass/90">{i.icon}</div>
            <h3>{i.title}</h3>
            <p>{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
