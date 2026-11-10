# KEPHAS Young Builders Registration Portal

A complete registration portal for KEPHAS Young Builders, built with React + Vite on the frontend and Node.js + Express on the backend. The application supports public registration, admin management, and secure email delivery workflow for a weekend online programme for children ages 10 to 19.

## Programme facts

- Programme: KEPHAS Young Builders
- Focus: Web Development, AI & Online Safety
- Delivery: Online
- Age range: 10–19
- Duration: 3 months
- Schedule: Weekends
- Fee: ₦35,000 per child
- Free first session
- Limited spots

## Features

- Public landing page with programme information
- Parent/guardian registration form for children aged 10–19
- Client-side and server-side validation
- DOB age calculation and unique registration references
- Duplicate-submission prevention
- MongoDB-backed persistence with in-memory fallback for development
- Resend email integration with independent admin and parent delivery statuses
- Retry/resend support for failed emails
- Protected admin dashboard with secure JWT login
- Search, filter, status updates, and CSV export
- Privacy notice, secure environment variables, and rate limiting
- Input sanitization and access-controlled admin endpoints
- Separate public and admin routes: `/`, `/registration/success`, `/admin/login`, and `/admin/dashboard`

## Stack

- Frontend: React, Vite, JSX, CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas or local MongoDB
- Email: Resend

## Local setup

1. Install dependencies:
   npm install
2. Copy the environment template:
   copy .env.example .env
3. Update the values in .env for your environment.
4. Start the app in development mode:
   npm run dev
5. Open the frontend at http://localhost:5173

## Production build

npm run build

## Start the production server

npm start

After building, the Express server serves the frontend bundle and falls back to the React app for direct route loads and browser refreshes. The production frontend uses same-origin `/api` requests unless `VITE_API_URL` is set.

## Environment variables

See .env.example for the required configuration values including:

- PORT
- CLIENT_URL
- MONGODB_URI
- JWT_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD
- ADMIN_EMAIL
- RESEND_API_KEY
- EMAIL_FROM
- RATE_LIMIT_WINDOW_MS
- RATE_LIMIT_MAX

## Deployment preparation

### Vercel frontend

- Connect the frontend GitHub repository to Vercel with the repository root as the project root.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add `VITE_API_URL` in Vercel Project Settings → Environment Variables with the value `https://kephas-server.onrender.com/api`, then redeploy. The value is not a secret and is intentionally not stored in a committed environment file.
- `vercel.json` rewrites direct route requests to the React app so `/admin/login`, `/admin/dashboard`, and `/registration/success` work after refresh.

### Render backend

- Deploy the separate `server` repository as a Node web service with build command `npm ci` and start command `npm start`.
- Set `CLIENT_URL` to the exact Vercel site origin.
- Configure `MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`, `RESEND_API_KEY`, and `EMAIL_FROM` in Render's environment settings. Use a production MongoDB Atlas connection string and a verified Resend sender domain.
- Confirm `/api/health` reports `database: connected` before accepting registrations; the in-memory fallback is not durable.
- Enable HTTPS and keep all credentials in hosting environment settings, never in Git.

## Security notes

- Never commit .env files to source control.
- Keep admin credentials secure and rotate them regularly.
- Use HTTPS in production and set a strong JWT secret.
- Validate and sanitize all user inputs before persisting or sending mail.

## Admin access

Use the values you set in .env for the admin username and password at `/admin/login`.

## Notes

This portal intentionally records the registration before attempting email delivery so the system keeps a reliable record even when an email fails. Email delivery statuses remain transparent and visible for retries.
