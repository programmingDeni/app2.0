import axios from "@/services/axios";
//Machinen Typ holen
import MachineLazy from "../types/machine.types";

export function fetchMachinesLazy() {
  return axios.get<MachineLazy[]>("/api/machines/lazy");
}

export function removeMachine(machineId: number) {
  return axios.delete(`/api/machines/${machineId}`);
}
