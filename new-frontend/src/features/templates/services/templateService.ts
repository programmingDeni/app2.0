import axios from "@/services/axios";
import type { AxiosResponse } from "axios";

//denk moderneres Model
import { Template, TemplateAttribute } from "../types/template.types";
import TemplateCardLazyList from "../components-ui/TemplateCardLazyList";

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Templates  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export async function fetchMachineTemplates(): Promise<Template[]> {
  try {
    const response = await axios.get<Template[]>("/api/machine-templates");
    return response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Templates:", error);
    throw error;
  }
}

export async function fetchTemplateByIdService(
  templateId: number
): Promise<Template> {
  try {
    const response = await axios.get<Template>(
      `/api/machine-templates/${templateId}`
    );
    console.log("TemplateService response", response);
    return response.data;
  } catch (error) {
    console.error("Fehler beim Laden des Templates:", error);
    throw error;
  }
}

export async function createMachineTemplateService(
  templateName: string,
  attributes: TemplateAttribute[]
): Promise<Template> {
  try {
    console.log(
      "request createMachineTemplateService",
      templateName,
      attributes
    );
    const response = await axios.post<Template>(`/api/machine-templates`, {
      templateName,
      templateAttributes: attributes,
    });
    console.log("createMachineTemplateService response", response.data);
    return response.data;
  } catch (error) {
    console.error("Fehler beim Erstellen des Templates:", error);
    throw error;
  }
}

export async function deleteTemplateService(templateId: number): Promise<void> {
  try {
    await axios.delete(`/api/machine-templates/${templateId}`);
  } catch (error) {
    console.error("Fehler beim Löschen des Templates:", error);
    throw error;
  }
}

export async function editTemplateService(
  template: Partial<Template>
): Promise<Template> {
  try {
    const response = await axios.put(
      `/api/machine-templates/${template.id}`,
      template
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Editieren des Templates:", error);
    throw error;
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Attribute  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export async function removeAttributeFromTemplateService(
  templateId: number,
  attributeId: number
): Promise<void> {
  try {
    await axios.delete(
      `/api/machine-templates/${templateId}/attributes/${attributeId}`
    );
  } catch (error) {
    console.error(
      "Fehler beim Entfernen des Attributs aus dem Template:",
      error
    );
    throw error;
  }
}

export async function editTemplateAttributeService(
  templateId: number,
  attribute: Partial<TemplateAttribute>
): Promise<TemplateAttribute> {
  try {
    //Mapping zu backend dto
    const payload = {
      ...(attribute.id && { id: attribute.id }),
      attributeName: attribute.templateAttributeName,
      attributeType: attribute.templateAttributeType,
    };

    const response = await axios.put<TemplateAttribute>(
      `/api/machine-templates/${templateId}/attributes/${attribute.id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Bearbeiten des Templateattributs:", error);
    throw error;
  }
}

export async function addAttributesToExistingTemplateService(
  templateId: number,
  attributes: TemplateAttribute[]
): Promise<TemplateAttribute[]> {
  try {
    const payload = attributes.map((attr) => ({
      attributeName: attr.templateAttributeName,
      attributeType: attr.templateAttributeType,
    }));

    const response = await axios.post<TemplateAttribute[]>(
      `/api/machine-templates/${templateId}/attributes`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Hinzufügen von Attributen zum Template:", error);
    throw error;
  }
}
