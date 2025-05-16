"use client";
import React, { useState } from "react";
import MachineTemplateForm from "@/components/MachineTemplate/MachineTemplateForm";
import MachineTemplateList from "@/components/MachineTemplate/MachineTemplateList";
import { MachineTemplate } from "@/types/machineTemplate";

export default function MachineTemplatesPage() {
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const toggleTemplate = () => {
    setShowTemplateForm(!showTemplateForm);
  };

  const triggerRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Maschinen Templates</h1>

      <MachineTemplateList refreshTrigger={refreshFlag} />

      {showTemplateForm && (
        <MachineTemplateForm onTemplateCreated={triggerRefresh} />
      )}

      <button
        onClick={toggleTemplate}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {showTemplateForm ? "Template ausblenden" : "Template anlegen"}
      </button>
    </div>
  );
}
