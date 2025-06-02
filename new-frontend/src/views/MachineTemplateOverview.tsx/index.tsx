import MachineTemplateForm from "@/components/MachineTemplate/MachineTemplateForm";
import { MachineTemplateList } from "@/components/MachineTemplate/MachineTemplateList";
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";
import { useMachineTemplates } from "@/presenters/useMachineTemplates";

export default function MachineTemplateOverview() {
  const { templates, loadingTemplates, errorTemplates, refetchTemplates } =
    useMachineTemplates();

  if (loadingTemplates) return <p>🔄 Lädt Templates...</p>;
  if (errorTemplates) return <p>❌ Fehler: {errorTemplates.message}</p>;

  const triggerRefresh = async () => {
    await refetchTemplates();
  };

  return (
    <div>
      <h2>Machine Templates Übersicht</h2>
      <MachineTemplateList machineTemplates={templates} />
      <ToggleableSection toggleLabel="Template hinzufügen">
        <MachineTemplateForm onSubmit={triggerRefresh} />
      </ToggleableSection>
    </div>
  );
}
