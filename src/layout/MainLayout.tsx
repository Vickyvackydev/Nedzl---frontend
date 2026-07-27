import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CommunityFloatingWidget from "../components/CommunityFloatingWidget";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
      <CommunityFloatingWidget />
    </>
  );
}

export default MainLayout;
