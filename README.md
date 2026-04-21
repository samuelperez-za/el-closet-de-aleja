# El Closet de Aleja

Boutique digital femenina construida con Next.js. Ahora la app puede trabajar con **Neon Postgres** como base de datos principal, sin depender de crear otro proyecto en Supabase.

## Stack actual

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Neon Postgres
- React Hook Form + Zod

## Variables de entorno

Crea `.env.local` con:

```bash
DATABASE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=573000000000
```

## Base de datos

Ejecuta el SQL de [database/neon-schema.sql](/Users/samuelesteban/EL-CLOSET-DE-ALEJA/database/neon-schema.sql:1) en tu proyecto de Neon.

## Panel admin

- Login privado con `ADMIN_EMAIL` y `ADMIN_PASSWORD`
- Sesión protegida con cookie firmada usando `ADMIN_SESSION_SECRET`
- CRUD de productos vía API interna
- Imágenes por URLs, para no depender de un Storage externo

## Rutas

- `/`
- `/categoria/[slug]`
- `/promociones`
- `/admin/login`
- `/admin/dashboard`
- `/admin/productos`
- `/admin/productos/nuevo`
- `/admin/productos/[id]/edit`

## Desarrollo

```bash
npm install
npm run dev
```
