/**
 * Server-only environment configuration.
 *
 * The browser never talks to Django directly — all requests go through the
 * Next.js BFF route handlers, which read these values server-side. That keeps
 * the JWT and the Django origin out of client bundles.
 */
export const env = {
  /** Base origin of the Django API, e.g. http://localhost:8000 */
  djangoApiUrl: (process.env.DJANGO_API_URL ?? "http://localhost:8000").replace(
    /\/$/,
    "",
  ),
  /** Base URL the hosted HTML game bundles are served from. */
  gamesBaseUrl: (
    process.env.NEXT_PUBLIC_GAMES_BASE_URL ?? "http://localhost:8000"
  ).replace(/\/$/, ""),
  /** App version reported to the backend (game manifest gating, telemetry). */
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  isProd: process.env.NODE_ENV === "production",
};

/** Full versioned API base, e.g. http://localhost:8000/api/v1 */
export const djangoApiBase = `${env.djangoApiUrl}/api/v1`;
