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
  //Machine(s)
  machine: Machine;
  customAttributes: MachineAttribute[];
  handleRemoveAttribute: (machineId: number, attributeId: number) => void;
  refetch?: () => void;
  loading?: boolean;
  error?: string | null;
  onCustomAttributeAdded: (
    attributeName: string,
    attributeType: AttributeType
  ) => void;
  //tempaltes
  template: Template | undefined;
  handleAssignTemplate: (templateId: number) => void;
  handleRemoveTemplate: (machineId: number) => void;
  // für template select
  templates: Template[];
  selectedTemplateId: number | null;
  setSelectedTemplateId: (id: number | null) => void;
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
    //temnplates
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    handleRemoveTemplate,
  } = props;

  const [showAddAttributeForm, setShowAddAttributeForm] = useState(false);

  return (
    <div>
      <h2>Maschine: {machine.machineName}</h2>
      {/* TemplateView */}
      {/** Templates zugewiesen? */}
      {template && template.id != null && (
        <div>
          <TemplateView templateId={template?.id} allowEdit={false} />
          <Button
            onClick={() => {
              if (
                window.confirm(
                  "Möchtest du das Template wirklich entfernen? Alle Template Attribute und Ihre Werte gehen dabei verloren."
                )
              ) {
                handleRemoveTemplate(machine.id!);
              }
            }}
          >
            Template entfernen
          </Button>
        </div>
      )}
      {/** //TODO: Templates zugewiesen aber keine attribute? */}

      {/** //TODO: kein template zugewiesen*/}
      {!template && (
        <div>
          <div>Kein Template zugewiesen</div>
          <TemplateSelect
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onChange={setSelectedTemplateId}
          />
        </div>
      )}
      <div>
        <Button to={`/machine-templates`}>→ Zu den Templates</Button>
      </div>

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
        toggleLabel="Benutzerdefinierte Attribute hinzufügen"
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <Button to={`/machines/${machine.id}/values`}>→ Zu den Werten</Button>
        <Button to={`/`}>→ Zur Startseite</Button>
      </div>
    </div>
  );
}
