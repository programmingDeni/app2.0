// Komponente zur Darstellung und Bearbeitung eines Templates

// react zeug
import { useState } from "react";
import { useParams } from "react-router-dom";

//Mein Button
import Button from "@/shared/components/Buttons/GenericButton";

// importiere TEmplateCardUi
import TemplateCardUi from "@/features/templates/components-ui/TemplateCard";
//ToggleableSection
import ToggleableSection from "@/shared/components/ToggleableSection/ToggleableSection";

//importiere AddAttributeFormView Componente
import AddAttributeFormView from "@/features/templates/TemplateAttributes/components/AddAttribute";

//importiere query
import {TemplateQuery} from "@/queries/template/TemplateQuery"
import { useQueryClient } from "@tanstack/react-query";

//Type(s)
import { Template } from "../../../shared/types/template.types";

interface TemplateViewProps {
  templateId?: number;
  allowEdit?: boolean;
  showLinks?: boolean;
}

export default function TemplateView(props: TemplateViewProps) {
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

  //queueries

  const queryClient = useQueryClient();
  const templateQuery = new TemplateQuery(queryClient);
  const { data: template, isLoading: templateIsLoading, error: templateLoadingError} = templateQuery.useLazyFindById(templateId!);
  const templateUpdateMutation = templateQuery.useUpdate(templateId!);

  if (!templateId) {
    return <div>Ungültige Template-ID.</div>;
  }
  if (!template) {
    return <div>Template nicht gefunden.</div>;
  }
  if(templateIsLoading){
    return (<>Template laedt...</>)
  }
  if(templateLoadingError){
    <>Error: {templateLoadingError.message}</>
  }

  //Bearbeitungs Methoden
  const handleEditTemplate = async (template: Partial<Template>) => {
    await templateUpdateMutation.mutateAsync(template);
  };

  console.log("TempalteView: tempalte:", template);

  return (
    <div>
      <TemplateCardUi
        key={template.id}
        machineTemplate={template}
        allowEdit={allowEdit && !showForm}
        onEditTemplate={handleEditTemplate}
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
