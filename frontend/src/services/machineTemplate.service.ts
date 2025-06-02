import axios from "./axios";
import { MachineTemplate } from "@/types/machineTemplate";

export const getAllMachineTemplates = async () => {
  const res = await axios.get<MachineTemplate[]>("/api/machine-templates");
  return res;
};

export const getMachineTemplateById = async (id: number) => {
  const res = await axios.get<MachineTemplate>(`/api/machine-templates/${id}`);
  return res;
};

export const createMachineTemplate = async (
  machineTemplate: Partial<MachineTemplate>
) => {
  const res = await axios.post("/api/machine-templates", machineTemplate);
  return res;
};

export const updateMachineTemplate = async (
  id: number,
  machineTemplate: Partial<MachineTemplate>
) => {
  const res = await axios.put(`/api/machine-templates/${id}`, machineTemplate);
  return res;
};

export const deleteMachineTemplate = async (id: number) => {
  const res = await axios.delete(`/api/machine-templates${id}`);
  return res;
};
