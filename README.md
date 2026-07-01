# FocusLearn Backend

This backend powers the FocusLearn e-learning research prototype with JWT auth, study modules, quiz delivery, NASA-TLX surveys, analytics, logging, and CSV export capabilities.

## Quick start

1. Install dependencies:
   - `cd server`
   - `npm install`
2. Configure environment:
   - Copy `.env.example` to `.env`
   - Set `MONGO_URI` to your MongoDB connection string
3. Seed the database:
   - `npm run seed`
4. Start the server:
   - `npm run dev`
   - or `PORT=5001 npm run start` if port `5000` is unavailable

## Environment variables

- `NODE_ENV` - development or production
- `PORT` - API port
- `MONGO_URI` - MongoDB connection string
- `DB_NAME` - database name
- `JWT_SECRET` - access token signing secret
- `JWT_REFRESH_SECRET` - refresh token signing secret
- `JWT_EXPIRES_IN` - access token lifetime
- `JWT_REFRESH_EXPIRES_IN` - refresh token lifetime
- `CORS_ORIGIN` - allowed origins
- `RATE_LIMIT_WINDOW_MS` - rate limiter window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - maximum requests per window

## Authentication

### Register student

- `POST /api/auth/register`
- Body:
  - `fullName` (string)
  - `email` (string)
  - `password` (string)

### Student login

- `POST /api/auth/login`
- Body:
  - `email` (string)
  - `password` (string)

### Admin login

- `POST /api/auth/admin/login`
- Body:
  - `email` (string)
  - `password` (string)

### Current user

- `GET /api/auth/me`
- Auth: Bearer token required

### Refresh token

- `POST /api/auth/refresh`
- Body:
  - `refreshToken` (string)

## Modules

### Get all modules

- `GET /api/modules`
- Auth required

### Get single module

- `GET /api/modules/:id`
- Auth required

### Create module

- `POST /api/modules`
- Auth required (admin)
- Body:
  - `title` (string)
  - `description` (string)
  - `sections` (array of objects `{ title, content }`)
  - `isActive` (boolean)

### Update module

- `PUT /api/modules/:id`
- Auth required (admin)
- Body: same as create

### Delete module

- `DELETE /api/modules/:id`
- Auth required (admin)

## Quiz

### Get module questions

- `GET /api/quiz/:moduleId`
- Auth required
- Response excludes `correctAnswerIndex`

### Submit quiz

- `POST /api/quiz/submit`
- Auth required
- Body:
  - `moduleId` (string)
  - `answers` (array)
  - `testType` (optional, `immediate` or `delayed`)
  - `timeSpent` (optional number)

### Delayed eligibility

- `GET /api/quiz/:moduleId/eligibility`
- Auth required
- Response:
  - `{ eligible: false, message: 'Delayed assessment unavailable.' }` when outside window

## NASA-TLX

### Submit survey

- `POST /api/nasa-tlx`
- Auth required
- Body:
  - `moduleId` (string)
  - `mentalDemand` (number)
  - `physicalDemand` (number)
  - `temporalDemand` (number)
  - `performance` (number)
  - `effort` (number)
  - `frustration` (number)

Composite score is calculated server-side.

## Results

### Immediate result

- `GET /api/results/immediate/:moduleId`
- Auth required

### Delayed result

- `GET /api/results/delayed/:moduleId`
- Auth required

### Eligibility check

- `GET /api/results/eligibility/:moduleId`
- Auth required

## Logging

### Bulk logging

- `POST /api/logs`
- Auth required
- Body: array of log objects
  - `eventType`, `eventDetail`, `pageURL`, `timestamp`, `duration`

## Admin

### Dashboard statistics

- `GET /api/admin/dashboard`
- Auth required (admin)

### Participants

- `GET /api/admin/participants`
- Auth required (admin)

### Assign groups

- `POST /api/admin/participants/assign`
- Auth required (admin)
- Body:
  - `participantIds` (array of user ids)
  - `group` (`control` or `experimental`)

### Analytics

- `GET /api/admin/analytics`
- Auth required (admin)

### Results list

- `GET /api/admin/results`
- Auth required (admin)

### Export CSV

- `GET /api/admin/export`
- Auth required (admin)

## Default admin credentials

- Email: `admin@focuslearn.com`
- Password: `Admin123!`

## Notes

- Use the Authorization header: `Bearer <accessToken>`.
- The server expects valid JWTs and enforces role-based access for module and admin routes.
- If port `5000` is occupied, launch with `PORT=5001 npm run start`.
