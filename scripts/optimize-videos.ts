#!/usr/bin/env bun
/**
 * Re-encode workflow demo videos from `videos/` into compact, 30 fps
 * `.mp4` and `.webm` assets in `src/assets/`.
 *
 * Transparent VP9 sources: **MP4** is matted onto white (`yuv420p`).
 * **WebM** keeps alpha (`yuva420p` + libvpx-vp9) for browsers that prefer it.
 *
 * Requires ffmpeg/ffprobe. By default they are provided by:
 *   nix-shell -p ffmpeg --run '<command>'
 *
 * Usage:
 *   bun run videos:optimize
 *   bun run videos:optimize --dry-run
 *   bun run videos:optimize --no-nix
 */

import { copyFile, mkdir, rm, stat } from "fs/promises"
import { basename, join, relative, resolve } from "path"
import { tmpdir } from "os"

const root = process.cwd()
const useNix = !process.argv.includes("--no-nix")
const dryRun = process.argv.includes("--dry-run")

const TARGET_FPS = 30
const TARGET_HEIGHT = 900

type Format = "mp4" | "webm"

interface Job {
  name: "research" | "slack"
  source: string
  height: number
  x264Crf: number
  vp9Crf: number
}

const jobs: Job[] = [
  { name: "research", source: "videos/research.webm", height: TARGET_HEIGHT, x264Crf: 27, vp9Crf: 35 },
  { name: "slack", source: "videos/slack.webm", height: TARGET_HEIGHT, x264Crf: 27, vp9Crf: 35 },
]

interface Probe {
  codec: string
  width: number
  height: number
  fps: string
  pixFmt: string
  alphaMode?: string
  duration: number
  size: number
  bitRate: number
}

interface EncodedAsset {
  name: string
  format: Format
  stagedPath: string
  beforeBytes: number
  afterBytes: number
  probe: Probe
}

function buildArgv(cmd: string): string[] {
  if (useNix) return ["nix-shell", "-p", "ffmpeg", "--run", cmd]
  return ["sh", "-c", cmd]
}

