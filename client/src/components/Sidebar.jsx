import React from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/ai", Icon: House },
  { name: "Write Article", path: "/ai/write-article", Icon: SquarePen },
  { name: "Blog Titles", path: "/ai/blog-title", Icon: Hash },
  { name: "Generate Images", path: "/ai/generate-images", Icon: Image },
  { name: "Remove Background", path: "/ai/remove-background", Icon: Eraser },
  { name: "Remove Object", path: "/ai/remove-object", Icon: Scissors },
  { name: "Review Resume", path: "/ai/review-resume", Icon: FileText },
  { name: "Community", path: "/ai/community", Icon: Users },
];

function Sidebar({ user, isSidebaropen, setIsSidebarOpen }) {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`fixed sm:static left-0 top-0 sm:top-auto sm:h-full h-full
        bg-white border-r border-gray-200 flex flex-col justify-between
        w-64 sm:w-72 z-50
        transition-transform duration-300 ease-in-out
        ${isSidebaropen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
    >
      {/* Close button only on mobile */}
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="absolute top-4 left-4 sm:hidden text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      {/* User info */}
      <div className="mt-16 sm:mt-6 px-4">
        {isLoaded && isSignedIn && user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.imageUrl}
              alt="user_image"
              className="w-16 h-16 object-cover rounded-full"
            />
            <h1 className="mt-2 text-center text-sm font-medium">
              {user.fullName}
            </h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>{" "}
              Plan
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-400"> 🧑‍🍼 </p>
        )}
      </div>

      {/* nav items */}
<nav className="flex-1 mt-6 mb-4 px-4 space-y-1 ">
  {navItems.map(({ name, path, Icon }) => {
    const isPremiumItem = [
      "/ai/generate-images",
      "/ai/remove-background",
      "/ai/remove-object",
      "/ai/review-resume",
    ].includes(path);

    const link = (
      <NavLink
        key={path}
        to={path}
        end={path === "/ai"}
        onClick={() => setIsSidebarOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded text-sm
          hover:bg-gray-100 ${
            isActive
              ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
              : "text-gray-700"
          }`
        }
      >
        <Icon className="w-4 h-4" />
        {name}
      </NavLink>
    );

    // If premium-only, wrap in Protect
    return isPremiumItem ? (
      <Protect key={path} plan="premium" fallback={
        <div
          key={path}
          className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-400 cursor-not-allowed opacity-50"
        >
          <Icon className="w-4 h-4" />
          {name} (Premium)
        </div>
      }>
        {link}
      </Protect>
    ) : (
      link
    );
  })}
</nav>


      {/* footer buttons */}
      <div className="mb-4 px-4 space-y-2">
        <button
          onClick={() => openUserProfile()}
          className="w-full px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Profile
        </button>
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
