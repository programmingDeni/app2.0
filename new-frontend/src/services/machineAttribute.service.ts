import { MachineAttributeDto } from "@/types/machineAttribute"; //models from backend, ganze Objekte
import axis from "@/services/axios";
import { CreateMachineAttributeDto } from "@/types/MachineAttributes/CreatemachineAttribute"; //types, request an backend

export function createAttribute(attribute: CreateMachineAttributeDto) {
  return axis.post<MachineAttributeDto>("/api/machine-attributes", attribute);
}

export function removeAttributeFromMachineService(attributeId: number) {
  return axis.delete(`/api/machine-attributes/${attributeId}`);
}
