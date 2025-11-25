// service klasse um machinen attribute zu verwalten
import axios from "@/services/axios";
import { MachineAttribute } from "../../../shared/types/machine.types";

export async function getMachineAttributesLazy(machineId: number) {
  try {
    const response = await axios.get<MachineAttribute[]>(
      `/api/machines/${machineId}/attributes`
    );
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function getMachineAttributesEager(machineId: number) {
  try {
    const response = await axios.get<MachineAttribute[]>(
      `/api/machines/${machineId}/attributes/eager`
    );
    console.log("machineAttributeService response:", response)
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function addMachineAttributeService(
  attribute: Partial<MachineAttribute>
) {
  try {
    const machineId = attribute.machineId;
    const response = await axios.post(
      `/api/machines/${machineId}/attributes`,
      attribute
    );
    return response.data;
  } catch (e) {
    throw e;
  }
}
