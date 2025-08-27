import { MachineLazy } from "@/types/machine";
import AddMachineFormUI from "./AddMachineFormUI";
import { useAddMachineFormPresenter } from "./useAddMachineFormPresenter";

interface Props {
  onMachineAdded: (machine: MachineLazy) => void;
}

export default function AddMachineFormView({ onMachineAdded }: Props) {
  const {
    name,
    setName,
    templateId,
    setTemplateId,
    templates,
    loading,
    error,
    handleSubmit,
  } = useAddMachineFormPresenter(onMachineAdded);

  return (
    <AddMachineFormUI
      name={name}
      onNameChange={setName}
      selectedTemplateId={templateId}
      onTemplateChange={setTemplateId}
      templates={templates}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
