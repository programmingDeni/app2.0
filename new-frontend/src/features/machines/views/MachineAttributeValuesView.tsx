//List komponente und Presenter importieren
//list is die UI der Liste
import MachineAttributesList from "../components-ui/MachinenAttributValuesTableUI";
//presenter enthält alle daten
import { useMachineAttributesPresenter } from "@/features/machines/presenter/useMachineAttributeValuesTablePresenter";

//machine id vom route
import { useParams } from "react-router-dom";

//Components
import Button from "@/components/Button";

export default function MachineAttributeValuesView() {
  const { id } = useParams();
  const machineId = id ? parseInt(id) : -1;

  const { machineName, attributes, handleAddAttributeValue } =
    useMachineAttributesPresenter(machineId);

  if (machineId < 0) return <div>Keine Maschine gefunden </div>;

  console.log("attributes", attributes);

  return (
    <div>
      <h1>Maschine: {machineName}</h1>
      <MachineAttributesList
        attributes={attributes}
        onAttributeValueAdded={handleAddAttributeValue}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "center", // <-- das sorgt für zentriert!
        }}
      >
        <Button to={`/machines/${machineId}`}>
          → Maschine #{machineId} Struktur bearbeiten
        </Button>
        <Button to="/">→ Zurück zur Startseite</Button>
      </div>
    </div>
  );
}

//TODO: refactoring: das view Struktur bearbeiten muss hier ins feature, mitsamt neuem presenter und maybe service and types
