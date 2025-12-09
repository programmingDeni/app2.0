import {
  Template,
  TemplateAttribute,
} from "../../../../shared/types/template.types";
import TemplateAttributeListView from "../../TemplateAttributes/components/TemplateAttributesList";
import { DeleteButton } from "@/shared/components/Buttons/DeleteButton";
import { EditButton } from "@/shared/components/Buttons/EditButton";
import { useNavigate } from "react-router-dom";

import "@/shared/styles/main.css";
import Button from "@/shared/components/Buttons/GenericButton";
import { CopyIcon } from "@/shared/components/Icons/CopyButton";

interface Props {
  machineTemplate: Template;
  onEdit?: boolean;
  onDelete?: (id: number) => void;
  onDuplicate?: (id: number) => void;
}

export function TemplateCardUi(props: Props) {
  const navigate = useNavigate();
  const { machineTemplate, onEdit, onDelete, onDuplicate } = props;

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title">
          Template Name: {machineTemplate.templateName}
        </div>
        <div className="card__actions">
          {onEdit && (
            <EditButton
              onClick={() =>
                navigate(`/machine-templates/${machineTemplate.id}`)
              }
            />
          )}
          {onDuplicate && (
            <Button onClick={() => onDuplicate(machineTemplate.id!)}>
              <CopyIcon />
            </Button>
          )}
          {onDelete && (
            <DeleteButton onDelete={onDelete} id={machineTemplate.id!} />
          )}
        </div>
      </div>
      <div className="card__body">
        <TemplateAttributeListView
          templateId={machineTemplate.id!}
          allowEdit={false}
        />
      </div>
    </div>
  );
}
