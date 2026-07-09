// Sample public media for the MVP. Swap from the admin Media Library / your CDN.
const BUCKET = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

export const SAMPLE = {
  showreel: `${BUCKET}/BigBuckBunny.mp4`,
  showreelPoster: "https://picsum.photos/seed/arka-hero-reel/1920/1080",
  reels: [
    `${BUCKET}/ForBiggerJoyrides.mp4`,
    `${BUCKET}/ForBiggerBlazes.mp4`,
    `${BUCKET}/ForBiggerFun.mp4`,
    `${BUCKET}/ForBiggerMeltdowns.mp4`,
  ],
  bts: [
    "https://picsum.photos/seed/arka-bts-1/900/600",
    "https://picsum.photos/seed/arka-bts-2/900/600",
    "https://picsum.photos/seed/arka-bts-3/900/600",
    "https://picsum.photos/seed/arka-bts-4/900/600",
  ],
};

export const img = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
