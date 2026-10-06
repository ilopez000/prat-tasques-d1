import { useEffect, useState } from "react";

interface Tasca {
  id: number;
  titol: string;
  feta: number;
  creada: string;
}

export default function App() {
  const [tasques, setTasques] = useState<Tasca[]>([]);
  const [titol, setTitol] = useState("");
  const [error, setError] = useState("");

  async function carrega() {
    const resposta = await fetch("/api/tasques");
    setTasques(await resposta.json());
  }

  // En obrir la pàgina, demanem les tasques a l'API
  useEffect(() => {
    fetch("/api/tasques")
      .then((resposta) => resposta.json())
      .then(setTasques);
  }, []);

  async function afegeix(e: React.FormEvent) {
    e.preventDefault();
    const resposta = await fetch("/api/tasques", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titol }),
    });
    if (!resposta.ok) {
      setError((await resposta.json()).error);
      return;
    }
    setError("");
    setTitol("");
    carrega();
  }

  async function canviaEstat(id: number) {
    await fetch(`/api/tasques/${id}`, { method: "PATCH" });
    carrega();
  }

  async function esborra(id: number) {
    await fetch(`/api/tasques/${id}`, { method: "DELETE" });
    carrega();
  }

  const pendents = tasques.filter((t) => t.feta === 0).length;

  return (
    <main>
      <h1>PratTasques</h1>
      <p className="subtitol">React + Cloudflare Workers + D1 (SQLite)</p>

      <form onSubmit={afegeix}>
        <input
          value={titol}
          onChange={(e) => setTitol(e.target.value)}
          placeholder="Què has de fer?"
          aria-label="Títol de la tasca"
        />
        <button type="submit">Afegeix</button>
      </form>
      {error && <p className="error">{error}</p>}

      <p className="comptador">{pendents} pendents de {tasques.length}</p>

      <ul>
        {tasques.map((t) => (
          <li key={t.id} className={t.feta ? "feta" : ""}>
            <label>
              <input type="checkbox" checked={t.feta === 1} onChange={() => canviaEstat(t.id)} />
              {t.titol}
            </label>
            <button className="esborra" onClick={() => esborra(t.id)} aria-label={`Esborra ${t.titol}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
