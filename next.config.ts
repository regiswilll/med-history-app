import type { NextConfig } from "next";

// GitHub Pages serves this project from https://<user>.github.io/med-history-app/,
// so every link and asset needs that prefix. The deploy workflow sets
// PAGES_BASE_PATH; locally it's empty and the app runs at "/".
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Build to plain HTML/CSS/JS files in ./out — no server needed.
  output: "export",
  // Emit folder/index.html for every page, which is what GitHub Pages expects.
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  experimental: {
    agentFeedback: true,
  },
  // cacheComponents / partialPrefetching are off: they rely on a server and
  // fail the build with output: "export" ("PPR cannot be enabled in export mode").
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
