// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Types  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// First Two are full models
export interface Template {
  id?: number;
  templateName: string;
  templateAttributes?: TemplateAttribute[];
}

export interface TemplateAttribute {
  id?: number;
  templateAttributeName: string;
  templateAttributeType: string;
  templateId?: number;
}

//one for creating an template (without id)
export interface CreateMachineTemplateWithAttributesDto {
  templateName: string;
  attributeTemplates: TemplateAttribute[];
}
