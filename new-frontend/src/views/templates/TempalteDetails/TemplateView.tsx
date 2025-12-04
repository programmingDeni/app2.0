// Komponente zur Darstellung und Bearbeitung eines Templates

// react zeug
import { useState } from "react";
import { useParams } from "react-router-dom";

//Mein Button
import Button from "@/shared/components/Buttons/GenericButton";

// importiere TEmplateCardUi
import { TemplateCardUi } from "@/features/templates/components-ui/TemplateCard";

//importiere query
import { TemplateQuery } from "@/queries/template/TemplateQuery";
import { useQueryClient } from "@tanstack/react-query";

//Type(s)
import { Template } from "../../../shared/types/template.types";
import TemplateFormView from "@/features/templates/componentsMVP/TemplateForm";
import { EditButton } from "@/shared/components/Buttons/EditButton";

interface TemplateViewProps {
  templateId?: number;
  allowEdit?: boolean;
  showLinks?: boolean;
}

export default function TemplateView(props: TemplateViewProps) {
  const [showForm, setShowForm] = useState(true);

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
  const {
    data: template,
    isLoading: templateIsLoading,
    error: templateLoadingError,
  } = templateQuery.useLazyFindById(templateId!);
  const templateUpdateMutation = templateQuery.useUpdate(templateId!);

  if (!templateId) {
    return <div>Ungültige Template-ID.</div>;
  }
  if (!template) {
    return <div>Template nicht gefunden.</div>;
  }
  if (templateIsLoading) {
    return <>Template laedt...</>;
  }
  if (templateLoadingError) {
    <>Error: {templateLoadingError.message}</>;
  }

  //Bearbeitungs Methoden
  const handleEditTemplate = async (template: Partial<Template>) => {
    await templateUpdateMutation.mutateAsync(template);
  };

  console.log("TempalteView: tempalte:", template);

  return (
    <div className="pageWrapper mt-lg">
      <div className="twoColumn__actionButton row row--sm">
        <EditButton
          className="btn--secondary btn--icon btn--m"
          onClick={() => setShowForm(!showForm)}
        />
        <Button className="btn--secondary btn--m" to="/home"></Button>
      </div>
      <div className="pageContent">
        {showForm ? (
          <TemplateFormView machineTemplate={template} />
        ) : (
          <TemplateCardUi machineTemplate={template} />
        )}
      </div>
    </div>
  );
}
