## Introduction
This project provides an end-to-end testing solution for web applications and APIs using the Playwright library. The tests are designed to cover most important functionalities of the application to ensure everything is working as expected.

## Getting Started

### Installation

#### Prerequisites
- Install [Node.js](https://nodejs.org/en/download/).
- Install project dependencies via `npm install`.

### Running Locally

#### Run the End-to-End Tests
```sh
npx playwright test
```

### Runs the tests only Chrome mobile
```sh
npx playwright test --project=chromeMobile
```
I recommend you see the configurations from `./playwright.config.ts` for test driver.

## Test Report
Once the test finished, it will have been created which shows you a full report of your tests allowing you to filter the report by browsers, passed tests, failed tests, skipped tests and flaky tests.
```sh
npx playwright show-report
```

## Assignment Details
- The project is divided into two main parts: UI tests and API tests.

## UI Tests
- UI tests follow the Page-Object pattern, creating an abstraction layer of the tested page for improved readability, maintainability, and reusability, along with Playwright fixture implementation.
- UI tests were developed based on exploratory testing of the Gamdom website.
- The most critical journeys, such as `registration`, `login`, `game (search/play/wagering)`, `deposit`/`withdrawal`, `user account management` were selected.
- Automation was implemented for the `registration`, `login`, and `game (search/play)` journeys.
- Since the Gamdom website is protected by Cloudflare, this was taken into consideration during testing.

## API Tests
- API tests focus on the JIRA Issues API, using this document as a baseline: [JIRA Issues API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issues/).
- A comprehensive workflow encompassing CRUD operations for the Issues feature was created. Four endpoints were selected and automated using Playwright's API capabilities.

## GitHub Actions
This project uses GitHub Actions for continuous integration. Definitions are included in the `.github/workflows` directory.

