// API de PratTasques. Totes les rutes comencen per /api/.
// La resta d'adreces (/, /about...) les serveix Cloudflare
// directament amb els fitxers de React.

interface Tasca {
  id: number;
  titol: string;
  feta: number;
  creada: string;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const metode = request.method;

    // GET /api/tasques -> llista de tasques
    if (url.pathname === "/api/tasques" && metode === "GET") {
      const { results } = await env.DB
        .prepare("SELECT * FROM tasques ORDER BY feta, id DESC")
        .all<Tasca>();
      return Response.json(results);
    }

    // POST /api/tasques -> crea una tasca nova
    if (url.pathname === "/api/tasques" && metode === "POST") {
      const dades = await request
        .json<{ titol?: string }>()
        .catch(() => ({ titol: "" }));
      const titol = (dades.titol ?? "").trim();
      if (titol.length === 0 || titol.length > 100) {
        return Response.json(
          { error: "El títol ha de tenir entre 1 i 100 caràcters" },
          { status: 400 },
        );
      }
      const tasca = await env.DB
        .prepare("INSERT INTO tasques (titol) VALUES (?) RETURNING *")
        .bind(titol)
        .first<Tasca>();
      return Response.json(tasca, { status: 201 });
    }

    // PATCH i DELETE /api/tasques/:id
    const coincidencia = url.pathname.match(/^\/api\/tasques\/(\d+)$/);
    if (coincidencia) {
      const id = Number(coincidencia[1]);

      if (metode === "PATCH") {
        const tasca = await env.DB
          .prepare("UPDATE tasques SET feta = 1 - feta WHERE id = ? RETURNING *")
          .bind(id)
          .first<Tasca>();
        return tasca
          ? Response.json(tasca)
          : Response.json({ error: "No existeix" }, { status: 404 });
      }

      if (metode === "DELETE") {
        const resultat = await env.DB
          .prepare("DELETE FROM tasques WHERE id = ?")
          .bind(id)
          .run();
        return resultat.meta.changes > 0
          ? new Response(null, { status: 204 })
          : Response.json({ error: "No existeix" }, { status: 404 });
      }
    }

    return Response.json({ error: "Ruta no trobada" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
