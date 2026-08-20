# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static, single-page digital menu ("cardápio digital") for Pizzaria Lagoinha, written in plain HTML/CSS/JS — no framework, no build step, no package manager. All UI text, comments, and identifiers are in Portuguese (pt-BR). Customers browse the menu, add items to a cart (with size/border/flavor variations), fill out a checkout form, and the app assembles a formatted order message and hands off to WhatsApp (`wa.me`) for the actual order submission — there is no backend or database.

## Running / testing

There is no build tooling. Open `index.html` directly in a browser, or serve the directory statically, e.g.:

```
npx serve .
```

or

```
python -m http.server 8000
```

There are no automated tests, linters, or CI configured. Verify changes by opening the page in a browser and exercising the flow manually (search, add product to cart, "Monte sua Pizza", checkout, WhatsApp message).

## File structure

- `index.html` — all markup, including the three off-canvas panels (product modal, "Monte sua Pizza" modal, cart, checkout) that live in the DOM at all times and are toggled with an `.oculto` class rather than `<dialog>` (see comment in `index.html` explaining why native `<dialog>` was rejected — inconsistent cross-browser default styling).
- `style.css` — design tokens (CSS custom properties), reset, typography, colors, shadows, animations, and component "skin". One CSS property per line by convention.
- `mobile.css` — structure/layout only, written mobile-first: base rules target phones, then `@media (min-width: 600px/900px/1200px)` scale up to tablet/desktop/large screens. Despite the filename, this is the layout stylesheet for *all* breakpoints, not just mobile.
- `script.js` — all application logic (~1700 lines), organized into numbered sections (search for `// ===` headers): config, menu data, app state, utilities, header/status, category nav, product cards, "Monte sua Pizza", cart, checkout, WhatsApp message building, initialization.
- `imagens/produtos/` — product photos, named by product id (`p01.jpg`, `p02.jpg`, ... `monte.jpg` for "Monte sua Pizza"). Missing photos fail gracefully (see `configurarFallbackDeFotos`), so adding a new product without an image is safe — the emoji is shown as fallback.

## Architecture

### Menu data model (`script.js`)

The entire menu is a hardcoded JS array, `PRODUTOS`, grouped by `categoriaId` matching entries in `CATEGORIAS`. Each product has:
- `id`, `categoriaId`, `emoji`, `nome`, `descricao`
- `variacoes`: an array of `{ id, nome, preco }`. Multi-size pizzas have `grande`/`gigante` variations; single-price items (bebidas, bordas, combos) use a single `{ id: 'unica', ... }` variation.

To add/edit/remove a menu item, edit the `PRODUTOS` array directly — there is no admin UI or external data source. Store-wide settings (WhatsApp number, delivery fee, opening hours, Pix key) live in `CONFIGURACAO` at the top of `script.js`.

### "Monte sua Pizza" (build-your-own-pizza)

This is a distinct flow with its own state (`estadoMontagem`, separate from the single-product `estado`) because it must track multiple selected flavors at once, plus size and border. Only products whose `categoriaId` is listed in `CATEGORIAS_SABORES_MONTAGEM` (`tradicionais`, `especiais`, `premium`) are eligible as flavors — doces are excluded because they lack a `gigante` variation. Pricing takes the *most expensive* selected flavor as the base price (see `calcularPrecoBaseMontagem`).

### Panels and modals

`MAPA_SOBREPOSICOES` maps each panel/modal id to its overlay id; `abrirPainel`/`fecharPainel` drive all open/close behavior uniformly (adds/removes `.oculto` on both the panel and its overlay, locks/unlocks background scroll). When adding a new panel, register it in this map rather than writing bespoke open/close code.

### Cart and checkout

- Cart state (`estado.carrinho`) persists to `localStorage` (`salvarCarrinhoLocalStorage`/`carregarCarrinhoLocalStorage`) so it survives page reloads.
- Checkout validates required fields and delivery-vs-pickup / payment-method conditional fields client-side (`validarFormularioCheckout`), then builds a formatted WhatsApp message (`montarMensagemWhatsApp`) using WhatsApp markdown (`*bold*`, `_italic_`).
- Order submission opens `wa.me` via a programmatically clicked `<a target="_blank">` rather than `window.open()`, specifically to avoid popup blockers. A manual fallback link (`exibirLinkManualWhatsApp`) is always shown after submit in case auto-open is blocked (common in iOS Safari / in-app browsers).
- There is no order persistence or backend — once handed to WhatsApp, the order lives only in that chat.

### Rendering

The menu, cart, and checkout summary are all rendered by directly building DOM/HTML strings from the `PRODUTOS`/`estado` data on each update — there's no virtual DOM or templating library. Category navigation highlighting during scroll uses `IntersectionObserver`, wrapped in try/catch so its failure never blocks core functionality (search/cart/checkout).

## Conventions

- Portuguese identifiers throughout (functions, variables, ids, CSS classes) — match this when adding code.
- CSS classes follow BEM-like naming with Portuguese words (e.g. `.modal-produto__cabecalho`, `.opcao-variacao__rotulo`).
- One CSS property per line in both `style.css` and `mobile.css`.
- `script.js` sections are numbered comment blocks (`/* === N. SECTION NAME === */`); keep new code within the relevant section or add a new numbered section rather than scattering logic.
