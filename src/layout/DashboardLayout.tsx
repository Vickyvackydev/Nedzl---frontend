import { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";
import { useMediaQuery } from "../hooks";
// import { useSelector } from "react-redux";
// import { selectUser } from "../state/slices/authReducer";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkmode = false;
  const location = useLocation();
  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const [isSideNavVisible, setSideNavVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  // const user = useSelector(selectUser);
  useEffect(() => {
    setSideNavVisible(false);
  }, [isMobileView]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls the div smoothly to top
    }
  }, [location.pathname]);

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Sidebar Overlay */}
      {(isMobileView || isTabletView) && isSideNavVisible && (
        <div
          className="fixed bottom-0 left-0 top-0 z-40 w-full bg-gray-800/60"
          onClick={() => setSideNavVisible(false)}
        />
      )}

      {/* Sidebar */}

      <AdminSidebar
        open={isSideNavVisible}
        setOpen={setSideNavVisible}
        onClose={() => setSideNavVisible(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col w-full lg:w-full h-full">
        <div className="w-full">
          <AdminHeader setSideNavVisible={setSideNavVisible} />
        </div>
        <div
          ref={contentRef}
          className={`[@media(max-width:767px)]:scrollbar-hide flex-grow overflow-auto ${
            darkmode ? "bg-[#141718]" : "bg-white"
          } lg:pb-20 lg:w-full md:w-full sm:w-full`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
