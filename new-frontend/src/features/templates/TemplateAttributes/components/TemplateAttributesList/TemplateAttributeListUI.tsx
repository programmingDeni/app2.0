import { TemplateAttribute } from "@/shared/types/template.types";
import TemplateAttributeCard from "../TemplateAttributeCard";
import messageStyles from "@/shared/styles/messages/messages.module.css";

interface Props{
    templateAttributes: TemplateAttribute[],
    allowEdit?: boolean;
    onDelete?: (templateAttributeId: number) => void;
    onSave?: (updated: TemplateAttribute) => void;
}
export default function TemplateAttributeListUI(props: Props){
    const {templateAttributes, allowEdit = false, onSave, onDelete} = props;

    console.log("TemplateAttributeListUI templateAttributes:", templateAttributes)
    return (
        <div>
            {templateAttributes.length === 0 ? (
                <p className={messageStyles.emptyState}>
                    Bisher keine Attribute zugewiesen
                </p>
            ) : (
                templateAttributes.map((templateAttribute) => (
                    <div key = {templateAttribute.id}>
                        <TemplateAttributeCard templateAttribute={templateAttribute}
                            allowEdit={allowEdit}
                            onSave={onSave}
                            onDelete={onDelete}
                            />

                    </div>
                ))
            )}
        </div>
    )

}