import "./App.css";
// React imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Context
import { TemplatesProvider } from "@/features/templates/context/TemplatesContext";
import { MachinesProvider } from "@/features/machines/context/MachineContext";

import MachineDetailsView from "@/features/machines/componentsMVP/MachineDetails";
//import MachineStructureWrapper from "@/views/MachineStructureView/MachineStrucutreWrapper";
import MachineListView from "./features/machines/views/MachineList/MachineListView";
import TemplateListView from "./features/templates/views/TemplateList/TemplateListView";
//import MachineAttributWerteView from "@/views/MachineAttributWerteSicht/MachineAttributWerteView";
import MachinenAttributeValuesView from "./features/machines/views/MachineAttributeValuesView";

import TemplateDetails from "./features/templates/views/TempalteDetails";

function App() {
  return (
    <>
      <MachinesProvider>
        <TemplatesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MachineListView />} />
              <Route
                path="/machines/:machineId"
                element={<MachineDetailsView />}
              />
              <Route path="/machine-templates" element={<TemplateListView />} />
              <Route
                path="/machine-templates/:templateId"
                element={<TemplateDetails />}
              />
              <Route
                path="/machines/:id/values"
                element={<MachinenAttributeValuesView />}
              />
            </Routes>
          </BrowserRouter>
        </TemplatesProvider>
      </MachinesProvider>
    </>
  );
}

export default App;
