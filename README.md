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

The interface includes a skip link, visible keyboard focus, an expandable mobile menu with Escape handling, reduced-motion support, scrollable code blocks, and announced clipboard feedback. The layout adapts to narrow viewports without shrinking code text. The latest content and style revision passes the production build; a fresh browser, screen-reader, and contrast review is still needed before making WCAG conformance claims.

## Source repository

Relay's source code is maintained in [mojtabafazeli/relay](https://github.com/mojtabafazeli/relay). That repository is currently private; visitors need access to download or clone the Relay source.

## Content sources

Website copy follows the current local `../Relay/README.md` and `../Relay/DESIGN.md`,
with the CLI options and bundled workflows used to verify command examples.
The product-owner guide supplies the request, story approval, and release handoff guidance.
Historical changelog entries, handoffs, milestone drafts, and contributing notes can lag
implemented behavior; do not use those alone to mark a capability as available or planned.

This revision covers resume, protected paths, between-turn spend limits, Codex,
Anthropic/OpenAI-compatible API adapters, the Claude Code plugin, and CI/JSON/PR review.
The local browser UI remains planned; adapter discovery is deferred until after v1.
The project is private and not published to npm. Do not describe it as open source
or imply that approval merges or releases a feature.

Documentation links point at the source repository and require the visitor's repository access.
Local capabilities may precede the remote documentation; do not push the Relay source repository
as part of updating this website.
