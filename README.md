# chrome-extension-vite-react

> A Chrome extension boilerplate for **Manifest V3 (MV3)** — Vite + React +
> TypeScript, with hot-module reload for popup / options / content scripts,
> typed message passing, and a service-worker keepalive baked in. Works in
> Chrome, Edge, and Firefox out of the box.

<p>
  <img src="https://img.shields.io/badge/manifest-v3-blue" alt="MV3">
  <img src="https://img.shields.io/badge/vite-5-purple" alt="Vite 5">
  <img src="https://img.shields.io/badge/react-18-cyan" alt="React 18">
  <img src="https://img.shields.io/badge/typescript-5-3178c6" alt="TS 5">
</p>

A modern, opinionated starter for building **Chrome extensions** (and Edge /
Firefox / browser extensions in general) on **Manifest V3**. No more wrestling
with webpack, custom HMR shims, or untyped `chrome.runtime.sendMessage`.

## What's in the box

- ⚡ **Vite 5 + `@crxjs/vite-plugin`** — manifest is the source of truth; HMR
  works in popup, options, and content scripts.
- ⚛️ **React 18 + TypeScript (strict)** — popup + options are real React apps.
- 📡 **Typed messaging** via [`mv3-message-router`](https://github.com/graybearo/mv3-message-router)
  — declare a `Messages` interface once, get end-to-end typing in the SW,
  popup, and content scripts.
- ⏰ **Durable scheduling** via [`mv3-keepalive`](https://github.com/graybearo/mv3-keepalive)
  — `chrome.alarms` that survive SW termination, plus a keepalive helper for
  long async work.
- 🦊 **Cross-browser** — `pnpm build` for Chrome / Edge, `pnpm build:firefox`
  for Firefox (background runs as a script, not a service worker).
- 📦 **`pnpm zip`** — packs `dist/` into a ready-to-upload `.zip`.

## Quick start

```bash
git clone https://github.com/graybearo/chrome-extension-vite-react my-extension
cd my-extension
pnpm install
pnpm dev
```

Then in Chrome:

1. Open `chrome://extensions/`
2. Toggle **Developer mode** on
3. Click **Load unpacked**
4. Select the `dist/` folder

The popup, options page, and content script all hot-reload as you edit them.

## Layout

```
src/
├── background/index.ts     # service worker — router + alarms live here
├── content/index.tsx       # injected into every https:// page
├── popup/                  # React popup (action.default_popup)
├── options/                # React options page
└── shared/
    ├── messages.ts         # typed message contract (single source of truth)
    └── storage.ts          # thin chrome.storage wrapper
```

## How messaging works

Declare your messages once:

```ts
// src/shared/messages.ts
export interface Messages {
  GET_STATE: { input: void; output: { count: number } };
  INCREMENT: { input: { by: number }; output: { count: number } };
}
```

Register handlers in the SW:

```ts
// src/background/index.ts
const router = createRouter<Messages>();
router.on("INCREMENT", async ({ by }) => { /* ... */ });
router.listen();
```

Call from popup / content / options:

```ts
const client = createClient<Messages>();
const { count } = await client.send("INCREMENT", { by: 1 });
//      ^? number
```

No untyped `chrome.runtime.sendMessage`, no `return true` foot-guns, no
manual error serialization.

## Building

```bash
pnpm build           # Chrome / Edge build into dist/
pnpm build:firefox   # Firefox-flavored build (background as script)
pnpm zip             # zip dist/ for web-store upload
```

## Adding an icon set

Drop `icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png` into
`public/icons/`. They're referenced from `manifest.config.ts`.

## Related packages

Part of a small **MV3 toolkit** by [@graybearo](https://github.com/graybearo):

- [`mv3-keepalive`](https://github.com/graybearo/mv3-keepalive) — service-worker keepalive + durable alarms
- [`mv3-message-router`](https://github.com/graybearo/mv3-message-router) — type-safe message passing
- [`mv3-content-bridge`](https://github.com/graybearo/mv3-content-bridge) — content-script ↔ page-context typed bridge
- [`mv3-storage`](https://github.com/graybearo/mv3-storage) — typed `chrome.storage` wrapper
- [`mv3-wait-for-element`](https://github.com/graybearo/mv3-wait-for-element) — `waitForElement` for content scripts
- [`chrome-extension-vite-svelte`](https://github.com/graybearo/chrome-extension-vite-svelte) — Svelte version of this starter
- [`chrome-extension-webpack-react`](https://github.com/graybearo/chrome-extension-webpack-react) — webpack version of this starter (same `src/` layout, swappable)
- [`chrome-extension-side-panel`](https://github.com/graybearo/chrome-extension-side-panel) — Side Panel API starter (Chrome 114+)
- [`webpack-ext-reloader-next`](https://github.com/graybearo/webpack-ext-reloader-next) — live reload for webpack-based MV3 extensions
- [`awesome-mv3`](https://github.com/graybearo/awesome-mv3) — curated list of MV3 tools, libraries, and resources

## Why not webpack?

Vite's HMR is faster and the config is much smaller. If you'd rather stay
on webpack (or your existing toolchain is webpack-based), the sibling
starter [`chrome-extension-webpack-react`](https://github.com/graybearo/chrome-extension-webpack-react)
shares this starter's `src/` layout exactly — you can switch between them
without rewriting your app code.

## License

MIT — see [LICENSE](LICENSE).
