import axios from "@/services/axios";
import type { AxiosResponse } from "axios";

//denk moderneres Model
import { Template, TemplateAttribute } from "../types/template.types";

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Templates  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export async function fetchMachineTemplates() {
  return axios.get<Template[]>("/api/machine-templates/full");
}

export async function deleteTemplateService(templateId: number) {
  return axios.delete(`/api/machine-templates/${templateId}`);
}

export async function createMachineTemplateService(
  templateName: string,
  attributes: TemplateAttribute[]
) {
  console.log("createMachineTemplate", templateName, attributes);

  return axios.post(`/api/machine-templates`, {
    templateName,
    attributes,
  });
}

/**
 * export function createMachineTemplateWithAttributes(
  dto: CreateMachineTemplateWithAttributesDto
) {
  return axios.post("/api/machine-templates/with-attributes", dto);
}

 */

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Attribute  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
  const payload = attributes.map((attr) => ({
    attributeName: attr.templateAttributeName,
    attributeType: attr.templateAttributeType,
  }));

  const response = axios.post(
    `/api/machine-templates/${templateId}/attributes`,
    payload
  );
  return response;
}
