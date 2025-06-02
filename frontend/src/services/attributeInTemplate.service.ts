// services/attributeTemplateService.ts
import axios from "./axios";
import { AttributeInTemplate } from "@/types/attributeInTemplate";

export const getAllAttributeTemplates = async () => {
  const res = await axios.get<AttributeInTemplate[]>(
    "/api/attribute-templates"
  );
  return res;
};

export const getAttributeTemplateById = async (id: number) => {
  const res = await axios.get<AttributeInTemplate>(
    `/api/attribute-templates/${id}`
  );
  return res;
};

export const getAttributeTemplatesByTemplateId = async (templateId: number) => {
  const res = await axios.get<AttributeInTemplate[]>(
    `/api/attribute-templates/by-template/${templateId}`
  );
  return res;
};

export const createAttributeTemplate = async (
  template: Partial<AttributeInTemplate>
) => {
  const res = await axios.post("/api/attribute-templates", template);
  return res;
};

export const updateAttributeTemplate = async (
  id: number,
  template: Partial<AttributeInTemplate>
) => {
  const res = await axios.put(`/api/attribute-templates/${id}`, template);
  return res;
};

export const deleteAttributeTemplate = async (id: number) => {
  const res = await axios.delete(`/api/attribute-templates/${id}`);
  return res;
};
