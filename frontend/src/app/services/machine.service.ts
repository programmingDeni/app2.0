import axios from "./axios";
import { Machine } from "@/types/machine";

export const getAllMachines = async () => {
  const res = await axios.get<Machine[]>("/api/machines");
  return res;
};

export const getMachineById = async (id: number) => {
  const res = await axios.get<Machine>(`/api/machines/${id}`);
  return res;
};

export const createMachine = async (machine: Partial<Machine>) => {
  const res = await axios.post("/api/machines", machine);
  return res;
};

export const updateMachine = async (id: number, machine: Partial<Machine>) => {
  const res = await axios.put(`/api/machines/${id}`, machine);
  return res;
};

export const deleteMachine = async (id: number) => {
  const res = await axios.delete(`/api/machines/${id}`);
  return res;
};
