export type TitlePoint = {
  x: number;
  y: number;
  color?: string;
};

const ALPHA_THRESHOLD = 128;

export async function sampleTitlePoints(
  title: HTMLElement,
  text: string,
  lite: boolean
): Promise<TitlePoint[]> {
  await document.fonts.ready;

  const style = window.getComputedStyle(title);
  const font = [
    style.fontStyle,
    style.fontVariant,
    style.fontWeight,
    style.fontSize,
    style.fontFamily,
  ].join(" ");
  const width = Math.max(1, Math.ceil(window.innerWidth));
  const height = Math.max(1, Math.ceil(window.innerHeight));
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;

  const context = offscreen.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Impossible de créer le canvas du titre.");

  context.font = font;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#fff";
  context.fillText(text, width / 2, height / 2);

  const pixels = context.getImageData(0, 0, width, height).data;
  const target = lite ? 400 : 1200;
  const step = Math.max(1, Math.floor(Math.sqrt((width * height) / (target * 7))));
  const candidates: TitlePoint[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (pixels[(y * width + x) * 4 + 3] >= ALPHA_THRESHOLD) {
        candidates.push({ x, y });
      }
    }
  }

  if (candidates.length <= target) return candidates;

  const points: TitlePoint[] = [];
  const stride = candidates.length / target;
  for (let index = 0; index < target; index++) {
    points.push(candidates[Math.floor(index * stride)]);
  }
  return points;
}

export async function sampleLogoPoints(
  image: HTMLImageElement,
  lite: boolean
): Promise<TitlePoint[]> {
  await image.decode();

  const bounds = image.getBoundingClientRect();
  const left = Math.max(0, Math.floor(bounds.left));
  const top = Math.max(0, Math.floor(bounds.top));
  const right = Math.min(window.innerWidth, Math.ceil(bounds.right));
  const bottom = Math.min(window.innerHeight, Math.ceil(bounds.bottom));
  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return [];

  const offscreen = document.createElement("canvas");
  offscreen.width = Math.max(1, Math.ceil(window.innerWidth));
  offscreen.height = Math.max(1, Math.ceil(window.innerHeight));

  const context = offscreen.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Impossible de créer le canvas du logo.");
  context.drawImage(image, bounds.left, bounds.top, bounds.width, bounds.height);

  const pixels = context.getImageData(left, top, width, height).data;
  const candidates: TitlePoint[] = [];
  const scanStep = lite ? 2 : 1;
  for (let y = 0; y < height; y += scanStep) {
    for (let x = 0; x < width; x += scanStep) {
      const pixel = (y * width + x) * 4;
      if (pixels[pixel + 3] < 96) continue;

      candidates.push({ x: left + x, y: top + y });
    }
  }

  const target = lite ? 1800 : 3200;
  if (candidates.length <= target) return candidates;

  const points: TitlePoint[] = [];
  const stride = candidates.length / target;
  for (let index = 0; index < target; index++) {
    points.push(candidates[Math.floor(index * stride)]);
  }
  return points;
}
