/**
 * TemplateSelect – eine Dropdown-Komponente zur Auswahl eines Maschinen-Templates.
 *
 * Wird verwendet, um eine Vorlage (MachineTemplateDto) auszuwählen oder "kein Template" zu setzen.
 * Übergibt die gewählte Template-ID (oder `null` bei "Kein Template verwenden") an den `onChange` Callback.
 *
 * @param {MachineTemplateDto[]} templates – Die verfügbaren Templates zur Auswahl
 * @param {number | null} selectedTemplateId – Die aktuell ausgewählte Template-ID oder `null`
 * @param {(id: number | null) => void} onChange – Callback, der beim Wechsel der Auswahl ausgelöst wird
 *
 * @example
 * <TemplateSelect
 *   templates={templateList}
 *   selectedTemplateId={selectedId}
 *   onChange={(id) => setSelectedId(id)}
 * />
 */

import { Template } from "@/features/templates/types/template.types";

interface Props {
  templates: Template[];
  selectedTemplateId: number | null;
  onChange: (id: number | null) => void;
}

export default function TemplateSelect({
  templates,
  selectedTemplateId,
  onChange,
}: Props) {
  return (
    <select
      value={selectedTemplateId ?? ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : Number(e.target.value))
      }
    >
      <option value="">Kein Template verwenden</option>
      {templates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.templateName}
        </option>
      ))}
    </select>
  );
}
