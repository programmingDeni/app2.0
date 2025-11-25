import { Template, TemplateAttribute } from "../../../../shared/types/template.types";
import TemplateAttributeListView from "../../TemplateAttributes/components/TemplateAttributesList";
import { DeleteButton } from "@/shared/components/Buttons/DeleteButton";
import { EditButton } from "@/shared/components/Buttons/EditButton";
import style from "./TemplateCard.module.css";
import { useNavigate } from "react-router-dom";

interface Props {
  machineTemplate: Template;
  onDelete?:(id:number) => void;
}

export default function TemplateCardUI(props: Props) {
    const navigate = useNavigate();
  const {
    machineTemplate,
    onDelete
  } = props;

  return (
    <div className={style.templateCard}>
      <div className={style.header}>
        <div className={''}>
          Template Name: {machineTemplate.templateName}
        </div>
        <div className={style.headerButtons}>
            <EditButton onClick={() => navigate(`/machine-templates/${machineTemplate.id}`)}/>
            { onDelete && (
                <DeleteButton onDelete={onDelete} id={machineTemplate.id!}/>
            )}

        </div>
      </div>
            <TemplateAttributeListView
                templateId={machineTemplate.id!}
                allowEdit={false}
            />
    </div>
  );
}
