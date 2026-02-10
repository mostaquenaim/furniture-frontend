"use client";

import { useSearchParams } from "next/navigation";
import DashboardPageComp from "./DashboardPageComp";

const AdminDashboard = () => {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  return (
    <div>
      {/* <DashboardPageComp searchParams={{ start, end }} /> */}
    </div>
  );
};

export default AdminDashboard;
