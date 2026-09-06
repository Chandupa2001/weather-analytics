# Weather Analytics — Comfort Index

A full-stack weather analytics application built as part of a technical assignment. The application fetches live weather data for multiple cities, calculates a custom **Comfort Index (0–100)**, ranks cities based on comfort, and presents the results through an authenticated dashboard.

The project is implemented using the **MERN stack**, with Redis-based caching and an in-memory fallback for local development.

---

## Overview

The application provides:

* Live weather data from OpenWeatherMap
* A custom server-side **Comfort Index** scored from 0–100
* Ranked city results based on comfort
* Redis caching with a 5-minute TTL
* Automatic in-memory cache fallback when Redis is unavailable
* Auth0 authentication and protected API routes
* Responsive React dashboard
* Dark/light mode
* City search and filtering
* Sorting by comfort, temperature, and city name
* Table and grid views
* Comfort breakdown visualization using Recharts
* Unit tests for the Comfort Index calculation

---

## Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* React Router
* Auth0 React SDK
* Recharts
* Axios

### Backend

* Node.js
* Express
* Axios
* Redis
* Auth0 JWT validation
* dotenv
* Jest
* Nodemon

### External Services

* **OpenWeatherMap** — live weather data
* **Auth0** — authentication and access control
* **Redis** — distributed caching

---

## Project Structure

```text
weather-analytics/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── auth/
│   │   └── hooks/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── data/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── tests/
│
├── .gitignore
└── README.md
```

---

# Setup & Installation

## Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* Git
* Redis (optional for local development)

Redis is recommended but **not required** because the backend automatically falls back to an in-memory cache if Redis is unavailable.

---

## 1. OpenWeatherMap Configuration

Create an OpenWeatherMap account and generate an API key.

The application uses the OpenWeatherMap current weather API to retrieve weather information for the configured cities.

Add the API key to the backend `.env` file:

```env
OWM_API_KEY=your_openweathermap_api_key
```

New OpenWeatherMap API keys may take a few minutes to become active.

---

## 2. Redis Configuration

Redis is used to cache weather responses and processed Comfort Index results.

### Using Docker

If Docker is installed:

```bash
docker run -p 6379:6379 redis:7-alpine
```

The backend can then connect using:

```env
REDIS_URL=redis://localhost:6379
```

### Without Redis

Redis is optional during development.

If the backend cannot connect to Redis, it automatically switches to an **in-memory cache**. The application continues to work without requiring Redis to be installed.

The in-memory cache is intended as a development fallback. It does not persist between application restarts and is not shared between multiple backend processes.

---

# 3. Auth0 Configuration

Auth0 is used to authenticate users and protect the application/API.

## Create an Auth0 API

In the Auth0 dashboard:

1. Go to **Applications → APIs**
2. Create a new API
3. Set an appropriate name, for example:

```text
Weather Analytics API
```

4. Copy the API **Identifier**

The Identifier is used as:

```env
AUTH0_AUDIENCE=your_auth0_api_identifier
```

---

## Create an Auth0 Application

Create an application of type:

```text
Single Page Application
```

Configure the following URLs for local development:

```text
Allowed Callback URLs:
http://localhost:5173

Allowed Logout URLs:
http://localhost:5173

Allowed Web Origins:
http://localhost:5173
```

Then obtain the application's:

* Domain
* Client ID

---

## Authentication Configuration

The application uses Auth0 for:

* Login
* Logout
* Protected frontend routes
* Protected backend API endpoints
* JWT access-token validation
* MFA support

For the assignment environment, user access can be restricted through an Auth0 allowlist/approved-user configuration.

> **Security note:** Authentication credentials and API secrets should never be committed to the repository. Reviewer/test accounts should be created or shared through a secure channel rather than stored in this README.

---

# 4. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
OWM_API_KEY=your_openweathermap_api_key

AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=your-auth0-api-identifier

REDIS_URL=redis://localhost:6379

