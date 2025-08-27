import axios from "@/services/axios";

import { MachineTemplateDto } from "@/types/machineTemplate";

export async function fetchMachineTemplates() {
  return axios.get<MachineTemplateDto[]>("/api/machineTemplates");
}
