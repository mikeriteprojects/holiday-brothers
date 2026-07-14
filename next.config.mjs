/** @type {import('next').NextConfig} */
// GitHub Pages serves a project repo (not a custom domain or a
// <user>.github.io repo) at /<repo-name>/ — basePath/assetPrefix are only
// needed for that production build, not local dev, so they're gated behind
// the GITHUB_ACTIONS env var the workflow sets.
const isGithubActionsBuild = process.env.GITHUB_ACTIONS === "true";
const repoName = "holiday-brothers";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGithubActionsBuild ? `/${repoName}` : "",
  assetPrefix: isGithubActionsBuild ? `/${repoName}/` : "",
  env: {
    // Mirrors basePath into a client-readable var: next/image renders a raw
    // <img src> (no basePath auto-prefixing) once images.unoptimized is on,
    // since that prefixing normally happens in the optimization loader path.
    NEXT_PUBLIC_BASE_PATH: isGithubActionsBuild ? `/${repoName}` : "",
  },
};

export default nextConfig;
