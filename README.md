# Trait-Theme Timeline

A small React + Vite app that loads a CSV of paintings and displays a horizontal timeline for a chosen trait/theme combination using React Flow.

How to run

1. From the project folder run:

```bash
npm install
npm run dev
```

2. Open the dev server URL printed by Vite (usually http://localhost:5173).

How to use

This app reads `public/trait_theme_timeline.csv` automatically on startup — place your CSV file there and refresh the page.
The CSV should include columns similar to: `trait`, `theme`, `date`, `image_url`, `title`.
- Choose a trait, then a theme (or pick a combo). The timeline will show paintings in chronological order.

Notes

- Parsing uses PapaParse; if the `date` values aren't standard parseable dates, the app will fall back to string compare.
- Images are loaded directly from the `image_url` column. Ensure they are public URLs or available locally via the public folder.

Next improvements (optional):
- Add caching of loaded image thumbnails, lazy loading, and error fallback images.
- Add zoom/pan controls or make nodes draggable to adjust spacing.
- Add filtering and search across titles.

