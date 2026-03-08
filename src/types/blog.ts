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
  image?: string;
  createdAt: string;
  category: BlogCategory;
  subCategories?: BlogSubCategory[];
}
