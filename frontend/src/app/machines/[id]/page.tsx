"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  deleteAttribute,
  getAllAttributes,
  createAttribute,
} from "@/app/services/machineAttribute.service";
import { useParams, useRouter } from "next/navigation";
import AddAttributeForm from "@/components/Attribute/AddAttributeForm";
import { Machine } from "@/types";
import MachineAttributeList from "@/components/Attribute/MachineAttributeList";

export default function MachineDetails() {
  const [machine, setMachine] = useState<Machine | null>(null);
  const params = useParams();
  const router = useRouter();

  //machinen name bearbeiten
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [showAddAttribute, setShowAddAttribute] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    const fetchMachine = async () => {
      try {
        console.log("params beim zugriff", params.id);
        const response = await axios.get(
          `http://localhost:8080/api/machines/${params.id}`
        );

        setMachine(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Maschinendetails:", error);
      }
    };
    fetchMachine();
  }, [params.id]);

  const toggleShowAddAttribute = () => {
    setShowAddAttribute(!showAddAttribute);
  };

  const saveMachineName = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/machines/${params.id}`,
        {
          name: editName,
        }
      );
      setMachine(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Fehler beim Aktualisieren:", err);
    }
  };

  const handleDeleteAttribute = async (attributeId: number) => {
    try {
      await deleteAttribute(attributeId);
      setMachine((prev) =>
        prev
          ? {
              ...prev,
              attributes: prev.attributes.filter(
                (attr) => attr.id !== attributeId
              ),
            }
          : prev
      );
    } catch (err) {
      console.error("Fehler beim Löschen des Attributs:", err);
    }
  };

  if (!machine) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Machine Details</h1>
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
          <button onClick={() => setIsEditing(true)}>Name bearbeiten</button>
        </>
      )}
      <MachineAttributeList
        attributes={machine.attributes}
        onDelete={handleDeleteAttribute}
      />

      <button onClick={() => toggleShowAddAttribute()}>
        {" "}
        {showAddAttribute ? "Zuklappen" : "Attribut hinzufügen"}{" "}
      </button>
      {showAddAttribute && (
        <AddAttributeForm
          machineId={machine.id!}
          onAttributeAdded={(newAttr) =>
            setMachine((prev) =>
              prev
                ? {
                    ...prev,
                    attributes: [...prev.attributes, newAttr],
                  }
                : prev
            )
          }
          onCancel={() => setShowAddAttribute(false)}
        />
      )}
    </div>
  );
}
