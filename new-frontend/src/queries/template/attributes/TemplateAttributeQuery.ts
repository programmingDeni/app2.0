import { TemplateAttribute } from "@/shared/types/template.types";
import { NestedCrudService } from "@/queries/abstract/NestedCrudService";
import { QueryClient } from "@tanstack/react-query";

export class TemplateAttributeQuery extends NestedCrudService<TemplateAttribute>{
    constructor(queryClient: QueryClient){
        super(
            (templateId: number) => `/api/machine-templates/${templateId}/attributes`,
            queryClient
        );
    }
}