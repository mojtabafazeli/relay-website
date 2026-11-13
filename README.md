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

## Accessibility

The interface targets WCAG 2.2 AA. The current review found no axe-core WCAG A/AA violations, verified at least 4.5:1 contrast for rendered text, and tested keyboard navigation, the skip link, mobile menu, and narrow viewport layouts. Automated checks do not replace a manual screen-reader review.

## Source repository

Relay's source code is maintained in [mojtabafazeli/relay](https://github.com/mojtabafazeli/relay). That repository is currently private; visitors need access to download or clone the Relay source.
