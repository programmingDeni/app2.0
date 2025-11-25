import axios from "@/services/axios";
import { AxiosResponse } from "axios";
//Machinen Typ holen
import {
  MachineLazy,
  CreateMachineByName,
  CreateMachineFromTemplate,
} from "@/shared/types/machine.types";

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
    } as Partial<Machine>;
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
    } as Partial<Machine>;
  } catch (e) {
    throw new Error(
      "Service Function wirft Fehler beim erstellen einer Machine mit Template"
    );
  }
}

export async function getMachineAttributesWithYearlyValues(machineId: number) {
  try {
    // brauche auch die machinen attribute nicht nur die attribute values
    console.log(
      "getMachineAttributesWithYearlyValues for machineId",
      machineId
    );
    const response = await axios.get(
      `/api/machines/${machineId}/attribute-values`
    );
    console.log("response in service", response.data);
    return response.data;
  } catch (e) {
    throw new Error("Service Function wirft Fehler" + e);
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Service (neu)  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//Crud Operationen + assign und remove template

//neuen typ holen aus feature
import {
  Machine,
  MachineAttribute,
} from "@/shared/types/machine.types";

//Create
export async function createMachineService(
  machine: Partial<Machine>
): Promise<Machine> {
  try {
    console.log("sending machine ", machine);
    let response: AxiosResponse<Machine>;

    if (machine.machineTemplate?.id) {
      // Backend erwartet:
      // public String machineName;
      // public Integer machineTemplateId;
      const payload = {
        machineName: machine.machineName,
        machineTemplateId: machine.machineTemplate.id,
      };
      response = await axios.post("/api/machines/from-template", payload);
    } else {
      // Backend erwartet:
      // public Integer id;
      // public String machineName;
      // public List<MachineAttributeDto> attributes;
      // public MachineTemplateDto machineTemplateDto;
      const { machineTemplate, ...rest } = machine;
      const payload = {
        ...rest,
        machineTemplateDto: machineTemplate,
      };
      response = await axios.post("/api/machines", payload);
    }

    console.log("createMachineService response", response.data);
    return response.data as Machine;
  } catch (e) {
    throw e;
  }
}
//Read
//all machines
export async function fetchMachinesService(): Promise<Machine[]> {
  const response = await axios.get("/api/machines?eager=false");
  const machines: Machine[] = response.data.map((dto: any) => {
    const { machineTemplateDto, ...rest } = dto;
    return {
      ...rest,
      machineTemplate: machineTemplateDto,
    };
  });
  console.log("fetchMachinesService", machines);
  return machines;
}
//one machine
export async function fetchMachineByIdService(
  machineId: number
): Promise<Machine> {
  const response = await axios.get(`/api/machines/${machineId}`);
  const { machineTemplateDto, ...rest } = response.data;
  // mapping auf "schöne" frontend datenstruktur
  const machine: Machine = {
    ...rest,
    machineTemplate: machineTemplateDto,
  };
  return machine;
}

//Update
//TODO: Update Machine name

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
  console.log("assignTemplateToMachineService", templateId, machineId);
  try {
    const response = await axios.put(
      `/api/machines/${machineId}/template/${templateId}`
    );
    return response.data;
  } catch (e) {
    throw e;
  }
  /*
      @PutMapping("/{id}/template/{templateId}")
    public ResponseEntity<MachineDto> assignTemplateToMachine(
            @PathVariable("id") Integer machineId,
            @PathVariable Integer templateId) {
        // 1. Validate
        if (machineId == null || machineId <= 0 || templateId == null || templateId <= 0) {
            throw new IllegalArgumentException("Invalid update data");
        }

        return ResponseEntity.ok(MachineMapper.toDto(machineService.assignTemplate(machineId, templateId)));
    }

  */
}

export async function removeTemplateFromMachineService(machineId: number) {
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

export async function editMachineAttributeService(
  machineAttribute: Partial<MachineAttribute>
) {
  try {
    const payload = {
      id: machineAttribute.id,
      attributeName: machineAttribute.attributeName,
      attributeType: machineAttribute.attributeType,
      // attributeValues: machineAttribute.attributeValues,
      machineId: machineAttribute.machineId,
      fromTemplate: machineAttribute.fromTemplate,
      pruefungsIntervall: machineAttribute.pruefungsIntervall,
    };
    console.log("editMachineAttributeService payload", payload);
    const response = await axios.put(
      `/api/machines/${machineAttribute.machineId}/attributes/${machineAttribute.id}`,
      payload
    );
    console.log("editMachineAttributeService response", response.data);
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
    console.log(
      "removeCustomAttributeFromMachineService",
      machineId,
      attributeId
    );
    await axios.delete(`/api/machines/${machineId}/attributes/${attributeId}`);
  } catch (e) {
    throw e;
  }
}
