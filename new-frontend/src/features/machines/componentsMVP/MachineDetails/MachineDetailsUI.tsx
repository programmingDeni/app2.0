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
import AddAttributeForm from "@/components/AddAttributeForm/AddAttributeForm";
import TemplateView from "@/features/templates/views/TempalteDetails";

interface Props {
  machine: Machine;
  template: Template | null;
  templateAttributes: TemplateAttribute[];
  customAttributes: MachineAttribute[];
  templates: Template[];
  selectedTemplateId: number | null;
  setSelectedTemplateId: (id: number | null) => void;
  handleAssignTemplate: () => void;
  handleRemoveTemplate: () => void;
  handleRemoveAttribute: (attributeId: number) => void;
  refetch: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function MachineDetails(props: Props) {
  const {
    machine,
    template,
    customAttributes,
    handleRemoveAttribute,
    refetch,
    loading,
    error,
  } = props;

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
              <Button onClick={() => handleRemoveAttribute(attribute.id)}>
                Attribut entfernen
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">❗ Keine aktuellen Attribute vorhanden</p>
      )}
      <ToggleableSection toggleLabel="Attribute hinzufügen">
        <AddAttributeForm machineId={machine.id!} onAttributeAdded={refetch} />
      </ToggleableSection>

      <Button to={`/`}>→ Zur Startseite</Button>
      <Button to={`/machines/${machine.id}/values`}>→ Zu den Werten</Button>
    </div>
  );
}
