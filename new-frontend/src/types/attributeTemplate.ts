import { AttributeType } from "./attributeType";

export interface AttributeTemplateDto {
  id: number;
  attributeInTemplateName: string;
  attributeInTemplateType: AttributeType;
  machineTemplateId: number;
}

export interface CreateAttributeInTemplateDto {
  attributeInTemplateName: string;
  attributeInTemplateType: AttributeType;
}

export interface CreateAttributeInExistingTemplateDto {
  machineTemplateId: number;
  attributeTemplateName: string;
  attributeTemplateType: AttributeType;
}
