//Template List View
import { useState } from "react";

//card importieren (UI)
import TemplateListComponent from "@/features/templates/componentsMVP/TemplateList";
import Button from "@/shared/components/Buttons/GenericButton";
import ToggleableSection from "@/shared/components/ToggleableSection/ToggleableSection";
import AddTemplateFormView from "../../../features/templates/componentsMVP/AddTemplateForm";

//style
import styles from "@/shared/styles/twoColumnContent.module.css";

export default function TemplateListView() {
  //state für showform
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <TemplateListComponent />
        </div>
        <div className={styles.rightSide}>
          {showForm ? 
          (
            <div className={styles.rightSideContent}>
              <div className={styles.topRightButton}>
                <Button onClick={() => setShowForm(false)}> Schliessen </Button>
              </div>
              <div className={styles.formWrapper}>
                <AddTemplateFormView onSubmit={() => setShowForm(false)} /> 
              </div>
            </div>
          ) : (
            <div className={styles.topRightButton}>
              <Button onClick={() => setShowForm(true)}> Template hinzufuegen </Button>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
}
