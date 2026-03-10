import "./index.css";
import { APITester } from "./APITester";

export function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-amber-300/40 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100">
            Bun + React Starter
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-5xl font-black tracking-tight text-white sm:text-6xl">
              React Query, Tailwind v4, Axios, TypeScript, Zustand, ESLint,
              Prettier
            </h1>
            <p className="max-w-xl text-lg leading-8 text-stone-300">
              Requested stack is wired in and ready. The card on the right
              fetches from Bun routes with React Query and Axios, while local
              counter state is handled by Zustand.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-stone-200">
            <code className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              bun dev
            </code>
            <code className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              bun run lint
            </code>
            <code className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              bun run typecheck
            </code>
          </div>
        </div>
        <APITester />
      </section>
    </main>
  );
}

export default App;
