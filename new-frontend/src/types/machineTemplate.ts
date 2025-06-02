import {
  AttributeTemplateDto,
  CreateAttributeInTemplateDto,
} from "./attributeTemplate";

export interface CreateMachineTemplateByNameDto {
  templateName: string;
}

export interface CreateMachineTemplateWithAttributesDto {
  templateName: string;
  attributeTemplates: CreateAttributeInTemplateDto[];
}

export interface MachineTemplateDto {
  id: number;
  templateName: string;
  attributeTemplates: AttributeTemplateDto[];
}
