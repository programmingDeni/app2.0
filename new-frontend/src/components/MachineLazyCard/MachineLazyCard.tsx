import styles from "./MachineLazyCard.module.css";
import { MachineLazy } from "@/types/machine";
import { Link } from "react-router-dom";

interface Props {
  machine: MachineLazy;
}

export default function MachineLazyCard({ machine }: Props) {
  return (
    <li className={styles.card}>
      <div className={styles.name}>{machine.name}</div>
      <div>Template: {machine.templateName ?? "Kein Template"}</div>
      <div className={styles.links}>
        <Link to={`/machines/${machine.id}`}>Struktur anzeigen</Link> |{" "}
        <Link to={`/machines/${machine.id}/values`}>Werte anzeigen</Link>
      </div>
    </li>
  );
}
