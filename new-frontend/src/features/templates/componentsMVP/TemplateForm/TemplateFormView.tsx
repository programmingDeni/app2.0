import { useState, useEffect } from "react";

// UI UND presenter importieren
// UI
import TemplateFormUi from "./TemplateFormUI";
//Presenter local attribute state
import { useAttributesPresenter } from "./useAttributesPresenter";
//queries / backend calls
import { useQueryClient } from "@tanstack/react-query";
import { TemplateQuery } from "@/queries/template/TemplateQuery";
import { TemplateAttributeQuery } from "@/queries/template/attributes/TemplateAttributeQuery";

import {
  Template,
  TemplateAttribute,
} from "../../../../shared/types/template.types";

interface Props {
  machineTemplate?: Template;
  onSubmit?: () => void;
}

export default function TemplateFormView({ machineTemplate, onSubmit }: Props) {
  //anhand dieses attrs wird entweder edit oder add form aufgerufen
  const isEditMode = !!machineTemplate;

  const [templateName, setTemplateName] = useState(
    machineTemplate?.templateName ?? ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();
  //template queries
  const templateQuery = new TemplateQuery(queryClient);
  const addTemplateMutation = templateQuery.useCreateTemplateWithAttributes();
  const updateTemplateMutation = templateQuery.useUpdate(
    machineTemplate?.id ?? 0
  );
  //attribute queries
  const attributeQuery = new TemplateAttributeQuery(queryClient);
  const updateAttributeMutation = attributeQuery.useUpdate(
    machineTemplate?.id ?? -1
  );

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);

      // Cleanup: Timer abbrechen wenn Component unmountet
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  //const addAttributeMutation = attributeQuery.useCreate(machineTemplate?.id ?? -1);
  //attributes state
  //entweder leeres array oder bei edit die attribute aus dem uebergebenen machineattribute objekt
  const initialAttributes = isEditMode
    ? machineTemplate.templateAttributes
    : undefined;
  const attributePresenter = useAttributesPresenter({ initialAttributes });

  const handleSubmit = async () => {
    if (!templateName.trim()) {
      setLocalError("Bitte gib einen Namen für das Template ein.");
      return;
    }
    setLocalError(null);

    console.log(
      "sending template",
      templateName,
      "templateId:",
      machineTemplate?.id,
      "attributes:",
      attributePresenter.attributes
    );

    //TODO: aber aktuallisiert der uach die attribute mit oder muss ich da den attribute
    //query verwenden
    if (isEditMode && machineTemplate?.id) {
      //backend temlate (name) update
      await updateTemplateMutation.mutateAsync({
        templateName,
      });
      //backend attribute update
      attributePresenter.attributes.forEach((attribute) => {
        attribute.templateId = machineTemplate?.id;
        updateAttributeMutation.mutate({
          id: attribute.id!,
          data: { ...attribute },
        });
      });
      setSuccessMessage("Template erfolgreich aktualisiert!");
    } else {
      await addTemplateMutation.mutateAsync({
        templateName,
        attributeTemplates: attributePresenter.attributes,
      });
      setSuccessMessage("Template erfolgreich erstellt!");
    }
    if (!isEditMode) {
      setTemplateName("");
      setIsEditing(false);
    }
    //inform parent
    onSubmit?.();
  };

  const handleSetTempalteName = (name: string) => {
    setTemplateName(name);
    setLocalError(null);
  };

  console.log(
    "addtempltateform machinetemplate:",
    machineTemplate,
    "attribtues: ",
    machineTemplate?.templateAttributes
  );

  return (
    <div className="container container--narrow">
      <TemplateFormUi
        //fuer template name bearbeitung
        templateName={templateName}
        setTemplateName={handleSetTempalteName}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        //um templateAttribute anzuzeigen und zu bearbeiten
        attributePresenter={attributePresenter}
        isEditMode={isEditMode}
        handleSubmit={handleSubmit}
        error={localError}
        successMessage={successMessage}
      />
    </div>
  );
}
