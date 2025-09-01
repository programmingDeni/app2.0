import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MachineStructureWrapper from "@/views/MachineStructureView/MachineStrucutreWrapper";
import MachineListView from "./features/machines/views/MachineList/MachineListView";
import MachineTemplatesOverview from "@/views/MachineTemplateOverview.tsx";
import TemplateListView from "./features/templates/views/TemplateList/TemplateListView";
//import MachineAttributWerteView from "@/views/MachineAttributWerteSicht/MachineAttributWerteView";
import MachinenAttributeValuesView from "./features/machines/views/MachineAttributeValuesView";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MachineListView />} />
          <Route path="/machines/:id" element={<MachineStructureWrapper />} />
          <Route path="/machine-templates" element={<TemplateListView />} />
          <Route
            path="/machines/:id/values"
            element={<MachinenAttributeValuesView />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
