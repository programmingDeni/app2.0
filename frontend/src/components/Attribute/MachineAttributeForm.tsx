"use client";
import React, { useState, useEffect } from "react";

export type AttributeType = "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN";

export interface MachineAttributeFormDto {
  id?: number;
  attributeName: string;
  attributeType: AttributeType;
  attributeValue: string;
  machineId: number;
}

interface Props {
  machineId: number;
  attribute?: MachineAttributeFormDto;
  onSubmit: (dto: MachineAttributeFormDto) => void;
  onCancel?: () => void;
}

//bekommt machineId und evtl. ein attribute übergeben
export default function MachineAttributeForm({
  machineId,
  attribute,
  onSubmit,
  onCancel,
}: Props) {
  const [attributeName, setName] = useState(attribute?.attributeName || ""); //wenn attribut übergeben, dann Werte entsprechend setzen
  const [attributeType, setType] = useState<AttributeType>(
    attribute?.attributeType || "STRING"
  );
  const [attributeValue, setValue] = useState(attribute?.attributeValue || "");

  useEffect(() => {
    if (attribute) {
      setName(attribute.attributeName);
      setType(attribute.attributeType);
      setValue(attribute.attributeValue);
    }
  }, [attribute]);

  const handleSubmit = () => {
    if (!attributeName.trim()) return;
    onSubmit({
      id: attribute?.id,
      attributeName,
      attributeType,
      attributeValue,
      machineId,
    });
  };

  return (
    <div>
      <h3>{attribute ? "Attribut bearbeiten" : "Neues Attribut hinzufügen"}</h3>
      <div>
        <input
          type="text"
          placeholder="Attributname"
          value={attributeName}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <select
          value={attributeType}
          onChange={(e) => setType(e.target.value as AttributeType)}
        >
          <option value="STRING">STRING</option>
          <option value="INTEGER">INTEGER</option>
          <option value="FLOAT">FLOAT</option>
          <option value="BOOLEAN">BOOLEAN</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Wert"
          value={attributeValue}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>
        {attribute ? "Speichern" : "Hinzufügen"}
      </button>
      {onCancel && <button onClick={onCancel}>Abbrechen</button>}
    </div>
  );
}
