# CampusEats — SE3090 Lab 11

Student: Thammita T.R.S.K  
IT number: IT24103911  
Repository: https://github.com/SajanaKavishan/campuseats-task-tracker

## What has been prepared

The frontend is live at https://campuseats-it24103911.vercel.app . It reached Vercel Ready status; public `/`, `/dish/1`, and `/menu.json` requests returned HTTP 200. `VITE_API_URL=demo` is configured in the Vercel Production environment, so the site displays an explicitly labelled sample menu. A backend URL switches requests to `GET /api/menu`; failed live requests show an error.

The existing React/Vite frontend and ASP.NET Core 8 API passed local production builds. The application source is pushed to GitHub branch `chore/lab11-cloud-hosting` at commit `e1fea1553bbc966f5da95bfd5529978931d6d426`. Both GitHub Actions workflows passed. Backend/database deployment is documented, not completed.

Vercel Git integration was attempted but rejected by Vercel. The initial live deployment used its authenticated CLI. Complete the repository connection in the Vercel dashboard, then merge the prepared branch before configuring production deployments from main.

The supplied GitHub repository currently contains a Lab 08 task tracker. `repository/` is an isolated checkout where the full application update is prepared. The project ZIP includes the application, existing tracker, workflow, and these instructions. Do not upload the entire parent workspace: it contains other labs.

## 1. GitHub

The application has already been pushed to `chore/lab11-cloud-hosting`. Review this branch and merge it into main when ready; its frontend and API CI checks passed. The ZIP is a sanitized copy for submission or backup. Never upload `.env`, `appsettings.Local.json`, `node_modules`, `bin`, `obj`, or credentials.

## 2. Vercel frontend — complete this first

1. Sign in to Vercel and import `SajanaKavishan/campuseats-task-tracker`.
2. Set **Root Directory** to `campuseats-dashboard`.
3. Framework: Vite; install: `npm ci`; build: `npm run build`; output: `dist`.
4. Initially set `VITE_API_URL=demo` to display the explicitly labelled sample menu. This placeholder verifies frontend hosting only; it does not establish an end-to-end API/database deployment.
5. After the API is deployed, set `VITE_API_URL` to its HTTPS origin, e.g. `https://<your-service>.onrender.com`, and redeploy. This URL is public configuration, never a secret.
6. Open the resulting URL, search the menu, and refresh `/dish/1` to verify SPA routing. The tracked `vercel.json` provides the route fallback.
7. Capture the project dashboard, Ready status/build log, deployed site, and environment-variable names with values hidden.

Alternative Netlify settings: base directory `campuseats-dashboard`, build `npm run build`, publish `dist`. `public/_redirects` supplies SPA routing.

## 3. Neon database

Create a PostgreSQL project on Neon. Use the dashboard's actual database, username, and host; do not assume the database is named `campuseats`. Convert the connection details to an Npgsql connection string:

```text
Host=<host>;Database=<database>;Username=<username>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true
```

This is the SSL example used in the lab. Npgsql also supports `SSL Mode=VerifyFull` for certificate and hostname verification. Keep actual values in the host's private configuration, never the document or source.

Apply migrations BEFORE starting the cloud API. From `CampusEats.Api`, in PowerShell:

```powershell
$cloudConnection = Read-Host 'Cloud PostgreSQL connection string' -AsSecureString
$env:ConnectionStrings__Default = [System.Net.NetworkCredential]::new('', $cloudConnection).Password
try {
    dotnet ef database update
} finally {
    Remove-Item Env:\ConnectionStrings__Default -ErrorAction SilentlyContinue
    $cloudConnection.Dispose()
}
```

The design-time factory lets EF work without starting the API or requiring a JWT key. The existing migration creates MenuItems and Users. The API seeds three initial dishes after migration. No migration has been applied to a cloud database as part of local preparation.

## 4. Render API

1. Create a Web Service from the GitHub repository; select Docker.
2. Root Directory: `CampusEats.Api`; Dockerfile Path: `./Dockerfile`; Docker Build Context: `.`.
3. Set these variables in Render's Environment page:

| Variable | Value / purpose |
| --- | --- |
| ASPNETCORE_ENVIRONMENT | Production |
| ConnectionStrings__Default | Private Neon connection string with SSL |
| Jwt__Key | New random secret of at least 32 UTF-8 bytes |
| Jwt__Issuer | CampusEats |
| Jwt__Audience | CampusEatsUsers |
| Cors__AllowedOrigins__0 | Exact Vercel frontend origin; HTTPS, no trailing slash |

4. Use `/health` as the health check path. Render supplies `PORT`; the API binds to `0.0.0.0` on that port. Its container receives HTTP behind Render's HTTPS proxy.
5. Deploy only after the database migration succeeds. Test `GET /api/menu` and `/health`. Swagger remains development-only, so use `/api/menu` for production evidence.
6. Set the frontend's `VITE_API_URL` and redeploy the frontend.

Generate the production JWT key privately with a password manager or cryptographic generator. Do not reuse development credentials or share the key in chat/screenshots.

For local development, the original local configuration is preserved in ignored `CampusEats.Api/appsettings.Local.json`. This file is excluded from the Docker image and project ZIP. Environment variables override it. ASP.NET Core does not automatically load `.env` files; the `.env.example` files document names only.

## 5. Testing and monitoring evidence

Record actual outcomes in the Word report. Local checks are not cloud evidence.

- Open the live frontend: page and search should work.
- With a configured backend, the browser Network panel should show `GET <backend>/api/menu` with HTTP 200 and database-backed JSON. A sample menu alone is not an end-to-end test.
- Call `/api/menu` directly and record the status and response.
- Check `/health` returns HTTP 200. It queries the menu table; database/schema failures produce HTTP 503 without exposing credentials.
- Record the latest successful deployment's commit and build duration.
- Capture the Vercel build log and Render runtime log. Explain one real line such as the server's listening address. Do not invent a log line or successful status.
- For CORS failures, compare the browser's exact frontend origin with `Cors__AllowedOrigins__0` and verify `VITE_API_URL` is the correct HTTPS API origin. Redeploy after changes.
- For database failures, check the host/database/username, SSL settings, and applied migrations. An idle service may require a warm-up request; consult its current hosting plan.

## 6. Finish the submission

Open `IT24103911_Lab11.docx`, add the actual frontend/API URLs, and replace each evidence placeholder with its corresponding real screenshot. Update the reflection to match deployment results. The document distinguishes completed local work from pending cloud steps. Submit the Word document to CourseWeb; include the sanitized project ZIP only if requested by the lecturer.

Lecture 11 slides were not supplied. The report follows the workflow described in the lab sheet; check it against your lecturer's slides before submission.

## Documentation checked

- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite): SPA rewrites and environment variables.
- [Render web services](https://render.com/docs/web-services): Docker services and port binding.
- [Render health checks](https://render.com/docs/health-checks): deployment readiness.
- [Neon connection guide](https://neon.com/docs/connect/connect-from-any-app): managed PostgreSQL connections.
- [Npgsql SSL modes](https://www.npgsql.org/doc/api/Npgsql.SslMode.html): SSL options.
