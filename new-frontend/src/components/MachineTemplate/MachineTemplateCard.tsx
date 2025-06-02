import { MachineTemplateDto } from "@/types/machineTemplate";
import Button from "../Button";
import ToggleableSection from "../ToggleableSection/ToggleableSection";
import MachineTemplateForm from "./MachineTemplateForm";
import AttributeInTemplateInput from "./AttributeInTemplateInput";
import AddAttributeTemplateForm from "../AddAttributeTemplateForm/AddAttributeTemplateForm";

interface Props {
  template: MachineTemplateDto;
}

export default function MachineTemplateCard({ template }: Props) {
  const attributeTemplates = template.attributeTemplates ?? [];

  console.log("template", template);
  console.log("attributeTemplates", attributeTemplates);

  //zeigt machine templates name und id an
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4">
      <h3 className="text-lg font-semibold">
        📦 {template.templateName} (ID: {template.id})
      </h3>

      {/*wenn attributTemplates vorhanden sind zeig die an*/}
      <ToggleableSection toggleLabel="Attribute anzeigen">
        {attributeTemplates.length > 0 ? (
          attributeTemplates.map((attr) => (
            <div key={attr.id}>
              Attribut Name {attr.attributeInTemplateName}, Attribut Typ{" "}
              {attr.attributeInTemplateType}
            </div>
          ))
        ) : (
          <p>Keine Attribute vorhanden</p>
        )}
        <ToggleableSection toggleLabel="Attribute hinzufügen">
          <AddAttributeTemplateForm templateId={template.id} />
        </ToggleableSection>
      </ToggleableSection>
      <Button onClick={() => console.log("Delete")}> Template Löschen </Button>
    </div>
  );
}
