import Header from "./components/Header";
import ToursList from "./components/ToursList";
import LoginPage from "./components/LoginPage";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<ToursList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
