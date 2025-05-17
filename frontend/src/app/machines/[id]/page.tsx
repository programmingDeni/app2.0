"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

import { useMachine } from "@/hook/useMachine";

import AddAttributeForm from "@/components/Attribute/AddAttributeForm";
import MachineAttributeList from "@/components/Attribute/MachineAttributeList";

export default function MachineDetails() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const {
    machine,
    updateName,
    addAttribute,
    removeAttribute,
    addValue,
    loading,
  } = useMachine(id);

  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddAttribute, setShowAddAttribute] = useState(false);

  const toggleShowAddAttribute = () => {
    setShowAddAttribute(!showAddAttribute);
  };

  const saveMachineName = async () => {
    if (!machine) return;
    await updateName(editName);
    setIsEditing(false);
  };

  if (!machine) return <div>Loading...</div>;

  return (
    <div>
      <h1>Machine Details</h1>

      {machine.machineTemplateDto?.templateName && (
        <h2>Vorlage: {machine.machineTemplateDto.templateName}</h2>
      )}

      {isEditing ? (
        <>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <button onClick={saveMachineName}>Speichern</button>
          <button onClick={() => setIsEditing(false)}>Abbrechen</button>
        </>
      ) : (
        <>
          <h2>Name: {machine.name}</h2>
          <button
            onClick={() => {
              setEditName(machine.name);
              setIsEditing(true);
            }}
          >
            Name bearbeiten
          </button>
        </>
      )}

      <MachineAttributeList
        attributes={machine.attributes}
        onDelete={removeAttribute}
        onValueAdded={addValue}
      />

      <button onClick={toggleShowAddAttribute}>
        {showAddAttribute ? "Zuklappen" : "Attribut hinzufügen"}
      </button>

      {showAddAttribute && (
        <AddAttributeForm
          machineId={machine.id}
          onAttributeAdded={addAttribute}
          onCancel={() => setShowAddAttribute(false)}
        />
      )}
    </div>
  );
}
