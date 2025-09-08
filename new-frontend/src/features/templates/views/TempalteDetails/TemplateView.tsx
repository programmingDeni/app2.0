// Komponente zur Darstellung und Bearbeitung eines Templates

// react zeug
import { useState } from "react";
import { useParams } from "react-router-dom";

//Mein Button
import Button from "@/components/Button";

// importiere TEmplateCardUi
import TemplateCardUi from "@/features/templates/components-ui/TemplateCard";
//ToggleableSection
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";

//importiere AddAttributeFormView Componente
import AddAttributeFormView from "@/features/templates/components-ui/AddAttribute";

//importiere den presenter
//import useTemplates from "@/features/templates/hooks/useTemplates";
//NEU: importiere query statt presenter
import {
  useTemplate,
  useEditTemplate,
  useRemoveAttributeFromTemplate,
  useEditTemplateAttribute,
} from "@/features/templates/query/useTemplateQueries";

//Type(s)
import { Template, TemplateAttribute } from "../../types/template.types";

interface TemplateViewProps {
  templateId?: number;
  allowEdit?: boolean;
  showLinks?: boolean;
}

export default function TemplateView(props: TemplateViewProps) {
  //const { machineTemplates, removeAttributeFromTemplate, updateTemplate } =    useTemplates();

  const [showForm, setShowForm] = useState(false);

  //Parameter übergeben
  //allowEdit
  const allowEdit = props.allowEdit ?? true;
  //templateId
  // Nutze Prop, falls vorhanden, sonst Params
  let templateId = props.templateId;
  if (templateId === undefined) {
    const params = useParams();
    templateId = params.templateId
      ? parseInt(params.templateId, 10)
      : undefined;
  }
  //showLinks
  const showLinks = props.showLinks ?? false;

  const { data: template } = useTemplate(templateId);

  //Mutation Queries
  const updateTemplateMutation = useEditTemplate(templateId!);

  const removeAttributeFromTemplateMutation = useRemoveAttributeFromTemplate(
    templateId!
  );

  const editTemplateAttributeMutation = useEditTemplateAttribute(templateId!);

  const handleRemoveAttribute = (attributeId: number) => {
    const confirm = window.confirm("Wollen Sie das Attribut wirklich löschen?");
    if (confirm) {
      removeAttributeFromTemplateMutation.mutate(attributeId);
    }
  };

  if (!templateId) {
    return <div>Ungültige Template-ID.</div>;
  }

  // Finde das Template mit der passenden ID
  //const template = machineTemplates.find((t) => t.id === templateId);

  if (!template) {
    return <div>Template nicht gefunden.</div>;
  }

  //Bearbeitungs Methoden
  const handleEditTemplate = async (template: Partial<Template>) => {
    await updateTemplateMutation.mutateAsync(template);
  };

  const handleTemplateAttributeChange = async (
    templateAttribute: TemplateAttribute
  ) => {
    console.log("templateAttribute", templateAttribute);
    await editTemplateAttributeMutation.mutateAsync(templateAttribute);
  };

  return (
    <div>
      <TemplateCardUi
        key={template.id}
        machineTemplate={template}
        onRemoveAttribute={handleRemoveAttribute}
        allowEdit={allowEdit && !showForm}
        onEditTemplate={handleEditTemplate}
        handleTemplateAttributeChange={handleTemplateAttributeChange}
      />
      {allowEdit && (
        <ToggleableSection
          toggleLabel="Attribute zu Template hinzufügen"
          onOpen={() => setShowForm(true)}
          onClose={() => setShowForm(false)}
          open={showForm}
        >
          <AddAttributeFormView templateId={template.id} />
        </ToggleableSection>
      )}
      {showLinks && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <Button to={`/machine-templates`}>→ Zurück zu den Templates</Button>
          <Button to={`/`}>→ Zur Startseite</Button>
        </div>
      )}
    </div>
  );
}
