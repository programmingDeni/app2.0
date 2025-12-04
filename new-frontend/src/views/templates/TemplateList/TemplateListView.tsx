//Template List View
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//card importieren (UI)
import TemplateListComponent from "@/features/templates/componentsMVP/TemplateList";
import Button from "@/shared/components/Buttons/GenericButton";




export default function TemplateListView() {
  const navigate= useNavigate();
  return (
    <div className="pageWrapper">
      <div className="pageContent">
        <Button
          className="twoColumn__actionButton"
          onClick={() => navigate("/machine-templates/add")}
        >
          {"Template hinzufuegen"}
        </Button>
        <TemplateListComponent />

        
      </div>
    </div>
  );
}
