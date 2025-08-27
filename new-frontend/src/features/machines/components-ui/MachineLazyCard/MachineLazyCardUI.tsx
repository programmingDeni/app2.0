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
