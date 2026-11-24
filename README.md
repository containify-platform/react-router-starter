# React Router starter

[![Deploy on Containify](https://containify.cloud/deploy-button.svg)](https://containify.cloud/templates/react-router)

A minimal [React Router](https://reactrouter.com/) app in framework mode (the successor to Remix),
server-rendered with `react-router-serve`, with Postgres, ready to deploy on
[Containify](https://containify.cloud).

- `app/routes/home.tsx`: a home page whose loader counts visits in Postgres
- `app/routes/health.ts`: `GET /health`, the health check (a resource route)
- `app/db.server.ts`: a [postgres.js](https://github.com/porsager/postgres) client reading `DATABASE_URL`
- `migrations/*.sql` and `scripts/migrate.mjs`: plain SQL migrations, applied once each in name order
- `Dockerfile`: a multi-stage build with production dependencies only, running as a non-root user

## Run locally

You need Node.js 24 and a Postgres database.

```bash
npm install
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
node scripts/migrate.mjs
npm run dev
```

Open http://localhost:5173.

## Deploy on Containify

[![Deploy on Containify](https://containify.cloud/deploy-button.svg)](https://containify.cloud/templates/react-router)

One click deploys it on [Containify](https://containify.cloud). The [template page](https://containify.cloud/templates/react-router) shows what it creates, and passwords, connection strings and the HTTPS address are filled in for you.

Deploy the **React Router starter** template from the Containify catalogue. It adds this app,
built from its Dockerfile, and a private Postgres database, with `DATABASE_URL` already set and
`node scripts/migrate.mjs` as the pre-deploy command, so migrations run before each release
takes traffic.

To deploy your own copy, fork or copy this repository, then add it to a project as a
**Git Repository** app with an HTTP endpoint on port `3000`, a health check on `/health`, and
`DATABASE_URL` set to `{{ "Postgres".DATABASE_URL }}`.

`react-router-serve` reads `HOST` and `PORT`. Containify sets `HOST=::`, so it listens on IPv6
and IPv4; the Dockerfile sets `PORT=3000`, the port the endpoint points at.

## License

MIT

---

Made by [Containify](https://containify.cloud): deploy apps, databases and workers from a Git repo or an image, with per-second billing. [Docs](https://containify.cloud/docs) · [Templates](https://containify.cloud/templates)
