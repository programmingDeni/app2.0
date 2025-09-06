// react
import { useState } from "react";
import { useParams } from "react-router-dom";
//Presenter wird erseztz durch query
//import { useMachineDetails } from "./useMachineDetails";
//Queries
//Query (Machine) import
import {
  useMachine,
  useAddCustomAttribute,
  useRemoveCustomAttribute,
  useAssignTemplate,
  useRemoveTemplate,
} from "@/features/machines/query/useMachineQueries";
import {
  useTemplate,
  useAddAttributesToTemplate,
  useRemoveAttributeFromTemplate,
} from "@/features/templates/query/useTemplateQueries";

//UI
import MachineDetailsUI from "./MachineDetailsUI";
import { MachineAttribute } from "../../types/machine.types";
import { AttributeType } from "@/types/attributeType";

export default function MachineDetailsView() {
  const { machineId } = useParams();
  const machineIdInt = machineId ? parseInt(machineId, 10) : undefined;

  if (machineIdInt === undefined) {
    return <div>Ungültige Maschinen-ID.</div>;
  }

  // Queries & Mutations
  const { data: machine, isLoading, error } = useMachine(machineIdInt);
  const addCustomAttributeMutation = useAddCustomAttribute(machineIdInt);
  const removeCustomAttributeMutation = useRemoveCustomAttribute(machineIdInt);

  const assignTemplateMutation = useAssignTemplate(machineIdInt);
  const removeTemplateMutation = useRemoveTemplate(machineIdInt);

  // State
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );

  const templateId = machine?.machineTemplate?.id;
  const { data: template } = useTemplate(templateId, { enabled: !!templateId });

  const handleAssignTemplate = async (templateId: number) => {
    await assignTemplateMutation.mutateAsync(templateId);
  };

  const handleRemoveTemplate = async (machineId: number) => {
    await removeTemplateMutation.mutateAsync(machineId);
  };

  if (!machine) {
    return <div>Maschine nicht gefunden</div>;
  }

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Operationen %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  //template noch nicht implementiert
  /*
  if (!template) {
    return <div>Template nicht gefunden</div>;
  }
    

  //Template change
  const handleTemplateChange = async (templateId: number | null) => {
    if (machine.id === undefined) return;
    if (templateId === null) {
      await removeTemplateFromMachine(machine.id);
    } else {
      await assignTemplateToMachine(machine.id, templateId);
    }
  };
  */

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Custom Attribute %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //Create
  const handleCustomAttributeAdded = async (
    attributeName: string,
    attributeType: AttributeType
  ) => {
    await addCustomAttributeMutation.mutateAsync({
      attributeName,
      attributeType,
    });
    //TODO: funktioniert nicht, warum? bekomme richtige backend antwort
  };
  //Remove
  const handleRemoveAttribute = async (attributeId: number) => {
    await removeCustomAttributeMutation.mutateAsync(attributeId);
  };

  const customAttributes = machine.attributes.filter(
    (attr: MachineAttribute) => attr.fromTemplate === false
  );

  return (
    <MachineDetailsUI
      machine={machine}
      template={template}
      customAttributes={customAttributes}
      onCustomAttributeAdded={handleCustomAttributeAdded}
      handleRemoveAttribute={handleRemoveAttribute}
      selectedTemplateId={selectedTemplateId}
      setSelectedTemplateId={setSelectedTemplateId}
      handleAssignTemplate={handleAssignTemplate}
      handleRemoveTemplate={handleRemoveTemplate}
    />
  );
}
