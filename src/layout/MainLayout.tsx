import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}

export default MainLayout;
