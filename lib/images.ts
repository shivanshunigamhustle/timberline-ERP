// Curated, verified Unsplash photos — picked and visually confirmed per category
// (not random stock photos) so imagery actually matches what it represents.

function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=75&auto=format`;
}

export const CATEGORY_IMAGES = {
  Timber: ["photo-1567080586917-e6ab6aa0df85", "photo-1617615181070-ab4788da6d03"],
  Gas: ["photo-1644217209694-5ca176114adb", "photo-1596465664095-f1f622965562"],
  "Bio-products": ["photo-1613036582025-ba1d4ccb3226", "photo-1622641146379-2672c7437900"],
} as const;

export const ROLE_COVER_IMAGES = {
  Owner: "photo-1567080586917-e6ab6aa0df85",
  Accountant: "photo-1709880945165-d2208c6ad2ec",
  Cashier: "photo-1526304640581-d334cdbbf45e",
  Warehouse: "photo-1672552226380-486fe900b322",
  Driver: "photo-1616432043562-3671ea2e5242",
} as const;

export const TRUCK_IMAGES = [
  "photo-1682033239272-6b60b828a9a2", // loaded cargo truck
  "photo-1766785368863-f2188a8c8b32", // semi-trucks on highway
  "photo-1616432043562-3671ea2e5242", // delivery van at dusk
] as const;

function hashIndex(seed: string, length: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % length;
}

export function categoryImageUrl(productLine: keyof typeof CATEGORY_IMAGES, seed: string, w = 160, h = 160) {
  const options = CATEGORY_IMAGES[productLine];
  const id = options[hashIndex(seed, options.length)];
  return unsplash(id, w, h);
}

export function roleCoverUrl(role: keyof typeof ROLE_COVER_IMAGES, w = 640, h = 360) {
  return unsplash(ROLE_COVER_IMAGES[role], w, h);
}

export function truckImageUrl(index: number, w = 640, h = 360) {
  const id = TRUCK_IMAGES[index % TRUCK_IMAGES.length];
  return unsplash(id, w, h);
}
