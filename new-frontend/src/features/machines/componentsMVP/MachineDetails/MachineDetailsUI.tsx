//react
import { useState } from "react";
//Types
import { Machine, MachineAttribute } from "../../types/machine.types";
import {
  Template,
  TemplateAttribute,
} from "@/features/templates/types/template.types";

//Components (not yet optimised)
import MachineAttributeCard from "@/features/machines/components-ui/MachineAttributeCard";
import Button from "@/components/Button";
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";
import TemplateSelect from "@/components/TemplateSelect/TemplateSelect";
import AddAttributeForm from "@/features/machines/components-ui/AddAttributeForm/AddAttributeForm";
import TemplateView from "@/features/templates/views/TempalteDetails";
import { AttributeType } from "@/types/attributeType";

interface Props {
  machine: Machine;
  template: Template | undefined;
  customAttributes: MachineAttribute[];
  selectedTemplateId: number | null;
  setSelectedTemplateId: (id: number | null) => void;
  handleAssignTemplate: (templateId: number) => void;
  handleRemoveTemplate: (machineId: number) => void;
  handleRemoveAttribute: (machineId: number, attributeId: number) => void;
  refetch?: () => void;
  loading?: boolean;
  error?: string | null;
  onCustomAttributeAdded: (
    attributeName: string,
    attributeType: AttributeType
  ) => void;
}

export default function MachineDetailsUI(props: Props) {
  const {
    machine,
    template,
    customAttributes,
    handleRemoveAttribute,
    refetch,
    loading,
    error,
    onCustomAttributeAdded,
  } = props;

  const [showAddAttributeForm, setShowAddAttributeForm] = useState(false);

  console.log("template", template);
  console.log("machine", machine);

  return (
    <div>
      <h2>Maschine: {machine.machineName}</h2>
      {/* TemplateView */}
      {template && template.id != null && (
        <TemplateView templateId={template?.id} />
      )}
      {/* Template Wechseln */}

      {/* Custom Attributes */}
      <h3>Maschinen Attribute (Custom)</h3>
      {customAttributes && customAttributes.length > 0 ? (
        <div>
          {customAttributes.map((attribute) => (
            <div key={attribute.id} className="flex  gap-4 mb-2">
              <MachineAttributeCard key={attribute.id} attribute={attribute} />
              <Button
                onClick={() => handleRemoveAttribute(machine.id!, attribute.id)}
              >
                Attribut entfernen
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">❗ Keine aktuellen Attribute vorhanden</p>
      )}
      <ToggleableSection
        toggleLabel="Attribute hinzufügen"
        toggleLabelActive="Schließen"
        open={showAddAttributeForm}
        onClose={() => setShowAddAttributeForm(false)}
        onOpen={() => setShowAddAttributeForm(true)}
      >
        <AddAttributeForm
          machineId={machine.id!}
          onAttributeAdded={onCustomAttributeAdded}
          onCancel={() => setShowAddAttributeForm(false)}
        />
      </ToggleableSection>

      <Button to={`/`}>→ Zur Startseite</Button>
      <Button to={`/machines/${machine.id}/values`}>→ Zu den Werten</Button>
    </div>
  );
}
