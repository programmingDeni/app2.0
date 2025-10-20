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
  useEditCustomAttribute,
  useRemoveCustomAttribute,
  useAssignTemplate,
  useRemoveTemplate,
} from "@/features/machines/query/useMachineQueries";
import {
  useTemplate,
  useTemplates,
} from "@/features/templates/query/useTemplateQueries";

//UI
import MachineDetailsUI from "./MachineDetailsUI";
import { MachineAttribute } from "../../types/machine.types";
import { AttributeType } from "@/features/machines/types/machine.types";

//Props
interface Props {
  showLinks?: boolean;
}

export default function MachineDetailsView(props: Props) {
  const { showLinks } = props;

  const { machineId } = useParams();
  const machineIdInt = machineId ? parseInt(machineId, 10) : undefined;

  if (machineIdInt === undefined) {
    return <div>Ungültige Maschinen-ID.</div>;
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MACHINEN UND TEMPLATES %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machinen %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // KOMPONENTE BRAUCHT MACHINEN UND TEMPLATES DATEN
  //  Queries & Mutations
  //MACHINE
  const { data: machine, isLoading, error } = useMachine(machineIdInt);
  const addCustomAttributeMutation = useAddCustomAttribute(machineIdInt);
  const editCustomAttributeMutation = useEditCustomAttribute();
  const removeCustomAttributeMutation = useRemoveCustomAttribute(machineIdInt);

  const assignTemplateMutation = useAssignTemplate(machineIdInt);
  const removeTemplateMutation = useRemoveTemplate(machineIdInt);

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Templates %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const templateId = machine?.machineTemplate?.id;
  const { data: template } = useTemplate(templateId, { enabled: !!templateId });

  const { data: templates } = useTemplates();

  const handleAssignTemplate = async (templateId: number) => {
    await assignTemplateMutation.mutateAsync(templateId);
  };

  const handleRemoveTemplate = async (machineId: number) => {
    setSelectedTemplateId(null);
    await removeTemplateMutation.mutateAsync(machineId);
  };

  // State
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  if (!machine) {
    return <div>Maschine nicht gefunden</div>;
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Methoden %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Operationen %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  //template noch nicht implementiert
  /*
  if (!template) {
    return <div>Template nicht gefunden</div>;
  }
    
*/
  //Template change
  const handleTemplateChange = async (templateId: number | null) => {
    // State aktualisieren
    setSelectedTemplateId(templateId);
    if (machine.id === undefined) return;
    if (templateId === null) {
      await removeTemplateMutation.mutateAsync(machine.id);
    } else {
      await handleAssignTemplate(templateId);
    }
    console.log("templateChaagne templateId", templateId);
  };

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
  };
  //Remove
  const handleRemoveAttribute = async (attributeId: number) => {
    await removeCustomAttributeMutation.mutateAsync(attributeId);
  };

  const handleCustomAttributeEdited = async (
    attribute: Partial<MachineAttribute>
  ) => {
    await editCustomAttributeMutation.mutateAsync(attribute);
  };

  const customAttributes = machine.attributes.filter(
    (attr: MachineAttribute) => attr.fromTemplate === false
  );

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Render %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <MachineDetailsUI
      machine={machine}
      template={template}
      customAttributes={customAttributes}
      onCustomAttributeAdded={handleCustomAttributeAdded}
      onCustomAttributeEdited={handleCustomAttributeEdited}
      handleRemoveAttribute={handleRemoveAttribute}
      handleAssignTemplate={handleAssignTemplate}
      handleRemoveTemplate={handleRemoveTemplate}
      templates={templates!}
      selectedTemplateId={selectedTemplateId}
      setSelectedTemplateId={handleTemplateChange}
      showLinks={showLinks}
    />
  );
}
