import Navbar from "../components/Navbar";
import AppRoutes from "../router/routes.jsx";
import LoadingPage from "../pages/LoadingPage.jsx";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default Layout;
