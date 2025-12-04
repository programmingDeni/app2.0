import {
  Template,
  TemplateAttribute,
} from "../../../../shared/types/template.types";
import TemplateAttributeListView from "../../TemplateAttributes/components/TemplateAttributesList";
import { DeleteButton } from "@/shared/components/Buttons/DeleteButton";
import { EditButton } from "@/shared/components/Buttons/EditButton";
import { useNavigate } from "react-router-dom";

import "@/shared/styles/main.css";

interface Props {
  machineTemplate: Template;
  onEdit?: boolean;
  onDelete?: (id: number) => void;
}

export function TemplateCardUi(props: Props) {
  const navigate = useNavigate();
  const { machineTemplate, onEdit, onDelete } = props;

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
