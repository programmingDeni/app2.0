import { QueryClient } from "@tanstack/react-query"
import type { MachineAttribute } from "../../../../shared/types/machine.types"
import { MachineAttributeQuery } from "@/queries/machine/attributes/MachineAttributeQuery";
import { useState } from "react";
import { QueryStateWrapper } from "@/shared/abstracts/QueryStateWrapper";
import { MachineAttributeListUI } from "./MachineAttributeListUI";

interface Props{
    machineId: number;
    allowEdit?: boolean;
}

export function MachineAttributeListView (props: Props){
    const {machineId, allowEdit} = props;

    const queryClient = new QueryClient();
    const machineAttributeQuery = new MachineAttributeQuery(queryClient);
    const findAllMachineAttributesQuery = machineAttributeQuery.useFindAllByParentId(machineId);
    const deleteMachineAttributeQuery = machineAttributeQuery.useDelete(machineId);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

        const handleDelete = (machineAttributeId: number) => {
        const confirm = window.confirm(
        "⚠️⚠️⚠️Bist du sicher, dass du das Machinen Attribut entfernen möchtest?⚠️⚠️⚠️\n" +
            "Das Attribut geht dabei unwiderruflich verloren."
        );
        if (!confirm) return;
        setErrorMsg(null);

        deleteMachineAttributeQuery.mutate(machineAttributeId,{
            onSuccess: () => {
                console.log("Attribute gelöscht:", machineAttributeId);
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
               
                     <QueryStateWrapper {...findAllMachineAttributesQuery} resourceName="Machine Attributes">
                       {(machineAttributes) => <MachineAttributeListUI machineAttributes={machineAttributes} allowEdit={allowEdit} onDelete={handleDelete}/>}
                     </QueryStateWrapper>
                </div>
    )
    
}