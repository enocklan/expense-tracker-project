# Expense Tracker with Live Currency Conversion

Expense Tracker helps travelers, freelancers, and international shoppers understand what they spend across currencies. Add each purchase in the currency you paid, and the app uses live exchange rates to show converted expense values and a running total in your chosen home currency.

## Live demo

Once published to GitHub Pages, the app will be available at `https://your-github-username.github.io/expense-tracker/`.

## Features

- Add expenses with a description, amount, original currency, and category.
- View each original amount alongside its conversion into your home currency.
- See a running total and filter expenses by category.
- Delete individual expenses.
- Change the home currency and fetch a fresh set of live rates.
- See explicit loading and error states, with a retry action when rate fetching fails.
- Use the app on desktop and mobile.

## Technology

- HTML, CSS, and JavaScript ES modules.
- [ExchangeRate-API](https://open.er-api.com/v6/latest/USD) for free, no-key-required live rates.
- [Vitest](https://vitest.dev/) for utility unit tests.
- [ESLint](https://eslint.org/) for static analysis.
- [Vite](https://vite.dev/) for local development and production builds.

## Run locally

Requires Node.js 20.19+ (or 22.12+) and npm.

```sh
npm install
npm run dev
```

Run the unit tests and lint checks:

```sh
npm test
npm run lint
```

Create a production build:

```sh
npm run build
```

## Deployment

Push the repository to GitHub and enable GitHub Actions in repository settings. The included workflow builds the app and deploys `dist/` to GitHub Pages on pushes to `main`. Select **Settings → Pages → GitHub Actions** if Pages is not already configured.

## What I'd improve with more time

- Save expenses and currency preferences between visits.
- Add date ranges, monthly summaries, and export to CSV.
- Cache rates and show their exact age while offline.
- Let users add custom categories and more currencies.