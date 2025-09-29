//Komponente soll Template Attribute hinzufügen
//hält dazu local state und gibt diesen an parent zurück
//wie kann ich implementieren dass wenn die templateId schon uebergeben ist
// der backend state einfach ueber die query gemanaged wird aber wenn nicht
//der local state bearbeitet wird, und auf das erstellte template gewartet wird?

//react
import react, { useState } from "react";

import { TemplateAttribute } from "../../types/template.types";
import AddTemplateAttributeFormUI from "./AddTemplateAttributeFormUI";

import { useAddAttributeFormPresenter } from "./useAddAttributeFormPresenter";

import { useAddAttributesToTemplate } from "@/features/templates/query/useTemplateQueries";

type Props = {
  templateId?: number;
  onSubmit?: (attributes: TemplateAttribute[], templateId?: number) => void;
};

export default function AddTemplateAttributeFormView({
  templateId,
  onSubmit,
}: Props) {
  //1. Query für backend state communication
  const addAttributesMutation = useAddAttributesToTemplate(templateId);
  //2. Presenter für den localen state
  const presenter = useAddAttributeFormPresenter();

  const handleSubmit = () => {
    if (!presenter.attributes.length) {
      console.log(
        "AddTemplateAttributeFormView added attributes",
        presenter.attributes
      );
      alert("Bitte mindestens ein Attribut hinzufügen!");
      return;
    }
    //wenn die tempalteId uebergeben wurde füge es einfach direkt hinzu
    if (templateId) {
      try {
        addAttributesMutation.mutateAsync(presenter.attributes);
        //braucht es hier das onSubmit?
      } catch (error) {
        alert("Fehler beim Hinzufügen der Attribute!");
      }
    }
    // sonst gib an das parent zurück;
    //  lass dort das ganze template erstellen
    else {
      onSubmit?.(presenter.attributes);
    }
  };

  return (
    <div>
      <AddTemplateAttributeFormUI
        attributes={presenter.attributes}
        onChangeName={presenter.onChangeName}
        onChangeType={presenter.onChangeType}
        onDelete={presenter.onDelete}
        onAdd={presenter.onAdd}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
