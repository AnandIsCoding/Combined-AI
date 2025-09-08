import React, { useEffect, useState } from "react";
import { GemIcon, Sparkles } from "lucide-react";
import { Protect, useAuth, useUser } from "@clerk/clerk-react";
import { DummyCreations } from "../utils/aiToolsData";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
function Dashboard() {
  const [creations, setCreations] = useState([]);
    const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const shimmerCards = Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="animate-pulse p-4 max-w-5x space-y-3 border-gray-200">
      <div className="h-7 bg-gray-100 rounded-lg" /> {/* image */}
      <div className="h-5 bg-gray-200 rounded w-3/4" /> {/* title */}
    </div>
  ));

  const getDashboardData = async() => {
     try {
      const { data } = await axios.get("/user/get-user-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data?.success) {
        setCreations(data?.creations);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Error is --> ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6 w-full pb-16">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* 1st Total Creations*/}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations?.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* 2nd Active Plan */}

        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#0BB0D7] text-white flex justify-center items-center">
            <GemIcon className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* creations */}

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
       {loading ? (
        // Show shimmer placeholders while loading
        <div className="space-y-4">{shimmerCards}</div>
      ) : creations?.length > 0 ? (
        creations.map((item) => <CreationItem key={item.id} item={item} />)
      ) : (
        <p className="text-gray-500">No recent creations</p>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
