import { useState } from "react";

import { TemplateAttribute } from "../../types/template.types";

import { addAttributesToExistingTemplateService } from "@/features/templates/services/templateService";

//global hook holen
import useTemplates from "@/features/templates/hooks/useTemplates";

export function useAddAttributeFormPresenter() {
  const { addAttributesToTemplate } = useTemplates();

  const [attributes, setAttributes] = useState<TemplateAttribute[]>([
    { templateAttributeName: "", templateAttributeType: "STRING" },
  ]);

  const onChangeName = (idx: number, val: string) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy[idx].templateAttributeName = val;
      return copy;
    });
  };

  const onChangeType = (idx: number, val: string) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy[idx].templateAttributeType = val;
      return copy;
    });
  };

  const onDelete = (idx: number) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy.length === 0
        ? [{ templateAttributeName: "", templateAttributeType: "STRING" }]
        : copy;
    });
  };

  const onAdd = () => {
    setAttributes((prev) => [
      ...prev,
      { templateAttributeName: "", templateAttributeType: "STRING" },
    ]);
  };

  //onSUbmitFunctiopn ruft den globalen useTemplates und resettet die Form felder
  const onSubmit = async (
    templateId: number,
    attributes: TemplateAttribute[]
  ) => {
    try {
      await addAttributesToTemplate(templateId, attributes);
      setAttributes([
        { templateAttributeName: "", templateAttributeType: "STRING" },
      ]);
    } catch (err) {
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
