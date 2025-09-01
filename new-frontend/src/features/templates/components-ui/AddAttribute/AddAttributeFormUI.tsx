import React from "react";

import { TemplateAttribute } from "../../types/template.types";
import Button from "@/components/Button";

type Props = {
  attributes: TemplateAttribute[];
  onChangeName: (idx: number, val: string) => void;
  onChangeType: (idx: number, val: string) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
  onSubmit: (attributes: TemplateAttribute[]) => void;
};

export default function AddAttributeFormUI({
  attributes,
  onChangeName,
  onChangeType,
  onDelete,
  onAdd,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-2">
      {attributes.map((attr, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Attributname"
            value={attr.attributeName}
            onChange={(e) => onChangeName(idx, e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={attr.attributeType}
            onChange={(e) => onChangeType(idx, e.target.value)}
            className="p-2 border rounded"
          >
            <option value="STRING">String</option>
            <option value="NUMBER">Number</option>
            <option value="BOOLEAN">Boolean</option>
          </select>
          <button
            type="button"
            onClick={() => onDelete(idx)}
            className="text-red-500"
          >
            Löschen
          </button>
        </div>
      ))}

      <Button onClick={() => onAdd()}>+ Attribut hinzufügen</Button>
      <Button onClick={() => onSubmit(attributes)}>Template speichern</Button>
    </div>
  );
}
