import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import Layout from "../pages/Layout.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Battle = lazy(() => import("../pages/Battle.jsx"));
const Trader = lazy(() => import("../pages/Trader.jsx"));
const FreeCases = lazy(() => import("../pages/FreeCases.jsx"));
const Case = lazy(() => import("../pages/Case.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/trader" element={<Trader />} />
        <Route path="/freecases" element={<FreeCases />} />
        <Route path="/case/:id/:name" element={<Case />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
