import CustomerDashboard from "@/component/Dashboard/CustomerDashboard";
import DashboardComp from "@/component/Dashboard/Dashboard";
import CustomerDrawer from "@/component/Headers/CustomerDrawer";
import ProtectedRoute from "@/component/ProtectedRoute";
import React, { Suspense } from "react";

const Dashboard = () => {
  return (
    <div>
      {/* <DashboardComp /> */}
      {/* <Suspense> */}
        <CustomerDashboard />
      {/* </Suspense> */}
    </div>
  );
};

export default Dashboard;
