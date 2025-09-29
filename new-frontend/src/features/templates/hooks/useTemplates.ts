// framework / libs
import { useEffect, useState } from "react";
import axios from "axios";

//Template relevante types importieren
import {
  Template,
  TemplateAttribute,
} from "@/features/templates/types/template.types";

//service importieren
import {
  createMachineTemplateService,
  addAttributesToExistingTemplateService,
} from "@/features/templates/services/templateService";

//hook um mit backend CRUD zu arbeiten
//also templates Create, Read, Update, Delete (Remove)
//UND
// Template Attribute Create, Read, Update, Delete (Remove)

//server importierren
import {
  fetchMachineTemplates,
  deleteTemplateService,
  removeAttributeFromTemplateService,
} from "@/features/templates/services/templateService";

export default function useTemplates() {
  // state variablen
  //main: machine Templates
  const [machineTemplates, setMachineTemplates] = useState<Template[]>([]);
  // error und success state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Machine Templates  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //Create
  //returned true if success, false sonst
  const createTemplate = async (
    templateName: string,
    attributes: TemplateAttribute[]
  ) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    // 1. Validierung (nur name, attribute, ihre namen und types werden schon in AddAttribtue gechecket )
    if (!templateName.trim()) {
      setErrorMsg("Name darf nicht leer sein");
      return;
    }
    try {
      const response = await createMachineTemplateService(
        templateName,
        attributes
      );
      //if (response.status >= 200 && response.status < 300) {
      setMachineTemplates((prev) => [...prev, response]);
      setSuccessMsg(response.templateName + " erfolgreich erstellt!");
      return true;
      /*
      } else {
        setErrorMsg("Fehler beim Erstellen des Templates.");
        return false;
      }*/
    } catch (e: any) {
      return {
        success: false,
        error:
          e?.response?.data?.message || "Unbekannter Fehler beim Erstellen.",
      };
    }
  };

  //Read
  const fetch = async () => {
    try {
      const response = await fetchMachineTemplates();
      const data = response;
      console.log("TEMPLATE DATA", data);
      setMachineTemplates(data);
    } catch (e) {
      console.error(e);
    }
  };
  //Update

  //Delete
  const removeTemplate = async (templateId: number) => {
    try {
      const response = await deleteTemplateService(templateId);
      //state update
      setMachineTemplates((prev) => prev.filter((t) => t.id !== templateId));
    } catch (e) {
      console.error("error in removeTemplate", e);
      throw e;
    }
  };

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Template Attribute  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  //Add Attribute to Template
  // useTemplates.ts
  const addAttributesToTemplate = async (
    templateId: number,
    attributes: TemplateAttribute[]
  ) => {
    // Validierung (optional)
    if (attributes.some((attr) => !attr.templateAttributeName.trim())) {
      throw new Error("Alle Attributnamen müssen ausgefüllt sein!");
    }
    const response = await addAttributesToExistingTemplateService(
      templateId,
      attributes
    );
    setMachineTemplates((prev) =>
      prev.map((t) =>
        t.id !== templateId
          ? t
          : {
              ...t,
              templateAttributes: [
                ...(t.templateAttributes || []),
                ...response,
              ],
            }
      )
    );
    return response;
  };

  //Remove
  const removeAttributeFromTemplate = async (
    templateId: number,
    attributeId: number
  ) => {
    //der presenter ruft den service und ändert den state
    try {
      //service call
      const response = await removeAttributeFromTemplateService(
        templateId,
        attributeId
      );
      //aus dem state entfernen
      setMachineTemplates((prev) =>
        prev.map((t) =>
          t.id !== templateId
            ? t
            : {
                ...t,
                templateAttributes: t.templateAttributes?.filter(
                  (a) => a.id !== attributeId
                ),
              }
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Remove failed:", err.response?.data ?? err.message);
        // optional: show UI toast/snackbar here
      } else {
        console.error("Remove failed:", err);
      }
    }
  };

  return {
    machineTemplates,
    removeTemplate,
    removeAttributeFromTemplate,
    addAttributesToTemplate,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    createTemplate,
  };
}
