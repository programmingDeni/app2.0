import axios from "@/services/axios";
import { AxiosResponse } from "axios";

import { AttributeValue } from "../../../shared/types/machine.types";

export async function addAttributeValue(
  attributeValue: Partial<AttributeValue>
) {
  try {
    console.log("addMachineAttributeValue");
    const response = await axios.post(`/api/attribute-values`, {
      machineId: attributeValue.machineId,
      attributeId: attributeValue.machineAttributeId,
      attributeValue: attributeValue.attributeValue,
      attributeValueYear: attributeValue.attributeValueYear,
    });
    return response.data;
  } catch (e) {
    throw new Error("Service Function wirft Fehler");
  }
}

/**
 * export async function addMachineAttributeValue(
   machineId: number,
   attributeId: number,
   attributeValue: string,
   year: number
 ) {
   try {
     console.log("addMachineAttributeValue");
     const response = await axios.post(`/api/attribute-values`, {
       machineId,
       attributeId,
       attributeValue,
       attributeValueYear: year,
     });
     return response.data;
   } catch (e) {
     throw new Error("Service Function wirft Fehler");
   }
 }
 */
