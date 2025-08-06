import axios from "@/services/axios";
//Machinen Typ holen
import {
  MachineLazy,
  CreateMachineByName,
  CreateMachineFromTemplate,
} from "@/types/machine";
import { machine } from "os";

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

export async function getMachineAttributesWithYearlyValues(machineId: number) {
  try {
    const response = await axios.get(`/api/machines/${machineId}`);
    return response.data;
  } catch (e) {
    throw new Error("Service Function wirft Fehler");
  }
}

export async function addMachineAttributeValue(
  machineId: number,
  attributeId: number,
  attributeValue: string,
  year: number
) {
  try {
    console.log("addMachineAttributeValue");
    const response = await axios.post(`/api/attribute-values`, {
      machineId,
      attributeId,
      attributeValue,
      attributeValueYear: year,
    });
    return response.data;
  } catch (e) {
    throw new Error("Service Function wirft Fehler");
  }
}
