import react, { useState } from "react";

import ToggleableSection from "@/shared/components/ToggleableSection/ToggleableSection";
import MachineListView from "@/features/machines/componentsMVP/MachineList";
import AddMachineFormView from "@/features/machines/componentsMVP/AddMachineFormMVP";
import Button from "@/shared/components/Buttons/GenericButton";

export function Homepage() {
  const [showAddMachineForm, setShowAddMachineForm] = useState(false);
  return (
    <div className="pageWrapper">
        <div className="flex-scroll">
            <MachineListView /> 
        </div>
      <div className="mt-auto stack stack--md">
        <ToggleableSection
          toggleLabel="Add Machine"
          open={showAddMachineForm}
          onOpen={() => setShowAddMachineForm(true)}
          onClose={() => setShowAddMachineForm(false)}
        >
          <AddMachineFormView />
        </ToggleableSection>
        <div className="container container--narrow stack stack--md mt-auto">
          <Button to="/machine-templates" className="btn btn--primary">
            → Zu den Machine Templates
          </Button>
          <Button to="/print" className="btn btn--primary">
            → Drucken
          </Button>
        </div>
      </div>
    </div>
  );
}
