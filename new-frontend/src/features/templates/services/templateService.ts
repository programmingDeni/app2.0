import axios from "@/services/axios";
import type { AxiosResponse } from "axios";

//Backend model
import { MachineTemplateDto } from "@/types/machineTemplate";

//denk moderneres Model
import { TemplateAttribute } from "../types/template.types";

export async function fetchMachineTemplates() {
  return axios.get<MachineTemplateDto[]>("/api/machine-templates/full");
}

export async function removeAttributeFromTemplateService(
  templateId: number,
  attributeId: number
): Promise<AxiosResponse> {
  return axios.delete(
    `/api/machine-templates/${templateId}/attributes/${attributeId}`
  );
}

export async function addAttributesToExistingTemplateService(
  templateId: number,
  attributes: TemplateAttribute[]
): Promise<AxiosResponse> {
  return axios.post(
    `/api/machine-templates/${templateId}/attributes`,
    attributes
  );
}
