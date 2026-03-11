import CategoryWiseProduct from "@/component/ProductDisplay/ByCategory/CategoryWiseProduct";
import FeaturedReview from "@/component/Reviews/FeaturedReview";

const CategoryWiseProductPage = () => {
  return (
    <div>
      <CategoryWiseProduct />

      {/* Featured Review */}
      <div className="px-4 md:px-12 lg:px-40 pb-8">
        <FeaturedReview />
      </div>
    </div>
  );
};

export default CategoryWiseProductPage;
