import { CreateAttributeInTemplateDto } from "./attributeTemplate";

export interface CreateMachineTemplateDto {
  templateName: string;
  attributeTemplates: CreateAttributeInTemplateDto[];
}

/**import { AttributeInTemplate } from "./attributeInTemplate";

export interface MachineTemplate {
  id: number;
  templateName: string;
  attributeTemplates: AttributeInTemplate[];
}
 */
