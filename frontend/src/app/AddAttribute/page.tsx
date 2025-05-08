"use client";
import MachineAttributeForm, {
  MachineAttributeFormDto,
} from "@/components/Attribute/MachineAttributeForm"; // Pfad anpassen
import { useSearchParams } from "next/navigation";
import axios from "axios";
import React from "react";

export default function AddAttribute() {
  const searchParams = useSearchParams();
  const machineIdParam = searchParams.get("machineId");
  const machineId = machineIdParam ? parseInt(machineIdParam) : null;

  const handleSubmit = async (dto: MachineAttributeFormDto) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/attributes",
        dto
      );
      alert(
        `Attribut "${response.data.attributeName}" erfolgreich hinzugefügt.`
      );
    } catch (err: any) {
      alert(err.response?.data || "Fehler beim Hinzufügen.");
    }
  };

  return machineId ? (
    <MachineAttributeForm machineId={machineId} onSubmit={handleSubmit} />
  ) : (
    <p>Kein Machine-ID übergeben.</p>
  );
}
