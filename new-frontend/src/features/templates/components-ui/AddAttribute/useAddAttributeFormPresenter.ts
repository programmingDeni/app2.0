import { useState } from "react";

import { TemplateAttribute } from "../../types/template.types";

import { addAttributesToExistingTemplateService } from "@/features/templates/services/templateService";

export function useAddAttributeFormPresenter() {
  const [attributes, setAttributes] = useState<TemplateAttribute[]>([
    { attributeName: "", attributeType: "STRING" },
  ]);

  const onChangeName = (idx: number, val: string) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy[idx].attributeName = val;
      return copy;
    });
  };

  const onChangeType = (idx: number, val: string) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy[idx].attributeName = val;
      return copy;
    });
  };

  const onDelete = (idx: number) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy.length === 0
        ? [{ attributeName: "", attributeType: "STRING" }]
        : copy;
    });
  };

  const onAdd = () => {
    setAttributes((prev) => [
      ...prev,
      { attributeName: "", attributeType: "STRING" },
    ]);
  };

  const onSubmit = async (
    templateId: number,
    attributes: TemplateAttribute[]
  ) => {
    console.log("onSubmit", attributes);
    // 1. Validierung
    const hasEmpty = attributes.some((attr) => !attr.attributeName.trim());
    if (hasEmpty) {
      alert("Alle Attributnamen müssen ausgefüllt sein!");
      return;
    }

    try {
      // 2. Backend-Call
      await addAttributesToExistingTemplateService(templateId, attributes);
      // 3. Erfolgsmeldung
      alert("Attribute erfolgreich hinzugefügt!");
    } catch (err) {
      // 4. Fehlerbehandlung
      alert("Fehler beim Hinzufügen der Attribute.");
      console.error(err);
    }
  };

  return {
    attributes,
    onChangeName,
    onChangeType,
    onDelete,
    onAdd,
    onSubmit,
  };
}
