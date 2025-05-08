"use client";
import React, { useState } from "react";
import MachineAttributeForm, {
  MachineAttributeFormDto,
} from "./MachineAttributeForm";
import axios from "axios";

interface MachineAttribute {
  id: number;
  attributeName: string;
  attributeType: string;
  attributeValue?: string;
  machineId: number;
}

interface Props {
  attributes: MachineAttribute[];
  machineId: number;
  onAttributesUpdated: (newAttributes: MachineAttribute[]) => void;
}

export default function MachineAttributeList({
  attributes,
  machineId,
  onAttributesUpdated,
}: Props) {
  const [editingAttr, setEditingAttr] = useState<number | null>(null);

  const handleUpdate = async (updated: MachineAttributeFormDto) => {
    const res = await axios.put(
      `http://localhost:8080/api/attributes/${updated.id}`,
      updated
    );
    onAttributesUpdated(
      attributes.map((a) => (a.id === res.data.id ? res.data : a))
    );
    setEditingAttr(null);
  };

  const handleDelete = async (attrId: number) => {
    await axios.delete(`http://localhost:8080/api/attributes/${attrId}`);
    onAttributesUpdated(attributes.filter((a) => a.id !== attrId));
  };

  return (
    <>
      <h2>Attribute</h2>
      {attributes.length === 0 ? (
        <p>Keine Attribute vorhanden.</p>
      ) : (
        <ul>
          {attributes.map((attr) => (
            <li key={attr.id}>
              {editingAttr === attr.id ? (
                <MachineAttributeForm
                  machineId={machineId}
                  attribute={{
                    id: attr.id,
                    attributeName: attr.attributeName,
                    attributeType: attr.attributeType as any,
                    attributeValue: attr.attributeValue ?? "", // optional
                    machineId,
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingAttr(null)}
                />
              ) : (
                <>
                  {attr.attributeName + " " + attr.attributeValue}
                  <button onClick={() => setEditingAttr(attr.id)}>✏️</button>
                  <button onClick={() => handleDelete(attr.id)}>🗑️</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
