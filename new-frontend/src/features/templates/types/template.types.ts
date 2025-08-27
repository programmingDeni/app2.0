export interface Template {
  id: number;
  templateName: string;
  attributes?: TemplateAttribute[];
}

export interface TemplateAttribute {
  id: number;
  attributeName: string;
  attributeType: string;
}
