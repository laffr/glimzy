import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import Layout from "../pages/Layout.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Trader = lazy(() => import("../pages/Trader.jsx"));
const Inventory = lazy(() => import("../pages/Inventory.jsx"));
const Case = lazy(() => import("../pages/Case.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/case/:id/:name" element={<Case />} />
      <Route path="/trader" element={<Trader />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  );
};

export default AppRoutes;
