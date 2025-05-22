/** @type {import('next').NextConfig} */

module.exports = {
  telemetry: false, // Disable telemetry (sending data to Vercel)
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    loader: "custom",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
      },
    ],
  },
  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.mainFields = ["browser", "module", "main"];
    return config;
  },
};
