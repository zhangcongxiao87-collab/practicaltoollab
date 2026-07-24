export default function Home() {
  const tools = [
    {
      name: "JSON Formatter",
      description: "Format, validate, and read JSON more easily.",
    },
    {
      name: "Password Generator",
      description: "Create strong passwords in a few seconds.",
    },
    {
      name: "Markdown Converter",
      description: "Turn Markdown into clean, shareable content.",
    },
    {
      name: "AI Prompt Generator",
      description: "Build clearer prompts for everyday AI tasks.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
          Practical Tool Lab
        </p>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          潇&amp;美
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
          Free online tools that help you solve everyday tasks quickly, without
          unnecessary complexity.
        </p>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <article
              key={tool.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p className="mt-2 text-slate-400">{tool.description}</p>
              <p className="mt-5 text-sm font-medium text-emerald-400">
                Coming soon
              </p>
            </article>
          ))}
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-slate-500">
          © {new Date().getFullYear()} Practical Tool Lab
        </footer>
      </main>
    </div>
  );
}
