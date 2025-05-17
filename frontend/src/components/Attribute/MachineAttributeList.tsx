"use client";
import React from "react";
import { MachineAttribute } from "@/types/machineAttribute";

interface Props {
  attributes: MachineAttribute[];
  onDelete?: (id: number) => void;
}

export default function MachineAttributeList({ attributes, onDelete }: Props) {
  if (!attributes.length) return <div>Keine Attribute vorhanden.</div>;

  return (
    <ul style={{ padding: 0, listStyle: "none" }}>
      {attributes.map((attr) => (
        <li
          key={attr.id}
          style={{
            padding: "0.5rem",
            marginBottom: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            <strong>{attr.attributeName}</strong> &nbsp;(
            <em>{attr.attributeType}</em>)
          </span>
          {onDelete && (
            <button onClick={() => onDelete(attr.id)}>Löschen</button>
          )}
        </li>
      ))}
    </ul>
  );
}
