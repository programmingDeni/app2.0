import { TemplateAttribute } from "../../types/template.types";
import AddAttributeFormUI from "./AddAttributeFormUI";
import { useAddAttributeFormPresenter } from "./useAddAttributeFormPresenter";

type Props = {
  templateId?: number;
  onSubmit?: (attributes: TemplateAttribute[], templateId?: number) => void;
};

export default function AddAttributeFormView({ templateId, onSubmit }: Props) {
  const presenter = useAddAttributeFormPresenter();
  const { attributes } = presenter;

  const handleSubmit = () => {
    if (onSubmit) {
      if (templateId !== undefined) {
        onSubmit(attributes, templateId);
      } else {
        console.log("test");
        onSubmit(attributes);
      }
    } else if (templateId !== undefined) {
      presenter.onSubmit(templateId, attributes);
    } else {
      // Optional: Hinweis anzeigen
      alert("Kein Template ausgewählt!");
    }
  };

  return (
    <div>
      <AddAttributeFormUI {...presenter} onSubmit={handleSubmit} />
    </div>
  );
}
