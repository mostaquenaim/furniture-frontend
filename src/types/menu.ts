import { JSX } from "react";

// Mobile Menu Item Types
export type MobileMenuItem =
  | { type: "link"; label: string }
  | { type: "collapsible"; label: string; links: string[]; expanded: boolean }
  | { type: "banner"; label: string };

// Mobile Menu Content mapping
export type MobileMenuContent = Record<string, MobileMenuItem[]>;

// MegaMenu Column Type
export interface MegaMenuColumn {
  title: string;
  links: string[];
}

// Props for MegaMenu
export interface MegaMenuProps {
  data: MegaMenuColumn[];
}

// Props for MobileMenuDrawer
export interface MobileMenuDrawerProps {
  navItems: string[];
  mobileMenuContent: MobileMenuContent;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  token: string | null;
  logoutIcon: () => JSX.Element;
  loading: boolean; 
}
