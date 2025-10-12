# 🧭 osu! Server List

A **modern monorepo** for managing and displaying private or community osu! servers — built with **Bun**, **TypeScript**, and **TurboRepo** for blazing-fast development and builds.

---

## 📁 Project Structure

```
osu-server-list/
├── apps/
│   ├── crawler/         # Service that scrapes or updates osu! server data
│   └── frontend/        # Web frontend for displaying servers
│
├── packages/
│   └── db/              # Shared database package (Drizzle ORM + schema definitions)
│       ├── src/
│       │   ├── index.ts
│       │   ├── query.ts
│       │   └── schema.ts
│       ├── drizzle.config.ts
│       └── package.json
│
├── .gitignore
├── bunfig.toml
├── LICENSE
├── package.json
├── turbo.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Tech Stack

* **🧠 Language:** TypeScript
* **⚡ Runtime:** [Bun](https://bun.sh/)
* **📦 Monorepo Management:** [Turborepo](https://turbo.build/repo)
* **🗃 Database:** [Drizzle ORM](https://orm.drizzle.team/)
* **🌐 Frontend:** [SvelteKit](https://svelte.dev/)
* **🔍 Crawler:** Custom Bun service for collecting osu! server data

---

## 🧩 Packages

### `packages/db`

Shared Drizzle ORM setup used by all apps in the monorepo.
Includes:

* `schema.ts`: database schema definitions
* `query.ts`: reusable query helpers
* `index.ts`: exports for external use

---

## 🧠 Apps

### `apps/frontend`

Frontend web app displaying osu! servers with sorting, filtering, and details.

### `apps/crawler`

Backend crawler that fetches or updates server info periodically.

---

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/ezppfarm/osu-server-list.git
cd osu-server-list
```

### 2. Install dependencies

Using **Bun**:

```bash
bun install
```

### 3. Run all apps

Use **Turborepo** to start everything in parallel:

```bash
bun run dev
```

Or run individual apps:

```bash
bun run dev --filter=frontend
bun run dev --filter=crawler
```

---

## 🧱 Building

To build all packages and apps:

```bash
bun run build
```

---

## 🐋 Running with Docker

### 1. Generate migrations

You need to generate migrations so drizzle knows what to keep track of and not error. To do that, run:

```bash
bun run db:generate
```

### 2. Running

To run, run:

```bash
docker compose up
```

If you want to run in the background, run:

```bash
docker compose up -d
```

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**.
See the [LICENSE](./LICENSE) file for details.

---

## 🌟 Contributing

Pull requests are welcome!
If you’d like to contribute:

1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Open a PR

---

## 🩵 Acknowledgements

* Powered by [Bun](https://bun.sh) and [Turborepo](https://turbo.build)

---
