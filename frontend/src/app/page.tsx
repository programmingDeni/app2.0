"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getAllMachines, deleteMachine } from "./services/machine.service";
import AddMachineForm from "@/components/Machine/AddMachineForm";
import MachineList from "@/components/Machine/MachineList";
import { Machine } from "@/types/machine";

export default function Page() {
  const [showMachineForm, setMachineForm] = useState(false);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await getAllMachines();
        console.log("got machines :", response.data);
        setMachines(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Maschinen:", error);
      }
    };

    fetchMachines();
  }, []);

  const toggleShowMachineForm = () => {
    setMachineForm(!showMachineForm);
  };

  const deleteMachineLocal = async (id: number) => {
    try {
      const res = await deleteMachine(id);
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
      <MachineList machines={machines} onDelete={deleteMachineLocal} />
      <button onClick={() => toggleShowMachineForm()}>
        {!showMachineForm ? "Add Machine" : "Zuklappen"}
      </button>
      {showMachineForm && (
        <AddMachineForm
          onMachineAdded={(newMachine) => {
            setMachines((prev) =>
              prev ? [...prev, newMachine] : [newMachine]
            );
            setMachineForm(false);
          }}
          onCancel={() => setMachineForm(false)}
        />
      )}
      <button onClick={() => router.push("/machine-templates")}>
        Templates
      </button>
    </div>
  );
}
