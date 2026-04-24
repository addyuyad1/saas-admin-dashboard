# SaaS Admin Dashboard

Angular 21 enterprise admin starter with:

- `CoreModule` for auth, guards, interceptors, and singleton services
- `SharedModule` for reusable UI, pipes, and directives
- `LayoutModule` for the app shell
- Lazy-loaded feature modules for dashboard, users, analytics, and settings

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Build

```bash
npm run build
```

## Recommended CLI bootstrap

```bash
npx @angular/cli@latest new saas-admin-dashboard --routing --style=scss --standalone=false
```

## Suggested module generation flow

```bash
ng generate module core
ng generate module shared
ng generate module layout
ng generate module features/dashboard --routing
ng generate module features/users --routing
ng generate module features/analytics --routing
ng generate module features/settings --routing
```

## Structure

```text
src/app
├── core
├── shared
├── layout
├── features
│   ├── dashboard
│   ├── users
│   ├── analytics
│   └── settings
└── app-routing.module.ts
```

## Mock auth flow

The app starts on `/login`. Use the demo sign-in button to create a mock session in `localStorage`. The auth guard protects all feature routes, and the HTTP interceptor attaches a bearer token when one is present.
