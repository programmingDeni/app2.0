import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMachineTemplates,
  fetchTemplateByIdService,
  createMachineTemplateService,
  deleteTemplateService,
  addAttributesToExistingTemplateService,
  removeAttributeFromTemplateService,
} from "@/features/templates/services/templateService";
import {
  Template,
  TemplateAttribute,
} from "@/features/templates/types/template.types";

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Templates  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Alle Templates holen
export function useTemplates() {
  return useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: fetchMachineTemplates,
  });
}

// Einzelnes Template holen (optional, falls du das brauchst)
export function useTemplate(
  templateId?: number,
  options?: { enabled?: boolean }
) {
  console.log("TemplateQuery templateId", templateId);
  return useQuery<Template | undefined>({
    queryKey: ["template", templateId],
    queryFn: () => fetchTemplateByIdService(templateId!),
    enabled: !!templateId && (options?.enabled ?? true),
  });
}

// Template anlegen
export function useAddTemplate() {
  const queryClient = useQueryClient();
  return useMutation<
    Template,
    unknown,
    { templateName: string; attributes: TemplateAttribute[] }
  >({
    mutationFn: ({
      templateName,
      attributes,
    }: {
      templateName: string;
      attributes: TemplateAttribute[];
    }) => createMachineTemplateService(templateName, attributes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

// Template löschen
export function useRemoveTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: number) => deleteTemplateService(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Attribute  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Attribute zu Template hinzufügen
export function useAddAttributesToTemplate(templateId: number) {
  const queryClient = useQueryClient();
  return useMutation<TemplateAttribute[], unknown, TemplateAttribute[]>({
    mutationFn: (attributes: TemplateAttribute[]) =>
      addAttributesToExistingTemplateService(templateId, attributes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", templateId] });
    },
  });
}

// Attribut aus Template entfernen
export function useRemoveAttributeFromTemplate(templateId: number) {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: (attributeId: number) =>
      removeAttributeFromTemplateService(templateId, attributeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", templateId] });
    },
  });
}
