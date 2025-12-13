export interface BannerLink {
  text: string;
  url: string;
}

export interface PromoBanner {
  id: string;
  text: string;
  links?: BannerLink[];
  bgColor: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
