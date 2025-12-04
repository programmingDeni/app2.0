import { Template } from "../../../../shared/types/template.types";

import { TemplateCardUi } from "../../components-ui/TemplateCard";

import "@/shared/styles/main.css";


interface Props{
    templates: Template[],
    onDelete?: (templateId: number) => void;
    onNavigateEdit?: () => void;
}

export default function TemplateListComponentUI (props: Props){
    const {templates, onDelete} = props;
    
    return (
        <>
            <h2 className="sticky-top">Template List Component ({templates.length})</h2>
            <div className="flex-scroll">
                {templates.map((template) => (
                    <div className="stack stack--lg" key = {template.id}>
                            <TemplateCardUi 
                                key={template.id}
                                machineTemplate={template} 
                                onEdit={true}
                                onDelete={onDelete}
                            />
                    </div>
                ))}
            </div>
        </>
    )
} 

//TODO: die scrollbar ist jetzt im list component,
//immer nur die ersten 2 attribute pro template anzeigen 
