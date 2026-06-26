/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Django paths are slash-terminated; let "/api/proxy/foo/" reach the catch-all
  // route handler directly instead of issuing a 308 trailing-slash redirect.
  skipTrailingSlashRedirect: true,
  // Security headers applied to every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
