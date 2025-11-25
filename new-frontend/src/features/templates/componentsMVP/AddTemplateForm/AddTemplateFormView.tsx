import { useState } from "react";

// UI UND presenter importieren
// UI
import AddTemplateFormUI from "./AddTemplateFormUI";
//Presenter
//import useTemplates from "@/features/templates/hooks/useTemplates";

import { useQueryClient } from "@tanstack/react-query";
import { TemplateQuery } from "@/queries/template/TemplateQuery";

import { TemplateAttribute } from "../../../../shared/types/template.types";

interface Props {
  onSubmit?: () => void;
}

export default function AddTemplateFormView({ onSubmit }: Props) {
  const [templateName, setTemplateName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const templateQuery = new TemplateQuery(queryClient);
  const addTemplateMutation = templateQuery.useCreateTemplateWithAttributes();

  const handleSubmit = async (attributes: TemplateAttribute[]) => {
    if (!templateName.trim()) {
      setLocalError("Bitte gib einen Namen für das Template ein.");
      return;
    }
    setLocalError(null);

    console.log("sending template", templateName, "attributes:", attributes);

    await addTemplateMutation.mutate({
      templateName,
      attributeTemplates: attributes,
    });

    setTemplateName("");
    setIsEditing(false);
    //inform parent
    if (onSubmit) onSubmit();
  };

  const handleSetTemplateName = (name: string) => {
    setTemplateName(name);
    setLocalError(null);
    //addTemplateMutation.reset();
  };

  return (
    <div>
      <AddTemplateFormUI
        templateName={templateName}
        setTemplateName={handleSetTemplateName}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSubmit={handleSubmit}
      />
      {localError && (
        <div style={{ color: "red", marginBottom: "0.5rem" }}>{localError}</div>
      )}
    </div>
  );
}
