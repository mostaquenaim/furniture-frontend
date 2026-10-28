/**
 * Display-time sizing for Cloudinary images.
 *
 * Uploads are stored as a single URL with a width baked in (e.g.
 * `/upload/c_limit,w_1920,q_auto,f_auto/...`), which on its own makes phones
 * download desktop-sized files. These helpers swap that baked segment for the
 * width actually needed and build a srcset, so the browser picks the smallest
 * file that stays sharp. Non-Cloudinary URLs (placeholders, local assets) pass
 * through untouched.
 */

const UPLOAD = "/upload/";

// A leading transformation segment made only of sizing/format params, as
// written by handleUploadWithCloudinary (old and new). Anything else after
// /upload/ (version, folder) is left alone.
const BAKED_SEGMENT = /^(?:(?:w|h|c|q|f|dpr)_[^,/]+)(?:,(?:w|h|c|q|f|dpr)_[^,/]+)*\//;

// Few steps on purpose: every distinct width is a derived asset (and a
// transformation credit) on Cloudinary.
const WIDTHS = [320, 640, 960, 1280, 1920];

const isCloudinary = (url?: string | null): url is string =>
  !!url && url.includes("res.cloudinary.com") && url.includes(UPLOAD);

/** The same image, resized to at most `width` px (never upscaled). */
export const cldUrl = (url: string, width: number): string => {
  if (!isCloudinary(url)) return url;
  const i = url.indexOf(UPLOAD) + UPLOAD.length;
  const rest = url.slice(i).replace(BAKED_SEGMENT, "");
  return `${url.slice(0, i)}c_limit,w_${width},q_auto,f_auto/${rest}`;
};

/**
 * Props to spread on an <img>: `{...responsiveImg(url, "(min-width: 768px) 50vw, 100vw")}`.
 * `sizes` must describe the rendered width, or the browser over-fetches.
 * `maxWidth` caps the srcset for slots that are never shown large.
 */
export const responsiveImg = (
  url: string,
  sizes: string,
  maxWidth = 1920,
): { src: string; srcSet?: string; sizes?: string } => {
  if (!isCloudinary(url)) return { src: url };
  const widths = WIDTHS.filter((w) => w < maxWidth).concat(maxWidth);
  return {
    src: cldUrl(url, maxWidth),
    srcSet: widths.map((w) => `${cldUrl(url, w)} ${w}w`).join(", "),
    sizes,
  };
};
