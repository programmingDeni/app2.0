import { Template } from "../../../../shared/types/template.types";

import { TemplateCardUi } from "../../components-ui/TemplateCard";

import "@/shared/styles/main.css";

interface Props {
  templates: Template[];
  onDelete?: (templateId: number) => void;
  onNavigateEdit?: () => void;
  onDuplicate?: (templateId: number) => void;
}

export default function TemplateListComponentUI(props: Props) {
  const { templates, onDelete, onDuplicate } = props;

  return (
    <>
      <h2 className="sticky-top">
        Template List Component ({templates.length})
      </h2>
      <div className="flex-scroll stack stack--md">
        {templates.map((template) => (
          <TemplateCardUi
            key={template.id}
            machineTemplate={template}
            onEdit={true}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>
    </>
  );
}

//TODO: die scrollbar ist jetzt im list component,
//immer nur die ersten 2 attribute pro template anzeigen
