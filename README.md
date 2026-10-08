# JS Demos

[![Version](https://img.shields.io/github/v/tag/brysonbw/js-demos?style=flat&label=version)](https://github.com/brysonbw/js-demos/releases) ![CI](https://img.shields.io/github/actions/workflow/status/brysonbw/js-demos/ci.yml?branch=main&style=flat&logo=github&label=CI) ![Build & Deploy](https://img.shields.io/github/actions/workflow/status/brysonbw/js-demos/deploy.yml?branch=main&style=flat&logo=github&label=Deploy)

A collection of practical, browser-based JavaScript examples — each one built in just JavaScript, no frameworks.

## Getting started

Requires [Node](https://nodejs.org/) 24+ and [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

## Scripts

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `pnpm dev`      | Start the dev server on port 3000      |
| `pnpm build`    | Build for production to `dist/browser` |
| `pnpm preview`  | Preview the production build           |
| `pnpm test`     | Run the test suite                     |
| `pnpm coverage` | Run tests with a coverage report       |
| `pnpm lint`     | Lint all files (zero warnings allowed) |
| `pnpm format`   | Format the codebase with Prettier      |
| `pnpm flf`      | Format and lint/fix all files          |

## Project structure

```
src/
  main.js            # App entry: router, theme toggle, page tabs, shared page headings
  app.routes.js      # Route definitions and lazy page loaders
  app.css            # Global styles and theme variables (light/dark)
  components/
    sidebar/         # Navigation sidebar + mobile dialog
    top-bar/         # Header with brand, theme toggle, menu button
  pages/             # Page/demos
  shared/styles/     # Shared styles
  utils/             # Utility functions
    tests/           # Unit tests for utils
```

## Routing

Hash-based routing (`#/contact`, `#/tabs`, …) keeps the app deployable as a static site with no server configuration. Route definitions live in [src/app.routes.js](src/app.routes.js), and route metadata (path, title, description) plus the sidebar/numbering order (`DEMO_LIST_ORDER`) live in [src/utils/constants.js](src/utils/constants.js). Each page's heading (eyebrow, title, description) is rendered once in `main.js` from that metadata, so pages don't define their own.

## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, feel free to open an issue! We welcome all contributions.

Likewise, before contributing please read and complete the [contribution guide](CONTRIBUTING.md).

## Resources

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## License

[MIT](LICENSE)
