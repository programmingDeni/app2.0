// TemplateAttributeRow
//soll ein template attribut row anzeigen und je nach props bearbeiten können

//types
import Button from "@/shared/components/Buttons/GenericButton";
import { TemplateAttribute } from "../../../../../shared/types/template.types";
import { AttributeType } from "@/shared/types/machine.types";
import { useState } from "react";

interface Props {
  templateAttribute: TemplateAttribute;
  allowEdit?: boolean;
  onSave?: (updated: TemplateAttribute) => void;
  onDelete?: (attributeId: number) => void;
}

export default function TemplateAttributeRowUI(props: Props) {
  const {
    templateAttribute,
    allowEdit,
    onSave,
    onDelete,
  } = props;
  const [localName, setLocalName] = useState(
    templateAttribute.templateAttributeName
  );
  const [localType, setLocalType] = useState<AttributeType>(
    templateAttribute.templateAttributeType as AttributeType
  );

  if(!templateAttribute.id && allowEdit){
    return (<>Fehler: Attribut ohne ID </>)
  }

  if (!allowEdit) {
    return (
      <tr>
        <td style={{ textAlign: "left", width: "60%" }}>
          <strong>Name:</strong> {templateAttribute.templateAttributeName}
        </td>
        <td style={{ textAlign: "left", width: 120 }}>
          <strong>Typ:</strong> {templateAttribute.templateAttributeType}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td style={{ textAlign: "left", width: "60%" }}>
        <input
          style={{ width: "100%" }}
          value={localName}
          onChange={(e) => {
            setLocalName(e.target.value);
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
        {onDelete && <Button onClick={() => onDelete(templateAttribute.id!)}>Delete</Button>}
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
      </td>
    </tr>
  );
}
