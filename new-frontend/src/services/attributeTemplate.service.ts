import axios from "@/services/axios";

import {
  AttributeTemplateDto,
  CreateAttributeInTemplateDto,
  CreateAttributeInExistingTemplateDto,
} from "@/types/attributeTemplate";

export function createAttributeTemplate(
  CreateAttributeInTemplateDto: CreateAttributeInTemplateDto
) {
  return axios.post<AttributeTemplateDto>(
    "/api/attribute-templates",
    CreateAttributeInTemplateDto
  );
}

export function createAttributeTemplateInExistingTemplate(
  CreateAttributeInExistingTemplateDto: CreateAttributeInExistingTemplateDto
) {
  return axios.post<AttributeTemplateDto>(
    "/api/attribute-templates",
    CreateAttributeInExistingTemplateDto
  );
}

export function getAllAttributeTemplates() {
  return axios.get<AttributeTemplateDto[]>("/api/attribute-templates");
}
