import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MachineList from "./pages/MachineList";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MachineList />} />
      </Routes>
    </Router>
  );
};

export default App;
