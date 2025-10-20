// service klasse um machinen attribute zu verwalten
import axios from "@/services/axios";
import { MachineAttribute } from "../types/machine.types";

export async function getMachineAttributes(machineId: number) {
    try {
        const response = await axios.get<MachineAttribute[]>(`/api/machines/${machineId}/attributes`);
        return response.data;
    } catch (e) {
        throw e;
    }
}