export default function CustomPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Custom Calls</h1>
      <p className="mt-3 text-sky">
        Want a specific acrylic colorway or engraving? Tell us what you’re after.
      </p>
      <form method="post" action="/api/contact" className="mt-6 grid gap-4">
        <input required name="name" placeholder="Name" className="bg-camo-light p-3 rounded" />
        <input required type="email" name="email" placeholder="Email" className="bg-camo-light p-3 rounded" />
        <textarea required name="message" rows={6} placeholder="Describe your custom call"
          className="bg-camo-light p-3 rounded" />
        <button className="px-4 py-2 bg-brass text-black rounded-md">Send Inquiry</button>
      </form>
    </section>
  );
}
