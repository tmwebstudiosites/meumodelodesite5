# Annaly Noivas — site

Aluguel de vestidos de noiva e festa em Niterói. React 19 + TypeScript + Vite 8, animações com `motion`.

```bash
npm install
npm run dev            # desenvolvimento
npm run build          # produção (dist/)
npm run quality        # typecheck + Biome + Knip + arch-contract + testes com cobertura
npm run test:e2e       # Playwright (desktop + mobile). Sem Chromium do Playwright: PW_CHANNEL=chrome
npm run test:mutation  # Stryker (mutação)
```

## Antes de publicar

- **Catálogo**: `src/features/catalog/data.ts` tem nomes e textos **ilustrativos**. Troque pelas peças reais (ou por uma API em `repository.ts`).
- **WhatsApp**: defina `VITE_WHATSAPP_NUMBER` (ex.: `5521999999999`) para a mensagem do agendamento abrir já preenchida. Sem ele, usa o link `bit.ly/ContatoAnnalynoivas` e copia a mensagem.
- **FAQ/textos**: revise `src/pages/home/Sections.tsx` (respostas genéricas, sem valores nem regras de aluguel).
- **Observabilidade**: copie `.env.example` para `.env` e preencha as chaves.

## Motion Principles (`src/shared/motion`)

Tokens únicos de duração/easing; entrada desacelera e saída acelera; stagger curto; só `transform`/`opacity`; `prefers-reduced-motion` respeitado (`MotionConfig reducedMotion="user"`).
Em toda a interface: skeletons (`Skeleton`, `DressCardSkeleton`, `PageSkeleton`), lazy loading (rotas com `lazy()`, imagens com `loading="lazy"` + placeholder borrado, mapa em iframe lazy), entrada/saída (`AnimatePresence` em páginas, filtros, menu, FAQ, erros de formulário), progresso (barra de scroll, barra de rota, etapas do formulário, loading de botão).

## Observabilidade (`src/shared/observability`)

Sentry, OpenTelemetry (OTLP/HTTP), Datadog RUM e New Relic Browser, todos por import dinâmico e ligados só se houver chave. `captureError`/`track` enviam a todos os provedores; falha em um nunca derruba o app. `ErrorBoundary` e `unhandledrejection` já reportam.

## Qualidade

- **Biome** (lint + format), **Knip** (código/dependências mortas), **Commitlint + Husky** (Conventional Commits).
- **arch-contract** (`.dependency-cruiser.cjs`): `shared ← features ← layout ← pages ← app`; features só se falam pelo `index.ts`; sem ciclos.
- **Testes**: Vitest (unitário + integração, limiar de cobertura 80%), Playwright (E2E + acessibilidade axe), **Stryker** (mutação), **Codecov** via `.github/workflows/ci.yml`.
