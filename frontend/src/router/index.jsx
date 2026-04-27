import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Router;
