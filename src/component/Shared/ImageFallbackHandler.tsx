export const IMAGE_PLACEHOLDER = "/images/placeholder.svg";

/**
 * Site-wide safety net for broken images. `error` events don't bubble, so a
 * single capture-phase listener on document catches failures from every <img>
 * (including next/image) and swaps in a neutral placeholder instead of the
 * browser's broken-image icon.
 *
 * Rendered as an inline <head> script so it is active before any image starts
 * loading — a useEffect would miss images that fail during the first paint.
 * Components with their own onError still win, since React's handler runs
 * after this capture listener. Opt out per element with `data-no-fallback`.
 */
const script = `document.addEventListener("error",function(e){var i=e.target;if(!(i instanceof HTMLImageElement))return;if(i.hasAttribute("data-no-fallback")||i.getAttribute("data-fallback-applied"))return;i.setAttribute("data-fallback-applied","true");i.removeAttribute("srcset");i.src="${IMAGE_PLACEHOLDER}";},true);`;

const ImageFallbackHandler = () => (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);

export default ImageFallbackHandler;
