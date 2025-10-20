//List komponente und Presenter importieren
//list is die UI der Liste
import MachineAttributesList from "../components-ui/MachinenAttributValuesTableUI";
//presenter enthält alle daten
//import { useMachineAttributesPresenter } from "@/features/machines/presenter/useMachineAttributeValuesTablePresenter";
import { useMachineAttributesAndValuesQuery } from "@/features/machines/query/useMachineAttributeQueries";
import {
  useEditCustomAttribute,
  useMachine,
} from "@/features/machines/query/useMachineQueries";
import { useAddAttributeValue } from "../query/useAttributeValuesQuery";

//machine id vom route
import { useParams } from "react-router-dom";

//Components
import Button from "@/components/Button";

export default function MachineAttributeValuesView() {
  const { id } = useParams();
  const machineId = id ? parseInt(id) : -1;

  //const { machineName, attributes, handleAddAttributeValue } =useMachineAttributesPresenter(machineId);
  const {
    data: attributes,
    isLoading,
    error,
  } = useMachineAttributesAndValuesQuery(machineId);

  const { data: machine, isLoading: machineIsLoading } = useMachine(machineId);

  const useAddAttributeValueMutation = useAddAttributeValue();
  const useEditCustomAttributeMutation = useEditCustomAttribute();

  if (machineId < 0) return <div>Keine Maschine gefunden </div>;

  if (error) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;

  console.log("attributes", attributes);

  const handleAddAttributeValue = (
    attributeId: number,
    attributeValue: string,
    year: number
  ) => {
    console.log(
      "add attribute value attributeId",
      attributeId,
      "attributeValue",
      attributeValue,
      "year",
      year
    );
    //TODO: query dafür useAddAttributeValue
    useAddAttributeValueMutation.mutate({
      machineId: machineId,
      machineAttributeId: attributeId,
      attributeValue: attributeValue,
      attributeValueYear: year,
    });
  };

  const handlePruefungsIntervallChanged = (
    attributeId: number,
    pruefungsIntervall: number
  ) => {
    console.log(
      "pruefungsIntervall changed attributeId",
      attributeId,
      "pruefungsIntervall",
      pruefungsIntervall
    );
    //TODO: eigentlich nur updateAttribute mutation aufrufen
    useEditCustomAttributeMutation.mutate({
      id: attributeId,
      machineId: machineId,
      pruefungsIntervall: pruefungsIntervall,
    });
  };

  return (
    <div>
      <h1>Maschine: {machine?.machineName}</h1>
      <MachineAttributesList
        attributes={attributes!}
        onAttributeValueAdded={handleAddAttributeValue}
        onPruefungsIntervallChanged={handlePruefungsIntervallChanged}
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