PORT=5000
```

Start the development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

To run the backend in production mode:

```bash
npm start
```

---

# 5. Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-api-identifier
```

Start the development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

Open the application in a browser and log in using an authorized Auth0 account.

---

# Comfort Index

The Comfort Index is calculated entirely on the backend.

The score ranges from:

```text
0 ─────────────────────────────── 100
Uncomfortable                    Ideal
```

The calculation uses four weather parameters.

| Parameter   | Weight | Ideal Range |
| ----------- | -----: | ----------: |
| Temperature |    35% |    18–24 °C |
| Humidity    |    25% |      30–55% |
| Wind Speed  |    25% |   0–3.5 m/s |
| Cloud Cover |    15% |      10–50% |

Each parameter is converted into a **0–100 sub-score**.

Values inside the ideal range receive a score of 100. Values outside the ideal range receive a linear penalty based on their distance from the ideal range.

The weighted sub-scores are then combined to produce the final Comfort Index.

The final score is:

* Clamped between 0 and 100
* Rounded to the nearest integer
* Used to rank cities from highest to lowest comfort

---

## Why This Formula?

The scoring model was intentionally designed to be:

### Transparent

Each parameter has a clearly defined contribution to the final score.

### Tunable

The ideal ranges and weights can be adjusted without redesigning the overall scoring architecture.

### Easy to explain

A linear penalty model makes the scoring behavior straightforward to understand during development, testing, and review.

---

## Design Trade-offs

### Linear vs. Gaussian Scoring

A Gaussian curve could produce a smoother and potentially more realistic distribution.

However, a linear penalty was selected because it is:

* Easier to understand
* Easier to tune
* Easier to test
* More predictable for users

---

### Fixed Comfort Ranges vs. Climate-Specific Ranges

The current implementation uses fixed comfort ranges based on a general temperate-climate definition of comfort.

A more advanced implementation could dynamically adjust these ranges based on:

* Season
* Geographic location
* Historical climate
* User preferences

This was intentionally avoided to keep the scoring model deterministic and transparent for the assignment.

---

### Independent Parameters vs. Weather Interactions

The parameters are currently scored independently.

Real-world comfort models can include interactions such as:

* Temperature + wind
* Temperature + humidity
* Wind chill
* Heat index

These interactions were intentionally excluded from the initial implementation to keep the scoring model simple and explainable.

---

# Caching Architecture

The backend uses a cache abstraction that supports both Redis and in-memory storage.

```text
                    ┌─────────────────┐
                    │   API Request   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Cache Service  │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
             Redis Cache          Memory Cache
             (preferred)          (fallback)
```

Two cache namespaces are used:

### Weather Cache

```text
weather:<city>
```

Stores raw OpenWeatherMap responses.

Purpose:

* Reduce external API calls
* Improve response times
* Avoid unnecessary upstream requests

### Score Cache

```text
score:all
```

Stores the processed and ranked city results.

Purpose:

* Avoid repeated Comfort Index calculations
* Avoid repeated sorting
* Serve the dashboard efficiently

### Cache TTL

The default cache lifetime is:

```text
5 minutes
```

---

## Cache Monitoring

The application exposes:

```http
GET /api/cache
```

This endpoint provides cache-related information such as:

* Active cache backend
* Cached keys
* Configured TTLs
* Recent cache accesses
* HIT/MISS information

This is useful for monitoring cache behavior during development and testing.

---

# Backend Architecture

The backend follows a layered architecture:

| Layer          | Responsibility                                   |
| -------------- | ------------------------------------------------ |
| `config/`      | Environment configuration and Redis setup        |
| `controllers/` | HTTP request/response handling                   |
| `services/`    | Business logic and external API interaction      |
| `routes/`      | API endpoint definitions                         |
| `middleware/`  | Authentication, error handling, and 404 handling |
| `utils/`       | Shared utilities and city data loading           |

### Services

#### `weatherService`

Responsible for:

