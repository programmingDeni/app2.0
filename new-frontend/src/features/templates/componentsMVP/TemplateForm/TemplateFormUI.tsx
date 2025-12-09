//bekommt von Props alles Übergeben was es für ANzeige und Veränderungen braucht
import Button from "@/shared/components/Buttons/GenericButton";
import AddAttributeFormUi from "@/features/templates/TemplateAttributes/components/TemplateAttributeForms/AddAttribute/AddTemplateAttributeFormUI";
import { TemplateAttribute } from "../../../../shared/types/template.types";
import { useAttributesPresenter } from "./useAttributesPresenter";
import "@/shared/styles/main.css";

type Props = {
  templateName: string;
  setTemplateName: (name: string) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  attributePresenter: ReturnType<typeof useAttributesPresenter>;
  isEditMode?: boolean;
  handleSubmit: () => void;
  error?: string | null;
  successMessage?: string | null;
};

export default function TemplateFormUi({
  templateName,
  setTemplateName,
  isEditing,
  setIsEditing,
  attributePresenter,
  isEditMode,
  handleSubmit,
  error,
  successMessage,
}: Props) {
  {
    console.log("error", error);
  }

  return (
    <div className="form-group">
      {/* Messages direkt unter der Überschrift */}
      <div className="flex-shrink-0 stack stack--sm">
        <h2>{isEditMode ? "Template bearbeiten" : "Template erstellen"}</h2>
        <div className="row row--sm">
          <h3>Template Name:</h3>

          {isEditing ? (
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditing(false);
              }}
              autoFocus
              className="form-input"
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
      <div className="message-container">
        {error && <div className="alert alert--error">{error}</div>}
        {successMessage && (
          <div className="alert alert--success">{successMessage}</div>
        )}
      </div>
      <AddAttributeFormUi
        attributePresenter={attributePresenter}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
