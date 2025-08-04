import { MachineTemplateDto } from "@/types/machineTemplate";
import TemplateSelect from "../../components/TemplateSelect/TemplateSelect";

interface Props {
  name: string;
  onNameChange: (val: string) => void;
  selectedTemplateId: number | null;
  onTemplateChange: (id: number | null) => void;
  onSubmit: () => void;
  templates: MachineTemplateDto[];
  loading: boolean;
  error: Error | null;
}

export default function AddMachineFormUI({
  name,
  onNameChange,
  selectedTemplateId,
  onTemplateChange,
  onSubmit,
  templates,
  loading,
  error,
}: Props) {
  if (loading) return <p>lade Templates...</p>;
  if (error) return <p>Fehler beim Laden</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Maschinenname"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <TemplateSelect
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onChange={onTemplateChange}
      />
      <button onClick={onSubmit} disabled={!name.trim()}>
        Speichern
      </button>
    </div>
  );
}
