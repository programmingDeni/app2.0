import react, {useState} from "react";

import ToggleableSection from "@/shared/components/ToggleableSection/ToggleableSection";
import MachineListView from "@/features/machines/componentsMVP/MachineList";
import AddMachineFormView from "@/features/machines/componentsMVP/AddMachineFormMVP";
import Button from "@/shared/components/Buttons/GenericButton"

export function Homepage() {
    const [showAddMachineForm, setShowAddMachineForm] = useState(false);
    return(
        <div>
            <MachineListView />
            <ToggleableSection
                toggleLabel="Add Machine"
                open={showAddMachineForm}
                onOpen={() => setShowAddMachineForm(true)}
                onClose={() => setShowAddMachineForm(false)}
            >
                <AddMachineFormView />
            </ToggleableSection>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Button to="/machine-templates">→ Zu den Machine Templates</Button>
                <Button to="/print">→ Drucken</Button>
            </div>
        </div>
    )
}