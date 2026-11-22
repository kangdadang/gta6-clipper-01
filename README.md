# penyiksa hewan di gta6 — gta6-clipper-01

A 30-second vertical clip (720x1280, H.264 + AAC) cut for the make.fun
bounty **gta6-clipper-01 — "Clip GTA 6 for the most YouTube views"** ($500,
ranked by YouTube views).

## The clip

Source moment: GTA 6 gameplay inside a convenience store — a cat in an
orange vest wanders the aisle next to the player character (white tank top)
while the streamer (facecam, bottom-left) bursts out laughing, then folds
his hands together like he's praying. The joke is the title: the streamer
reacts as if the player is about to hurt the cat — "penyiksa hewan di GTA 6"
(animal abuser in GTA 6).

Edit (all decisions made by the AI agent in the recorded build session):

| Output time | Source time | What happens |
|---|---|---|
| 0.0–1.2s | 2.0–3.2s | Hook: cat clearest, streamer laughing. Title overlay "PENYIKSA HEWAN / DI GTA 6". |
| 1.2–5.0s | 3.2–7.0s | Player beside the cat, streamer laughing ("adaa kucingggg" → "bisa di tendang ga?"). |
| 5.0–7.0s | 7.0–9.0s | Wide store view; streamer starts bringing his hands together (the "wait, what?" hold). |
| 7.0–12.0s | 9.0–14.0s | Punch-in on the facecam so the prayer-hands reaction fills the frame. |
| 12.0–16.0s | 14.0–18.0s | make.fun pitch as on-screen text: "Mau bikin clip keren pakai AI / dan berpeluang dapat bayaran? / Cek make.fun - kode / ada di deskripsi." |
| 16.0–28.0s | 18.0–30.0s | Prayer hands, player at the counter, streamer lowers his hands near the end. |
| 28.0–30.0s | 2.0–4.0s | Loop echo: the cat again, matching the opening shot. |

All added text sits inside the black letterbox bars, so it never covers the
cat's face or the streamer's hands. Original audio is kept throughout.

## Build

Requires `ffmpeg` on PATH and Node.js 22.18+.

```sh
node main.ts        # renders clip.mp4 from source.mp4
```

`main.ts` uses only the Node.js standard library and makes no network
calls. It invokes ffmpeg with the exact cut list above, so the clip is
fully reproducible from `source.mp4`.

## YouTube upload

Post `clip.mp4` as a **public** YouTube Short (or video). The description
must carry this line, plus the make.fun play code:

> Made by my AI agent for a $500 bounty on make.fun, where you can earn
> money making clips with AI: https://make.fun/bounty/gta6-clipper-01

Play code: `makefun-frosting-guppy-sauce`

Title: **penyiksa hewan di gta6**

After uploading, put the video's YouTube URL into `VIDEO.json`
(`youtube_url`), then submit the repo to make.fun. The video must stay
public until the results are out.

## Source

The source moment is GTA 6 gameplay footage found on TikTok (@hyclippp),
used as the "found moment" the bounty asks for ("find a GTA 6 moment in
gameplay or livestreams"). The agent's work is the choice of moment, the
creative (title, punch-in, loop), the make.fun pitch, and the cut/render
itself — all performed by `main.ts` in the recorded build session.

## License

MIT — see `LICENSE`.
