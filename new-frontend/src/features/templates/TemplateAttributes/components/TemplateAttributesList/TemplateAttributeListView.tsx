import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {QueryStateWrapper} from "@/shared/abstracts/QueryStateWrapper";
import { TemplateAttributeQuery } from "@/queries/template/attributes/TemplateAttributeQuery";
import TemplateAttributeListUI from "./TemplateAttributeListUI"

interface Props{
    templateId: number,
    allowEdit?: boolean,
}

export default function TemplateAttributeListView(props: Props){
    //muss die tempalte id uebergeben bekommen
    const {templateId, allowEdit = false} = props;

    //queries
    const queryClient = useQueryClient();
    const templateAttributeQuery = new TemplateAttributeQuery(queryClient);
    const findAllTemplateAttributesQuery = templateAttributeQuery.useFindAllByParentId(templateId);
    const deleteTemplateAttributeQuery = templateAttributeQuery.useDelete(templateId);

    // error state
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleDelete = (templateAttributeId: number) => {
        const confirm = window.confirm(
        "⚠️⚠️⚠️Bist du sicher, dass du das Template Attribut entfernen möchtest?⚠️⚠️⚠️\n" +
            "Das Attribut geht dabei unwiderruflich verloren."
        );
        if (!confirm) return;
        setErrorMsg(null);

        deleteTemplateAttributeQuery.mutate(templateAttributeId,{
            onSuccess: () => {
                console.log("Attribute gelöscht:", templateAttributeId);
            },
            onError: (error: any) => {
                if (error?.response?.data?.message) {
                setErrorMsg(error.response.data.message);
                } else {
                setErrorMsg("Fehler beim Entfernen des Templates. Bitte versuche es erneut.");
                }
            }
        })
    }




    return (
       <div>
             {errorMsg && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                   {errorMsg}
                 </div>
             )}
       
             <QueryStateWrapper {...findAllTemplateAttributesQuery} resourceName="Template Attributes">
               {(templateAttributes) => <TemplateAttributeListUI templateAttributes={templateAttributes} allowEdit={allowEdit} onDelete={handleDelete}/>}
             </QueryStateWrapper>
        </div>
    )
}