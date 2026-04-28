# Video Processing Reference

This project ships short, looping videos in `src/assets/`. Workflow clips
are capped at **30 fps**. **MP4** outputs are opaque (`yuv420p`); **WebM**
workflow outputs keep **alpha** (`yuva420p`) where the source is
transparent. The hero background assets are opaque.

The high-quality sources live in `videos/` (gitignored, large) and never
ship in the bundle:

| Source                  | Output assets                                                | Preset         |
| ----------------------- | ------------------------------------------------------------ | -------------- |
| `videos/hero-bg.mp4`    | `src/assets/hero-bg.mp4`, `src/assets/hero-bg.webm`          | separate hero encode |
| `videos/research.webm`  | `src/assets/research.mp4`, `src/assets/research.webm`        | 900p, 30 fps   |
| `videos/slack.webm`     | `src/assets/slack.mp4`, `src/assets/slack.webm`              | 900p, 30 fps   |

The current workflow sources carry VP9 `alpha_mode=1`. The optimizer decodes
them with `libvpx-vp9`. **MP4** is flattened onto a solid white canvas for
Safari and other H.264 fallbacks. **WebM** keeps the alpha plane for
browsers that pick the VP9 source first.

## Asset Roles

- `hero-bg.mp4` — full-bleed hero background. Encoded with the most
  generous quality budget because blockiness is most visible here.
- `research.mp4`/`.webm`, `slack.mp4`/`.webm` — workflow demo panels.
  They sit inside a smaller container, so 900p remains sharper than the
  rendered desktop panel while keeping each shipped file under ~1 MB.

## Re-encoding

Whenever a source video changes, run the optimizer:

```bash
bun run videos:optimize
```

The script:

1. Reads source dimensions + duration with `ffprobe`.
2. Scales each source to `-2:900` and drops to 30 fps.
3. **MP4**: transparent sources are overlaid onto a 900-tall white canvas
   (`-filter_complex` → `yuv420p`). Opaque sources use a plain `-vf` chain.
4. **WebM**: transparent sources stay **`yuva420p`** (no matting), with
   **`-auto-alt-ref 0`** for correct VP9 alpha. Opaque sources use `yuv420p`.
5. Encodes MP4 with **libx264** (`-crf 27`, `-preset slow`,
   `-movflags +faststart`, `-pix_fmt yuv420p`).
6. Encodes WebM with **libvpx-vp9** (`-crf 35`, `-b:v 0`, `-row-mt 1`,
   `-cpu-used 4`, `-pix_fmt yuva420p` or `yuv420p` by source).
7. Writes everything to a temp directory first, prints a before/after table,
   then copies only `research.mp4`, `research.webm`, `slack.mp4`, and
   `slack.webm` into `src/assets/` after every encode succeeds.

By default the script runs `ffmpeg` through nix:

```bash
nix-shell -p ffmpeg --run '<ffmpeg command>'
```

If you already have `ffmpeg` and `ffprobe` on `PATH` (e.g. via Homebrew),
skip the nix wrapper:

```bash
bun scripts/optimize-videos.ts --no-nix
```

To preview the commands without running them, add `--dry-run`.

## Quality Tuning

Per-asset CRF values live in `scripts/optimize-videos.ts` in the `jobs`
array. The current preset was chosen after comparing 720p, 900p, 1080p,
CRF, and bitrate-targeted candidates. If a particular output is visibly soft
or blocky, lower its CRF by 1–2 and re-run the script. Approximate
sensitivity:

- **−1 CRF** → ~10–15 % larger file, modest quality bump.
- **−3 CRF** → noticeably crisper, ~30–50 % larger.

Hero quality should stay near the 700-800 KB target and is not replaced by
the workflow optimizer. If the source changes, sample CRF values around `15`
and keep the result under that budget.

## Verification

After re-encoding:

```bash
nix-shell -p ffmpeg --run 'for f in src/assets/{research,slack}.{mp4,webm}; do
  echo "=== $f ===";
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt \
    -show_entries format=duration,size,bit_rate \
    -of default=noprint_wrappers=1 "$f";
done'
```

Expect each workflow output to report `r_frame_rate=30/1` and `height=900`.
MP4 should be `pix_fmt=yuv420p`; WebM from transparent sources should be
`pix_fmt=yuva420p`. There should be no audio stream.

Then:

```bash
bun run dev      # eyeball hero + workflow panels in the browser
bun run build:prod
```

Confirm the bundle table in `build:prod` lists each `<name>-<hash>.mp4`
at the new (smaller) size.

## Common Pitfalls

- **Do not** feed a transparent WebM into x264 directly — the alpha plane
  becomes a solid black background. The script composites onto white **only
  for MP4**. WebM keeps alpha (`yuva420p` + `-auto-alt-ref 0`).
- **Do not** drop the hero quality budget further to chase bytes. The
  hero is above the fold and visibly sensitive to blockiness.
- If `nix-shell` cold-starts, the first invocation can spend a minute or
  two fetching the `ffmpeg` derivation. Subsequent runs are instant.
