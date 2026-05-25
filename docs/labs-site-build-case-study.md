# Building Most Certainly Try Labs

Most Certainly Try Labs was created to solve a practical split: Squarespace is good for polished brand pages, but it is not the best place to manage a growing library of structured experiments, build logs, workflow notes, and case studies.

The answer was a small static site hosted on GitHub Pages at `labs.mostcertainlytry.com`. Squarespace stays the front door for the main site. GitHub becomes the workspace for repeatable project documentation, version history, JSON data, and lightweight publishing.

## Problem

The main site needed a place to show work in progress without turning Squarespace into a database. The project library needed to support repeated entries with the same basic fields:

- title
- category
- type
- status
- date
- tools
- summary
- outcome
- public URL
- source note

That structure is awkward to maintain by hand in a visual site builder. It is simple to maintain in JSON.

## Build

The first version used plain files on purpose:

- `index.html` for the project library
- `projects.json` as the source of truth
- `app.js` for rendering, search, status filters, category filters, and counts
- `styles.css` for responsive layout
- `new-project.html` and `form.js` for drafting new JSON entries
- `docs/` for Markdown source notes
- `projects/` for polished case-study pages
- `CNAME` for the custom GitHub Pages domain

The repository was created as a separate Git project so the Labs site has clean history and can be pushed without mixing in unrelated OpenClaw workspace files.

## Publishing

The site was pushed to GitHub at:

`https://github.com/ilanajill-png/labs-mostcertainlytry`

GitHub Pages was enabled from the `main` branch. The custom domain was configured with:

`labs.mostcertainlytry.com`

Squarespace DNS was updated with:

`CNAME labs -> ilanajill-png.github.io`

After DNS propagated, the site loaded over HTTP. HTTPS was left pending while GitHub issued the custom-domain certificate.

## Result

The project shipped as a working public library, not just a demo page. It now supports searchable, filterable, JSON-driven entries and can grow without rebuilding the homepage by hand each time.

The important outcome is not the first design. It is the workflow:

1. Draft a project entry.
2. Add the object to `projects.json`.
3. Write rough notes in Markdown.
4. Promote the best entries into case-study pages.
5. Commit and push.
6. Let GitHub Pages publish the update.

## Why JSON and GitHub

This project benefits from JSON and GitHub because the content is structured, repeatable, and likely to grow. Each entry follows the same schema, which means cards, filters, tables, and counts can be generated from one data file.

Git also gives the site a memory. Every change has a commit, and every case study can be updated as the work matures.

## What Squarespace Still Does Better

Squarespace remains better for the polished public-facing parts of the brand:

- homepage
- about page
- services page
- contact flow
- visual landing pages

Labs exists next to Squarespace, not instead of it.

## Reusable Pattern

The same pattern can now be reused for:

- AI workflow catalogs
- project case studies
- build logs
- prompt experiments
- client-ready proof-of-work pages
- research notes that need public summaries later

The core idea is simple: use Squarespace for presentation, use GitHub for structured work that changes often.
