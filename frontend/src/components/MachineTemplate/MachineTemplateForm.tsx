"use client";
import React, { useState } from "react";
import axios from "axios";

interface AttributeTemplate {
  attributeInTemplateName: string;
  attributeInTemplateType: "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN";
}

export default function MachineTemplateForm() {
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState<AttributeTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { attributeInTemplateName: "", attributeInTemplateType: "STRING" },
    ]);
  };

  const handleRemoveAttribute = (index: number) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };

  const handleAttributeChange = (
    index: number,
    key: keyof AttributeTemplate,
    value: string
  ) => {
    const updated = [...attributes];
    updated[index][key] = value as any;
    setAttributes(updated);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name darf nicht leer sein.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/machine-templates",
        {
          templateName: name,
          attributeTemplates: attributes,
        }
      );
      setSuccess(`Template '${response.data.name}' wurde erstellt!`);
      setName("");
      setAttributes([]);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Erstellen des Templates.");
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Neues Maschinen-Template</h2>
      <input
        type="text"
        placeholder="Template Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h3>Attribut-Templates</h3>
      {attributes.map((attr, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Attributname"
            value={attr.attributeInTemplateName}
            onChange={(e) =>
              handleAttributeChange(
                index,
                "attributeInTemplateName",
                e.target.value
              )
            }
          />
          <select
            value={attr.attributeInTemplateType}
            onChange={(e) =>
              handleAttributeChange(
                index,
                "attributeInTemplateType",
                e.target.value
              )
            }
          >
            <option value="STRING">STRING</option>
            <option value="INTEGER">INTEGER</option>
            <option value="FLOAT">FLOAT</option>
            <option value="BOOLEAN">BOOLEAN</option>
          </select>
          <button onClick={() => handleRemoveAttribute(index)}>
            Entfernen
          </button>
        </div>
      ))}
      <button onClick={handleAddAttribute}>+ Attribut hinzufügen</button>
      <br />
      <button onClick={handleSubmit}>Template speichern</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
