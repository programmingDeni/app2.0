import { CreateMachineByName, CreateMachineFromTemplate, Machine } from "@/shared/types/machine.types";
import { CrudService } from "../abstract/CrudService";
import { QueryClient } from "@tanstack/react-query";

export class MachineQuery extends CrudService<Machine,CreateMachineByName|CreateMachineFromTemplate>{
    constructor(queryClient: QueryClient){
        super('/api/machines', queryClient);
    }
};
