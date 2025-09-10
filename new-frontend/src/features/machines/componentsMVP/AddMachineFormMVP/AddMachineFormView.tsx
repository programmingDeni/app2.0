import { Machine } from "@/features/machines/types/machine.types";
import AddMachineFormUI from "./AddMachineFormUI";
//presenter für state
import { useAddMachineFormPresenter } from "./useAddMachineFormPresenter";
//query für backend communication
import { useTemplates } from "@/features/templates/query/useTemplateQueries";
import { useAddMachine } from "../../query/useMachineQueries";

interface Props {}

export default function AddMachineFormView({}: Props) {
  const { name, setName, templateId, setTemplateId, resetForm } =
    useAddMachineFormPresenter();

  const { data: templates, isLoading, error } = useTemplates();
  const addMachineMutation = useAddMachine();

  const handleSubmit = () => {
    if (!name.trim()) return;
    let template = undefined;
    let machine: Partial<Machine> = {
      machineName: name,
    };
    if (templateId !== null) {
      template = templates?.find((t) => t.id === templateId);
      machine = {
        machineName: name,
        machineTemplate: template,
      };
    }
    addMachineMutation.mutateAsync(machine);
    resetForm();
  };

  if (error) return <div>Error</div>;

  if (!templates) return <div>Loading...</div>;

  return (
    <AddMachineFormUI
      name={name}
      onNameChange={setName}
      selectedTemplateId={templateId}
      onTemplateChange={setTemplateId}
      templates={templates}
      loading={isLoading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
