## Documentation and Guides

Most important documentation is kept in the [GitHub Wiki](https://github.com/TabulateJarl8/velour/wiki). Important pages include:

- Architecture & Motivation
- Adding a New Configuration Option Type

## AI Policy

Please review the [AI Policy](./AI_POLICY.md) before contributing.

## Create a New Plugin - Quickstart

Adding a new setup script option or app installer is pretty easy, you can run the following command to scaffold the plugin for you:

```sh
pnpm gen:plugin
```

This will launch an interactive script will prompt you for the plugin's details and automatically generate the TypeScript file for you in the correct directory.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
pnpm test:unit:coverage
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

#### Automatically Fix Linting Errors

```sh
pnpm fix
```

### Formatting code with [Prettier](https://prettier.io/)

```sh
pnpm format
```

## Opening a Pull Request

1. Check existing issues/PRs for discussion related to your contributed feature
2. Fork the repo and create a feature branch off of `master`
3. **IMPORTANT:** make sure to review our [AI Policy](./AI_POLICY.md) before making any changes.
4. Ensure any new plugins or components are fully tested at 100% code coverage. If you're modifying existing code, ensure that any relevant unit tests are updated and that the component remains at 100% coverage. You can run `pnpm test:unit:coverage` to see code coverage.
5. Our husky `pre-commit` hook checks code formatting and linting before allowing you to commit, but you can manually perform formatting and linting with `pnpm format` and `pnpm lint`/`pnpm fix`
6. Submit your PR with a clear description of the changes and what issue it resolves
