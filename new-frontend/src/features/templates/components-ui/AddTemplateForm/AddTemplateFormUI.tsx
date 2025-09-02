//bekommt von Props alles Übergeben was es für ANzeige und Veränderungen braucht
import Button from "@/components/Button";
import AddAttributeFormView from "@/features/templates/components-ui/AddAttribute";
import { TemplateAttribute } from "../../types/template.types";

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
    <div>
      <h2>Add Template Form</h2>
      {/* Messages direkt unter der Überschrift */}
      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
      {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
      <div>
        <h3>
          Template Name:{" "}
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
        </h3>
      </div>
      <AddAttributeFormView onSubmit={handleSubmit} />
    </div>
  );
}
