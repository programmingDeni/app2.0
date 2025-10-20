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
import { useQuery } from "@tanstack/react-query";

// service import 
import { getMachineAttributes } from "../services/machineAttributeService";

//types
import { MachineAttribute } from "../types/machine.types";

export function useMachineAttributeQueries(machineId: number) {
  return useQuery< MachineAttribute[] >({
    queryKey: ["machineAttributes", machineId],
    queryFn: () => getMachineAttributes(machineId),
    enabled: !!machineId,
  });
}

export const useMachineAttributesAndValuesQuery = (machineId: number) => {
  return useQuery<MachineAttribute[]>({
    queryKey: ["machineAttributes", machineId, "withValues"],
    queryFn: () => getMachineAttributes(machineId),
    enabled: !!machineId,
  });
}