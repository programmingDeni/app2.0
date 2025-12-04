import "./App.css";
// React imports
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
//React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import MachineDetailsView from "@/views/machines/MachineDetails";
//import MachineStructureWrapper from "@/views/MachineStructureView/MachineStrucutreWrapper";
import MachineListView from "./features/machines/componentsMVP/MachineList/MachineListView";
import TemplateListView from "./views/templates/TemplateList/TemplateListView";
//import MachineAttributWerteView from "@/views/MachineAttributWerteSicht/MachineAttributWerteView";
import MachinenAttributeValuesView from "./views/machines/MachineAttributeValues/MachineAttributeValuesView";

import TemplateDetails from "./views/templates/TempalteDetails";
import PrintMachinesView from "./views/machines/PrintView";

import { LoginView } from "./features/auth/views/LoginView";
import { RegisterView } from "./features/auth/views/RegisterView";
import { RootRedirect } from "./features/auth/components/RootRedirect";

import Navbar from "./shared/components/Navbar/Navbar";
import { Homepage } from "./views/Homepage";
import TemplateFormView from "./features/templates/componentsMVP/TemplateForm";
import { AuthGuard } from "./features/auth/components/AuthGuard";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <div className="app-main">
            <Routes>
              {/** SHARED */}
              <Route path="/" element={<RootRedirect />} />
              <Route
                path="/login"
                element={
                  <AuthGuard requireAuth={false}>
                    <LoginView />
                  </AuthGuard>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthGuard requireAuth={false}>
                    <RegisterView />
                  </AuthGuard>
                }
              />

              <Route
                element={
                  <AuthGuard requireAuth={true}>
                    <Outlet />
                  </AuthGuard>
                }
              >
                {/** MACHINES */}
                <Route path="/home" element={<Homepage />} />
                <Route path="/print" element={<PrintMachinesView />} />
                <Route
                  path="/machines/:machineId"
                  element={<MachineDetailsView showLinks={false} />}
                />
                <Route
                  path="/machines/:id/values"
                  element={<MachinenAttributeValuesView />}
                />
                {/** TEMPLATES */}
                <Route
                  path="/machine-templates"
                  element={<TemplateListView />}
                />
                <Route
                  path="/machine-templates/:templateId"
                  element={<TemplateDetails showLinks={true} />}
                />
                <Route
                  path="machine-templates/add"
                  element={<TemplateFormView />}
                />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
