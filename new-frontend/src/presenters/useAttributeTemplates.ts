import { AttributeTemplateDto } from "@/types/attributeTemplate";
import { useCallback, useEffect, useState } from "react";
import {
  createAttributeTemplateInExistingTemplate,
  getAllAttributeTemplates,
} from "@/services/attributeTemplate.service";
import { CreateAttributeInExistingTemplateDto } from "@/types/attributeTemplate";
import { AttributeType } from "@/types/attributeType";

export function useAttributeTemplates(machineTemplateId: number) {
  const [attributeTemplates, setAttributeTemplates] = useState<
    AttributeTemplateDto[]
  >([]);
  const [loadingAttributeTemplates, setLoadingAttributeTemplates] =
    useState(true);
  const [errorAttributeTemplates, setErrorAttributeTemplates] =
    useState<Error | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = useCallback(async () => {
    setLoadingAttributeTemplates(true);
    try {
      const res = await getAllAttributeTemplates();
      setAttributeTemplates(res.data);
    } catch (err) {
      setErrorAttributeTemplates(err as Error);
    } finally {
      setLoadingAttributeTemplates(false);
    }
  }, []);

  const addAttributeTemplateToMachineTemplate = async (
    name: string,
    type: AttributeType
  ) => {
    const payload: CreateAttributeInExistingTemplateDto = {
      machineTemplateId: machineTemplateId,
      attributeTemplateName: name,
      attributeTemplateType: type,
    };

    try {
      const res = await createAttributeTemplateInExistingTemplate(payload);
      await fetch(); // aktualisiert Liste
      return res.data;
    } catch (err) {
      console.error("Fehler beim Erstellen des Attribut-Templates", err);
      throw err;
    }
  };

  return {
    fetch,
    attributeTemplates,
    loadingAttributeTemplates,
    errorAttributeTemplates,
    addAttributeTemplateToMachineTemplate,
  };
}
