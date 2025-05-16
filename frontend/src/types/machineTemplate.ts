import { AttributeInTemplate } from "./attributeInTemplate";

export interface MachineTemplate {
  id: number;
  templateName: string;
  attributeTemplates: AttributeInTemplate[];
}
