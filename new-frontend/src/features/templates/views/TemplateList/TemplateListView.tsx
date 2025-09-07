//Komponente die die Liste an Templates Anzeigt
// dazu iteriert es ueber die machineTemplates und zeigt diese
//Ui ist eigene Komponente
//diese View handlet noch löschen und einen Link zur details page
//importiere den presenter
//import useTemplates from "@/features/templates/hooks/useTemplates";
import {
  useTemplates,
  useRemoveTemplate,
} from "@/features/templates/query/useTemplateQueries";
import { useState } from "react";

//card importieren (UI)
import TempalteCardLazyList from "@/features/templates/components-ui/TemplateCardLazyList";
import Button from "@/components/Button";
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";
import MachineTemplateForm from "@/components/MachineTemplate/MachineTemplateForm";
import AddTemplateFormView from "../../components-ui/AddTemplateForm";

export default function TemplateListView() {
  //const { machineTemplates, removeTemplate } = useTemplates();
  //Query Templates
  const { data: templates, isLoading, error } = useTemplates();
  const removeTemplate = useRemoveTemplate();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  //state für showform
  const [showForm, setShowForm] = useState(false);

  const handleRemoveTemplate = async (templateId: number) => {
    const confirm = window.confirm(
      "⚠️⚠️⚠️Bist du sicher, dass du das Template entfernen möchtest?⚠️⚠️⚠️\n" +
        "Das Template sowie alle eingetragenen Attribut Werte gehen dabei unwiderruflich verloren."
    );
    if (!confirm) return;
    setErrorMsg(null);
    try {
      await removeTemplate.mutateAsync(templateId);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(
          "Fehler beim Entfernen des Templates. Bitte versuche es erneut."
        );
      }
    }
  };

  if (!templates) return <div>Loading...</div>;

  return (
    <div>
      <h2>Machinen Template Liste [{templates?.length}]</h2>
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {errorMsg}
        </div>
      )}
      {templates?.map((machineTemplate) => (
        <div key={machineTemplate.id}>
          <TempalteCardLazyList template={machineTemplate} />
          <Button to={`/machine-templates/${machineTemplate.id}`}>Edit </Button>
          <Button onClick={() => handleRemoveTemplate(machineTemplate.id!)}>
            Delete
          </Button>
        </div>
      ))}
      <ToggleableSection
        toggleLabel="Template hinzufügen"
        open={showForm}
        onOpen={() => setShowForm(true)}
        onClose={() => setShowForm(false)}
      >
        <AddTemplateFormView onSubmit={() => setShowForm(false)} />
      </ToggleableSection>
      <Button to="/">→ Zurück zur Startseite</Button>
    </div>
  );
}
