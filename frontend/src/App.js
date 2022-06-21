import { LoadScript } from '@react-google-maps/api';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HeroPage from "./screens/HeroPage/HeroPage";
import Gallery from "./screens/Gallery/Gallery";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen/RegisterScreen";
import Camera from "./screens/Camera/Camera";

import "./App.css";

const App = () => (
  
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/Camera" element={<Camera />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/Gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />
    </Router>
);

export default App;
