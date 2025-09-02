import React, { use, useState } from "react";

// UI UND presenter importieren
// UI
import AddTemplateFormUI from "./AddTemplateFormUI";
//Presenter
import useTemplates from "@/features/templates/hooks/useTemplates";

import { TemplateAttribute } from "../../types/template.types";

export default function AddTemplateFormView() {
  const [templateName, setTemplateName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { createTemplate, successMsg, setSuccessMsg, errorMsg, setErrorMsg } =
    useTemplates();

  const handleSubmit = async (attributes: TemplateAttribute[]) => {
    console.log(
      "handleSubmit templateName",
      templateName,
      "attributes",
      attributes
    );
    setErrorMsg(null);
    setSuccessMsg(null);
    //1. Presenter-Call -> validierung, state managment, baclkend communication
    //  auch response wird dort verarbeitet
    const success = await createTemplate(templateName, attributes);
    if (success) {
      setTemplateName("");
      setIsEditing(false);
    }
  };

  return (
    <div>
      <AddTemplateFormUI
        templateName={templateName}
        setTemplateName={setTemplateName}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSubmit={handleSubmit}
        errorMsg={errorMsg}
        successMsg={successMsg}
      />
    </div>
  );
}
