"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import MachineAttributeForm, {
  MachineAttributeFormDto,
} from "@/components/Attribute/MachineAttributeForm";
import MachineAttributeList from "@/components/Attribute/MachineAttributeList";

interface Machine {
  id?: number;
  name?: string;
  attributes: MachineAttribute[];
}

interface MachineAttribute {
  id: number;
  attributeName: string;
  attributeType: string;
  machineId: number;
}

export default function MachineDetails() {
  const [machine, setMachine] = useState<Machine | null>(null);
  const params = useParams();
  const router = useRouter();

  //machinen name bearbeiten
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  //attribute bearbeiten
  const [editingAttr, setEditingAttr] = useState<number | null>(null);
  const [attributeNameEdit, setattributeNameEdit] = useState<{
    [key: number]: string;
  }>({}); // namen bearbeiten
  const [typeEdits, setTypeEdits] = useState<{ [id: number]: string }>({}); // typen bearbeiten

  //mögliche typen
  const attributeTypes = ["STRING", "INTEGER", "FLOAT", "BOOLEAN"];

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

  const addAttributes = () => {
    router.push(`/AddAttribute?machineId=${params.id}`);
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
        machineId={machine.id!}
        onAttributesUpdated={(updated) =>
          setMachine((prev) => (prev ? { ...prev, attributes: updated } : prev))
        }
      />
      <button onClick={() => addAttributes()}> Attribute hinzufügen </button>
    </div>
  );
}
