import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getHello } from "@/lib/api";
import { useCounterStore } from "@/store/counter-store";

export function APITester() {
  const [name, setName] = useState("codex");
  const { count, decrement, increment, reset } = useCounterStore();
  const helloQuery = useQuery({
    queryKey: ["hello", name],
    queryFn: () => getHello(name.trim() || undefined),
  });

  return (
    <section className="rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Data layer
          </p>
          <h2 className="text-2xl font-bold text-white">
            Runtime stack smoke test
          </h2>
          <p className="text-sm leading-6 text-stone-300">
            Query state comes from React Query, requests go through Axios, and
            counter state is stored in Zustand.
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-stone-200">
            Name parameter
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-200/70"
            placeholder="Leave blank to call /api/hello"
          />
        </label>

        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">
            Axios + React Query
          </p>
          <div className="mt-3 min-h-16 text-sm text-emerald-50">
            {helloQuery.isPending && <p>Loading response...</p>}
            {helloQuery.isError && <p>{helloQuery.error.message}</p>}
            {helloQuery.data && (
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs">
                {JSON.stringify(helloQuery.data, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-300">
            Zustand store
          </p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-4xl font-black text-white">{count}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={decrement}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
              >
                -
              </button>
              <button
                type="button"
                onClick={increment}
                className="rounded-xl border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-amber-50 transition hover:bg-amber-200/20"
              >
                +
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
