# Startup Checklist for Expense Manager (Frontend + Backend)

## ✅ Phase 1 — Planning & Architecture

* [ ] Define core functional requirements
* [ ] Define stretch features and roadmap
* [ ] Decide on architecture (frontend + backend structure)
* [ ] Choose tech stack (React, Vite, Yarn, Node.js backend, state management, UI library)

## ✅ Phase 2 — Project Setup (Monorepo Friendly)

* [ ] Create root folder `expense-manager`
* [ ] Initialize Git repository
* [ ] Create `apps/frontend` and `apps/backend` folders
* [ ] Scaffold frontend with Vite (React + TypeScript)
* [ ] Remove `package-lock.json` and run `yarn install`
* [ ] Move / initialize backend under `apps/backend`
* [ ] Add core dependencies to frontend (react-router-dom, react-query, UI library)
* [ ] Add ESLint & Prettier to both frontend and backend

## ✅ Phase 3 — Folder Structure & Documentation

* [ ] Create base folder structure in frontend:

  * `src/components`
  * `src/pages`
  * `src/features`
  * `src/hooks`
  * `src/types`
  * `src/utils`
  * `src/lib`
* [ ] Create `/docs` folder at root
* [ ] Create `README.md` in root with overview and requirements
* [ ] Create `docs/spec.md` (features & scope)
* [ ] Create `docs/adr/0001-tech-stack.md` (architecture decision)
* [ ] Create `CONTRIBUTING.md` (coding conventions & branch model)

## ✅ Phase 4 — Environment & Versioning

* [ ] Add `.env` and `.env.example` files for both apps
* [ ] Adopt Semantic Versioning (0.x.y during development)
* [ ] Define branch naming convention (`main` + `feature/<name>`)

## ✅ Phase 5 — DevOps & Deployment Config

* [ ] Add GitHub Action for build/lint CI
* [ ] Choose initial frontend deployment (Vercel / Netlify)
* [ ] Add Dockerfile for backend
* [ ] Add `docker-compose.yml` (optional)
* [ ] Plan future deployment to AWS (ECS or S3+CloudFront)

## ✅ Phase 6 — Logging & Observability

* [ ] Add error logging on frontend (Sentry or LogRocket)
* [ ] Add logging on backend (Winston or similar)
* [ ] Add requestId propagation from backend to frontend
* [ ] Add simple analytics (PostHog or GA)

## ✅ Phase 7 — Development Flow

* [ ] Build frontend layout (sidebar, header)
* [ ] Add routing (React Router)
* [ ] Implement “Add Expense” form
* [ ] Implement “List Expenses” table
* [ ] Implement categories UI + API endpoints
* [ ] Implement dashboard / charts
* [ ] Integrate frontend with backend APIs
* [ ] Validate and refine UX
* [ ] Initial deployment (FE + BE)
* [ ] Iterate and scale up
