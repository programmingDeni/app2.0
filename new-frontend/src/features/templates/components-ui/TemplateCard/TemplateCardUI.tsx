//style import von der anderne
import styles from "../../../machines/components-ui/MachineLazyCard/MachineLazyCard.module.css";

// Types aus dem neuen Frontend
import { MachineTemplateDto } from "@/types/machineTemplate";
import { AttributeTemplateDto } from "@/types/attributeTemplate";
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
  machineTemplate: MachineTemplateDto;
  onRemoveAttribute: (
    templateId: number,
    attributeId: number
  ) => void | Promise<void>;
}

export default function TemplateCardUI(props: Props) {
  const machineTemplate = props.machineTemplate;
  const { onRemoveAttribute } = props;
  const attributeTemplates = machineTemplate.templateAttributes ?? [];

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
            Attribut Name {attr.attributeInTemplateName}, Attribut Typ{" "}
            {attr.attributeInTemplateType}
            <Button
              onClick={() => onRemoveAttribute(machineTemplate.id, attr.id)}
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
