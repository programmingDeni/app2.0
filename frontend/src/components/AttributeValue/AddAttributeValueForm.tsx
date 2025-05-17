"use client";
import React, { useState } from "react";
import { createAttributeValue } from "@/app/services/attributeValue.service";
import { AttributeValue } from "@/types/AttributeValue";

interface Props {
  machineAttributeId: number;
  onValueAdded: (newValue: AttributeValue) => void;
}

export default function AddAttributeValueForm({
  machineAttributeId,
  onValueAdded,
}: Props) {
  const [value, setValue] = useState("");
  const [year, setYear] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!value.trim() || !year) return;
    try {
      const res = await createAttributeValue({
        machineAttributeId,
        attributeValue: value,
        attributeValueYear: year,
      });
      onValueAdded(res.data);
      setValue("");
      setYear(null);
    } catch (err) {
      console.error("Fehler beim Hinzufügen:", err);
    }
  };

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <input
        type="text"
        placeholder="Wert"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <input
        type="number"
        placeholder="Jahr"
        value={year ?? ""}
        onChange={(e) => setYear(Number(e.target.value))}
        style={{ marginLeft: "8px" }}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || !year}
        style={{ marginLeft: "8px" }}
      >
        Speichern
      </button>
    </div>
  );
}
