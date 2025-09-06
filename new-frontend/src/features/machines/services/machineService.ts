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
import {
  Machine,
  MachineAttribute,
} from "@/features/machines/types/machine.types";

//Create
export async function createMachineService(
  machine: Partial<Machine>
): Promise<Machine> {
  try {
    const response = await axios.post("/api/machines", machine);
    return response.data as Machine;
  } catch (e) {
    throw e;
  }
}
//Read
//all machines
export async function fetchMachinesService(): Promise<Machine[]> {
  const response = await axios.get("/api/machines");
  const machines: Machine[] = response.data.map((dto: any) => ({
    ...dto,
    machineTemplate: dto.machineTemplateDto,
  }));
  return machines;
}
//one machine
export async function fetchMachineByIdService(
  machineId: number
): Promise<Machine> {
  const response = await axios.get(`/api/machines/${machineId}`);
  const dto = response.data;
  // mapping auf "schöne" frontend datenstruktur
  const machine: Machine = {
    ...dto,
    machineTemplate: dto.machineTemplateDto,
  };
  return machine;
}

//Update
//TODO: Update Machine

//Delete
export async function removeMachineService(machineId: number) {
  try {
    const response = await axios.delete(`/api/machines/${machineId}`);
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function assignTemplateToMachineService(
  machineId: number,
  templateId: number
): Promise<Machine> {
  //TODO: ist implementiert?
  try {
    const response = await axios.post(`/api/machines/${machineId}/template`, {
      templateId,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function removeTemplateFromMachineService(machineId: number) {
  //TODO ist implementiert?
  try {
    await axios.delete(`/api/machines/${machineId}/template`);
  } catch (e) {
    throw e;
  }
  //return axios.delete(`/api/machines/${machineId}/template`);
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Attributes  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export async function createMachineAttributeService(
  machineId: number,
  attributeName: string,
  attributeType: string
): Promise<MachineAttribute> {
  try {
    const response = await axios.post(`/api/machines/${machineId}/attributes`, {
      attributeName,
      attributeType,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function removeCustomAttributeFromMachineService(
  machineId: number,
  attributeId: number
) {
  try {
    const response = await axios.delete(
      `/api/machines/${machineId}/attributes/${attributeId}`
    );
    return response.data;
  } catch (e) {
    throw e;
  }
}
