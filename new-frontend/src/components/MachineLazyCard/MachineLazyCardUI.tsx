import styles from "./MachineLazyCard.module.css";
import { MachineLazy } from "@/types/machine";
import { Link } from "react-router-dom";

interface Props {
  machine: MachineLazy;
  onRemove: () => void;
}

export default function MachineLazyCardUI({ machine, onRemove }: Props) {
  return (
    <li className={styles.card}>
      <div className={styles.name}>{machine.name}</div>
      <div>Template: {machine.templateName ?? "Kein Template"}</div>
      <div className={styles.links}>
        <Link to={`/machines/${machine.id}`}>Struktur anzeigen</Link> |{" "}
        <Link to={`/machines/${machine.id}/values`}>Werte anzeigen</Link>
        <button onClick={onRemove}>Entfernen</button>
      </div>
    </li>
  );
}
