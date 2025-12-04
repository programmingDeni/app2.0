//List komponente und Presenter importieren
//list is die UI der Liste
import MachineAttributesList from "../../../features/machines/components-ui/MachinenAttributValuesTableUI";
import { useQueryClient } from "@tanstack/react-query";
import { MachineQuery } from "@/queries/machine/MachineQuery";
import {MachineAttributeQuery} from "@/queries/machine/attributes/MachineAttributeQuery"
import { AttributeValueQuery } from "@/queries/machine/attributes/values/AttributeValuesQuery";

//machine id vom route
import { useParams } from "react-router-dom";

//Components
import Button from "@/shared/components/Buttons/GenericButton";
import { MachineAttribute } from "../../../shared/types/machine.types";

export default function MachineAttributeValuesView() {
  const { id } = useParams();
  const machineId = id ? parseInt(id) : -1;

  const queryClient = useQueryClient();
  const machineQuery = new MachineQuery(queryClient);
  const machineAttributeQuery = new MachineAttributeQuery(queryClient);
  const updateMachineAttributeMutation = machineAttributeQuery.useUpdate(machineId);
  const valueQuery = new AttributeValueQuery(machineId,queryClient);
  const createValueMutation = valueQuery.useCreateDynamic();


  
  const { data: machine, isLoading: machineIsLoading, error: machineError } = machineQuery.useEagerFindById(machineId);

  console.log("MachineAttributeValuesView: Machine:", machine)

  const attributes: MachineAttribute[] = machine?.attributes || [] ;
  const customAttributes = attributes.filter((attr) => !attr.fromTemplate);
  const templateAttributes = attributes.filter((attr) => !attr.fromTemplate);
  //const { machineName, attributes, handleAddAttributeValue } =useMachineAttributesPresenter(machineId);
  /**
   * 
   
  const {
    data: attributes,
    isLoading,
    error,
  } = machineAttributeQuery.useFindAllByParentId(machineId, true);


  const useAddAttributeValueMutation = useAddAttributeValue();
  const useEditCustomAttributeMutation = useEditCustomAttribute();

  */

  if (machineId < 0) return <div>Keine Maschine gefunden </div>;

  if (machineError) return <div>Error</div>;
  if (machineIsLoading) return <div>Loading...</div>;

  console.log("custom attributes", customAttributes);
  console.log("template attributes", templateAttributes);  
  console.log("machine template attributes", machine?.machineTemplate?.templateAttributes)

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
    // query umschreiben sodaass nicht beim initialisieren sondern beim aufruf die id uebergeben werden muss
    //hier ist das problem mit doppel nested 
    createValueMutation.mutate({
      parentId: attributeId,
      data : {
        machineId: machineId,
        machineAttributeId: attributeId,
        attributeValue: attributeValue,
        attributeValueYear: year,
      }
    },
  {
        onSuccess: () => {
          // Machine Query invalidieren für automatisches Refetch
          queryClient.invalidateQueries({ 
            queryKey: ['/api/machines', machineId] 
          });
        }
      }
    );
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
    
    updateMachineAttributeMutation.mutate(
      {
        id: attributeId,
        data: {pruefungsIntervall},
    },
      {
        onSuccess: () => {
          // Machine Query invalidieren für automatisches Refetch
          queryClient.invalidateQueries({ 
            queryKey: ['/api/machines', machineId] 
          });
        }
      }
    );
  };

  /**
   * export interface MachineAttribute {
     id: number;
     machineId: number;
     attributeName: string;
     attributeType: string;
     attributeValues: AttributeValue[];
     fromTemplate: boolean;
     pruefungsIntervall?: number;
     zuletztGeprueft?: string;
     zuletztGetauscht?: string;
   }
   */

  console.log("MachineAttributeValuesView attributes: ",attributes)
   

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
        <Button to="/home">→ Zurück zur Startseite</Button>
      </div>
    </div>
  );
}
