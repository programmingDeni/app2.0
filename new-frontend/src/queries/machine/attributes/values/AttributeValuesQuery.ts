import { AttributeValue } from "@/shared/types/machine.types";
import { NestedCrudService } from "@/queries/abstract/NestedCrudService";
import { QueryClient } from "@tanstack/react-query";

export class AttributeValueQuery extends NestedCrudService<AttributeValue>{
    constructor(machineId: number, queryClient: QueryClient){
        super(
            (attributeId: number) => `/api/machines/${machineId}/attributes/${attributeId}/values`,
            queryClient
        );
    }
}