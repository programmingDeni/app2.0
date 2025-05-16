"use client";
import { useState } from "react";
import axios from "axios";
import { AttributeType } from "@/types/attributeInTemplate";

interface Props {
  templateId: number;
  onSubmit: () => void;
}

export default function AttributeTemplateForm({ templateId, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AttributeType>("STRING");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name darf nicht leer sein");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/attribute-templates", {
        attributeInTemplateName: name,
        attributeInTemplateType: type,
        machineTemplateId: templateId,
      });
      setName("");
      onSubmit();
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Erstellen des Attributes");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Attributname"
        className="p-2 border rounded"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as AttributeType)}
        className="p-2 border rounded ml-2"
      >
        <option value="STRING">Text</option>
        <option value="INTEGER">Zahl</option>
        <option value="BOOLEAN">Ja/Nein</option>
      </select>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
      >
        Hinzufügen
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
