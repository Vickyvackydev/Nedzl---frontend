import React from "react";
import { useLocation } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CommunityFloatingWidget from "../components/CommunityFloatingWidget";

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideFooterPaths = ["/dashboard", "/products", "/search"];
  const shouldHideFooter = hideFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Header />
      <div>{children}</div>
      {!shouldHideFooter && <Footer />}
      <CommunityFloatingWidget />
    </>
  );
}

export default MainLayout;
