import axios from "@/services/axios";
//Machinen Typ holen
import {
  MachineLazy,
  CreateMachineByName,
  CreateMachineFromTemplate,
} from "@/types/machine";

export function fetchMachinesLazy() {
  return axios.get<MachineLazy[]>("/api/machines/lazy");
}

export function removeMachine(machineId: number) {
  return axios.delete(`/api/machines/${machineId}`);
}

export function addMachine(createMachineByName: CreateMachineByName) {
  return axios.post(`/api/machines/}`, createMachineByName);
}

export function addMachineFromTemplate(
  createMachineFromTemplateDto: CreateMachineFromTemplate
) {
  return axios.post(
    `/api/machines/from-template`,
    createMachineFromTemplateDto
  );
}
