import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SafetyDepositBoxes from "./pages/SafetyDepositBoxes/SafetyDepositBoxes";
import SafetyDepositBoxForm from "./components/SafetyDepositBox/forms/Create/Create";
import SafetyDepositBox from "./components/SafetyDepositBox/SafetyDepositBox";
import Nav from "./components/Nav/Nav";
import Contingents from "./pages/Contingents/Contingents";
import Contingent from "./components/Contingent/Contingent";
import ContingentForm from "./components/Contingent/forms/Create/Create";
import LinkedSafetyDepositBox from "./components/LinkedSafetyDepositBox/LinkedSafetyDepositBox";

function App() {
  return (
    <Routes>
      <Route path="/sdb/:linkUUID" element={<LinkedSafetyDepositBox />} />
      <Route path="/" element={<Nav />}>
        <Route path="/safety-deposit-boxes">
          <Route path="new" element={<SafetyDepositBoxForm />} />
          <Route path=":box" element={<SafetyDepositBox />} />
          <Route index element={<SafetyDepositBoxes />} />
        </Route>
        <Route path="/contingents">
          <Route path="new" element={<ContingentForm />} />
          <Route path=":contingent" element={<Contingent />} />
          <Route index element={<Contingents />} />
        </Route>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
