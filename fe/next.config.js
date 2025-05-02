/** @type {import('next').NextConfig} */

module.exports = {
  output: "standalone",
  telemetry: false, // Disable telemetry (sending data to Vercel)
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./src/utils/helpers/loader.js",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "ukm.ugm.ac.id",
        port: "",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ppsmb.ugm.ac.id",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pionir.ugm.ac.id",
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
