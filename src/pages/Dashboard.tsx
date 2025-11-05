import { useParams } from "react-router-dom";
import ProductDashboard from "@/components/dashboard/ProductDashboard";
import ServiceDashboard from "@/components/dashboard/ServiceDashboard";

const Dashboard = () => {
  const { type } = useParams<{ type: "product" | "service" }>();

  return (
    <div className="min-h-screen">
      {type === "product" ? <ProductDashboard /> : <ServiceDashboard />}
    </div>
  );
};

export default Dashboard;
