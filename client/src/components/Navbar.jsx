import { ArrowRight } from "lucide-react"; 
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const location = useLocation();

  // check if url contains /ai
  const isAIPage = location.pathname.includes("/ai");

  // track if navbar is visible
  const [showNav, setShowNav] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(false);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      const timeout = setTimeout(() => setShowNav(true), 150);
      setScrollTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  return (
    <nav
      className={`sticky z-10 top-0 left-0 w-full shadow-sm transition-transform duration-300
        ${showNav ? "translate-y-0" : "-translate-y-full"}
        ${isAIPage ? "bg-white" : "bg-black/80 backdrop-blur-md"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink
          to="/"
          className={`text-2xl cursor-pointer font-bold tracking-tight 
            ${isAIPage ? "text-yellow-400" : "text-white"}
          `}
        >
          Combined.ai
        </NavLink>

        {/* Only show user icon + name when not on /ai */}
        {!isAIPage && (
          user ? (
            <div className="flex items-center text-white gap-4">
              <UserButton />
              <span>{user?.fullName}</span>
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-white flex items-center text-pink-600 px-5 py-2 rounded-lg font-semibold shadow  transition"
            >
              Get Started&nbsp; <ArrowRight />
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
