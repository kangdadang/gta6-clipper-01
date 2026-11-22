// gta6-clipper-01 — "penyiksa hewan di gta6"
// Cut + render the YouTube Short from source.mp4 (30s vertical GTA 6 gameplay,
// TikTok @hyclippp: a cat in an orange vest inside a convenience store, the
// player character beside it, streamer facecam bottom-left reacting).
//
// What this program does (the edit decisions, all chosen in this session):
//   0.0 - 1.2s  HOOK  — source 2.0-3.2s (cat clearest, streamer laughing).
//                   Big title overlay: "PENYIKSA HEWAN / DI GTA 6".
//   1.2 - 5.0s        source 3.2-7.0s — player beside the cat, streamer
//                   laughing ("adaa kucingggg" -> "bisa di tendang ga?").
//   5.0 - 7.0s        source 7.0-9.0s — wide store view, streamer starts
//                   bringing his hands together (the "wait, what?" hold).
//   7.0 - 12.0s       source 9.0-14.0s — PUNCH-IN on the facecam
//                   (crop 480x853 at bottom-left, scaled back to 720x1280)
//                   so the prayer-hands reaction fills the frame.
//   12.0- 16.0s       source 14.0-18.0s — make.fun PITCH as on-screen text
//                   in the bottom letterbox bar (footage keeps moving):
//                   "Mau bikin clip keren pakai AI / dan berpeluang dapat
//                   bayaran? / Cek make.fun - kode / ada di deskripsi."
//   16.0- 28.0s       source 18.0-30.0s — prayer hands, player at the
//                   counter, streamer lowers his hands near the end.
//   28.0- 30.0s       LOOP ECHO — source 2.0-4.0s (the cat again),
//                   so the ending visually matches the opening hook.
//
// Text is placed only inside the black letterbox bars (top bar y 0-340,
// bottom bar y 940-1280 of the 720x1280 frame), so it never covers the
// cat's face or the streamer's hands.
//
// Standard library only, no network. Requires ffmpeg on PATH.
// Run:  node main.ts        (produces clip.mp4 next to source.mp4)

import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const SRC = join(dir, "source.mp4");
const OUT = join(dir, "clip.mp4");
const FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";

// Drawtext helper: one filter string for a single line of text.
function text(
  value: string,
  fontsize: number,
  x: string,
  y: number,
): string {
  // Values contain no ':' or ',' so no ffmpeg escaping is needed.
  return (
    `drawtext=fontfile=${FONT}:text='${value}'` +
    `:fontsize=${fontsize}:fontcolor=white:borderw=3:bordercolor=black` +
    `:x=${x}:y=${y}`
  );
}

const CENTER_X = "(w-text_w)/2";

// --- video segments (trim + setpts, then optional text / punch-in) ---
// Every segment ends with setsar=1,format=yuv420p so the concat filter
// sees identical frame parameters (the HEVC source carries SAR 640:639).
const NORM = "setsar=1,format=yuv420p";
const v1 = [
  `[0:v]trim=start=2.0:end=3.2,setpts=PTS-STARTPTS,${NORM}`,
  text("PENYIKSA HEWAN", 58, CENTER_X, 95),
  text("DI GTA 6", 58, CENTER_X, 175),
].join(",");
const v2 = `[0:v]trim=start=3.2:end=7.0,setpts=PTS-STARTPTS,${NORM}`;
const v3 = `[0:v]trim=start=7.0:end=9.0,setpts=PTS-STARTPTS,${NORM}`;
// Punch-in on the streamer facecam (bottom-left): crop a 480x853 window
// that holds the facecam, then scale it back to full 720x1280.
// The window starts at y=300 so the facecam lands mid-frame and the
// bottom letterbox bar takes only ~25% of the frame, not ~40%.
const v4 =
  "[0:v]trim=start=9.0:end=14.0,setpts=PTS-STARTPTS," +
  `crop=480:853:0:300,scale=720:1280,${NORM}`;
const v5 = [
  `[0:v]trim=start=14.0:end=18.0,setpts=PTS-STARTPTS,${NORM}`,
  text("Mau bikin clip keren pakai AI", 36, CENTER_X, 975),
  text("dan berpeluang dapat bayaran?", 36, CENTER_X, 1025),
  text("Cek make.fun - kode", 36, CENTER_X, 1075),
  text("ada di deskripsi.", 36, CENTER_X, 1125),
].join(",");
const v6 = `[0:v]trim=start=18.0:end=30.0,setpts=PTS-STARTPTS,${NORM}`;
const v7 = `[0:v]trim=start=2.0:end=4.0,setpts=PTS-STARTPTS,${NORM}`;

// --- audio segments (same cuts, so sound follows the picture) ---
const audioCuts: Array<[number, number]> = [
  [2.0, 3.2],
  [3.2, 7.0],
  [7.0, 9.0],
  [9.0, 14.0],
  [14.0, 18.0],
  [18.0, 30.0],
  [2.0, 4.0],
];
const audioFilters = audioCuts
  .map(
    ([start, end], i) =>
      `[0:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${i + 1}]`,
  )
  .join(";");

const videoFilters = [
  `${v1}[v1]`,
  `${v2}[v2]`,
  `${v3}[v3]`,
  `${v4}[v4]`,
  `${v5}[v5]`,
  `${v6}[v6]`,
  `${v7}[v7]`,
].join(";");

const filterComplex =
  `${videoFilters};${audioFilters};` +
  "[v1][v2][v3][v4][v5][v6][v7]concat=n=7:v=1:a=0[vout];" +
  "[a1][a2][a3][a4][a5][a6][a7]concat=n=7:v=0:a=1[aout]";

function main(): void {
  if (!existsSync(SRC)) {
    console.error(`missing source: ${SRC}`);
    process.exit(1);
  }
  if (!existsSync(FONT)) {
    console.error(`missing font: ${FONT}`);
    process.exit(1);
  }

  const args = [
    "-y",
    "-v",
    "error",
    "-i",
    SRC,
    "-filter_complex",
    filterComplex,
    "-map",
    "[vout]",
    "-map",
    "[aout]",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    OUT,
  ];

  const res = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (res.error) {
    console.error("failed to run ffmpeg:", res.error.message);
    process.exit(1);
  }
  if (res.status !== 0) {
    console.error(`ffmpeg exited with status ${res.status}`);
    process.exit(1);
  }

  const size = statSync(OUT).size;
  console.log(`wrote ${OUT} (${size} bytes)`);
}

main();
