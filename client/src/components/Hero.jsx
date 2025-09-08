import React from "react";
import {
  Image,
  FileText,
  Eraser,
  UserCheck,
  Scissors,
  Type,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk, PricingTable } from "@clerk/clerk-react";

const services = [
  {
    icon: <FileText size={32} className="text-pink-500" />,
    label: "Article Writer",
  },
  {
    icon: <Type size={32} className="text-yellow-400" />,
    label: "Blog Titles",
  },
  {
    icon: <Image size={32} className="text-green-400" />,
    label: "Image Generation",
  },
  {
    icon: <Scissors size={32} className="text-purple-500" />,
    label: "Background Removal",
  },
  {
    icon: <Eraser size={32} className="text-emerald-500" />,
    label: "Object Removal",
  },
  {
    icon: <UserCheck size={32} className="text-blue-500" />,
    label: "Resume Review",
  },
];

const Hero = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) openSignIn();
    else navigate("/ai");
  };

  return (
    <section className="relative  w-full  md:pb-24 flex items-center justify-center text-center bg-black">
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
          Welcome to <span className="text-yellow-400">Combined.ai</span>
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-12 font-medium drop-shadow-md">
          Your all-in-one AI platform for content creation, image generation,
          object removal, and more.
        </p>

        {/* Grid: 2 per row on mobile, 3 per row on md, 6 per row on lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12 justify-items-center">
          {services.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center w-36 p-6 rounded-2xl cursor-pointer shadow-lg
              bg-gradient-to-tr from-pink-800 via-purple-900 to-yellow-300
              text-white hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="p-4 rounded-full mb-3 flex items-center justify-center">
                {s.icon}
              </div>
              <span className="mt-2 text-sm md:text-base font-semibold text-center drop-shadow-sm">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="inline-block bg-yellow-400 text-pink-700 px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-yellow-300 transition"
        >
          {user ? "Go to AI Dashboard" : "Get Started"}
        </button>

        {/* Pricing Table */}
        <div className="mt-20  ">
          <h1 className="text-2xl  mb-8 font-semibold text-yellow-400">
            Choose Billing
          </h1>
          <PricingTable
            publishableKey={import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
            customerId={user?.id}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
