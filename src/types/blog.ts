interface BlogCategory {
  name: string;
}

interface BlogSubCategory {
  id: number;
  subCategory: {
    name: string;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  slug?: string;
  content: string;
  image?: string | null;
  published?: boolean;
  categoryId?: number | null;
  tags?: { tag: { id: number; name: string } }[];
  createdAt: string;
  updatedAt?: string;
  category?: BlogCategory & { id?: number; slug?: string };
  subCategories?: BlogSubCategory[];
}
