import { Routes, Route } from "react-router-dom";
import HamburgerNav from "./components/HamburgerNav";
import HomePage from "./components/HomePage";
import WorkPage from "./components/WorkPage";
import "./App.css";

export default function App() {
  return (
    <>
      <HamburgerNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
      </Routes>
    </>
  );
}
