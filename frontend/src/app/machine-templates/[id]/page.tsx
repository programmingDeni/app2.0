"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import AddAttribute from "@/app/AddAttribute/OLDpage";
import MachineTemplateForm from "@/components/MachineTemplateForm";
import AttributeTemplateForm from "@/components/AttributeTemplateForm";

interface AttributeTemplate {
  id: number;
  attributeTemplateName: string;
  attributeTemplateType: string;
}

interface MachineTemplate {
  id: number;
  templateName: string;
  attributeTemplates: AttributeTemplate[];
}

export default function MachineTemplateDetailsPage() {
  const [template, setTemplate] = useState<MachineTemplate | null>(null);
  const params = useParams();

  //toggle show attribute form
  const [showAddAttributeToTemplate, setShowAddAttributeToTemplate] =
    useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/machine-templates/${params.id}`
        );
        setTemplate(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Fehler beim Laden des Templates:", error);
      }
    };

    fetchTemplate();
  }, [params.id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (template) {
      setTemplate({ ...template, templateName: e.target.value });
    }
  };

  const saveTemplate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/machine-templates/${params.id}`,
        template
      );
      alert("Änderungen gespeichert");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  const deleteAttribute = async (attrId: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/attribute-templates/${attrId}`
      );
      if (template) {
        setTemplate({
          ...template,
          attributeTemplates: template.attributeTemplates.filter(
            (a) => a.id !== attrId
          ),
        });
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const toggleAddAttributeToTemplate = () => {
    setShowAddAttributeToTemplate(!showAddAttributeToTemplate);
  };

  if (!template) return <div>Loading...</div>;

  return (
    <div>
      <h1>Template bearbeiten</h1>
      <strong>Template name:</strong>
      <input value={template.templateName} onChange={handleNameChange} />
      <h2>Attribute</h2>
      <ul>
        {template.attributeTemplates.map((attr) => (
          <li key={attr.id}>
            Attribut Name: {attr.attributeTemplateName} (
            {attr.attributeTemplateType})
            <button onClick={() => deleteAttribute(attr.id)}>Löschen</button>
          </li>
        ))}
      </ul>
      {showAddAttributeToTemplate && (
        <AttributeTemplateForm templateId={template.id} />
      )}
      <button onClick={toggleAddAttributeToTemplate}>
        {showAddAttributeToTemplate
          ? "Attribut ausblenden"
          : "Attribut anlegen"}
      </button>
      <button onClick={saveTemplate}>Speichern</button>
    </div>
  );
}
