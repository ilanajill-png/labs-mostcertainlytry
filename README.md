# labs.mostcertainlytry.com

A small static lab site for building a searchable library of projects, AI workflows, experiments, build logs, and case studies with plain HTML, CSS, JavaScript, JSON, Markdown, and Git.

## What This Project Practices

- HTML pages with shared structure
- CSS layouts, cards, tables, and responsive design
- Markdown source notes for case studies
- JavaScript rendering, search, and filters from JSON
- Form handling and live previews
- Git commits and GitHub Pages publishing

## Content Workflow

1. Draft a new entry on `new-project.html`.
2. Paste the generated object into `projects.json`.
3. Add rough notes or a finished writeup in `docs/`.
4. Add an HTML case-study page in `projects/` when the entry is ready.
5. Commit and push to publish through GitHub Pages.

See `docs/project-entry-template.md` for the expected JSON shape and Markdown note structure.

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

This repo is published from `main` using GitHub Pages with a custom domain:

```txt
labs.mostcertainlytry.com
```

DNS points `labs` to `ilanajill-png.github.io`.
