import { Template } from "@/features/templates/types/template.types";
import { CrudService } from "../abstract/CrudService";
import { QueryClient } from "@tanstack/react-query";

export class TemplateQuery extends CrudService<Template>{
    constructor(queryClient: QueryClient){
        super('/api/machine-templates', queryClient);
    }
}