"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import MachineTemplateForm from "@/components/MachineTemplateForm";
import MachineTemplateList from "@/components/MachineTemplateList";

interface AttributeTemplate {
  id: number;
  attributeInTemplateName: string;
  attributeInTemplateType: string;
}

interface MachineTemplate {
  id: number;
  name: string;
  attributeTemplates: AttributeTemplate[];
}

export default function MachineTemplatesPage() {
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const toggleTemplate = () => {
    setShowTemplateForm(!showTemplateForm);
  };

  return (
    <div>
      <MachineTemplateList />
      {showTemplateForm && <MachineTemplateForm />}
      <button onClick={() => toggleTemplate()}>
        {showTemplateForm ? "Tempalte ausblenden" : "Template anlegen"}
      </button>
    </div>
  );
}
