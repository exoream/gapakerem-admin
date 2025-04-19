import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </BrowserRouter>
  );
};

export default App;