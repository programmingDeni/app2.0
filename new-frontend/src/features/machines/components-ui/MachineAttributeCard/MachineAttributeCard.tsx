import Button from "@/shared/components/Buttons/GenericButton";
import { MachineAttribute } from "@/shared/types/machine.types";
import { AttributeType } from "@/shared/types/machine.types";
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
    editable,
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
      <div className="card">
        <div className="card__title">
          <strong>Name:</strong> {attribute.attributeName}
        </div>
        <div className="card__item">
          <strong>Typ:</strong> {attribute.attributeType}
        </div>
        <div className="card__actions">
          {onEditClick && <Button onClick={onEditClick}>Bearbeiten</Button>}
        </div>
      </div>
    );
  }

  return (
    <tr>
      <td style={{ textAlign: "left", width: 220 }}>
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
