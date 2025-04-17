import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Router>
  );
};

export default App;