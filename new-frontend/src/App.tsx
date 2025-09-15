import "./App.css";
// React imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
//React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import MachineDetailsView from "@/features/machines/views/MachineDetails";
//import MachineStructureWrapper from "@/views/MachineStructureView/MachineStrucutreWrapper";
import MachineListView from "./features/machines/views/MachineList/MachineListView";
import TemplateListView from "./features/templates/views/TemplateList/TemplateListView";
//import MachineAttributWerteView from "@/views/MachineAttributWerteSicht/MachineAttributWerteView";
import MachinenAttributeValuesView from "./features/machines/views/MachineAttributeValuesView";

import TemplateDetails from "./features/templates/views/TempalteDetails";
import PrintMachinesView from "./features/machines/views/PrintView";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MachineListView />} />
            <Route path="/print" element={<PrintMachinesView />} />
            <Route
              path="/machines/:machineId"
              element={<MachineDetailsView showLinks={false} />}
            />
            <Route path="/machine-templates" element={<TemplateListView />} />
            <Route
              path="/machine-templates/:templateId"
              element={<TemplateDetails showLinks={true} />}
            />
            <Route
              path="/machines/:id/values"
              element={<MachinenAttributeValuesView />}
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
