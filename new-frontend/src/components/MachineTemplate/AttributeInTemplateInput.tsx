// components/MachineTemplate/AttributeInTemplateInput.tsx
import { AttributeType } from "@/types/attributeType";

interface Props {
  name: string;
  type: AttributeType;
  onChangeName: (val: string) => void;
  onChangeType: (val: AttributeType) => void;
  onDelete: () => void;
}

export default function AttributeInTemplateInput({
  name,
  type,
  onChangeName,
  onChangeType,
  onDelete,
}: Props) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Attributname"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
        className="p-2 border rounded"
      />
      <select
        value={type}
        onChange={(e) => onChangeType(e.target.value as AttributeType)}
      >
        {["STRING", "INTEGER", "BOOLEAN", "FLOAT"].map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button onClick={onDelete}>✕</button>
    </div>
  );
}
