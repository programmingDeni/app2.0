//react
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//Types
import { Machine, MachineAttribute } from "../../../shared/types/machine.types";
import { Template, TemplateAttribute } from "@/shared/types/template.types";
import { AttributeType } from "@/shared/types/machine.types";

//Components (not yet optimised)
import MachineAttributeCard from "@/features/machines/components-ui/MachineAttributeCard";
import Button from "@/shared/components/Buttons/GenericButton";
import ToggleableSection from "@/shared/components/ToggleableSection/ToggleableSection";
import TemplateSelect from "@/components/TemplateSelect/TemplateSelect";
import AddAttributeForm from "@/features/machines/components-ui/AddAttributeForm/AddAttributeForm";
//view
import { TemplateCardUi } from "@/features/templates/components-ui/TemplateCard";
import { EditButton } from "@/shared/components/Buttons/EditButton";
import { DeleteButton } from "@/shared/components/Buttons/DeleteButton";
import { PlusIcon } from "@/shared/components/Icons/PlusIcon";
import { CloseIcon } from "@/shared/components/Icons/CloseIcon";

interface Props {
  //Machine(s)
  machine: Machine;
  customAttributes: MachineAttribute[];
  handleRemoveAttribute: (attributeId: number) => void;
  refetch?: () => void;
  loading?: boolean;
  error?: string | null;
  onCustomAttributeAdded: (
    attributeName: string,
    attributeType: AttributeType
  ) => void;
  onCustomAttributeEdited: (attribute: Partial<MachineAttribute>) => void;
  //tempaltes
  template: Template | undefined;
  handleAssignTemplate: (templateId: number) => void;
  handleRemoveTemplate: (machineId: number) => void;
  // für template select
  templates: Template[];
  selectedTemplateId: number | null;
  setSelectedTemplateId: (id: number | null) => void;
  showLinks?: boolean;
  editingCustomAttributeId?: number | null;
  setEditingCustomAttributeId?: (id: number | null) => void;
}

export default function MachineDetailsUI(props: Props) {
  const {
    machine,
    template,
    customAttributes,
    handleRemoveAttribute,
    refetch,
    loading,
    error,
    onCustomAttributeAdded,
    onCustomAttributeEdited,
    //temnplates
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    handleRemoveTemplate,
    showLinks,
  } = props;

  const [showAddAttributeForm, setShowAddAttributeForm] = useState(false);
  const [editingCustomAttributeId, setEditingCustomAttributeId] = useState<
    number | null
  >(null);

  const navigate = useNavigate();

  return (
    <div className="pageWrapper">
      <h2 className="pageHeader">Maschine: {machine.machineName}</h2>
      <div className="twoColumn twoColumn--withDivider">
        <div className="twoColumn__left">
          <div className="row row--between">
            <h3 className="pageSection__title">Zugewiesenes Template</h3>
            <div className="row row--sm">
              <EditButton
                onClick={() => navigate(`/machine-templates/${template?.id}`)}
              />
              <DeleteButton
                onDelete={handleRemoveTemplate}
                id={machine.id!}
                confirmMessage="Möchtest du das Template wirklich entfernen? Alle Template Attribute und Ihre Werte gehen dabei verloren."
              />
            </div>
          </div>

          {/* TemplateView */}
          {/** Templates zugewiesen? */}
          {template && template.id != null && (
            <div className="twoColumn__scrollable stack stack--md">
              <TemplateCardUi machineTemplate={template} />
            </div>
          )}
          {/** //TODO: Templates zugewiesen aber keine attribute? */}

          {/** kein template zugewiesen*/}
          {!template && (
            <div className="stack stack--md">
              <div>Kein Template zugewiesen</div>
              <TemplateSelect
                selectedTemplateId={selectedTemplateId}
                onChange={setSelectedTemplateId}
              />
            </div>
          )}
          {showLinks && (
            <div>
              <Button className="btn btn--primary" to={`/machine-templates`}>
                → Zu den Templates
              </Button>
            </div>
          )}
        </div>

        <div className="twoColumn__right">
          <div className="row row--between">
            <h3 className="pageSection__title">Custom Attributes</h3>
            <Button
              className="btn btn--icon btn--primary"
              onClick={() => setShowAddAttributeForm(!showAddAttributeForm)}
              icon={showAddAttributeForm ? <CloseIcon /> : <PlusIcon />}
            />
          </div>

          {/* Custom Attributes */}
          <h3>Maschinen Attribute (Custom)</h3>
          {showAddAttributeForm && (
            //TODO: NEUES MODAL NUTZEN
            <AddAttributeForm
              machineId={machine.id!}
              onAttributeAdded={onCustomAttributeAdded}
              onCancel={() => setShowAddAttributeForm(false)}
            />
          )}
          {customAttributes && customAttributes.length > 0 ? (
            <div className="scroll-container">
              {customAttributes.map((attribute) => (
                <div key={attribute.id} className="flex-scrollable">
                  <MachineAttributeCard
                    key={attribute.id}
                    attribute={attribute}
                    editable={attribute.id === editingCustomAttributeId}
                    onEditClick={() =>
                      setEditingCustomAttributeId(attribute.id)
                    }
                    onSave={(updated) => {
                      onCustomAttributeEdited(updated);
                      setEditingCustomAttributeId(null);
                    }}
                    onCancel={() => setEditingCustomAttributeId(null)}
                    onDelete={() => {
                      handleRemoveAttribute(attribute.id);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              ❗ Keine aktuellen Attribute vorhanden
            </p>
          )}
        </div>
      </div>
      <div className="mt-auto container container--narrow stack stack--md">
        <div className=" row row--center">
          <Button
            className="btn btn--primary btn--fixed"
            to={`/machines/${machine.id}/values`}
          >
            → Zu den Werten
          </Button>
        </div>
      </div>
    </div>
  );
}
