"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MachineTemplate } from "@/types/machineTemplate";

interface Props {
  refreshTrigger: boolean;
}

export default function MachineTemplateList({ refreshTrigger }: Props) {
  const [templates, setTemplates] = useState<MachineTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/machine-templates"
      );
      setTemplates(response.data);
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Laden der Templates.");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [refreshTrigger]);

  const handleEdit = (id: number) => {
    router.push(`/machine-templates/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Template wirklich löschen?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/machine-templates/${id}`);
      await fetchTemplates();
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Löschen des Templates.");
    }
  };

  return (
    <div className="mt-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {templates.length === 0 ? (
        <p>Keine Templates gefunden.</p>
      ) : (
        <ul className="space-y-2">
          {templates.map((template) => (
            <li
              key={template.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span>{template.templateName}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(template.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
