import React, { useState } from "react";
import axios from "axios";

const attributeTypes = ["STRING", "INTEGER", "FLOAT", "BOOLEAN"];

export default function AttributeTemplateForm({
  templateId,
}: {
  templateId: number;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("STRING");
  const [message, setMessage] = useState<string | null>(null);

  const handleAdd = async () => {
    try {
      console.log("add attributeToTemplate", templateId, name, type);
      await axios.post("http://localhost:8080/api/attribute-templates", {
        machineTemplateId: templateId,
        attributeInTemplateName: name,
        attributeInTemplateType: type,
      });
      setMessage("Attribut erfolgreich hinzugefügt.");
      setName("");
      setType("STRING");
    } catch (err: any) {
      setMessage("Fehler beim Hinzufügen");
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {attributeTypes.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <button onClick={handleAdd}>Attribut hinzufügen</button>
      {message && <p>{message}</p>}
    </div>
  );
}
