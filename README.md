# Relay website

The public React + TypeScript introduction and getting-started guide for Relay.

## Local development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

To create and preview a production build:

```sh
npm run build
npm run preview
```

## Deployment

The site is deployed to GitHub Pages from the `main` branch using GitHub Actions:

```text
https://mojtabafazeli.github.io/relay-website/
```

The repository's Pages setting must use **GitHub Actions** as its build and deployment source. The workflow at `.github/workflows/deploy.yml` builds the Vite site and publishes `dist/`.

## Source repository

Relay's source code is maintained in [mojtabafazeli/relay](https://github.com/mojtabafazeli/relay). That repository is currently private; visitors need access to download or clone the Relay source.
