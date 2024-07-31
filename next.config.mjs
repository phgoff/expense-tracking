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
