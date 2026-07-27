import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";

type Todo = {
  id: number;
  name: string;
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase.from("todos").select();
        if (error) throw error;
        setTodos(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-display text-4xl font-black tracking-tight text-gradient-cyber mb-8">
              Todos from Supabase
            </h1>

            {loading && (
              <p className="text-slate-400">Loading todos...</p>
            )}

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-xs mt-3 text-red-400/80">
                  Make sure the "todos" table exists in your Supabase project
                  and has RLS policies that allow read access.
                </p>
              </div>
            )}

            {!loading && !error && (
              <ul className="space-y-3">
                {todos.length === 0 ? (
                  <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-slate-400">
                    No todos yet. Add some to your Supabase "todos" table!
                  </li>
                ) : (
                  todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 ring-1 backdrop-blur-xl transition-all hover:border-neon-cyan/30 hover:ring-neon-cyan/20"
                    >
                      <span className="text-lg font-medium">{todo.name}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
