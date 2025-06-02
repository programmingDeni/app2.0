import axios from "@/services/axios";
import {
  MachineTemplateDto,
  CreateMachineTemplateByNameDto,
  CreateMachineTemplateWithAttributesDto,
} from "@/types/machineTemplate";

export function getAllMachineTemplatesLazy() {
  return axios.get<MachineTemplateDto[]>("/api/machine-templates/lazy");
}

export function getAllMachineTemplatesWithAttributes() {
  return axios.get<MachineTemplateDto[]>("/api/machine-templates/full");
}

// services/machineTemplate.service.ts
export function createMachineTemplate(dto: CreateMachineTemplateByNameDto) {
  return axios.post("/api/machine-templates", dto);
}

export function createMachineTemplateWithAttributes(
  dto: CreateMachineTemplateWithAttributesDto
) {
  return axios.post("/api/machine-templates/with-attributes", dto);
}
