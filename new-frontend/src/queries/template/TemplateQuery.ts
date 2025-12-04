import { Template, CreateMachineTemplateWithAttributesDto } from "@/shared/types/template.types";
import { CrudService } from "../abstract/CrudService";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "@/services/axios";

export class TemplateQuery extends CrudService<Template, Template | CreateMachineTemplateWithAttributesDto>{
    constructor(queryClient: QueryClient){
        super('/api/machine-templates', queryClient);
    }

    useCreateTemplateWithAttributes(){
        return useMutation<TemplateQuery, Error, CreateMachineTemplateWithAttributesDto>({
            mutationFn: (data) => axios.post(`${this.baseUrl}/with-attribtues`, data).then(r => r.data),
            onSuccess: () => this.queryClient.invalidateQueries({ queryKey: [this.baseUrl] })
        });
    }
}