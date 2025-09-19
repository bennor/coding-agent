const { withBotId } = require("botid/next/config");
const withVercelToolbar = require("@vercel/toolbar/plugins/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@vercel/sandbox"],
};

module.exports = withVercelToolbar()(withBotId(nextConfig));
