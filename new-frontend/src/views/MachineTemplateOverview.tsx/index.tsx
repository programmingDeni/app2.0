import MachineTemplateForm from "@/components/MachineTemplate/MachineTemplateForm";
import { MachineTemplateList } from "@/components/MachineTemplate/MachineTemplateList";
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";
import { useMachineTemplates } from "@/presenters/useMachineTemplates";
import Button from "@/components/Button";

export default function MachineTemplateOverview() {
  const { templates, loadingTemplates, errorTemplates, refetchTemplates } =
    useMachineTemplates();

  if (loadingTemplates) return <p>🔄 Lädt Templates...</p>;
  if (errorTemplates) return <p>❌ Fehler: {errorTemplates.message}</p>;

  const triggerRefresh = async () => {
    await refetchTemplates();
  };

  const zuHome = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <h2>Machine Templates Übersicht</h2>
      <MachineTemplateList machineTemplates={templates} />
      <ToggleableSection toggleLabel="Template hinzufügen">
        <MachineTemplateForm onSubmit={triggerRefresh} />
      </ToggleableSection>
      <Button to="/">→ Zurück zur Startseite</Button>
    </div>
  );
}
