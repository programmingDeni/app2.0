import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MachineStructureWrapper from "@/views/MachineStructureView/MachineStrucutreWrapper";
import MachineListView from "./features/machines/views/MachineList/MachineListView";
import MachineTemplatesOverview from "@/views/MachineTemplateOverview.tsx";
import MachineAttributWerteView from "@/views/MachineAttributWerteSicht/MachineAttributWerteView";

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
          <Route
            path="/machines/:id/values"
            element={<MachineAttributWerteView />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
