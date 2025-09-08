import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

function Layout() {
  const [isSidebaropen, setIsSidebarOpen] = useState(false);
  const { user } = useUser(); // you already get the user here

  return user ? (
    <div className="flex  bg-white  flex-col justify-start h-screen">
      <Navbar />

      {/* Toggle button */}
      {isSidebaropen ? (
        <X
          onClick={() => setIsSidebarOpen(false)}
          className="w-6 h-6 ml-4  mt-4  text-gray-600 sm:hidden cursor-pointer "
        />
      ) : (
        <Menu
          onClick={() => setIsSidebarOpen(true)}
          className="w-6 h-6 ml-4 mt-4 text-gray-600 cursor-pointer sm:hidden "
        />
      )}

      {/* sidebar and main content */}
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]  ">
        {/* pass props */}
        <Sidebar
          isSidebaropen={isSidebaropen}
          user={user}
          setIsSidebarOpen={setIsSidebarOpen} // correct spelling
        />
        <Outlet />

        <div className="flex-1 bg-[#F4F7FB]">{/* your page content */}</div>
      </div>
      <div
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="
    w-full 
    fixed bottom-0   /* stick to bottom */
    text-center py-2 text-black 
    bg-yellow-400 
    block sm:hidden  /* ✅ show only below 640px */
  "
      >
        See All 🤖 Services
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
}

export default Layout;
