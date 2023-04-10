import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/Home";
import PaintPage from "./pages/Paint";
import LoginPage from "./pages/Login";
import ErrorPage from "./pages/Error";

function App() {
  return (
    <Router>
      <div className="main">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paint" element={<PaintPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
