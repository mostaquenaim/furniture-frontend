'use client'
import useAxiosSecure from "@/hooks/useAxiosSecure";

const DashboardPageComp = () => {
  const axiosSecure = useAxiosSecure();

  const handleTestRoleAuth = async () => {
    try {
      const response = await axiosSecure.get("/category/all");
      console.log("Data fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <button onClick={handleTestRoleAuth}>Dashboard Page</button>
    </div>
  );
};

export default DashboardPageComp;
