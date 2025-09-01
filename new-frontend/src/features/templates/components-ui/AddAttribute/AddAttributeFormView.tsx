import AddAttributeFormUI from "./AddAttributeFormUI";
import { useAddAttributeFormPresenter } from "./useAddAttributeFormPresenter";

type Props = {
  templateId: number;
};

export default function AddAttributeFormView({ templateId }: Props) {
  const presenter = useAddAttributeFormPresenter();
  const { attributes } = presenter;

  return (
    <div>
      <AddAttributeFormUI
        {...presenter}
        onSubmit={() => presenter.onSubmit(templateId, attributes)}
      />
    </div>
  );
}
