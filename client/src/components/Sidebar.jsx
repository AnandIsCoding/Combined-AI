import React, { useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";

function Sidebar({ user, isSidebaropen }) {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  useEffect(() => {
    console.log("Sidebar mounted");
  }, [user]);

  return (
    <div
      /* 👇 no unknown prop here, just use isSidebaropen inside className */
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 
        ${isSidebaropen ? "translate-x-0" : "max-sm:-translate-x-full"} 
        transition-all duration-300 z-50 ease-in-out`}
    >
      <div className="my-7 w-full">
        {isLoaded && isSignedIn && user ? (
          <>
            <img
              src={user.imageUrl}
              alt="user_image"
              className="w-16 h-16 object-cover rounded-full mx-auto"
            />
            <h1 className="mt-1 text-center">{user.fullName}</h1>
          </>
        ) : (
          <p className="text-center text-gray-400"> 🧑‍🍼 </p>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <button
          onClick={() => openUserProfile()}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Profile
        </button>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
