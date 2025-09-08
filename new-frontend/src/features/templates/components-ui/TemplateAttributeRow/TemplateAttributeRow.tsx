// TemplateAttributeRow
//soll ein template attribut row anzeigen und je nach props bearbeiten können

//types
import Button from "@/components/Button";
import { TemplateAttribute } from "../../types/template.types";
import { AttributeType } from "@/types/attributeType";
import { useState } from "react";

interface Props {
  templateAttribute: TemplateAttribute;
  editable?: boolean;
  onChange?: (name: string, type: AttributeType) => void;
  onSave?: (updated: TemplateAttribute) => void;
  onCancel?: () => void;
  onEditClick?: () => void;
  onDelete?: () => void;
}

export default function TemplateAttributeRow(props: Props) {
  const {
    templateAttribute,
    editable = false,
    onChange,
    onSave,
    onCancel,
    onEditClick,
    onDelete,
  } = props;
  const [localName, setLocalName] = useState(
    templateAttribute.templateAttributeName
  );
  const [localType, setLocalType] = useState<AttributeType>(
    templateAttribute.templateAttributeType as AttributeType
  );

  if (!editable) {
    return (
      <tr>
        <td style={{ textAlign: "left", width: 180 }}>
          <strong>Name:</strong> {templateAttribute.templateAttributeName}
        </td>
        <td style={{ textAlign: "left", width: 120 }}>
          <strong>Typ:</strong> {templateAttribute.templateAttributeType}
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
                ...templateAttribute,
                templateAttributeName: localName,
                templateAttributeType: localType,
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
