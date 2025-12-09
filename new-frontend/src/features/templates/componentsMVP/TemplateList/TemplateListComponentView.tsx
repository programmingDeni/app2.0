//laed temmplates und list ui
//query
import { useQueryClient } from "@tanstack/react-query";
import { TemplateQuery } from "@/queries/template/TemplateQuery";
//ui
import TemplateListComponentUI from "./TemplateListComponentUI";
import { QueryStateWrapper } from "@/shared/abstracts/QueryStateWrapper";
import { useState } from "react";

import messageStyle from "@/shared/styles/messages/messages.module.css";
export default function TemplateListComponentView() {
  //queries
  const queryClient = useQueryClient();
  const templateQuery = new TemplateQuery(queryClient);
  //templates (lazy) laden
  const findAllTemplatesQuery = templateQuery.useFindAll(false);
  //delete
  const deleteTemplateMutation = templateQuery.useDelete();
  const duplicateTemplateMutation = templateQuery.useDuplicate();

  //State
  //error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  //delete
  const handleDelete = (templateId: number) => {
    const confirm = window.confirm(
      "⚠️⚠️⚠️Bist du sicher, dass du das Template entfernen möchtest?⚠️⚠️⚠️\n" +
        "Das Template sowie alle eingetragenen Attribut Werte gehen dabei unwiderruflich verloren."
    );
    if (!confirm) return;
    setErrorMsg(null);

    deleteTemplateMutation.mutate(templateId, {
      onSuccess: () => {
        console.log("Template gelöscht:", templateId);
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg(
            "Fehler beim Entfernen des Templates. Bitte versuche es erneut."
          );
        }
      },
    });
  };

  const handleCopy = (templateId: number) => {
    duplicateTemplateMutation.mutate(templateId);
    setErrorMsg(null);
    console.log("copied template:", templateId);
  };

  //list ui rendern
  return (
    <div className="scroll-container">
      {errorMsg && <div className={messageStyle.error}>{errorMsg}</div>}

      <QueryStateWrapper {...findAllTemplatesQuery} resourceName="Templates">
        {(templates) => (
          <TemplateListComponentUI
            templates={templates}
            onDelete={handleDelete}
            onDuplicate={handleCopy}
          />
        )}
      </QueryStateWrapper>
    </div>
  );
}
