"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AttributeTemplate {
  id: number;
  attributeInTemplateName: string;
  attributeInTemplateType: string;
}

interface MachineTemplate {
  id: number;
  templateName: string;
  attributeTemplates: AttributeTemplate[];
}

export default function MachineTemplateList() {
  const [templates, setTemplates] = useState<MachineTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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

    fetchTemplates();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/machine-templates/${id}`);
  };

  return (
    <div>
      <h1>Maschinen-Templates</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {templates.length === 0 ? (
        <p>Keine Templates gefunden.</p>
      ) : (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <strong>{template.templateName}</strong> (ID: {template.id})
              <ul>
                {template.attributeTemplates.map((attr) => (
                  <li key={attr.id}>
                    {attr.attributeInTemplateName} (
                    {attr.attributeInTemplateType})
                  </li>
                ))}
              </ul>
              <button onClick={() => handleEdit(template.id)}>
                Bearbeiten
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
