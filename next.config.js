const { withBotId } = require("botid/next/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@vercel/sandbox"],
};

module.exports = withBotId(nextConfig);
