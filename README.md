# Inbox Ledger

> Track your spending by forwarding receipts to an email address.

Inbox Ledger is a personal expense tracker that runs on email. Forward payment emails (bank transfer notices, QRIS payment confirmations, e-wallet receipts, marketplace orders) to a dedicated address. Inbox Ledger parses each one into a transaction, puts it in a category, and sends a push notification when you go over a budget.

I'm building it to learn **Redis** through real use cases, with a **Java / Spring Boot** backend on **Firebase** and **Cloudflare** infrastructure.

🚧 **Status:** Work in progress. See [Roadmap](#roadmap).

---

## Features

- 📧 **Email ingestion**: forward receipts to `receipts@` and they become transactions
- 🧾 **Sender-specific parsers**: banks, e-wallets, and marketplaces each get their own parser
- 🔁 **Idempotent processing**: forwarding the same receipt twice never creates two transactions
- 🗂️ **Auto-categorization** of merchants into spending categories
- 💰 **Budgets & alerts**: push notifications when a category nears its limit
- 📊 **Live dashboard**: new transactions show up in real time
- 📬 **Weekly summary email** sent from the project's own domain

## Architecture

```mermaid
flowchart LR
    U[User forwards receipt] --> M[receipts@ domain]
    M --> EW[Cloudflare Email Worker]
    EW -->|POST /ingest| T[Cloudflare Tunnel]
    T --> API[Spring Boot API]
    API -->|XADD| RS[(Redis Stream)]
    RS -->|consumer group| W[Parser Workers]
    W --> DB[(Database)]
    W --> R2[(Cloudflare R2<br/>raw emails & attachments)]
    W -->|HINCRBY / ZINCRBY| RC[(Redis counters<br/>& rankings)]
    W -->|budget exceeded| FCM[Firebase Cloud Messaging]
    FE[Frontend<br/>Firebase Hosting] -->|Firebase ID token| T
    API -->|SSE / Pub/Sub| FE
```

| Hostname | Purpose |
|---|---|
| `app.<domain>` | Frontend (Firebase Hosting) |
| `api.<domain>` | Backend API (Spring Boot behind Cloudflare Tunnel) |
| `receipts@<domain>` | Inbound receipt address (Cloudflare Email Routing) |

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security |
| Cache / Queue | Redis (Streams, Hashes, Sorted Sets, Pub/Sub) |
| Auth | Firebase Authentication (Google sign-in), verified server-side |
| Notifications | Firebase Cloud Messaging (FCM) |
| Frontend hosting | Firebase Hosting |
| Edge & networking | Cloudflare DNS, Tunnel, Turnstile, WAF |
| Email | Cloudflare Email Routing + Email Workers; SPF / DKIM / DMARC |
| Object storage | Cloudflare R2 |

## Redis Patterns Used

The project uses each of these Redis features to solve a real problem:

| Pattern | Redis feature | Used for |
|---|---|---|
| Async job queue | **Streams + consumer groups** (`XADD`, `XREADGROUP`, `XACK`) | The ingest webhook returns immediately; workers parse emails in the background |
| Failure recovery | `XPENDING`, `XCLAIM` | Recovering messages from crashed workers |
| Dead-letter queue | Separate stream | Emails that fail to parse, kept for inspection and replay |
| Idempotency | `SET key NX EX` | Deduplicating forwarded receipts and retried webhooks |
| Running totals | **Hashes** + `HINCRBY` | O(1) per-category monthly spend for budget checks |
| Rankings | **Sorted sets** (`ZINCRBY`, `ZREVRANGE`) | Top merchants and biggest spending days |
| Real-time updates | **Pub/Sub** | Pushing new transactions to the dashboard over SSE |
| Caching | `GET`/`SET` with TTL + explicit eviction | Monthly reports, invalidated when a new transaction lands in that month |
| Distributed lock | `SET NX PX` + Lua release | Making sure scheduled jobs (weekly summary) run exactly once |
| Rate limiting | Token bucket (Lua) | Protecting the ingest endpoint |

## Roadmap

- [ ] **Phase 1: Foundation**
  - [x] Domain moved to Cloudflare DNS
  - [ ] Frontend on `app.` via Firebase Hosting
  - [ ] Backend on `api.` via Cloudflare Tunnel
  - [ ] Firebase Auth → Spring Security token verification
- [ ] **Phase 2: Ingestion pipeline**
  - [ ] Cloudflare Email Routing + Email Worker
  - [ ] `POST /ingest` → Redis Stream → worker
  - [ ] Raw email storage in R2
- [ ] **Phase 3: Parsing**
  - [ ] Parsers for 2–3 real senders
  - [ ] Idempotency keys
  - [ ] Dead-letter stream + replay
- [ ] **Phase 4: Budgets**
  - [ ] Categories and budgets
  - [ ] Redis counters + FCM alerts
- [ ] **Phase 5: Polish**
  - [ ] Live dashboard (SSE)
  - [ ] Weekly summary email
  - [ ] Metrics: stream lag, parse failure rate

## Getting Started

> Setup instructions will grow as each phase lands.

### Prerequisites

- Java 21+
- Maven or Gradle
- Docker (for local Redis)
- Node.js 18+ (for the Firebase CLI)
- A Firebase project and a Cloudflare account

### Run Redis locally

```bash
docker run -d --name redis -p 6379:6379 redis:7
```

### Run the backend

```bash
cd backend
./mvnw spring-boot:run
# Health check
curl http://localhost:8080/actuator/health
```

### Deploy the frontend

```bash
cd frontend
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

### Configuration

Secrets are never committed. Provide them through environment variables:

| Variable | Description |
|---|---|
| `REDIS_URL` | Redis connection string, e.g. `redis://localhost:6379` |
| `FIREBASE_PROJECT_ID` | Firebase project used to verify ID tokens |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the Firebase service account JSON |
| `INGEST_SHARED_SECRET` | Shared secret between the Email Worker and `/ingest` |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Cloudflare R2 credentials |

## Project Structure (planned)

```
inbox-ledger/
├── backend/            # Spring Boot API + workers
├── email-worker/       # Cloudflare Email Worker
├── frontend/           # Web app (Firebase Hosting)
└── docs/               # Architecture notes and runbooks
```

## Security Notes

- The ingest endpoint only accepts requests signed with a shared secret from the Email Worker.
- Every API request is authenticated with a Firebase ID token verified on the server.
- Raw emails can contain personal financial data. They're stored privately in R2 and never exposed publicly.
- No secrets, service-account files, or `.env` files are committed (see `.gitignore`).

## License

MIT. See [LICENSE](LICENSE).
