import { useMachineStructure } from "@/presenters/useMachineStructure";
import AttributeList from "@/components/AttributeList";
import AddAttributeForm from "@/components/AddAttributeForm/AddAttributeForm";
import { useState } from "react";
import { MachineAttributeDto } from "@/types/machineAttribute";
import { useMachineTemplates } from "@/presenters/useMachineTemplates";

interface Props {
  machineId: number;
}

export default function MachineStructureView({ machineId }: Props) {
  //das ist der state mit den attributen
  const {
    machineStructure,
    loading,
    error,
    refetch,
    assignTemplateToMachine,
    removeTemplateFromMachine,
  } = useMachineStructure(machineId);

  const { templates, loadingTemplates } = useMachineTemplates();

  const [showForm, setShowForm] = useState(false);

  if (loading) return <p>⏳ Lädt...</p>;
  if (error) return <p>❌ Fehler: {error.message}</p>;
  if (!machineStructure) return <p>Keine Daten gefunden</p>;

  const handleAttributeAdded = async () => {
    await refetch(); // 🌀 holt alle Daten neu vom Server
    setShowForm(false);
    console.log("neue Attribute hinzugefügt", machineStructure);
  };

  return (
    <div>
      <h2>Maschine: {machineStructure.name}</h2>
      <p>
        Template:{" "}
        {machineStructure.machineTemplateId ?? "Kein Template zugewiesen"}
      </p>
      <h3>Attribute:</h3>
      <AttributeList attributes={machineStructure.machineAttributes} />{" "}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>+ Attribut hinzufügen</button>
      ) : (
        <AddAttributeForm
          machineId={machineId}
          onAttributeAdded={handleAttributeAdded}
          onCancel={() => setShowForm(false)}
        />
      )}
      <h3>Template:</h3>
      {loadingTemplates ? (
        <p>🔄 Templates werden geladen...</p>
      ) : machineStructure.machineTemplateId ? (
        <>
          <select
            value={machineStructure.machineTemplateId}
            onChange={(e) => assignTemplateToMachine(Number(e.target.value))}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.templateName}
              </option>
            ))}
          </select>
          <button onClick={() => removeTemplateFromMachine()}>
            Template entfernen
          </button>
        </>
      ) : (
        <>
          <p>Kein Template zugewiesen</p>
          <select
            defaultValue=""
            onChange={(e) => assignTemplateToMachine(Number(e.target.value))}
          >
            <option value="" disabled>
              Template auswählen
            </option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.templateName}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
