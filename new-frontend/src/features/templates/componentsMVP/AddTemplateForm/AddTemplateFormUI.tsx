//bekommt von Props alles Übergeben was es für ANzeige und Veränderungen braucht
import Button from "@/shared/components/Buttons/GenericButton";
import AddAttributeFormView from "@/features/templates/TemplateAttributes/components/AddAttribute";
import { TemplateAttribute } from "../../../../shared/types/template.types";
import style from "./AddTemplateForm.module.css"

type Props = {
  templateName: string;
  setTemplateName: (name: string) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  handleSubmit: (attributes: TemplateAttribute[]) => void;
  errorMsg?: string | null;
  successMsg?: string | null;
};

export default function AddTemplateFormUI({
  templateName,
  setTemplateName,
  isEditing,
  setIsEditing,
  handleSubmit,
  errorMsg,
  successMsg,
}: Props) {
  return (
    <div className={style.formContainer}>
      <h2 className={style.header}>Add Template Form</h2>
      {/* Messages direkt unter der Überschrift */}
      {errorMsg && <div className={style.message}>{errorMsg}</div>}
      {successMsg && <div className={style.message}>{successMsg}</div>}
      <div className={style.nameSection}>
        <h3>Template Name:</h3>
        <div>
          {isEditing ? (
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditing(false);
              }}
              autoFocus
              className="border rounded px-2"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="cursor-pointer underline"
            >
              {templateName === "" ? "Hier Name eingeben" : templateName}
            </span>
          )}
        </div>
      </div>
      <div className={style.contentArea}>
        <AddAttributeFormView onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
