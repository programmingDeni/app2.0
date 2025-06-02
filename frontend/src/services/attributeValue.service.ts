// services/attributeValueService.ts
import axios from "./axios";
import { AttributeValue } from "@/types/AttributeValue";

export const getAllAttributeValues = async () => {
  const res = await axios.get<AttributeValue[]>("/api/attribute-values");
  return res;
};

export const getAttributeValueById = async (id: number) => {
  const res = await axios.get<AttributeValue>(`/api/attribute-values/${id}`);
  return res;
};

export const getAttributeValuesByMachineAttributeId = async (
  attributeId: number
) => {
  const res = await axios.get<AttributeValue[]>(
    `/api/attribute-values/by-attribute/${attributeId}`
  );
  return res;
};

export const getAttributeValuesByYear = async (year: number) => {
  const res = await axios.get<AttributeValue[]>(
    `/api/attribute-values/by-year/${year}`
  );
  return res;
};

export const createAttributeValue = async (value: Partial<AttributeValue>) => {
  const res = await axios.post("/api/attribute-values", value);
  return res;
};

export const updateAttributeValue = async (
  id: number,
  value: Partial<AttributeValue>
) => {
  const res = await axios.put(`/api/attribute-values/${id}`, value);
  return res;
};

export const deleteAttributeValue = async (id: number) => {
  const res = await axios.delete(`/api/attribute-values/${id}`);
  return res;
};
