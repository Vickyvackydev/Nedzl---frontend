import { Route, Routes } from "react-router-dom";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Home from "./features/Home";

import ProductDetails from "./features/ProductDetails";
import UserDashboard from "./features/user-dashboard";
import LoadingExample from "./components/LoadingExample";
import { Toaster } from "react-hot-toast";
import Products from "./features/Products";

function App() {
  return (
    <>
      <Toaster position="top-left" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Home />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={<Products />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/example" element={<LoadingExample />} />
      </Routes>
    </>
  );
}

export default App;
