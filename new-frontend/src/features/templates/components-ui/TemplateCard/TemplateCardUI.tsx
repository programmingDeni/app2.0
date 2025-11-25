//style import von der anderne
import { useState } from "react";

// Types aus dem neuen Frontend
import { Template, TemplateAttribute } from "../../../../shared/types/template.types";

//Button Import
import Button from "@/shared/components/Buttons/GenericButton";
import TemplateAttributeListView from "../../TemplateAttributes/components/TemplateAttributesList";
import { DeleteButton } from "@/shared/components/Buttons/DeleteButton";
import { EditButton } from "@/shared/components/Buttons/EditButton";

interface Props {
  machineTemplate: Template;
  allowEdit?: boolean;
  onEditTemplate?: (template: Partial<Template>) => void | Promise<void>;
  onDelete?:(id:number) => void;
  
}

export default function TemplateCardUI(props: Props) {
  const {
    machineTemplate,
    allowEdit,
    onEditTemplate,
    onDelete
  } = props;

  // Edit-Modus State
  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState(
    machineTemplate.templateName
  );

  const handleSave = () => {
    if (onEditTemplate) {
      onEditTemplate({ id: machineTemplate.id, templateName });
    }
    setIsEditing(false);
  };


  return (
    <div>
      <div className={style.header}>
        <div className={style.headerName}>
          Template Name: {machineTemplate.templateName}
        </div>
        <div className={styled.headerButtons}>
            <EditButton onClick={() => `/machine-templates/${template.id}`}/>
            <DeleteButton onDelete={onDelete} id={machineTemplate.id}/>

        </div>
      </div>
      <div>
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
              <TemplateAttributeListView
                templateId={machineTemplate.id!}
                allowEdit={allowEdit}
              />
    </div>
  );
}
