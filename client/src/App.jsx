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
        </Routes>
      </main>
    </>
  );
}
