"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Machine } from "@/types/machine";
import MachineCard from "./MachineCard";
import { MachineTemplate } from "@/types";

import { useMachineTemplates } from "@/hook/useMachineTemplates";

import { getFilteredAndSortedMachines } from "@/utils/machineFilter";

interface Props {
  machines: Machine[];
  onDelete?: (id: number) => void;
}

export default function MachineList({ machines, onDelete }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"id" | "name" | "template">("name");
  const { machineTemplates } = useMachineTemplates();
  const [templateKey, setTemplateKey] = useState<MachineTemplate | null>(null);

  const filteredMachines = getFilteredAndSortedMachines(
    machines,
    searchTerm,
    templateKey,
    sortKey
  );

  if (!machines.length) return <div>Keine Maschinen vorhanden.</div>;

  return (
    <div>
      <div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Nach Name filtern..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "1rem" }}
          />
          <select
            value={templateKey?.id ?? ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selected =
                machineTemplates.find((t) => t.id === selectedId) || null;
              setTemplateKey(selected);
            }}
            style={{ marginLeft: "1rem" }}
          >
            <option value="">Alle Templates</option>
            {machineTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.templateName}
              </option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as "name" | "template")}
          >
            <option value="name">nach Name</option>
            <option value="template">nach Template</option>
            <option value="id"> nach ID </option>
          </select>
        </div>

        {filteredMachines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
