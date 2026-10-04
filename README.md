# JS Demos

![CI](https://img.shields.io/github/actions/workflow/status/brysonbw/js-demos/ci.yml?branch=main&style=flat&logo=github&label=CI)

![Build & Deploy](https://img.shields.io/github/actions/workflow/status/brysonbw/js-demos/deploy.yml?branch=main&style=flat&logo=github&label=Deploy)

A collection of practical, browser-based JavaScript examples — each one built in just JavaScript, no frameworks.

## Why just Javascript?

Frameworks come and go, but the platform endures. These demos are a reminder of how much you can do with just the browser's own APIs.

## Getting started

Requires [Node](https://nodejs.org/) 24+ and [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

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
  main.js            # App entry: router, theme toggle, page tabs
  app.css            # Global styles and theme variables (light/dark)
  components/
    sidebar/         # Navigation sidebar + mobile dialog
    top-bar/         # Header with brand, theme toggle, menu button
  pages/             # Page/demos go here
  shared/styles/     # Shared button and form styles
  utils/             # Constants, datetime, and helper functions
tests/               # Unit tests for utils
```

## Routing

Hash-based routing (`#/contact`, `#/tabs`, …) keeps the app deployable as a static site with no server configuration. Route definitions live in [src/pages/index.js](src/pages/index.js) and [src/utils/constants.js](src/utils/constants.js).

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
