# Project Structure

## Apps

- [`@my-monorepo/api`](../apps/api) - Bun runtime API using Hono + tRPC, with shared logging/utilities.
- [`@my-monorepo/tauri`](../apps/tauri) - Tauri v2 desktop app (leedshack-digitialpet) with Vue 3 + Vite frontend.

## Packages

- [`@my-monorepo/tsconfig`](../packages/tsconfig) - Shared TypeScript base configs.
- [`@my-monorepo/utils`](../packages/utils) - Cross-app helpers for crypto/format/validation and shared libs (zod, validator, date-fns, jose, etc.).
- [`@my-monorepo/i18n`](../packages/i18n) - i18n setup with locale bundles.
- [`@my-monorepo/logger`](../packages/logger) - Pino-based logger with contextual helpers.
- [`@my-monorepo/memory`](../packages/memory) - Redis-backed cache helpers.
- [`@my-monorepo/ai`](../packages/ai) - AI streaming helpers (OpenAI-compatible + resumable streams).
- [`@my-monorepo/ui`](../packages/ui) - Shared Vue UI components and styles.

## Dependency Graph

```mermaid
graph BT
    subgraph Packages
        TSCONFIG[tsconfig]
        UTILS[utils]
        I18N[i18n]
        LOGGER[logger]
        MEMORY[memory]
        AI[ai]
        UI[ui]
    end

    subgraph Apps
        API[api]
        TAURI[tauri]
    end

    TSCONFIG --> UTILS & I18N & LOGGER & MEMORY & AI & UI
    UTILS --> API
    LOGGER --> API
    AI --> API
    MEMORY --> AI
    UTILS --> AI
    UI --> TAURI
    UTILS --> TAURI
    I18N --> TAURI
```

> everything under `packages/` is an internal library.
