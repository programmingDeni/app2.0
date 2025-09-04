// Komponente zur Darstellung und Bearbeitung eines Templates

// react zeug
import { useState } from "react";
import { useParams } from "react-router-dom";

// importiere TEmplateCardUi
import TemplateCardUi from "@/features/templates/components-ui/TemplateCard";
//ToggleableSection
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";

//importiere AddAttributeFormView Componente
import AddAttributeFormView from "@/features/templates/components-ui/AddAttribute";

//importiere den presenter
import useTemplates from "@/features/templates/hooks/useTemplates";

interface TemplateViewProps {
  templateId?: number;
}

export default function TemplateView(props: TemplateViewProps) {
  const { machineTemplates, removeAttributeFromTemplate } = useTemplates();

  const [showForm, setShowForm] = useState(false);

  // Nutze Prop, falls vorhanden, sonst Params
  let templateId = props.templateId;
  if (templateId === undefined) {
    const params = useParams();
    templateId = params.templateId
      ? parseInt(params.templateId, 10)
      : undefined;
  }

  if (!templateId) {
    return <div>Ungültige Template-ID.</div>;
  }

  // Finde das Template mit der passenden ID
  const template = machineTemplates.find((t) => t.id === templateId);

  if (!template) {
    return <div>Template nicht gefunden.</div>;
  }

  return (
    <div>
      <TemplateCardUi
        key={template.id}
        machineTemplate={template}
        onRemoveAttribute={removeAttributeFromTemplate}
      />
      <ToggleableSection
        toggleLabel="Attribute zu Template hinzufügen"
        onOpen={() => setShowForm(true)}
        onClose={() => setShowForm(false)}
        open={showForm}
      >
        <AddAttributeFormView templateId={template.id} />
      </ToggleableSection>
    </div>
  );
}
