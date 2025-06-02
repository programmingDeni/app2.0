"use client";
import React, { useState } from "react";
import { AttributeType } from "@/types/attributeInTemplate";
import { MachineAttribute } from "@/types/machineAttribute";
import { createAttribute } from "@/services/machineAttribute.service";

interface Props {
  machineId: number;
  onAttributeAdded: (newAttr: MachineAttribute) => void;
  onCancel: () => void;
}

export default function AddAttributeForm({
  machineId,
  onAttributeAdded,
  onCancel,
}: Props) {
  const [attributeName, setAttributeName] = useState("");
  const [attributeType, setAttributeType] = useState<AttributeType>("STRING");
  const [value, setValue] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const attributeTypeOptions: AttributeType[] = [
    "STRING",
    "INTEGER",
    "BOOLEAN",
  ];

  const handleSubmit = async () => {
    try {
      const res = await createAttribute({
        attributeName,
        attributeType,
        attributeValues: [],
        machineId,
      });
      onAttributeAdded(res.data);
      setAttributeName("");
      setAttributeType("STRING");
      setValue("");
      setYear(new Date().getFullYear());
    } catch (err) {
      console.error("Fehler beim Attribut-Hinzufügen:", err);
    }
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
