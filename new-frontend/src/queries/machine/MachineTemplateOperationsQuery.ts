import axios from "@/services/axios";
import { CreateMachineFromTemplate, Machine } from "@/shared/types/machine.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

class MachineTemplateOperationsQuery {
    //TODO: assign, remove, und createFormTemplate
    useCreateFromTemplate(){
        const queryClient = useQueryClient();
        return useMutation<Machine, unknown, CreateMachineFromTemplate>({
            mutationFn: (data) => {
                console.log("inside query data:", data);
                const result = axios.post("/api/machines/from-template",data).then(r=>r.data);
                console.log("result", result);
                return result //.then(r => r.data),
            },
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["machines"] }),
        });
    }
} 

export {MachineTemplateOperationsQuery};