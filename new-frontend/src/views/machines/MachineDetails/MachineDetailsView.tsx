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
import { MachineAttribute } from "../../../shared/types/machine.types";
import { AttributeType } from "@/shared/types/machine.types";
import { useQueryClient } from "@tanstack/react-query";
import { MachineQuery } from "@/queries/machine/MachineQuery";
import { MachineTemplateOperationsQuery } from "@/queries/machine/MachineTemplateOperationsQuery";
import { MachineAttributeQuery } from "@/queries/machine/attributes/MachineAttributeQuery";
import { TemplateQuery } from "@/queries/template/TemplateQuery";

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
  const queryClient = useQueryClient();
  const machineQuery = new MachineQuery(queryClient);
  const findMachineById = machineQuery.useEagerFindById(machineIdInt);

  //MACHINE TEMPLATE OPERATIONS
  const machineTemplateOperationsQuery = new MachineTemplateOperationsQuery();
  const assignTemplateMutation =
    machineTemplateOperationsQuery.useAssignTemplate(machineIdInt);
  const removeTemplateMutation =
    machineTemplateOperationsQuery.useRemoveTemplate(machineIdInt);

  //MACHINE ATTRIBUTES
  const machineAttributeQuery = new MachineAttributeQuery(queryClient);
  const findMachineAttributes =
    machineAttributeQuery.useFindAllByParentId(machineIdInt);
  const addCustomAttributeMutation = machineAttributeQuery.useCreateDynamic();
  const editCustomAttributeMutation =
    machineAttributeQuery.useUpdate(machineIdInt);
  const removeCustomAttributeMutation =
    machineAttributeQuery.useDelete(machineIdInt);

  //TEMPLATES
  const templateQuery = new TemplateQuery(queryClient);
  const findAllTemplates = templateQuery.useFindAll();

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Templates %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  const machine = findMachineById.data;
  const template = machine?.machineTemplate;

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
    console.log("handleCustomAttributeAdded", attributeName, attributeType);
    await addCustomAttributeMutation.mutateAsync({
      parentId: machineIdInt,
      data: {
        machineId: machineIdInt,
        attributeName,
        attributeType,
        fromTemplate: false,
        attributeValues: [],
      },
    });
  };
  //Remove
  const handleRemoveAttribute = async (attributeId: number) => {
    await removeCustomAttributeMutation.mutateAsync(attributeId);
  };

  const handleCustomAttributeEdited = async (
    attribute: Partial<MachineAttribute>
  ) => {
    await editCustomAttributeMutation.mutateAsync({
      id: attribute.id!,
      data: attribute,
    });
  };

  const customAttributes = machine.attributes.filter(
    (attr: MachineAttribute) => attr.fromTemplate === false
  );

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Render %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  //if (isLoading) return <div>Loading...</div>;
  //if (error) return <div>Error</div>;

  console.log("MachineDetailsView: Machine:", machine, "Template:", template);

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
      templates={findAllTemplates.data!}
      selectedTemplateId={selectedTemplateId}
      setSelectedTemplateId={handleTemplateChange}
      showLinks={showLinks}
    />
  );
}
