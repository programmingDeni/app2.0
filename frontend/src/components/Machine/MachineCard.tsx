"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Machine } from "@/types/machine";

interface Props {
  machine: Machine;
  onDelete?: (id: number) => void;
}

export default function MachineCard({ machine, onDelete }: Props) {
  const router = useRouter();

  return (
    <li
      style={{
        padding: "0.5rem",
        marginBottom: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => router.push(`/machines/${machine.id}`)}
    >
      <span>
        <strong>ID:</strong> {machine.id} &nbsp; | &nbsp;
        <strong>Name:</strong> {machine.name} &nbsp; | &nbsp;
        {machine.machineTemplateDto ? (
          <span>
            <strong>Template:</strong> {machine.machineTemplateDto.templateName}
          </span>
        ) : (
          <span style={{ fontStyle: "italic", color: "#888" }}>
            Kein Template gesetzt
          </span>
        )}
      </span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // verhindert Navigation
            onDelete(machine.id!);
          }}
        >
          Löschen
        </button>
      )}
    </li>
  );
}
