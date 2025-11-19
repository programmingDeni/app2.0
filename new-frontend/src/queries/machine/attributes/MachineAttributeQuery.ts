import { MachineAttribute } from "@/features/machines/types/machine.types";
import { NestedCrudService } from "@/queries/abstract/NestedCrudService";
import { QueryClient } from "@tanstack/react-query";

export class MachineAttributeQuery extends NestedCrudService<MachineAttribute>{
    constructor(queryClient:QueryClient){
        super(
            (machineId: number) => `/api/machines/${machineId}/attributes`, 
            queryClient
        );
    }
} 