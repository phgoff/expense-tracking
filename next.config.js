/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      // https://nextjs.org/docs/app/api-reference/next-config-js/staleTimes
      dynamic: 60 * 60 * 24 * 1,
      static: 180,
    },
  },
};

export default nextConfig;
