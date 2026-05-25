# labs.mostcertainlytry.com

A small static lab site for building project case studies with plain HTML, CSS, JavaScript, JSON, Markdown, and Git.

## What This Project Practices

- HTML pages with shared structure
- CSS layouts, cards, tables, and responsive design
- Markdown source notes for case studies
- JavaScript rendering from JSON
- Form handling and live previews
- Git commits and GitHub Pages publishing

## Local Preview

Run a small local server:

```sh
python3 -m http.server 4173
```

Then visit:

```txt
http://localhost:4173
```

## Suggested GitHub Pages Setup

1. Create a GitHub repo named `labs-mostcertainlytry`.
2. Push this folder as the repo root.
3. In GitHub, enable Pages from the `main` branch.
4. Add a custom domain: `labs.mostcertainlytry.com`.
5. In your DNS provider, create a CNAME record:

```txt
labs -> <your-github-username>.github.io
```

GitHub will provide the exact target once the repo exists.
