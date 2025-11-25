import TemplateCardUI from "../../components-ui/TemplateCard";
import { Template } from "../../../../shared/types/template.types";

import style from "./TemplateListComponent.module.css";
import NewTemplateCardUi from "../../components-ui/TemplateCard/NewTemplateCardUi";


interface Props{
    templates: Template[],
    onDelete?: (templateId: number) => void;
    onNavigateEdit?: () => void;
}

export default function TemplateListComponentUI (props: Props){
    const {templates, onDelete} = props;
    
    return (
        <div className={style.container}>
            <h2 className={style.header}>Template List Component ({templates.length})</h2>
            <div className={style.listContent}>
                {templates.map((template) => (
                    <div key = {template.id}>
                            <NewTemplateCardUi 
                                key={template.id}
                                machineTemplate={template} 
                                onDelete={onDelete}
                            />
                    </div>
                ))}
            </div>
        </div>
    )
} 