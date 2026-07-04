const STYLE_ID = "dynamic-label-print-style";

/**
 * Prints only the element with class "print-label-sheet", sized to the
 * given physical label dimensions. Works regardless of what admin layout
 * chrome (sidebar/header) is currently on screen.
 */
export function printLabelSheet(widthMm: number, heightMm: number) {
  let styleTag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = STYLE_ID;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
    @media print {
      body * { visibility: hidden; }
      .print-label-sheet, .print-label-sheet * { visibility: visible; }
      .print-label-sheet {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }
      @page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }
    }
  `;

  const cleanup = () => {
    styleTag?.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.print();
}
