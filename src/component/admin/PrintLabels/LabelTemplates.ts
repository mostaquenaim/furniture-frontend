export interface LabelTemplate {
  name: string;
  widthMm: number;
  heightMm: number;
}

export const LABEL_TEMPLATES: LabelTemplate[] = [
  { name: "Small (25 x 38mm)", widthMm: 25, heightMm: 38 },
  { name: "Medium (38 x 50mm)", widthMm: 38, heightMm: 50 },
  { name: "Standard (50 x 76mm)", widthMm: 50, heightMm: 76 },
  { name: "Sakigai Thermal (50 x 100mm)", widthMm: 50, heightMm: 100 },
  {
    name: "Gprinter GP-3120TUC (58 x 38mm)",
    widthMm: 58.42,
    heightMm: 38.1,
  },
];

export const OG_TEMPLATE_NAME =
  "Gprinter GP-3120TUC (58 x 38mm)";

export const CUSTOM_TEMPLATE_NAME = "Custom";
