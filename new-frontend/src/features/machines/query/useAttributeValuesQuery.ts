//jquery klasse um attributeValues zu verwalten
import { useQuery } from "@tanstack/react-query";

// service import 
// TODO:service implementieren import { getAttributeValues } from "../services/attributeValueService";

// query hook
export const useAttributeValuesQuery = (machineId: string) => {
  // return useQuery(["attributeValues", machineId], () => getAttributeValues(machineId));
};
