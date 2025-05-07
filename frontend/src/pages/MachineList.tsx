import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Machine {
  id: number;
  name: string;
}

export default function MachineList() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/machines");
        console.log("got machines :", response.data);
        setMachines(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Maschinen:", error);
      }
    };

    fetchMachines();
  }, []);

  return (
    <div>
      <h1>Maschinenübersicht</h1>
      <ul>
        {machines.map((machine) => (
          <li key={machine.id}>{machine.name}</li>
        ))}
      </ul>
    </div>
  );
}
