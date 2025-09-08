//style import von der anderne
import styles from "../../../machines/components-ui/MachineLazyCard/MachineLazyCard.module.css";
import { useState } from "react";

// Types aus dem neuen Frontend
import { Template, TemplateAttribute } from "../../types/template.types";

//Button Import
import Button from "@/components/Button";
import TemplateAttributeRow from "../TemplateAttributeRow";

interface Props {
  machineTemplate: Template;
  onRemoveAttribute: (attributeId: number) => void | Promise<void>;
  allowEdit?: boolean;
  onEditTemplate?: (template: Partial<Template>) => void | Promise<void>;
  handleTemplateAttributeChange?: (
    templateAttribute: TemplateAttribute
  ) => void;
}

export default function TemplateCardUI(props: Props) {
  const {
    machineTemplate,
    onRemoveAttribute,
    allowEdit,
    onEditTemplate,
    handleTemplateAttributeChange,
  } = props;
  const attributeTemplates = machineTemplate.templateAttributes ?? [];

  // Edit-Modus State
  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState(
    machineTemplate.templateName
  );

  //Edit Modus State Attribute
  const [editingAttrId, setEditingAttrId] = useState<number | null>(null);

  const handleSave = () => {
    if (onEditTemplate) {
      onEditTemplate({ id: machineTemplate.id, templateName });
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div className={styles.name}>
        <h3>Template Name: {machineTemplate.templateName}</h3>
        {allowEdit && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            style={{ marginLeft: "0.5rem" }}
          >
            Template Name Bearbeiten
          </Button>
        )}
        {allowEdit && isEditing && (
          <div>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              style={{ marginBottom: "0.5rem" }}
            />
            <Button onClick={handleSave}>Speichern</Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setTemplateName(machineTemplate.templateName);
              }}
              style={{ marginLeft: "0.5rem" }}
            >
              Abbrechen
            </Button>
          </div>
        )}
      </div>
      <h3>Attribute Templates:</h3>
      {attributeTemplates.length === 0 ? (
        <div>Keine Attribute vorhanden</div>
      ) : (
        <table>
          <tbody>
            {attributeTemplates.map((attr) => (
              <TemplateAttributeRow
                key={attr.id!}
                templateAttribute={attr}
                editable={editingAttrId === attr.id}
                onChange={(name, type) => {
                  /* optional live update */
                }}
                onSave={(updatedAttr) => {
                  if (handleTemplateAttributeChange) {
                    handleTemplateAttributeChange(updatedAttr);
                    setEditingAttrId(null);
                  }
                }}
                onCancel={() => setEditingAttrId(null)}
                onEditClick={() => setEditingAttrId(attr.id!)}
                onDelete={() => onRemoveAttribute(attr.id!)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