async function run(label: string, cmd: string, capture = false): Promise<string> {
  if (dryRun && !capture) {
    console.log(`  [dry-run] ${label}\n    $ ${cmd}`)
    return ""
  }

  const proc = Bun.spawn(buildArgv(cmd), {
    stdout: capture ? "pipe" : "inherit",
    stderr: capture ? "pipe" : "inherit",
  })
  const stdout = capture ? await new Response(proc.stdout).text() : ""
  const stderr = capture ? await new Response(proc.stderr).text() : ""
  const code = await proc.exited

  if (code !== 0) {
    if (capture) {
      console.error(stdout)
      console.error(stderr)
    }
    throw new Error(`${label} failed (exit ${code})`)
  }

  return stdout
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function sizeOf(path: string): Promise<number> {
  try {
    return (await stat(path)).size
  } catch {
    return 0
  }
}

async function probe(path: string): Promise<Probe> {
  const cmd = [
    "ffprobe",
    "-v error",
    "-select_streams v:0",
    "-show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt:stream_tags=alpha_mode",
    "-show_entries format=duration,size,bit_rate",
    "-of json",
    JSON.stringify(path),
  ].join(" ")
  const out = await run(`ffprobe ${path}`, cmd, true)
  const json = JSON.parse(out) as {
    streams: {
      codec_name: string
      width: number
      height: number
      r_frame_rate: string
      pix_fmt: string
      tags?: {
        alpha_mode?: string
      }
    }[]
    format: {
      duration?: string
      size?: string
      bit_rate?: string
    }
  }
  const stream = json.streams[0]
  if (!stream) throw new Error(`${path}: no video stream found`)

  return {
    codec: stream.codec_name,
    width: stream.width,
    height: stream.height,
    fps: stream.r_frame_rate,
    pixFmt: stream.pix_fmt,
    alphaMode: stream.tags?.alpha_mode,
    duration: Number.parseFloat(json.format.duration ?? "0"),
    size: Number.parseInt(json.format.size ?? "0", 10),
    bitRate: Number.parseInt(json.format.bit_rate ?? "0", 10),
  }
}

function hasAlpha(meta: Probe): boolean {
  return meta.pixFmt.includes("a") || meta.alphaMode === "1"
}

function scaledWidth(meta: Probe, height: number): number {
  const width = Math.round((meta.width / meta.height) * height)
  return width % 2 === 0 ? width : width + 1
}

function inputArgs(job: Job, meta: Probe): string {
  const decoder = hasAlpha(meta) && meta.codec === "vp9" ? "-c:v libvpx-vp9 " : ""
  return `${decoder}-i ${JSON.stringify(job.source)}`
}

/** Opaque MP4: mat transparent sources onto white; otherwise plain yuv420p. */
function filterArgsMp4(job: Job, meta: Probe): string {
  const scale = `fps=${TARGET_FPS},scale=-2:${job.height}:flags=lanczos`

  if (!hasAlpha(meta)) {
    return `-vf "${scale},format=yuv420p"`
  }

  const width = scaledWidth(meta, job.height)
  const graph =
    `color=c=white:s=${width}x${job.height}:r=${TARGET_FPS}[bg];` +
    `[0:v]${scale},format=yuva420p[fg];` +
    "[bg][fg]overlay=shortest=1:format=auto,format=yuv420p[out]"

  return `-filter_complex ${JSON.stringify(graph)} -map "[out]"`
}

/** Transparent WebM: keep alpha; opaque sources stay yuv420p. */
function filterArgsWebm(job: Job, meta: Probe): string {
  const scale = `fps=${TARGET_FPS},scale=-2:${job.height}:flags=lanczos`

  if (!hasAlpha(meta)) {
    return `-vf "${scale},format=yuv420p"`
  }

  return `-vf "${scale},format=yuva420p"`
}

async function encodeJob(job: Job, stageDir: string, assetDir: string): Promise<EncodedAsset[]> {
  if (!(await exists(resolve(root, job.source)))) {
    throw new Error(`Source missing: ${job.source}`)
  }

  const meta = await probe(job.source)
  const width = scaledWidth(meta, job.height)
  const inputs = inputArgs(job, meta)
  const filtersMp4 = filterArgsMp4(job, meta)
  const filtersWebm = filterArgsWebm(job, meta)
  const stagedBase = join(stageDir, job.name)

  console.log(
    `  ${job.source}: ${meta.width}x${meta.height} ${meta.fps} ${meta.pixFmt} -> ${width}x${job.height} ${TARGET_FPS}fps`,
  )

  const stagedMp4 = `${stagedBase}.mp4`
  await run(
    `${job.name}.mp4`,
    [
      "ffmpeg -y -hide_banner",
      inputs,
      filtersMp4,
      "-an",
      "-c:v libx264",
      `-preset slow -crf ${job.x264Crf}`,
      "-movflags +faststart",
      "-pix_fmt yuv420p",
      JSON.stringify(stagedMp4),
    ].join(" "),
  )

  const stagedWebm = `${stagedBase}.webm`
  const webmPixFmt = hasAlpha(meta) ? "yuva420p" : "yuv420p"
  await run(
    `${job.name}.webm`,
    [
      "ffmpeg -y -hide_banner",
      inputs,
      filtersWebm,
      "-an",
      "-c:v libvpx-vp9",
      ...(hasAlpha(meta) ? ["-auto-alt-ref 0"] : []),
      "-b:v 0",
      `-crf ${job.vp9Crf}`,
      "-deadline good",
      "-cpu-used 4",
      "-row-mt 1",
      "-tile-columns 2",
      `-pix_fmt ${webmPixFmt}`,
      JSON.stringify(stagedWebm),
    ].join(" "),
  )

  if (dryRun) return []

  const staged = [
    { format: "mp4" as const, path: stagedMp4 },
    { format: "webm" as const, path: stagedWebm },
  ]

  return Promise.all(
    staged.map(async (asset) => {
      const name = `${job.name}.${asset.format}`
      return {
        name,
        format: asset.format,
        stagedPath: asset.path,
        beforeBytes: await sizeOf(join(assetDir, name)),
        afterBytes: await sizeOf(asset.path),
        probe: await probe(asset.path),
      }
    }),
  )
}

function fmtBytes(bytes: number): string {
  if (!bytes) return "-"
  const units = ["B", "KB", "MB", "GB"]
  let value = bytes
  let index = 0

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index++
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[index]}`
}

function saved(before: number, after: number): string {
  if (!before) return "new"
  const diff = before - after
  return `${diff >= 0 ? "-" : "+"}${fmtBytes(Math.abs(diff))} (${((diff / before) * 100).toFixed(0)}%)`
}

function printTable(assets: EncodedAsset[]): void {
  console.table(
    assets.map((asset) => ({
      Asset: asset.name,
      Before: fmtBytes(asset.beforeBytes),
      After: fmtBytes(asset.afterBytes),
      Saved: saved(asset.beforeBytes, asset.afterBytes),
      Codec: asset.probe.codec,
      Size: `${asset.probe.width}x${asset.probe.height}`,
      FPS: asset.probe.fps,
      Bitrate: `${Math.round(asset.probe.bitRate / 1000)} kbps`,
    })),
  )
}

async function replaceAssets(assetDir: string, assets: EncodedAsset[]): Promise<void> {
  for (const asset of assets) {
    const dest = join(assetDir, asset.name)
    await copyFile(asset.stagedPath, dest)
    console.log(`  ${basename(asset.stagedPath)} -> ${relative(root, dest)}`)
  }
}

async function main(): Promise<void> {
  console.log(
    `Optimizing workflow videos${useNix ? " via nix-shell -p ffmpeg" : " with local ffmpeg"}${dryRun ? " (DRY RUN)" : ""}\n`,
  )

  const assetDir = resolve(root, "src/assets")
  const stageDir = join(tmpdir(), `landing-video-optimize-${Date.now()}`)
  await mkdir(stageDir, { recursive: true })

  try {
    const encoded: EncodedAsset[] = []

    for (const job of jobs) {
      console.log(`=== ${job.name} ===`)
      const assets = await encodeJob(job, stageDir, assetDir)
      encoded.push(...assets)
      console.log()
    }

    if (dryRun) {
      console.log("Dry run complete; no files replaced.")
      return
    }

    console.log("Candidate outputs:\n")
    printTable(encoded)

    console.log("\nReplacing workflow videos in src/assets/...\n")
    await replaceAssets(assetDir, encoded)
    console.log("\nDone.")
  } finally {
    await rm(stageDir, { recursive: true, force: true })
  }
}

await main()
