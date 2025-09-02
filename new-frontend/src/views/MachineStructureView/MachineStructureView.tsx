import { useMachineStructure } from "@/presenters/useMachineStructure";
import AttributeList from "@/components/AttributeList";
import AddAttributeForm from "@/components/AddAttributeForm/AddAttributeForm";
import { useEffect, useState } from "react";
import { MachineAttributeDto } from "@/types/machineAttribute";
import { useMachineTemplates } from "@/presenters/useMachineTemplates";
import Button from "@/components/Button";
import { Link, Router } from "react-router-dom";
import MachineAttributeCard from "@/components/MachineAttributeCard";
import ToggleableSection from "@/components/ToggleableSection/ToggleableSection";
import TemplateSelect from "@/components/TemplateSelect/TemplateSelect";
import { assignTemplateToMachineById } from "@/services/machine.service";
import { useMachineAttributes } from "@/presenters/useMachineAttributes";
import TemplateView from "@/features/templates/views/TempalteDetails";

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
    addAttributeToMachine,
  } = useMachineStructure(machineId);

  //template verwaltung
  const { templates, loadingTemplates } = useMachineTemplates();

  const { removeAttributeFromMachine } = useMachineAttributes(machineId);

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );

  console.log(
    "MachineStructuremapper, id:",
    machineId,
    "machineidtype",
    typeof machineId,
    "machineStructure",
    machineStructure
  );

  if (loading) return <p>⏳ Lädt...</p>;
  if (error) return <p>❌ Fehler: {error.message}</p>;
  if (!machineStructure) return <p>Keine Daten gefunden</p>;

  // Attribute einteilen in custom und template
  const templateAttributes = machineStructure.machineAttributes.filter(
    (attr) => attr.fromTemplate === true
  );

  const customAttributes = machineStructure.machineAttributes.filter(
    (attr) => attr.fromTemplate === false
  );

  //TODO: das soll nicht  machineTemplates laden, sondern eine Machine, mit Ihren Attributen und Tempaltes

  //console.log("templates", templates, "loadingTemplates", loadingTemplates);
  /*
  const [showForm, setShowForm] = useState(false);

  if (loading) return <p>⏳ Lädt...</p>;
  if (error) return <p>❌ Fehler: {error.message}</p>;
  if (!machineStructure) return <p>Keine Daten gefunden</p>;

  const handleAttributeAdded = async () => {
    await refetch(); // 🌀 holt alle Daten neu vom Server
    setShowForm(false);
    console.log("neue Attribute hinzugefügt", machineStructure);
  };
  */
  const handleRemoveTemplate = async () => {
    const confirm = window.confirm(
      "⚠️⚠️⚠️Bist du sicher, dass du das Template entfernen möchtest?⚠️⚠️⚠️\n" +
        "Alle eingetragenen Attribut Werte gehen dabei unwiderruflich verloren."
    );

    if (!confirm) return;

    try {
      await removeTemplateFromMachine();
      refetch();
    } catch (error) {
      console.error("Fehler beim Entfernen des Templates:", error);
      alert("Fehler beim Entfernen des Templates. Bitte versuche es erneut.");
    }
  };

  const handleAssignTemplate = async () => {
    if (selectedTemplateId === null) return;
    else {
      console.log("selectedTemplateId", selectedTemplateId);
      //call presenter
      assignTemplateToMachine(selectedTemplateId);
    }
  };

  const handleRemoveAttribute = async (attributeId: number) => {
    if (!machineStructure) return;
    //user bestätigen lassen, sonst datenverlust
    const confirm = window.confirm(
      "⚠️⚠️⚠️Bist du sicher, dass du das Template entfernen möchtest?⚠️⚠️⚠️\n" +
        "Alle eingetragenen Attribut Werte gehen dabei unwiderruflich verloren."
    );

    if (!confirm) return;

    //call presenter
    await removeAttributeFromMachine(attributeId);
    await refetch();
  };

  return (
    <div>
      <h2>Maschine: {machineStructure.machineName}</h2>

      <h3>Maschinen Attribute (Template)</h3>
      {/*WENN TEmplates vorhanden ist dieses anzeigen; erlauben es zu entfernen*/}
      {templateAttributes.length > 0 ? (
        <div>
          {templateAttributes.map((attribute) => (
            <MachineAttributeCard key={attribute.id} attribute={attribute} />
          ))}
          <Button onClick={handleRemoveTemplate}>Template entfernen</Button>
        </div>
      ) : (
        //WENN keine Templates vorhanden, dann Template hinzufügen oder zu den Templates süringen
        <div>
          <p className="text-gray-500">❗ Keine Template-Attribute vorhanden</p>
          {/*Template Auswahl */}
          <ToggleableSection toggleLabel="Template hinzufügen">
            <TemplateSelect
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onChange={setSelectedTemplateId}
            />
            <Button
              onClick={handleAssignTemplate}
              disabled={selectedTemplateId === null}
            >
              Template zuweisen
            </Button>
            <Link to={`/machine-templates`}>→ Zu den Templates</Link>
          </ToggleableSection>
        </div>
      )}

      <h3>Maschinen Attribute (Custom)</h3>
      {customAttributes.length > 0 ? (
        <div>
          {customAttributes.map((attribute) => (
            <div key={attribute.id} className="flex  gap-4 mb-2">
              <MachineAttributeCard key={attribute.id} attribute={attribute} />
              <Button onClick={() => handleRemoveAttribute(attribute.id)}>
                Attribut entfernen
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">❗ Keine aktuellen Attribute vorhanden</p>
      )}
      <ToggleableSection toggleLabel="Attribute hinzufügen">
        <AddAttributeForm machineId={machineId} onAttributeAdded={refetch} />
      </ToggleableSection>

      <h1> Neue Componente TEst </h1>
      <TemplateView templateId={1} />

      <Link to={`/`}>→ Zur Startseite</Link>
      <Link to={`/machines/${machineId}/values`}>→ Zu den Werten</Link>
    </div>
  );
}
