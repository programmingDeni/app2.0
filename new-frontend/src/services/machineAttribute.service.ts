import { MachineAttributeDto } from "@/types/machineAttribute"; //models from backend, ganze Objekte
import axis from "@/services/axios";
import { CreateMachineAttributeDto } from "@/types/MachineAttributes/CreatemachineAttribute"; //types, request an backend

export function createAttribute(
  machineId: number,
  attribute: CreateMachineAttributeDto
) {
  return axis.post<MachineAttributeDto>(
    `/api/machines/${machineId}/attributes`,
    attribute
  );
}

export function removeAttributeFromMachineService(attributeId: number) {
  return axis.delete(`/api/machine-attributes/${attributeId}`);
}

export function getMachineAttributes(machineId: number) {
  return axis.get<MachineAttributeDto[]>(
    `/api/machine-attributes/${machineId}`
  );
}
