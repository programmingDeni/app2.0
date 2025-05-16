export interface AttributeInTemplate {
  id: number;
  attributeInTemplateName: string;
  attributeInTemplateType: AttributeType;
  machineTemplateId?: number;
}

export type AttributeType = "STRING" | "INTEGER" | "BOOLEAN";
