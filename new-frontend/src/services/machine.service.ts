import {
  MachineLazy,
  MachineStructureDto,
  CreateMachineByNameDto,
  CreateMachineFromTemplateDto,
  MachineWithAttributeValues,
} from "@/types/machine";

import axios from "@/services/axios";

//GET
export function getMachineStructureByMachineId(machineId: number) {
  return axios.get<MachineStructureDto>(`/api/machines/${machineId}/structure`);
}

export function getAllMachineNamesAndTemplateName() {
  return axios.get<MachineLazy[]>("/api/machines/lazy");
}

export function getMachinesAttributesValuesByMachineId(machineId: number) {
  return axios.get<MachineWithAttributeValues>(
    `/api/machines/${machineId}/structure`
  );
}
//TEMPLATES ASSIGN UND REMOVE
export function assignTemplateToMachineById(
  machineId: number,
  templateId: number
) {
  console.log("assignTemplateToMachineById", machineId, templateId);
  return axios.put(`/api/machines/${machineId}/template/${templateId}`);
}

export function removeTemplateFromMachineById(machineId: number) {
  return axios.delete(`/api/machines/${machineId}/template`);
}

//machinen hinzufügen und entfernen
//CREATE MACHINE
//BY NAME
export function createMachineByName(payload: CreateMachineByNameDto) {
  return axios.post("/api/machines", payload);
}
//BY TEMPLATE
export async function createMachineFromTemplate(
  payload: CreateMachineFromTemplateDto
) {
  const response = await axios.post("/api/machines/from-template", payload);
  console.log("serveer response", response);
  return response;
}
//DELETE MACHINE
export function deleteMachine(machineId: number) {
  try {
    return axios.delete(`/api/machines/${machineId}`);
  } catch (err) {
    console.error("Fehler beim Entfernen der Maschine:", err);
    return err;
  }
}
