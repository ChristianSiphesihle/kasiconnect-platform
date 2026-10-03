import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import BusinessList from "./Pages/business/BusinessList";
import BusinessDetails from "./Pages/business/BusinessDetails";
import BusinessFormPage from "./Pages/business/BusinessFormPage";
import MyBusinesses from "./Pages/business/MyBusinesses";
import ManageProducts from "./Pages/products/ManageProducts";
import ProductFormPage from "./Pages/products/ProductFormPage";
import BrowseProducts from "./Pages/products/BrowseProducts";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/businesses" element={<BusinessList />} />
          <Route path="/products" element={<BrowseProducts />} />
          <Route path="/business/:id" element={<BusinessDetails />} />

          <Route
            path="/business/new"
            element={
              <ProtectedRoute role="seller">
                <BusinessFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/:id/edit"
            element={
              <ProtectedRoute role="seller">
                <BusinessFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-businesses"
            element={
              <ProtectedRoute role="seller">
                <MyBusinesses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/:businessId/products"
            element={
              <ProtectedRoute role="seller">
                <ManageProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/:businessId/products/new"
            element={
              <ProtectedRoute role="seller">
                <ProductFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute role="seller">
                <ProductFormPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}
