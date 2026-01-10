import ProtectedRoute from "@/component/ProtectedRoute";
import WishlistComponent from "@/component/Wish/WishlistComponent";

const Wishlist = () => {
  return (
    <ProtectedRoute>
      <div>
        <WishlistComponent></WishlistComponent>
      </div>
    </ProtectedRoute>
  );
};

export default Wishlist;
