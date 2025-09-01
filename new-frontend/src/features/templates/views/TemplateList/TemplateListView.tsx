// importiere TEmplateCardUi
import TemplateCardUi from "@/features/templates/components-ui/TemplateCard";

//importiere AddAttributeFormView Componente
import AddAttributeFormView from "@/features/templates/components-ui/AddAttribute";

//importiere den presenter
import useTemplates from "@/features/templates/hooks/useTemplates";

export default function TemplateListView() {
  const { machineTemplates, removeAttributeFromTemplate } = useTemplates();
  return (
    <div>
      {machineTemplates.map((machineTemplate) => (
        <div>
          <TemplateCardUi
            key={machineTemplate.id}
            machineTemplate={machineTemplate}
            onRemoveAttribute={removeAttributeFromTemplate}
          />
          <AddAttributeFormView templateId={machineTemplate.id} />
        </div>
      ))}
    </div>
  );
}
