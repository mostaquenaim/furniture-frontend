import toast from "react-hot-toast";

export interface ImageSpec {
  width: number;
  height: number;
}

/**
 * Recommended upload sizes, derived from how each image is rendered on the
 * storefront (aspect ratio of its container). Single source of truth for both
 * the hint text next to each uploader and the dimension check below.
 */
export const IMAGE_SPECS = {
  heroDesktop: { width: 1920, height: 480 }, // aspect-4/1 slider (md+)
  heroMobile: { width: 1080, height: 1080 }, // aspect-square slider
  broadBanner: { width: 1920, height: 540 }, // lg:aspect-32/9
  seasonalCategory: { width: 800, height: 200 }, // aspect-4/1
  galleryHeading: { width: 1920, height: 100 }, // full-width, 96px tall
  galleryItem: { width: 600, height: 1000 }, // aspect-3/5
  featuredCategory: { width: 800, height: 800 }, // aspect-square
  series: { width: 1000, height: 1000 }, // aspect-square grids
  category: { width: 800, height: 800 },
  subcategory: { width: 800, height: 800 },
  blogCover: { width: 1200, height: 675 }, // 16:9; optimizer caps at 1200
  product: { width: 960, height: 1200 }, // 4:5; optimizer caps at 1200
  colorSwatch: { width: 200, height: 200 },
} satisfies Record<string, ImageSpec>;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** e.g. "1920×480px (4:1)" */
export const specLabel = ({ width, height }: ImageSpec) => {
  const d = gcd(width, height);
  const w = width / d;
  const h = height / d;
  // Ratios like 96:5 aren't meaningful to a person — skip them
  return w <= 32 && h <= 32
    ? `${width}×${height}px (${w}:${h})`
    : `${width}×${height}px`;
};

// Tolerances: small ratio differences crop invisibly; below 75% of the
// recommended width the image is noticeably upscaled.
const RATIO_TOLERANCE = 0.1;
const MIN_SIZE_FACTOR = 0.75;

const readDimensions = (file: File) =>
  new Promise<ImageSpec>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error("Unreadable image"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

const evaluate = async (file: File, spec: ImageSpec) => {
  let actual: ImageSpec;
  try {
    actual = await readDimensions(file);
  } catch {
    return null; // Let the normal upload path surface unreadable files
  }

  const expectedRatio = spec.width / spec.height;
  const actualRatio = actual.width / actual.height;
  const ratioOff =
    Math.abs(actualRatio - expectedRatio) / expectedRatio > RATIO_TOLERANCE;
  const tooSmall = actual.width < spec.width * MIN_SIZE_FACTOR;

  return { actual, ratioOff, tooSmall };
};

/**
 * Advisory check for multi-file pickers: one summary toast instead of one
 * per file.
 */
export const checkImagesDimensions = async (
  files: File[],
  spec: ImageSpec,
) => {
  const results = await Promise.all(files.map((f) => evaluate(f, spec)));
  const flagged = results.filter((r) => r && (r.ratioOff || r.tooSmall));
  if (flagged.length === 0) return;

  if (files.length === 1) {
    void checkImageDimensions(files[0], spec);
    return;
  }

  toast(
    `${flagged.length} of ${files.length} images don't match the recommended ${specLabel(
      spec,
    )} — they may be cropped or look blurry.`,
    { icon: "⚠️", duration: 7000 },
  );
};

/**
 * Advisory check run when an admin picks a file. Never blocks the upload —
 * it only warns when the image will be visibly cropped or look blurry.
 */
export const checkImageDimensions = async (file: File, spec: ImageSpec) => {
  const result = await evaluate(file, spec);
  if (!result) return;
  const { actual, ratioOff, tooSmall } = result;

  if (!ratioOff && !tooSmall) return;

  const issues = [
    ratioOff && "its shape differs, so parts will be cropped",
    tooSmall && "it's smaller than recommended and may look blurry",
  ].filter(Boolean);

  toast(
    `This image is ${actual.width}×${actual.height}px — ${issues.join(
      " and ",
    )}. Recommended: ${specLabel(spec)}.`,
    { icon: "⚠️", duration: 7000 },
  );
};
