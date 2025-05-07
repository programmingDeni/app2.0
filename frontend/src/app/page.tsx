"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  interface Machine {
    id?: number;
    name?: string;
  }

  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/machines");
        console.log("got machines :", response.data);
        setMachines(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Maschinen:", error);
      }
    };

    fetchMachines();
  }, []);

  const addMachine = () => {
    router.push("/addMachine");
  };

  const deleteMachine = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/machines/${id}`
      );
      console.log("Gelöscht:", res.data);
      setMachines((prev) => prev.filter((machine) => machine.id !== id));
      // z. B. Maschinenliste neu laden oder Filter entfernen
    } catch (error: any) {
      console.error(
        "Fehler beim Löschen:",
        error.response?.data || error.message
      );
      setError(error.response?.data || "Fehler beim Löschen");
    }
  };

  return (
    <div>
      <h1>Maschinen Liste</h1>
      <ul>
        {machines?.map((machine) =>
          machine.id ? (
            <div>
              {machine.id} name: {machine.name}
              <button onClick={() => deleteMachine(machine.id!)}>
                Löschen
              </button>
            </div>
          ) : // if yes render the comp
          // <li key={machine.id}>
          //     {machine.name}
          //     {/** can be really sure about the existance of id here, is assigned by the backend  */}
          //     <button onClick={() => copyMachine(machine.id!)}>
          //     Duplizieren
          //     </button>
          //     <button onClick={() => editMachine(machine.id!)}>
          //     Bearbeiten
          //     </button>
          //     <button onClick={() => deleteMachine(machine.id!)}>
          //     Löschen
          //     </button>
          // </li>
          // sonst null
          null
        )}
      </ul>
      <button onClick={() => addMachine()}>Add Machine</button>
    </div>
  );
}
