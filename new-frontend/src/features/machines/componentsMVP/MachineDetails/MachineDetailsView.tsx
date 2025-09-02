// react
import { useParams } from "react-router-dom";
//Presenter
import { useMachineDetails } from "./useMachineDetails";
//UI
import MachineDetailsUI from "./MachineDetailsUI";

export default function MachineDetailsView() {
  const { machineId } = useParams();
  const machineIdInt = machineId ? parseInt(machineId, 10) : undefined;

  if (machineIdInt === undefined) {
    return <div>Ungültige Maschinen-ID.</div>;
  }

  //presenter
  const { machine, template } = useMachineDetails(machineIdInt);

  //ui
  if (!machine) {
    return <div>Maschine nicht gefunden</div>;
  }
  if (!template) {
    return <div>Template nicht gefunden</div>;
  }
  const templateAttributes = template.templateAttributes;
  const machineAttributes = machine.attributes;
  return <MachineDetailsUI machine={machine} template={template} />;
}
