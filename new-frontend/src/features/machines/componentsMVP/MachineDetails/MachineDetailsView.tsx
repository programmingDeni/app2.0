// react
import { useState } from "react";
import { useParams } from "react-router-dom";
//Presenter
import { useMachineDetails } from "./useMachineDetails";
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

  //presenter
  const {
    machine,
    template,
    addCustomAttribute,
    removeCustomAttributeFromMachine,
    removeTemplateFromMachine,
    assignTemplateToMachine,
  } = useMachineDetails(machineIdInt);

  //ui
  if (!machine) {
    return <div>Maschine nicht gefunden</div>;
  }
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

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Custom Attribute %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //Create
  const handleCustomAttributeAdded = async (
    machineId: number,
    attributeName: string,
    attributeType: AttributeType
  ) => {
    await addCustomAttribute(machineId, attributeName, attributeType);
    //TODO: funktioniert nicht, warum? bekomme richtige backend antwort
  };
  //Remove
  const handleRemoveAttribute = async (attributeId: number) => {
    await removeCustomAttributeFromMachine(machineIdInt, attributeId);
  };

  const customAttributes = machine.attributes.filter(
    (attr) => attr.fromTemplate === false
  );

  return (
    <MachineDetailsUI
      machine={machine}
      template={template}
      customAttributes={customAttributes}
      onCustomAttributeAdded={handleCustomAttributeAdded}
      handleRemoveAttribute={handleRemoveAttribute}
    />
  );
}
