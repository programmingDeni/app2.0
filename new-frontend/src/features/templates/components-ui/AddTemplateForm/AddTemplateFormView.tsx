import React, { use, useState } from "react";

// UI UND presenter importieren
// UI
import AddTemplateFormUI from "./AddTemplateFormUI";
//Presenter
//import useTemplates from "@/features/templates/hooks/useTemplates";

import { useAddTemplate } from "@/features/templates/query/useTemplateQueries";

import { TemplateAttribute } from "../../types/template.types";

interface Props {
  onSubmit?: () => void;
}

export default function AddTemplateFormView({ onSubmit }: Props) {
  const [templateName, setTemplateName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  //const { createTemplate, successMsg, setSuccessMsg, errorMsg, setErrorMsg } = useTemplates();

  //const { data: template, isLoading, error } = useTemplate(1);
  const addTemplateMutation = useAddTemplate();

  const handleSubmit = async (attributes: TemplateAttribute[]) => {
    //1. Presenter-Call -> validierung, state managment, baclkend communication
    //  auch response wird dort verarbeitet
    if (!templateName.trim()) {
      setLocalError("Bitte gib einen Namen für das Template ein.");
      return;
    }
    setLocalError(null);
    const success = await addTemplateMutation.mutateAsync({
      templateName,
      attributes,
    });
    console.log("success ", success);
    if (success) {
      setTemplateName("");
      setIsEditing(false);
      //inform parent
      if (onSubmit) onSubmit();
    }
  };

  /*
  if (!template) return <div>Loading...(Template mising)</div>;

  if (isLoading) return <div>Loading...(isLoading)</div>;

  if (error) return <div>Error: {error.message}</div>;
  */

  const handleSetTemplateName = (name: string) => {
    setTemplateName(name);
    setLocalError(null);
    addTemplateMutation.reset();
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
