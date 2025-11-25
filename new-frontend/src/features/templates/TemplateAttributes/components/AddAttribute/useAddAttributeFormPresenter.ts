import { useState } from "react";

import { TemplateAttribute } from "../../../../../shared/types/template.types";

export function useAddAttributeFormPresenter() {
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

  return {
    attributes,
    onChangeName,
    onChangeType,
    onDelete,
    onAdd,
  };
}
