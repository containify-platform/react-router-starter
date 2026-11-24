import type { Route } from "./+types/home";
import { sql } from "~/db.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router on Containify" },
    { name: "description", content: "A React Router starter with Postgres, deployed on Containify" },
  ];
}

// Runs on the server for every request to this page.
export async function loader() {
  try {
    const [row] = await sql<{ count: number }[]>`
      INSERT INTO visits DEFAULT VALUES RETURNING (SELECT count(*)::int + 1 FROM visits) AS count
    `;
    return { visits: row.count, error: false };
  } catch (err) {
    console.error(err);
    return { visits: 0, error: true };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>React Router on Containify</h1>
      <p>
        Edit <code>app/routes/home.tsx</code> and push to deploy a new version.
      </p>
      {loaderData.error ? (
        <p className="error">Couldn't reach the database. Is DATABASE_URL set, and have the migrations run?</p>
      ) : (
        <p>
          This page has been visited <strong>{loaderData.visits}</strong>{" "}
          {loaderData.visits === 1 ? "time" : "times"}, counted in Postgres.
        </p>
      )}
      <p className="links">
        <a href="https://reactrouter.com/home">React Router docs</a>
        <a href="https://containify.cloud/docs">Containify docs</a>
      </p>
    </main>
  );
}
