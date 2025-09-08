import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { dummyPublishedCreationData } from "../utils/aiToolsData";
import { Heart } from "lucide-react";

function Community() {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setCreations(dummyPublishedCreationData);
    }
  }, [user]);

  return (
    <div className="p-6 w-full text-slate-700">
      <h2 className="text-xl font-semibold mb-4">Creations</h2>

      {creations?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creations.map((creation, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              {/* fixed height container */}
              <div className="w-full h-96 ">
                <img
                  src={creation.content}
                  alt="creation_image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition text-white">
                <p className="text-sm mb-2 line-clamp-2">{creation.prompt}</p>
                <div className="flex gap-1 items-center justify-end">
                  <p>{creation.likes.length}</p>
                  <Heart
                    className={`w-5 h-5 hover:scale-110 transition cursor-pointer ${
                      creation?.likes?.includes(user?.id)
                        ? "fill-red-500 text-red-600"
                        : "text-white"
                    }`}
                  />
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
