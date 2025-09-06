import React, { useState } from "react";
import { AttributeType } from "@/types/attributeType";

interface Props {
  machineId: number;
  onAttributeAdded: (
    attributeName: string,
    attributeType: AttributeType
  ) => void;
  onCancel?: () => void;
}

export default function AddAttributeForm({
  machineId,
  onAttributeAdded,
  onCancel,
}: Props) {
  const [attributeName, setAttributeName] = useState("");
  const [attributeType, setAttributeType] = useState<AttributeType>("STRING");

  const attributeTypeOptions: AttributeType[] = [
    "STRING",
    "INTEGER",
    "BOOLEAN",
  ];

  const handleSubmit = async () => {
    onAttributeAdded(attributeName, attributeType);
    setAttributeName("");
    setAttributeType("STRING");
  };

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    >
      <h4>Neues Attribut</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Attributname"
          value={attributeName}
          onChange={(e) => setAttributeName(e.target.value)}
        />

        <select
          value={attributeType}
          onChange={(e) => setAttributeType(e.target.value as AttributeType)}
        >
          {attributeTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleSubmit}
            disabled={!attributeName || !attributeType}
          >
            Speichern
          </button>
          <button onClick={onCancel}>Abbrechen</button>
        </div>
      </div>
    </div>
  );
}
