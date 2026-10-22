# Playframe

Playframe is an Angular video-browsing application backed by the API in the
separate `youtubeLearn` workspace.

## Development

Install dependencies and start the Angular development server:

```bash
npm ci
npm start
```

The app runs at `http://localhost:4200`. The development API URL is configured
in `src/environments/environment.ts` and defaults to
`http://localhost:3000/api/v1`.

## Features

- Browse recommendations, search videos, and filter by category.
- Watch videos, react, share, comment, and explore related videos.
- Visit public channels and manage your own video uploads.
- Edit your account profile and manage watch history and liked videos.

## Checks

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```
