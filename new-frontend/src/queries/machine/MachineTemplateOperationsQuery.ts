import axios from "@/services/axios";
import {
  CreateMachineFromTemplate,
  Machine,
} from "@/shared/types/machine.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

class MachineTemplateOperationsQuery {
  //TODO: assign, remove, und createFormTemplate
  useCreateFromTemplate() {
    const queryClient = useQueryClient();
    return useMutation<Machine, unknown, CreateMachineFromTemplate>({
      mutationFn: (data) => {
        console.log("inside query data:", data);
        const result = axios
          .post("/api/machines/from-template", data)
          .then((r) => {
            console.log("result", r.data); // ← INNERHALB von .then()
            return r.data;
          });
        return result; //.then(r => r.data),
      },
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ["/api/machines"],
          exact: false,
        }),
    });
  }

  //assign template
  useAssignTemplate(machineId: number) {
    const queryClient = useQueryClient();
    //TODO: useMutation typisieren
    return useMutation({
      mutationFn: (templateId: number) => {
        const response = axios
          .put(`/api/machines/${machineId}/template/${templateId}`)
          .then((r) => r.data);
        return response;
      },
      onSuccess: (data) => {
        console.log("Erforl", data);
        queryClient.invalidateQueries({
          queryKey: ["/api/machines", machineId],
        });
      },
    });
  }

  //remove tempalte
  useRemoveTemplate(machineId: number) {
    const queryClient = useQueryClient();
    return useMutation<void, unknown, number>({
      mutationFn: () =>
        axios.delete(`/api/machines/${machineId}/template`).then((r) => r.data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/api/machines", machineId],
        });
      },
    });
  }
}

export { MachineTemplateOperationsQuery };
