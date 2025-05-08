"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

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

  const deleteAttribute = async (attrId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/attributes/${attrId}`);
      setMachine((prev) =>
        prev
          ? {
              ...prev,
              attributes: prev.attributes.filter((a) => a.id !== attrId),
            }
          : prev
      );
    } catch (err) {
      console.error("Fehler beim Löschen des Attributs:", err);
    }
  };

  const saveAttribute = async (attrId: number) => {
    try {
      const newName = attributeNameEdit[attrId];
      const response = await axios.put(
        `http://localhost:8080/api/attributes/${attrId}`,
        {
          attributeName: newName,
          id: attrId,
          attributeType: typeEdits[attrId],
          machineId: params.id,
        }
      );

      setMachine((prev) =>
        prev
          ? {
              ...prev,
              attributes: prev.attributes.map((a) =>
                a.id === attrId ? response.data : a
              ),
            }
          : prev
      );
      setEditingAttr(null);
    } catch (err) {
      console.error("Fehler beim Speichern des Attributs:", err);
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
      <h2>Attribute</h2> {/**Anzeigen der Attribute und bearbeitung */}
      {machine.attributes.length === 0 ? (
        <p>Keine Attribute vorhanden.</p>
      ) : (
        <ul>
          {machine.attributes.map((attr) => (
            <li key={attr.id}>
              {editingAttr === attr.id ? ( //Attribute bearbeiten
                <>
                  <input
                    value={attributeNameEdit[attr.id] ?? attr.attributeName}
                    onChange={(e) =>
                      setattributeNameEdit((prev) => ({
                        ...prev,
                        [attr.id]: e.target.value,
                      }))
                    }
                  />
                  <select
                    value={typeEdits[attr.id] ?? attr.attributeType}
                    onChange={(e) =>
                      setTypeEdits((prev) => ({
                        ...prev,
                        [attr.id]: e.target.value,
                      }))
                    }
                  >
                    {attributeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <button onClick={() => saveAttribute(attr.id)}>Save</button>
                  <button onClick={() => setEditingAttr(null)}>
                    Abbrechen
                  </button>
                </>
              ) : (
                <>
                  {attr.attributeName}
                  <button onClick={() => setEditingAttr(attr.id)}>
                    Bearbeiten
                  </button>
                  <button onClick={() => deleteAttribute(attr.id)}>
                    Löschen
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => addAttributes()}> Attribute hinzufügen </button>
    </div>
  );
}
