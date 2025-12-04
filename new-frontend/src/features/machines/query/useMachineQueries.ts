// useMachineQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//Service
import {
  fetchMachinesService,
  fetchMachineByIdService,
  createMachineService,
  removeMachineService,
  createMachineAttributeService,
  removeCustomAttributeFromMachineService,
  assignTemplateToMachineService,
  removeTemplateFromMachineService,
  editMachineAttributeService,
} from "../services/machineService";
//Types
import {
  Machine,
  MachineAttribute,
} from "@/shared/types/machine.types";

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machines  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//CRUDE Operationen
// Assign Template & Remove Tempalte
// Einzelne Maschine holen
export function useMachine(machineId: number) {
  return useQuery<Machine>({
    queryKey: ["machine", machineId],
    queryFn: () => fetchMachineByIdService(machineId),
    enabled: !!machineId,
  });
}

// Alle Maschinen holen
export function useMachines() {
  return useQuery<Machine[]>({
    queryKey: ["machines"],
    queryFn: fetchMachinesService,
  });
}

// Maschine anlegen
export function useAddMachine() {
  const queryClient = useQueryClient();
  return useMutation<Machine, unknown, Partial<Machine>>({
    mutationFn: createMachineService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}

// Maschine löschen
export function useRemoveMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMachineService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}

//assign template
export function useAssignTemplate(machineId: number) {
  const queryClient = useQueryClient();
  //TODO: useMutation typisieren
  return useMutation({
    mutationFn: (templateId: number) =>
      assignTemplateToMachineService(machineId, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machine", machineId] });
    },
  });
}
//remove tempalte
export function useRemoveTemplate(machineId: number) {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: () => removeTemplateFromMachineService(machineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machine", machineId] });
    },
  });
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Attributes  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//CRUD Operations
// Attribut hinzufügen
export function useAddCustomAttribute(machineId: number) {
  const queryClient = useQueryClient();
  return useMutation<
    MachineAttribute,
    unknown,
    { attributeName: string; attributeType: string }
  >({
    mutationFn: ({
      attributeName,
      attributeType,
    }: {
      attributeName: string;
      attributeType: string;
    }) =>
      createMachineAttributeService(machineId, attributeName, attributeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machine", machineId] });
    },
  });
}

export function useEditCustomAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attribute: Partial<MachineAttribute>) =>
      editMachineAttributeService(attribute),
    onSuccess: (data: Partial<MachineAttribute>) => {
      queryClient.invalidateQueries({ queryKey: ["machine", data.machineId] });
    },
  });
}

// Attribut entfernen
export function useRemoveCustomAttribute(machineId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attributeId: number) =>
      removeCustomAttributeFromMachineService(machineId, attributeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machine", machineId] });
    },
  });
}
