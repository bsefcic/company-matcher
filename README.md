# Company‑Matcher API 🚀

👋 **Welcome!** This public repository contains the solution I built for the **Veridion full‑stack coding challenge** (June 2025).  It showcases a complete pipeline that

1. **Crawls** a list of \~1 000 company websites,
2. **Extracts** phone numbers & social‑media profiles,
3. **Normalises & stores** them in PostgreSQL,
4. **Indexes** the data in Elasticsearch 8, and
5. Serves a \`/match\` endpoint that returns the *single best* company profile for any combination of
   - **name**
   - **website**
   - **phone number**
   - **social media URL**.

> **Match‑rate on Veridion’s test file:** **100 %** (32 / 32 rows) 🎉

---

## 🗺 Architecture

```
  CSV (websites)              CSV (company names)
        │                             │
        ▼                             ▼
┌──────────────────┐        ┌─────────────────────┐
│  website_queue   │◀────── │  seed:companies CLI │
│  (Postgres)      │        └─────────────────────┘
│  status: PENDING │
└────────┬─────────┘
         │ 1️⃣ cron picks 30 URLs/min
         ▼
┌──────────────────────┐   2️⃣ Playwright cluster
│  Scraper Runner      │──────────────┐
│ + extract.utils      │              │
└──────────────────────┘              ▼
                          3️⃣ structured payload (phones/socials)
                                      │
                                      ▼
          ┌───────────────────────────────────────────┐
          │  companies • phones • socials (Postgres)  │
          └────────────────┬──────────────────────────┘
                           │ 4️⃣ bulk sync
                           ▼
            ┌───────────────────────────┐
            │  companies_v1 index (ES8) │
            └────────────┬──────────────┘
                         │ 5️⃣ REST query
                         ▼
            POST /match  ➜  best company + score
```

- **NestJS v10 + TypeORM v0.3 (PostgreSQL)**  – domain entities & CLI tasks.
- **Playwright + playwright‑cluster**  – parallel headless scraping (4 contexts).
- **libphonenumber‑js**  – E.164 normalisation.
- **Elasticsearch 8**  – fuzzy‐name search + exact keyword filters.
- **Jest**  – extractor unit tests.

---

## 🏃 Quick start (Docker Compose)

```bash
# 1. clone & install
pnpm i               # or npm i / yarn install

# 2. spin up DB + ES
docker compose up -d postgres elasticsearch

# 3. import CSVs ➜ Postgres ➜ Elasticsearch
npm run seed:websites  data/sample-websites.csv
npm run seed:companies data/sample-websites-company-names.csv
npm run sync:es

# 4. launch API & crawler
npm run start:dev          # starts Nest app (port 3000) + cron crawler

# 5. test a match
curl -s -X POST http://localhost:3000/match \
  -H 'Content-Type: application/json' \
  -d '{"name":"DoLee Rentals","phone":"+12294369620"}' | jq

# 6. evaluate full match‑rate
npm run eval:match         # parses API-input-sample.csv ➜ 100 % ✅
```

---

## 🧩 Key scripts

| Command                | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `seed:websites  <csv>` | Fill **website\_queue** with PENDING rows                    |
| `seed:companies <csv>` | Upsert companies & merge phones/socials from scraper payload |
| `sync:es`              | (Re)build *companies\_v1* index & bulk‑load data             |
| `eval:match`           | Print match‑rate on Veridion’s *API-input-sample.csv*        |
| `crawler` (script)     | Run only the Playwright worker (no HTTP)                     |

---

## 📝 Challenge brief (high‑level)

> **Task.** Extract phone numbers, social media links and addresses from a list of \~1k websites, merge with a second CSV of company names, and expose an API that returns the best company profile given any subset of name/website/phone/facebook.
>
> **Scoring.** *Match‑rate* = #API rows correctly matched.  Bonus for *accuracy metric* & scalability (≤ 10 minutes for full crawl).

This repository delivers:

- **Scalable crawler** – 4 headless contexts; 1 k sites crawl in ≈ 8 min locally.
- **100 % match‑rate** on the provided inputs (see `eval:match`).
- **Postgres + Elasticsearch** – same stack Veridion mentions in the brief.
- **Docker compose** so reviewers can run everything in two commands.

---

## 📜 Licence

MIT – share, fork, improve.  Credits appreciated.

---

> Built with ☕, a stubborn regex obsession, and lots of retries.  Enjoy!
