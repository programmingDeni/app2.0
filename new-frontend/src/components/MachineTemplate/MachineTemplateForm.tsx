import React, { useState } from "react";

import { AttributeType } from "@/types/attributeType";

import { CreateMachineTemplateWithAttributesDto } from "@/types/machineTemplate";

import {
  createMachineTemplate,
  createMachineTemplateWithAttributes,
} from "@/services/machineTemplate.service";
import AttributeInTemplateInput from "./AttributeInTemplateInput";
import Button from "../Button";

type Props = {
  onSubmit: () => void;
};

export default function MachineTemplateForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attributes, setAttributes] = useState([
    { name: "", type: "STRING" as AttributeType },
  ]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name darf nicht leer sein.");
      return;
    }

    try {
      // create machine template with or without attribute templates

      if (attributes.length > 0) {
        // create attribute template
        const dto: CreateMachineTemplateWithAttributesDto = {
          templateName: name,
          attributeTemplates: attributes.map((a) => ({
            attributeInTemplateName: a.name,
            attributeInTemplateType: a.type,
          })),
        };

        await createMachineTemplateWithAttributes(dto);
      } else {
        await createMachineTemplate({ templateName: name });
      }
      onSubmit();
      setSuccess(`Template '${name}' wurde erstellt!`);
      setName("");
      setError(null);
    } catch (err: any) {
      setError(err.response?.data || "Fehler beim Erstellen des Templates.");
      setSuccess(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Neues Maschinen-Template</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />
        {attributes.map((attr, idx) => (
          <AttributeInTemplateInput
            key={idx}
            name={attr.name}
            type={attr.type}
            onChangeName={(val) => {
              const copy = [...attributes];
              copy[idx].name = val;
              setAttributes(copy);
            }}
            onChangeType={(val) => {
              const copy = [...attributes];
              copy[idx].type = val;
              setAttributes(copy);
            }}
            onDelete={() => {
              const copy = [...attributes];
              copy.splice(idx, 1);
              setAttributes(copy);
            }}
          />
        ))}

        <Button
          onClick={() =>
            setAttributes([...attributes, { name: "", type: "STRING" }])
          }
        >
          + Attribut hinzufügen
        </Button>

        <Button onClick={handleSubmit}>Template speichern</Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
