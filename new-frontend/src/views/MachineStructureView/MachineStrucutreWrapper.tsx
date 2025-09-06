// src/views/MachineStructureView/MachineStructureWrapper.tsx
import { useParams } from "react-router-dom";
import MachineStructureView from "./MachineStructureView.tsx";

export default function MachineStructureWrapper() {
  const { id } = useParams();

  const machineId = id ? parseInt(id, 10) : NaN;
  if (isNaN(machineId)) {
    return <p>❌ Ungültige Maschinen-ID</p>;
  }

  return <MachineStructureView machineId={machineId} />;
}
