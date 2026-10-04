# Contributing

We welcome and appreciate all contributions from the community. By contributing to js-demos, you agree to abide by the [code of conduct](CODE_OF_CONDUCT.md).

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
  - [Bug Reports](#bug-reports)
  - [Feature Request](#feature-request)
  - [Documentation](#documentation)
  - [Code](#code)
- [Setup](#setup)
  - [Installation](#installation)
  - [Getting Started](#getting-started)
- [Linting, Formating, Building, and Testing](#linting-formating-building-and-testing)
  - [Linting](#linting)
  - [Formating](#formating)
  - [Building](#building)
  - [Testing](#testing)
- [Pull Request](#pull-request)
  - [Submitting a Pull Request](#submitting-a-pull-request)
  - [Reviewing a Pull Request](#reviewing-a-pull-request)
  - [Addressing Review Feedback](#addressing-review-feedback)
  - [After Pull Request Merged](#after-pull-request-merged)
- [Keeping Fork Synced with Upstream](#keeping-fork-synced-with-upstream)
- [Resources](#resources)

## How Can I Contribute?

### Bug Reports

Before creating a bug report please check to see if it has already been reported. If the issue is closed, please open a new issue and link it to the original issue.

When creating a bug report, please fill out the template provided.

### Feature Request

Before creating a feature request, please check to see if it has already been requested.

When creating a feature request, please fill out the template provided.

### Documentation

The documentation for this project are files that end with `.md` extension.

If you would like to improve the documentation in any of these areas, please open an issue if there isn't one already to discuss what you would like to improve. Then submit a pull request to this repository.

### Code

Unsure of where to begin contributing to js-demos? You can start by looking through the issues labeled _good-first-issue_ and _help-wanted_. You can also start by contributing to the project documentation (e.g files with extension `.md`).

For instructions on setting up your environment, see the [setup](#setup) instructions in this document.

## Setup

If you don't already have [Git](https://git-scm.com/) installed, install it first. You will need it to contribute. You will also need to install [Node](https://nodejs.org/en) 24+ and [pnpm](https://pnpm.io/installation).

### Installation

1. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the js-demos repository.
2. Open a terminal, or "Git Bash" on Windows.
3. Use `cd` to move to the directory that you want to work in.
4. [Clone your repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).
5. [Configure the remote repository for your fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork).
6. Install dependencies:
   ```bash
   pnpm install
   ```
7. Open the js-demos folder in your favorite editor. If you don't have one, try [Visual Studio Code](https://code.visualstudio.com/)

### Getting Started

**Please complete [Setup](#setup) first and then return here.**

#### 1. Create environment variables (optional)

The app works without any environment variables. To customize the app name, create `.env.local`:

```bash
touch .env.local
```

```bash
VITE_APP_NAME="JS Demos"
```

> **Note**: _Non-sensitive_ environment variables used client-side **must** have the prefix `VITE_`. For more information see [Vite docs: Env Variables and Modes](https://vite.dev/guide/env-and-mode).

#### 2. Enable HTTPS for development (optional)

> In this case a [self-signed certificate](https://en.wikipedia.org/wiki/Self-signed_certificate) will be sufficient. Locally trusted certificates generated with tools like [mkcert](https://github.com/FiloSottile/mkcert) may be more appropriate depending on your testing scenario.

1. Create a folder (`ssl/` or `tls/`) in the project directory to hold the private key and public certificate:

```bash
mkdir ssl # or mkdir tls
```

2. Create a private key and public certificate with [OpenSSL](https://www.openssl.org/):

> Replace placeholders `<KEY_FILE_NAME>` and `<CERT_FILE_NAME>` with file names of your choosing.

```bash
openssl req -newkey rsa:2048 -nodes -keyout ssl/<KEY_FILE_NAME>.key -x509 -days 365 -out ssl/<CERT_FILE_NAME>.crt
```

3. Create `.env.development.local`:

```bash
touch .env.development.local
```

4. Add the following variables in `.env.development.local`, replacing the values with the paths of your private key and public certificate:

```bash
HTTPS_CERT="ssl/<CERT_FILE_NAME>.crt"
HTTPS_KEY="ssl/<KEY_FILE_NAME>.key"
```

Helpful resources regarding SSL/TLS and certificates:

- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#introduction)
- [NodeJS Docs: TLS/SSL concepts](https://nodejs.org/api/tls.html#tlsssl-concepts)

## Linting, Formating, Building, and Testing

Once you have cloned js-demos and completed [Setup](#setup), you can lint, format, build, and test the code from your terminal.

### Linting

To lint the code, run:

```bash
pnpm run lint
```

### Lint Fix

To lint and fix eslint errors in the code, run:

```bash
pnpm run lint:fix
```

This will start eslint and check all files for stylistic problems. See [eslint.config.js](./eslint.config.js) file for project config and rules.

### Formating

To format the code, run:

```bash
pnpm run format
```

### Formatting And Lint Fix

To format and fix eslint errors in the code, run:

```bash
pnpm run flf
```

### Building

To compile the js-demos source, run:

```bash
pnpm run build
```

Using [Vite](https://vite.dev/), this will bundle the app and output it to the `dist/browser` folder.

### Testing

To validate any changes you have made _in all test files_, run:

```bash
pnpm run test
```

To validate any changes you made _in a specifc file_, run:

```bash
pnpm run test <./folder-path-name/file-name>
```

To run code coverage, run:

```bash
pnpm run coverage
```

This will run all tests and output a detailed interactive HTML report, which will be generated in the `./coverage` directory (by default), which can be viewed in a web browser.

Coverage percentage requirement for the following thresholds in order for build to succeed:

| Threshold Type     | Required Coverage (%) |
| ------------------ | --------------------- |
| Line Coverage      | 80%                   |
| Branch Coverage    | 70%                   |
| Function Coverage  | 75%                   |
| Statement Coverage | 80%                   |

## Pull Request

Once you have finished working on an issue or feature, you can submit a pull request to have your changes merged into the js-demos repository and included in the next release.

**Please do not change the project version number in a pull request.**

**Note**: We squash commits into a single commit **before** merging any PRs, so _please do not squash commits while reviewing or during PR creation_.

### Submitting a Pull Request

Before you submit your Pull Request (PR) consider the following:

1. Search for an open or closed PR that relates to your submission.
   You don't want to duplicate existing efforts.

2. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add.
   Discussing the design upfront helps to ensure that we're ready to accept your work.

3. Skip this step if you have completed [Setup](#setup). Otherwise, please complete it first and then return here.

4. In your forked repository, make your changes in a new git branch. Branch names follow the convention:

   ```
   <conventional-scope>/<branch-name><gh-issue-if-present>
   ```

   Where `<conventional-scope>` is a [Conventional Commits type](https://www.conventionalcommits.org/en/v1.0.0/) (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, …), and the GitHub issue number is appended when one exists:

   ```bash
   git checkout -b feat/add-timer-page-123 main
   git checkout -b fix/sidebar-focus main
   ```

5. Create your patch, **including appropriate test cases**.

6. Run the tests and ensure no linting errors.

7. Stage and commit your changes using a descriptive commit message.

   ```bash
   git add .
   git commit -m "fix: restore focus to active sidebar link on route change"
   ```

   > [!NOTE]
   > Keeping your commits small and meaningful is encouraged.

   > [!NOTE]
   > Please write commit messages following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, using the format `<type>: <description>`.

8. Push your branch to your remote fork:

   ```bash
   git push -u origin feat/add-timer-page-123
   ```

9. In GitHub, send a pull request to `js-demos:main`.

### Reviewing a Pull Request

Community Leaders reserves the right not to accept pull requests from community members who haven't been good citizens of the community. Such behavior includes not following the [code of conduct](CODE_OF_CONDUCT.md).

### Addressing Review Feedback

If we ask for changes via code reviews then:

1. Make the required updates to the code.

2. Re-run tests to ensure tests are still passing.

3. Commit your changes as usual and push them to your feature branch (this will automatically update your Pull Request):

   ```bash
   git add .
   git commit -m "Address review feedback"
   git push origin my-fix-branch-issue-id
   ```

That's it! Thank you for your contribution!

### After Pull Request Merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local terminal as follows:

  ```bash
  git push origin --delete my-fix-branch-issue-id
  ```

- Check out the main branch:

  ```bash
  git checkout main -f
  ```

- Delete the local branch:

  ```bash
  git branch -D my-fix-branch-issue-id
  ```

## Keeping Fork Synced with Upstream

- Update your local `main` with the latest changes from upstream:

  ```bash
  git pull --ff upstream main
  ```

- Fetch the latest changes from upstream:

  ```bash
  git fetch upstream
  ```

- Update your local branch with latest changes from upstream:

  ```bash
  git fetch upstream && git rebase upstream/main
  ```

## Resources

- [How to contribute to open source](https://opensource.guide/how-to-contribute/)
- [Contributing to a project](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)
- [Using pull requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub help](https://help.github.com)
