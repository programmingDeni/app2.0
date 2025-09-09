import Button from "@/components/Button";
import { MachineAttribute } from "@/features/machines/types/machine.types";
import { AttributeType } from "@/types/attributeType";
import { useState } from "react";

interface Props {
  attribute: MachineAttribute;
  editable?: boolean;
  onChange?: (name: string, type: AttributeType) => void;
  onSave?: (updated: MachineAttribute) => void;
  onCancel?: () => void;
  onEditClick?: () => void;
  onDelete?: () => void;
}

export default function MachineAttributeCard(props: Props) {
  const {
    attribute,
    editable = false,
    onChange,
    onSave,
    onCancel,
    onEditClick,
    onDelete,
  } = props;

  const [localName, setLocalName] = useState(attribute.attributeName);
  const [localType, setLocalType] = useState<AttributeType>(
    attribute.attributeType as AttributeType
  );

  if (!editable) {
    return (
      <tr>
        <td style={{ textAlign: "left", width: 180 }}>
          <strong>Name:</strong> {attribute.attributeName}
        </td>
        <td style={{ textAlign: "left", width: 120 }}>
          <strong>Typ:</strong> {attribute.attributeType}
        </td>
        <td>
          {onEditClick && <Button onClick={onEditClick}>Bearbeiten</Button>}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td style={{ textAlign: "left", width: 180 }}>
        <input
          style={{ width: "100%" }}
          value={localName}
          onChange={(e) => {
            setLocalName(e.target.value);
            onChange?.(e.target.value, localType);
          }}
        />
      </td>
      <td style={{ textAlign: "left", width: 120 }}>
        <select
          style={{ width: "100%" }}
          value={localType}
          onChange={(e) => {
            const newType = e.target.value as AttributeType;
            setLocalType(newType);
            onChange?.(localName, newType);
          }}
        >
          {(["STRING", "INTEGER", "FLOAT", "BOOLEAN"] as AttributeType[]).map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            )
          )}
        </select>
      </td>
      <td>
        {onDelete && <Button onClick={onDelete}>Delete</Button>}
        {onSave && (
          <Button
            onClick={() =>
              onSave({
                ...attribute,
                attributeName: localName,
                attributeType: localType,
              })
            }
          >
            Save
          </Button>
        )}
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
      </td>
    </tr>
  );
}

/*
import { MachineAttributeDto } from "@/types/machineAttribute";

interface Props {
  attribute: MachineAttributeDto;
}

export default function MachineAttributeCard({ attribute }: Props) {
  return (
    <div className="border rounded p-2 mb-2 shadow-sm">
      <strong>{attribute.attributeName}</strong>{" "}
      <em>({attribute.attributeType})</em>
    </div>
  );
}
*/
