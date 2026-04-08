import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Router;
