"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Machine } from "@/types/machine";

interface Props {
  machines: Machine[];
  onDelete?: (id: number) => void;
}

export default function MachineList({ machines, onDelete }: Props) {
  const router = useRouter();

  if (!machines.length) return <div>Keine Maschinen vorhanden.</div>;

  return (
    <ul style={{ padding: 0, listStyle: "none" }}>
      {machines.map((machine) => (
        <li
          key={machine.id}
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
            <strong>Name:</strong> {machine.name}
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // verhindert Navigieren
                onDelete(machine.id!);
              }}
            >
              Löschen
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
