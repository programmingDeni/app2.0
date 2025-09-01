import { useEffect, useState } from "react";
import { MachineTemplateDto } from "@/types/machineTemplate";
import axios from "axios";

//hook um mit backend CRUD zu arbeiten
//also templates Create, Read, Update, Delete (Remove)

//server importierren
import {
  fetchMachineTemplates,
  removeAttributeFromTemplateService,
} from "@/features/templates/services/templateService";

export default function useTemplates() {
  const [machineTemplates, setMachineTemplates] = useState<
    MachineTemplateDto[]
  >([]);

  useEffect(() => {
    fetch();
  }, []);

  //Create
  //ist in eigenständiger komponente

  //Read
  const fetch = async () => {
    try {
      const response = await fetchMachineTemplates();
      const data = response.data;
      setMachineTemplates(data);
    } catch (e) {
      console.error(e);
    }
  };
  //Update
  //TODO: Update

  //Remove
  const removeAttributeFromTemplate = async (
    templateId: number,
    attributeId: number
  ) => {
    //der presenter ruft den service und ändert den state
    console.log("test remove attributeId:", attributeId);
    try {
      //service call
      const response = await removeAttributeFromTemplateService(
        templateId,
        attributeId
      );
      console.log("response", response);
      //aus dem state entfernen
      if (response.status === 204) {
        setMachineTemplates((prev) =>
          prev.map((t) =>
            t.id !== templateId
              ? t
              : {
                  ...t,
                  templateAttributes: t.templateAttributes.filter(
                    (a) => a.id !== attributeId
                  ),
                }
          )
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Remove failed:", err.response?.data ?? err.message);
        // optional: show UI toast/snackbar here
      } else {
        console.error("Remove failed:", err);
      }
    }
  };

  return { machineTemplates, removeAttributeFromTemplate };
}
