//laed temmplates und list ui
//query
import { useQueryClient } from "@tanstack/react-query";
import { TemplateQuery } from "@/queries/template/TemplateQuery";
//ui
import TemplateListComponentUI from "./TemplateListComponentUI";
import { QueryStateWrapper } from "@/shared/abstracts/QueryStateWrapper";
import { useState } from "react";

import messageStyle from "@/shared/styles/messages/messages.module.css"
export default function TemplateListComponentView() {
  //queries
  const queryClient = useQueryClient();
  const templateQuery = new TemplateQuery(queryClient);
  //templates (lazy) laden
  const findAllTemplatesQuery = templateQuery.useFindAll(false);
  //delete
  const deleteMutation = templateQuery.useDelete();

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

    deleteMutation.mutate(templateId, {
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

  //list ui rendern
  return (
    <div className="scroll-container">
      {errorMsg && (
        <div className={messageStyle.error}>
          {errorMsg}
        </div>
      )}

      <QueryStateWrapper {...findAllTemplatesQuery} resourceName="Templates">
        {(templates) => (
          <TemplateListComponentUI
            templates={templates}
            onDelete={handleDelete}
          />
        )}
      </QueryStateWrapper>
    </div>
  );
}
