import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useUser } from "@clerk/clerk-react";

function Layout() {
  const [isSidebaropen, setIsSidebarOpen] = useState(false);
  const { user } = useUser(); // you already get the user here

  return (
    <div className="flex flex-col justify-start h-screen">
      <Navbar />

      {/* Toggle button */}
      {isSidebaropen ? (
        <X
          onClick={() => setIsSidebarOpen(false)}
          className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
        />
      ) : (
        <Menu
          onClick={() => setIsSidebarOpen(true)}
          className="w-6 h-6 text-gray-600 cursor-pointer sm:hidden"
        />
      )}

      {/* sidebar and main content */}
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        {/* pass props */}
        <Sidebar isSidebaropen={isSidebaropen} user={user} />
        <div className="flex-1 bg-[#F4F7FB]">{/* your page content */}</div>
      </div>
    </div>
  );
}

export default Layout;
