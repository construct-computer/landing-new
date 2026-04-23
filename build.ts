#!/usr/bin/env bun
import plugin from "bun-plugin-tailwind";
import { existsSync } from "fs";
import { copyFile, mkdir, rm, writeFile, readFile } from "fs/promises";
import path from "path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🏗️  Bun Build Script

Usage: bun run build.ts [options]

Common Options:
  --outdir <path>          Output directory (default: "dist")
  --minify                 Enable minification (or --minify.whitespace, --minify.syntax, etc)
  --sourcemap <type>      Sourcemap type: none|linked|inline|external
  --target <target>        Build target: browser|bun|node
  --format <format>        Output format: esm|cjs|iife
  --splitting              Enable code splitting
  --packages <type>        Package handling: bundle|external
  --public-path <path>     Public path for assets
  --env <mode>             Environment handling: inline|disable|prefix*
  --conditions <list>      Package.json export conditions (comma separated)
  --external <list>        External packages (comma separated)
  --banner <text>          Add banner text to output
  --footer <text>          Add footer text to output
  --define <obj>           Define global constants (e.g. --define.VERSION=1.0.0)
  --help, -h               Show this help message

Example:
  bun run build.ts --outdir=dist --minify --sourcemap=linked --external=react,react-dom
`);
  process.exit(0);
}

const toCamelCase = (str: string): string => str.replace(/-([a-z])/g, g => g[1].toUpperCase());

const parseValue = (value: string): any => {
  if (value === "true") return true;
  if (value === "false") return false;

  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

  if (value.includes(",")) return value.split(",").map(v => v.trim());

  return value;
};

function parseArgs(): Partial<Bun.BuildConfig> {
  const config: Partial<Bun.BuildConfig> = {};
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === undefined) continue;
    if (!arg.startsWith("--")) continue;

    if (arg.startsWith("--no-")) {
      const key = toCamelCase(arg.slice(5));
      config[key] = false;
      continue;
    }

    if (!arg.includes("=") && (i === args.length - 1 || args[i + 1]?.startsWith("--"))) {
      const key = toCamelCase(arg.slice(2));
      config[key] = true;
      continue;
    }

    let key: string;
    let value: string;

    if (arg.includes("=")) {
      [key, value] = arg.slice(2).split("=", 2) as [string, string];
    } else {
      key = arg.slice(2);
      value = args[++i] ?? "";
    }

    key = toCamelCase(key);

    if (key.includes(".")) {
      const [parentKey, childKey] = key.split(".");
      config[parentKey] = config[parentKey] || {};
      config[parentKey][childKey] = parseValue(value);
    } else {
      config[key] = parseValue(value);
    }
  }

  return config;
}

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

console.log("\n🚀 Starting build process...\n");

const cliConfig = parseArgs();
const outdir = (cliConfig.outdir as string) || path.join(process.cwd(), "dist");

if (existsSync(outdir)) {
  console.log(`🗑️ Cleaning previous build at ${outdir}`);
  await rm(outdir, { recursive: true, force: true });
}

const start = performance.now();

const entrypoints = [...new Bun.Glob("**.html").scanSync("src")]
  .map(a => path.resolve("src", a))
  .filter(dir => !dir.includes("node_modules"));
console.log(`📄 Found ${entrypoints.length} HTML ${entrypoints.length === 1 ? "file" : "files"} to process\n`);

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [plugin],
  minify: true,
  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  ...cliConfig,
});

const end = performance.now();

// Copy the logo to a stable, unhashed path so absolute URLs like
// https://construct.computer/logo.png (used for OG/Twitter cards) resolve.
const logoSrc = path.resolve("src/assets/logo.png");
const logoDest = path.join(outdir, "logo.png");
if (existsSync(logoSrc)) {
  await copyFile(logoSrc, logoDest);
}

const outputTable = result.outputs.map(output => ({
  File: path.relative(process.cwd(), output.path),
  Type: output.kind,
  Size: formatFileSize(output.size),
}));

console.table(outputTable);
const buildTime = (end - start).toFixed(2);

console.log(`\n✅ Bundle built in ${buildTime}ms\n`);

/* -------------------------------------------------------------------- */
/* Static-site generation: render each route into dist/<path>/index.html */
/* -------------------------------------------------------------------- */

console.log("🧱 Pre-rendering routes...\n");
const ssgStart = performance.now();

const { renderToString } = await import("react-dom/server");
const { createElement } = await import("react");
const { App } = await import("./src/App");
const { ROUTES } = await import("./src/seo/routes");
const { renderHeadForRoute } = await import("./src/seo/head");
const {
  robotsTxt,
  sitemapXml,
  llmsTxt,
  llmsFullTxt,
  securityTxt,
  manifestJson,
} = await import("./src/seo/crawlerFiles");

const templatePath = path.join(outdir, "index.html");
const template = await readFile(templatePath, "utf8");

const HEAD_BLOCK = /<!--\s*ssg:head\s*-->[\s\S]*?<!--\s*\/ssg:head\s*-->/;
const ROOT_BLOCK = /<!--\s*ssg:root\s*-->[\s\S]*?<!--\s*\/ssg:root\s*-->/;

const renderedRoutes: { path: string; file: string; bytes: number }[] = [];

for (const route of ROUTES) {
  const body = renderToString(
    createElement(App as any, { initialPath: route.path }),
  );

  const head = renderHeadForRoute(route);

  const html = template
    .replace(HEAD_BLOCK, head)
    .replace(ROOT_BLOCK, body);

  // `/` → dist/index.html (overwrites template). Others → dist/<path>/index.html.
  const targetDir =
    route.path === "/"
      ? outdir
      : path.join(outdir, route.path.replace(/^\//, ""));
  await mkdir(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, "index.html");
  await writeFile(targetFile, html, "utf8");
  renderedRoutes.push({
    path: route.path,
    file: path.relative(process.cwd(), targetFile),
    bytes: Buffer.byteLength(html),
  });
}

console.table(
  renderedRoutes.map((r) => ({
    Route: r.path,
    File: r.file,
    Size: formatFileSize(r.bytes),
  })),
);

/* -------------------------------------------------------------------- */
/* Crawler-discovery files                                              */
/* -------------------------------------------------------------------- */

await writeFile(path.join(outdir, "robots.txt"), robotsTxt(), "utf8");
await writeFile(path.join(outdir, "sitemap.xml"), sitemapXml(), "utf8");
await writeFile(path.join(outdir, "llms.txt"), llmsTxt(), "utf8");
await writeFile(path.join(outdir, "llms-full.txt"), llmsFullTxt(), "utf8");
await writeFile(path.join(outdir, "manifest.webmanifest"), manifestJson(), "utf8");

const wellKnownDir = path.join(outdir, ".well-known");
await mkdir(wellKnownDir, { recursive: true });
await writeFile(path.join(wellKnownDir, "security.txt"), securityTxt(), "utf8");

const ssgEnd = performance.now();
console.log(
  `\n✅ SSG + crawler files written in ${(ssgEnd - ssgStart).toFixed(2)}ms`,
);
console.log(
  `   - ${renderedRoutes.length} pre-rendered routes\n   - robots.txt, sitemap.xml, llms.txt, llms-full.txt, manifest.webmanifest, .well-known/security.txt\n`,
);
