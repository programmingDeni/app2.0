import {
  MachineLazy,
  MachineStructureDto,
  CreateMachineByNameDto,
  CreateMachineFromTemplateDto,
} from "@/types/machine";

import axios from "@/services/axios";

export function getMachineStructureByMachineId(machineId: number) {
  return axios.get<MachineStructureDto>(`/api/machines/${machineId}/structure`);
}

export function getAllMachineNamesAndTemplateName() {
  return axios.get<MachineLazy[]>("/api/machines/lazy");
}

export function assignTemplateToMachineById(
  machineId: number,
  templateId: number
) {
  return axios.put(`/api/machines/${machineId}/template/${templateId}`);
}

export function removeTemplateFromMachineById(machineId: number) {
  return axios.delete(`/api/machines/${machineId}/template/`);
}

export function createMachineByName(payload: CreateMachineByNameDto) {
  return axios.post("/api/machines", payload);
}

export function createMachineFromTemplate(
  payload: CreateMachineFromTemplateDto
) {
  return axios.post("/api/machines/from-template", payload);
}
