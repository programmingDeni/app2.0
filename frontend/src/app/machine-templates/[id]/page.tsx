"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import AttributeTemplateList from "@/components/AttributeInTempalte/AttributeInTemplateList";
import AttributeTemplateForm from "@/components/AttributeInTempalte/AttributeTemplateForm";
import { MachineTemplate } from "@/types/machineTemplate";

export default function MachineTemplateDetailsPage() {
  const params = useParams();
  const templateId = parseInt(params.id as string);
  const [template, setTemplate] = useState<MachineTemplate | null>(null);
  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [refreshAttributes, setRefreshAttributes] = useState(false);

  const loadTemplate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/machine-templates/${templateId}`
      );
      setTemplate(response.data);
      setNewName(response.data.templateName);
    } catch (err) {
      setError("Fehler beim Laden des Templates");
    }
  };

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  const handleNameChange = async () => {
    if (!template || !newName.trim()) return;

    try {
      await axios.put(
        `http://localhost:8080/api/machine-templates/${templateId}`,
        {
          templateName: newName,
          id: templateId,
        }
      );
      await loadTemplate();
      setShowNameEdit(false);
    } catch (err) {
      setError("Fehler beim Speichern des Namens");
    }
  };

  if (!template) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Template: {template.templateName}</h1>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {showNameEdit ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={handleNameChange}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setShowNameEdit(false);
                  setNewName(template.templateName);
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Abbrechen
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowNameEdit(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Namen bearbeiten
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Attribute</h2>
        <AttributeTemplateList
          templateId={templateId}
          refreshTrigger={refreshAttributes}
        />

        <div className="mt-4">
          <button
            onClick={() => setShowAttributeForm(!showAttributeForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {showAttributeForm ? "Attributform ausblenden" : "Neues Attribut"}
          </button>

          {showAttributeForm && (
            <div className="mt-4">
              <AttributeTemplateForm
                templateId={templateId}
                onSubmit={() => {
                  setShowAttributeForm(false);
                  setRefreshAttributes((prev) => !prev); // Toggle to trigger refresh
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
