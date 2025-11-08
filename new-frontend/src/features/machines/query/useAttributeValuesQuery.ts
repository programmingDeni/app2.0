//jquery klasse um attributeValues zu verwalten
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttributeValue } from "../types/machine.types";

// service import
// TODO:service implementieren
import { addAttributeValue } from "../services/attributeValueService";

// query hook
export const useAttributeValuesQuery = (machineId: string) => {
  // return useQuery(["attributeValues", machineId], () => getAttributeValues(machineId));
  //TODO: getAttributeValuesByMachineId
};

export const useAddAttributeValue = () => {
  const queryClient = useQueryClient();
  return useMutation<AttributeValue, unknown, Partial<AttributeValue>>({
    mutationFn: (attributeValue: Partial<AttributeValue>) =>
      addAttributeValue(attributeValue),
    onSuccess: (data: Partial<AttributeValue>) => {
      queryClient.invalidateQueries({
        queryKey: ["attributeValues", data.machineAttributeId],
      });
    },
  });
};
