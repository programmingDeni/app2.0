import axios from "@/services/axios";
//Machinen Typ holen
import {
  MachineLazy,
  CreateMachineByName,
  CreateMachineFromTemplate,
  MachineStructureDto,
  MachineListElement,
} from "@/types/machine";

export function fetchMachinesLazy() {
  return axios.get<MachineLazy[]>("/api/machines/lazy");
}

export async function createMachineByName(payload: CreateMachineByName) {
  console.log("addMachine", payload);
  try {
    const response = await axios.post(`/api/machines`, payload);
    const responseData = response.data;
    console.log("responseData", responseData);
    return {
      machineId: responseData.id,
      machineName: responseData.machineName,
      templateName: responseData.machineTemplateDto,
    } as MachineLazy;
  } catch (e) {
    throw new Error(
      "Service Function wirft Fehler beim erstellen einer Machine ohne Template"
    );
  }
}

export async function addMachineFromTemplate(
  createMachineFromTemplateDto: CreateMachineFromTemplate
) {
  console.log(
    "Trying to add machine in SERVICE with TEMPLATE:",
    createMachineFromTemplateDto
  );
  try {
    const response = await axios.post(
      `/api/machines/from-template`,
      createMachineFromTemplateDto
    );
    const responseData = response.data;
    console.log("responseData", responseData);
    return {
      machineId: responseData.id,
      machineName: responseData.machineName,
      machineTempalteName: responseData.machineTemplateDto.templateName,
    } as MachineListElement;
  } catch (e) {
    throw new Error(
      "Service Function wirft Fehler beim erstellen einer Machine mit Template"
    );
  }
}

export async function getMachineAttributesWithYearlyValues(machineId: number) {
  try {
    const response = await axios.get(`/api/machines/${machineId}`);
    return response.data;
  } catch (e) {
    throw new Error("Service Function wirft Fehler");
  }
}

export async function addMachineAttributeValue(
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

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Service (neu)  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//Crud Operationen + assign und remove template

//neuen typ holen aus feature
import { Machine } from "@/features/machines/types/machine.types";

//Create
export async function createMachineService(machine: Partial<Machine>) {
  try {
    const response = await axios.post("/api/machines", machine);
    return response.data as Machine;
  } catch (e) {
    throw e;
  }
}
//Read
export async function fetchMachinesService() {
  const response = await axios.get("/api/machines");
  const machines: Machine[] = response.data.map((dto: any) => ({
    ...dto,
    machineTemplate: dto.machineTemplateDto,
  }));
  return machines;
}
//Update
//TODO: Update Machine

//Delete
export function removeMachineService(machineId: number) {
  return axios.delete(`/api/machines/${machineId}`);
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Service (neu)  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