* Fetching weather data
* Communicating with OpenWeatherMap
* Reading/writing weather cache

#### `comfortIndexService`

A pure scoring function responsible for calculating the Comfort Index.

Keeping this logic independent makes it easy to unit test.

#### `rankingService`

Responsible for:

* Calculating scores
* Sorting cities
* Caching the final processed result

#### `cacheService`

Provides a common caching interface for:

* Redis
* In-memory fallback

The rest of the application does not need to know which cache implementation is currently active.

---

# Authentication Flow

The authentication flow is:

```text
User
 │
 ▼
React Frontend
 │
 │ Auth0 Login
 ▼
Auth0
 │
 │ Access Token
 ▼
React Frontend
 │
 │ Bearer Token
 ▼
Express API
 │
 ▼
JWT Validation
 │
 ▼
Protected Controller
```

The backend validates Auth0 access tokens using:

* `express-jwt`
* `jwks-rsa`

The frontend uses:

* `@auth0/auth0-react`

Protected routes are only accessible to authenticated users.

---

# API Overview

The backend exposes REST API endpoints for weather analytics, including:

```text
GET /api/...
```

and the cache monitoring endpoint:

```text
GET /api/cache
```

All protected API endpoints require a valid Auth0 access token.

---

# Testing

The Comfort Index calculation has dedicated unit tests using Jest.

Run the test suite with:

```bash
cd backend
npm test
```

The tests are located under:

```text
backend/tests/
```

Example:

```text
backend/tests/comfortIndex.test.js
```

The test suite focuses on the scoring function because it is the core business rule of the application.

---

# Frontend Features

The dashboard provides:

### City Search

Filter cities by name.

### Sorting

Cities can be sorted by:

* Comfort Index
* Temperature
* City name

### Table/Grid View

Users can switch between:

* Table view
* Grid/card view

### Comfort Breakdown

The dashboard displays a per-city breakdown of the Comfort Index using a Recharts visualization.

### Dark Mode

The application supports:

* Light mode
* Dark mode
* System-preference detection
* Persistent theme selection using `localStorage`

---

# Known Limitations

The current implementation intentionally has several limitations:

* In-memory cache is process-local and is lost after a restart.
* In-memory cache is not shared between multiple backend instances.
* Comfort parameters are scored independently.
* Temperature/wind and temperature/humidity interactions are not modeled.
* Comfort ranges are fixed rather than climate-specific.
* Historical weather data is not currently considered.
* Automated end-to-end/integration tests are not included.
* External Auth0 and OpenWeatherMap integrations are primarily validated through development/manual testing.

These limitations provide potential areas for future enhancement.

---

# Future Improvements

Potential improvements include:

* Climate- and season-aware Comfort Index ranges
* Heat index and wind chill calculations
* Historical weather trends
* Automated integration/E2E testing
* Redis health monitoring
* Rate limiting
* API request validation
* Pagination for larger city datasets
* User-specific comfort preferences
* Deployment configuration for cloud environments
* Improved observability and structured logging

---

# Security Considerations

The project follows several basic security practices:

* Secrets are stored in environment variables.
* Auth0 access tokens are validated on the backend.
* Protected API routes require authentication.
* Authentication configuration is separated from application logic.
* `.env` files should not be committed to source control.

Before production deployment, additional measures such as rate limiting, security headers, stricter CORS configuration, and centralized logging should be considered.

---

# Local Development

Run the backend and frontend in separate terminals.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Assignment Deliverables

The project includes the following assignment-related deliverables:

* Full-stack weather analytics application
* Custom Comfort Index implementation
* Auth0 authentication
* Redis caching with fallback
* Responsive dashboard
* Unit tests for the scoring logic
* Sorting and filtering
* Table/grid views
* Comfort breakdown chart
* Dark/light mode

---

## Author

Developed as part of a technical assessment for an IT company.

**Project:** Weather Analytics — Comfort Index
**Stack:** React + Node.js + Express + Redis + Auth0
