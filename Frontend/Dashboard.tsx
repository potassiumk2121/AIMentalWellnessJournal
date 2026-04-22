import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiAuth } from "@/lib/apiAuth";

const Dashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await apiAuth("/blogs/analytics/", token);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default Dashboard;