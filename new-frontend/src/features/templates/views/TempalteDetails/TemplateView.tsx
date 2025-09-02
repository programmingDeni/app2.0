// Komponente zur Darstellung und Bearbeitung eines Templates

// react zeug
import { useParams } from "react-router-dom";

// importiere TEmplateCardUi
import TemplateCardUi from "@/features/templates/components-ui/TemplateCard";
//ToggleableSection
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";

//importiere AddAttributeFormView Componente
import AddAttributeFormView from "@/features/templates/components-ui/AddAttribute";

//importiere den presenter
import useTemplates from "@/features/templates/hooks/useTemplates";

export default function TemplateView() {
  const { machineTemplates, removeAttributeFromTemplate } = useTemplates();

  const { templateId } = useParams();
  const templateIdInteger = templateId ? parseInt(templateId, 10) : undefined;

  console.log("templateIdInteger", templateIdInteger, machineTemplates);

  if (!templateIdInteger) {
    return <div>Ungültige Template-ID.</div>;
  }

  // Finde das Template mit der passenden ID
  const template = machineTemplates.find((t) => t.id === templateIdInteger);

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
      <ToggleableSection toggleLabel="Attribute zu Template hinzufügen">
        <AddAttributeFormView templateId={template.id} />
      </ToggleableSection>
    </div>
  );
}
