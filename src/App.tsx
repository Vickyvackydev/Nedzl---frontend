import { Route, Routes, useLocation } from "react-router-dom";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Home from "./features/Home";

import ProductDetails from "./features/ProductDetails";
import UserDashboard from "./features/user-dashboard";
import LoadingExample from "./components/LoadingExample";
import { Toaster } from "react-hot-toast";
import Products from "./features/Products";
import SearchResults from "./features/SearchResults";
import Overview from "./features/admin/Overview";
import ProductManagement from "./features/admin/ProductManagement";
import SellerManagement from "./features/admin/SellerManagement";
import ViewUser from "./features/admin/ViewUser";
import PrivateRoute from "./PrivateRoute";
import { useEffect } from "react";
import CheckEmailVerification from "./features/auth/CheckEmailVerification";
import EmailVerifiedSuccess from "./features/auth/EmailVerificaionSuccess";
import EmailVerificationLoading from "./features/auth/VerifyEmail";
import NotFound from "./features/NotFound";
import { SidebarProvider } from "./context/SidebarContext";
import PrivacyPolicy from "./features/PrivacyPolicy";
import TermsOfService from "./features/TermsOfService";
import Contact from "./features/Contact";
import FAQs from "./features/FAQs";

function App() {
  const location = useLocation();

  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <SidebarProvider>
      <Toaster position="top-left" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-sent" element={<CheckEmailVerification />} />
        <Route path="/auth/verify/success" element={<EmailVerifiedSuccess />} />
        <Route path="/auth/verify" element={<EmailVerificationLoading />} />

        <Route path="/" element={<Home />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />

        <Route path="/search" element={<SearchResults />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/example" element={<LoadingExample />} />
        <Route
          path="/admin/overview"
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products-management"
          element={
            <PrivateRoute>
              <ProductManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/seller-management"
          element={
            <PrivateRoute>
              <SellerManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <PrivateRoute>
              <ViewUser />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}

export default App;
