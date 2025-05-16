"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AttributeInTemplate } from "@/types/attributeInTemplate";

interface Props {
  templateId: number;
  refreshTrigger?: boolean; // Add this prop
}

export default function AttributeTemplateList({
  templateId,
  refreshTrigger,
}: Props) {
  const [attributes, setAttributes] = useState<AttributeInTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadAttributes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/attribute-templates/by-template/${templateId}`
      );
      setAttributes(response.data);
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Laden der Attribute");
    }
  };

  useEffect(() => {
    loadAttributes();
  }, [templateId, refreshTrigger]); // Add refreshTrigger to dependencies

  const handleDelete = async (attributeId: number) => {
    if (!confirm("Attribut wirklich löschen?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/attribute-templates/${attributeId}`
      );
      await loadAttributes();
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Löschen des Attributs");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Template Attribute</h3>

      {attributes.length === 0 ? (
        <p className="text-gray-500">Keine Attribute vorhanden</p>
      ) : (
        <ul className="space-y-2">
          {attributes.map((attr) => (
            <li
              key={attr.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <span className="font-medium">
                  {attr.attributeInTemplateName}
                </span>
                <span className="ml-2 text-gray-500">
                  ({attr.attributeInTemplateType})
                </span>
              </div>

              <button
                onClick={() => handleDelete(attr.id)}
                className="px-2 py-1 text-red-500 hover:text-red-700"
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
