//style import von der anderne
import styles from "../../../machines/components-ui/MachineLazyCard/MachineLazyCard.module.css";

// Types aus dem neuen Frontend
import { Template } from "../../types/template.types";

//Button Import
import Button from "@/components/Button";

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
  const attributeTemplates = machineTemplate.templateAttributes ?? [];

  console.log("attributeTemplates", attributeTemplates);

  return (
    <div>
      {/*<h3>Template Id: {machineTemplate.id}</h3>*/}
      <div className={styles.name}>
        Template Name: {machineTemplate.templateName}
      </div>
      <h3>Attribute Templates:</h3>
      {attributeTemplates.length === 0 ? (
        <div>Keine Attribute vorhanden</div>
      ) : (
        attributeTemplates.map((attr) => (
          <div key={attr.id}>
            Attribut Name {attr.templateAttributeName}, Attribut Typ{" "}
            {attr.templateAttributeType}
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
