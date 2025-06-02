import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MachineStructureWrapper from "@/views/MachineStructureView/MachineStrucutreWrapper";
import MachineListView from "@/views/MachineListView/MachineListView";
import MachineTemplatesOverview from "@/views/MachineTemplateOverview.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MachineListView />} />
          <Route path="/machines/:id" element={<MachineStructureWrapper />} />
          <Route
            path="/machine-templates"
            element={<MachineTemplatesOverview />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
