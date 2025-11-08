// jquery klasse um machinen attribute zu verwalten
/* documentation
 ** 1. useMachineAttributeQueries: lazy loading der maschinen attribute
 ** parameter: machineId: number
 ** return: MachineAttribute[]
 *
 * useMachineAttributesAndValuesQuery: kombiniert maschinen attribute und deren werte
 ** parameter: machineId: number
 ** return: { attributes: MachineAttribute[], values: AttributeValue[] }
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// service import
import {
  getMachineAttributesEager,
  getMachineAttributesLazy,
  addMachineAttributeService,
} from "../services/machineAttributeService";

//types
import { MachineAttribute } from "../types/machine.types";

export function useMachineAttributeQueries(machineId: number) {
  return useQuery<MachineAttribute[]>({
    queryKey: ["machineAttributes", machineId],
    queryFn: () => getMachineAttributesLazy(machineId),
    enabled: !!machineId,
  });
}

export const useMachineAttributesAndValuesQuery = (machineId: number) => {
  return useQuery<MachineAttribute[]>({
    queryKey: ["machineAttributes", machineId, "withValues"],
    queryFn: () => getMachineAttributesEager(machineId),
    enabled: !!machineId,
  });
};

//ist aktuell in useMachineQueries implementiert für custom attribute hier aber besserer ort eigentlich
/* 
export const useAddMachineAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation<MachineAttribute, unknown, Partial<MachineAttribute>>({
    mutationFn: (attribute: Partial<MachineAttribute>) =>
      addMachineAttributeService(attribute),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["machineAttributes"],
      });
    },
  });
};
*/
