import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiUsers } from "react-icons/fi";

export default function CommunityFloatingWidget() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center geist-family">
      <Link
        to="/community"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 bg-global-green hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/20"
        aria-label="Join Nedzl Community"
      >
        {/* Pulse online indicator badge */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-white"></span>
        </span>

        {/* Icon */}
        <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />

        {/* Expandable Text on Hover */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${
            isHovered ? "max-w-xs opacity-100 pr-2" : "max-w-0 opacity-0"
          }`}
        >
          <span className="text-xs sm:text-sm font-extrabold tracking-wide">
            Join Nedzl Community
          </span>
        </div>

        {/* Floating Tooltip preview when not hovered or on small screens */}
        <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block pointer-events-none transition-all duration-200">
          <div className="bg-gray-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-sm whitespace-nowrap flex items-center gap-1.5 border border-gray-700">
            <FiUsers className="text-emerald-400 w-3.5 h-3.5" />
            <span>Join Nedzl Community</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
