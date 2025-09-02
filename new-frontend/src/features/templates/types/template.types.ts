// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Types  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// First Two are full models
export interface Template {
  id?: number;
  templateName: string;
  attributes?: TemplateAttribute[];
}

export interface TemplateAttribute {
  id?: number;
  attributeName: string;
  attributeType: string;
}

//one for creating an template (without id)
export interface CreateMachineTemplateWithAttributesDto {
  templateName: string;
  attributeTemplates: TemplateAttribute[];
}
