//style import von der anderne
import styles from "../../../machines/components-ui/MachineLazyCard/MachineLazyCard.module.css";

// Types aus dem neuen Frontend
import { MachineTemplateDto } from "@/types/machineTemplate";
import { AttributeTemplateDto } from "@/types/attributeTemplate";

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
}

export default function TemplateCardUI(props: Props) {
  const machineTemplate = props.machineTemplate;
  const attributeTemplates = machineTemplate.templateAttributes ?? [];

  return (
    <div>
      <h3>Template Id: {machineTemplate.id}</h3>
      <div className={styles.name}>
        Template Name: {machineTemplate.templateName}
      </div>
      <h3>Attribute Templates:</h3>
      {attributeTemplates.map((attr) => (
        <div key={attr.id}>
          Attribut Name {attr.attributeInTemplateName}, Attribut Typ{" "}
          {attr.attributeInTemplateType}
        </div>
      ))}
    </div>
  );
}

/*
import styles from "./MachineLazyCard.module.css";
import { MachineLazy } from "@/types/machine";
import { Link } from "react-router-dom";

interface Props {
  machine: MachineLazy;
  onRemove: (id: number) => void | Promise<void>;
}

export default function MachineLazyCardUI({ machine, onRemove }: Props) {
  return (
    <li className={styles.card}>
      <div className={styles.header}>
        <div className={styles.name}>{machine.machineName}</div>
        <button
          onClick={() => onRemove(machine.machineId)}
          className={styles.removeButton}
          title="Entfernen"
        >
          Entfernen
        </button>
      </div>

      <div className={styles.template}>
        Template: {machine.templateName ?? "Kein Template"}
      </div>

      <div className={styles.links}>
        <Link to={`/machines/${machine.machineId}`}>Struktur anzeigen</Link>
        <span>|</span>
        <Link to={`/machines/${machine.machineId}/values`}>Werte anzeigen</Link>
      </div>
    </li>
  );
}


*/
