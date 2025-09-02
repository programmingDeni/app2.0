//style import von der anderne
import styles from "../../../machines/components-ui/MachineLazyCard/MachineLazyCard.module.css";

// Types aus dem neuen Frontend
import { Template } from "../../types/template.types";

//Button Import
import Button from "@/components/Button";

/* Machinene Template DTO Struktur 
export interface MachineTemplateDto {
  id: number;
  templateName: string;
  templateAttributes: AttributeTemplateDto[];
}
Attribut Struktur
export interface AttributeTemplateDto {
  id: number;
  attributeInTemplateName: string;
  attributeInTemplateType: AttributeType;
  machineTemplateId: number;
}
  */

interface Props {
  machineTemplate: Template;
  onRemoveAttribute: (
    templateId: number,
    attributeId: number
  ) => void | Promise<void>;
}

export default function TemplateCardUI(props: Props) {
  const machineTemplate = props.machineTemplate;
  const { onRemoveAttribute } = props;
  const attributeTemplates = machineTemplate.attributes ?? [];

  return (
    <div>
      <h3>Template Id: {machineTemplate.id}</h3>
      <div className={styles.name}>
        Template Name: {machineTemplate.templateName}
      </div>
      <h3>Attribute Templates:</h3>
      {attributeTemplates.length === 0 ? (
        <div>Keine Attribute vorhanden</div>
      ) : (
        attributeTemplates.map((attr) => (
          <div key={attr.id}>
            Attribut Name {attr.attributeName}, Attribut Typ{" "}
            {attr.attributeType}
            <Button
              onClick={() => onRemoveAttribute(machineTemplate.id!, attr.id!)}
            >
              {" "}
              Remove Attribute{" "}
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
