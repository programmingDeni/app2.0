import axios from "./axios";
import { MachineAttribute } from "@/types/machineAttribute";

export const getAllAttributes = async () => {
  const res = await axios.get<MachineAttribute[]>("/api/machine-attributes");
  return res;
};

export const getAttributeById = async (id: number) => {
  const res = await axios.get<MachineAttribute>(
    `/api/machine-attributes/${id}`
  );
  return res;
};

export const createAttribute = async (attribute: Partial<MachineAttribute>) => {
  const res = await axios.post("/api/machine-attributes", attribute);
  return res;
};

export const updateAttribute = async (
  id: number,
  attribute: Partial<MachineAttribute>
) => {
  const res = await axios.put(`/api/machine-attributes/${id}`, attribute);
  return res;
};

export const deleteAttribute = async (id: number) => {
  const res = await axios.delete(`/api/machine-attributes/${id}`);
  return res;
};

export const getAttributesByMachineId = async (machineId: number) => {
  const res = await axios.get<MachineAttribute[]>(
    `/api/machine-attributes/by-machine/${machineId}`
  );
  return res;
  //@GetMapping("/by-machine/{machineId}")
};
