import React from "react";

import { TemplateAttribute } from "../../../../../../shared/types/template.types";
import Button from "@/shared/components/Buttons/GenericButton";

import style from "./AddAttributeForm.module.css";
import { DeleteButton } from "@/shared/components/Buttons/DeleteButton";
import { useAttributesPresenter } from "@/features/templates/componentsMVP/TemplateForm/useAttributesPresenter";

import "@/shared/styles/main.css";

type Props = {
  attributePresenter: ReturnType<typeof useAttributesPresenter>;
  onSubmit:() => void;
};

export default function AddTemplateAttributeFormUI({
  attributePresenter,
  onSubmit
}: Props) {
  const {attributes, onChangeName, onChangeType, onDelete, onAdd} = attributePresenter;
  return (
    <div className="scroll-container stack stack--md">
      <div className="row row--end row--lg">
        <Button onClick={() => onAdd()}>+ Attribut hinzufügen</Button>
        <Button onClick={() => onSubmit()}>Template speichern</Button>
      </div>
      {/** Attribtue List */}
      <div className="flex-scroll">
        <div className="stack stack--sm">
        {attributes.map((attr, idx) => (
          <div key={idx} className="row row--xs">
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
    </div>
  );
}
