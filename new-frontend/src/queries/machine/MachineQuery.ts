import { Machine } from "@/features/machines/types/machine.types";
import { CrudService } from "../abstract/CrudService";
import { QueryClient } from "@tanstack/react-query";

export class MachineQuery extends CrudService<Machine>{
    constructor(queryClient: QueryClient){
        super('/api/machines', queryClient);
    }
};
