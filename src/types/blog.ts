interface BlogCategory {
  name: string;
}

interface BlogSubCategory {
  subCategory: {
    name: string;
  };
}

export interface BlogPost {
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  category: BlogCategory;
  subCategories?: BlogSubCategory[];
}
