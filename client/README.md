# Expense Manager – UI

Frontend for the Expense Manager application (React + TypeScript).

---

## 🛠 Tech Stack

- React 18 + Vite
- TypeScript
- Yarn 1.22
- Styled-components (with ThemeProvider)
- React Router
- React Query
- ESLint / Prettier

---

## 🚀 Getting Started

```bash
yarn install
yarn dev
```

---

## 📁 Current Folder Structure

src/
├── App.tsx
├── main.tsx
├── theme/
│   └── index.ts            # ThemeProvider config
├── styled-components.d.ts  # TypeScript theme augmentation
├── components/
│   └── ExpenseCard.tsx
├── pages/
├── features/
├── hooks/
├── types/
├── utils/
└── lib/

---

## ⚙️ Configurations

| Item                               | Status                   |
| ---------------------------------- | ------------------------ |
| ESLint + Prettier                  | ✅ configured             |
| Theme Provider (styled-components) | ✅ added                  |
| Routing                            | ⚠️ pending (coming next) |
| React Query                        | ⚠️ pending               |
| Docker                             | ❌ not added yet          |
| CI / GitHub Workflow               | ❌ not added yet          |

---

## ✅ Available Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `yarn dev`     | Start dev server         |
| `yarn build`   | Build for production     |
| `yarn preview` | Preview production build |


---

## 📌 Roadmap

### 🔹 Phase 1 — Foundation
- [x] Scaffold project (React + Vite + TS + Yarn)
- [x] Set up ESLint / Prettier
- [x] Add styled-components + ThemeProvider
- [x] Define base folder structure
- [ ] Add React Router + layout
- [ ] Add React Query

### 🔹 Phase 2 — Core Features
- [ ] **Expense List Page**
  - [ ] Fetch expenses from backend
  - [ ] Display table
  - [ ] View expense details
- [ ] **Add Expense Page**
  - [ ] Form with validation
  - [ ] Submit to backend
- [ ] **Category Management**
  - [ ] CRUD categories

### 🔹 Phase 3 — Enhancements
- [ ] Dashboard (charts & summaries)
- [ ] Form validation (Zod / Yup)
- [ ] Error handling & toast notifications
- [ ] User settings (e.g. currency, theme)

### 🔹 Phase 4 — Production Readiness
- [ ] Dockerfile for backend + frontend
- [ ] GitHub Actions (build / lint)
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog / GA)
- [ ] Deploy: FE → Vercel  |  BE → AWS / Render
