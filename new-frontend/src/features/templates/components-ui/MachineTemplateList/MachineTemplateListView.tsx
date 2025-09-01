//importiere die UI
import TemplateCardUi from "@/features/templates/components-ui/TemplateCard";

//importiere den presenter
import useTemplates from "@/features/templates/hooks/useTemplates";

//importiere AddAttributeFormView Componente
import AddAttributeFormView from "@/features/templates/components-ui/AddAttribute";

export default function MachineTemplateListView() {
  const { machineTemplates, removeAttributeFromTemplate } = useTemplates();

  const handleRemoveAttribute = (templateId: number, attributeId: number) => {
    // Hier deine Logik zum Entfernen eines Attributs
    // also presenter aufrufen
    removeAttributeFromTemplate(templateId, attributeId);
  };

  return (
    <div>
      {/* hier muss der presenter ausgeführt werden und die machineTemplates ausgegeben werden*/}
      {machineTemplates.map((machineTemplate) => (
        <div>
          <TemplateCardUi
            key={machineTemplate.id}
            machineTemplate={machineTemplate}
            onRemoveAttribute={handleRemoveAttribute}
          />
          <AddAttributeFormView templateId={machineTemplate.id} />
        </div>
      ))}
    </div>
  );
}
