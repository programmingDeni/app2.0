import React from "react";

import { TemplateAttribute } from "../../../../../shared/types/template.types";
import Button from "@/shared/components/Buttons/GenericButton";

import style from "./AddAttributeForm.module.css";
import { DeleteButton } from "@/shared/components/Buttons/DeleteButton";

type Props = {
  attributes: TemplateAttribute[];
  onChangeName: (idx: number, val: string) => void;
  onChangeType: (idx: number, val: string) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
  onSubmit: (attributes: TemplateAttribute[]) => void;
};

export default function AddTemplateAttributeFormUI({
  attributes,
  onChangeName,
  onChangeType,
  onDelete,
  onAdd,
  onSubmit,
}: Props) {
  return (
    <div className={style.container}>
      <div className={style.buttonBar}>
        <Button onClick={() => onAdd()}>+ Attribut hinzufügen</Button>
        <Button onClick={() => onSubmit(attributes)}>Template speichern</Button>
      </div>
      {/** Attribtue List */}
      <div className={style.attributeList}>
        {attributes.map((attr, idx) => (
          <div key={idx} className={style.attributeRow}>
            <input
              type="text"
              placeholder="Attributname"
              value={attr.templateAttributeName}
              onChange={(e) => onChangeName(idx, e.target.value)}
              className={style.input}
            />
            <select
              value={attr.templateAttributeType}
              onChange={(e) => onChangeType(idx, e.target.value)}
              className={style.select}
            >
              <option value="STRING">String</option>
              <option value="NUMBER">Number</option>
              <option value="BOOLEAN">Boolean</option>
            </select>
            <DeleteButton onDelete={onDelete} id={idx}/>
          </div>
        ))}
      </div>
    </div>
  );
}
