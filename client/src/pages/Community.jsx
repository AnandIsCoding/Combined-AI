import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Community() {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // state for which item is toggling
  const [togglingId, setTogglingId] = useState(null);

  const fetchCreations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/user/get-published-creations", {
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

  // like handling
  const imageLikeToggle = async (id) => {
    setTogglingId(id); // mark this card as loading
    try {
      const { data } = await axios.post(
        "/user/toggle-like-creation",
        { id }, // body
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data?.success) {
        toast.success(data?.message || "Successful");
        await fetchCreations();
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Error is --> ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    setTogglingId(null); // done loading
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  // shimmer skeleton cards
  const shimmerCards = Array.from({ length: 2 }).map((_, i) => (
    <div
      key={i}
      className="relative rounded-lg overflow-hidden shadow animate-pulse"
    >
      <div className="w-full h-96 bg-gray-200" />
      <div className="absolute inset-0 flex flex-col justify-end p-3">
        <div className="h-3 bg-gray-300 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
  ));

  return (
    <div className="p-6 w-full text-slate-700">
      <h2 className="text-xl font-semibold mb-4">Creations</h2>

      {loading ? (
        // show shimmer placeholders
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-14 md:pb-0">
          {shimmerCards}
        </div>
      ) : creations?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-14 md:pb-0">
          {creations.map((creation) => (
            <div
              key={creation.id}
              className="relative group rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <div className="w-full h-96">
                <img
                  src={creation.content}
                  alt="creation_image"
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className="
    absolute inset-0 flex flex-col justify-end p-3
    bg-gradient-to-b from-transparent to-black/70
    opacity-100 sm:opacity-0 sm:group-hover:opacity-100
    transition text-white
  "
              >
                <p className="text-sm mb-2 line-clamp-2">{creation.prompt}</p>
                <div className="flex gap-1 items-center justify-end">
                  <p>{creation.likes.length}</p>

                  {togglingId === creation.id ? (
                    <span className="w-5 h-5 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
                  ) : (
                    <Heart
                      onClick={() => imageLikeToggle(creation.id)}
                      className={`w-5 h-5 hover:scale-110 transition cursor-pointer ${
                        creation?.likes?.includes(user?.id)
                          ? "fill-red-500 text-red-600"
                          : "text-white"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">No Creation Published</p>
      )}
    </div>
  );
}

export default Community;
