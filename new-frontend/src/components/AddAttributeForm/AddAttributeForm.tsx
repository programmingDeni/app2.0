"use client";
import React, { useState } from "react";
import { AttributeType } from "@/types/attributeType";
import { CreateMachineAttributeDto } from "@/types/MachineAttributes/CreatemachineAttribute";
import { MachineAttributeDto } from "@/types/machineAttribute";
import { useMachineAttributes } from "@/presenters/useMachineAttributes";
import { useMachineStructure } from "@/presenters/useMachineStructure";

interface Props {
  machineId: number;
  onAttributeAdded?: () => void;
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

  //const { addAttributetoMachine } = useMachineAttributes(machineId);
  const { addAttributeToMachine } = useMachineStructure(machineId);

  const handleSubmit = async () => {
    try {
      const newAttr: CreateMachineAttributeDto = {
        attributeName,
        attributeType,
        machineId,
      };
      addAttributeToMachine(newAttr);
      if (onAttributeAdded) onAttributeAdded();
      //onAttributeAdded();
      setAttributeName("");
      setAttributeType("STRING");
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
