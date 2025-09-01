import { useState } from "react";
import AttributeInTemplateInput from "../MachineTemplate/AttributeInTemplateInput";
import { AttributeType } from "@/types/attributeType";
import Button from "../Button";
import { CreateAttributeInExistingTemplateDto } from "@/types/attributeTemplate";
import { useAttributeTemplates } from "@/presenters/useAttributeTemplates";

interface Props {
  templateId: number;
}

export default function AddAttributeTemplateForm({ templateId }: Props) {
  const [attributeTemplateName, setAttributeTemplateName] = useState("");
  const [attributeTemplateType, setAttributeTemplateType] = useState(
    "STRING" as AttributeType
  );
  const { addAttributeTemplateToMachineTemplate } =
    useAttributeTemplates(templateId);

  const submitAttributeTemplate = async () => {
    const newAttr: CreateAttributeInExistingTemplateDto = {
      machineTemplateId: templateId,
      attributeTemplateName: attributeTemplateName,
      attributeTemplateType: attributeTemplateType,
    };
    await addAttributeTemplateToMachineTemplate(
      newAttr.attributeTemplateName,
      newAttr.attributeTemplateType
    );
    console.log("newAttr", newAttr);
  };

  return (
    <div>
      <AttributeInTemplateInput
        name={attributeTemplateName}
        type={attributeTemplateType}
        onChangeName={(val) => setAttributeTemplateName(val)}
        onChangeType={(val) => setAttributeTemplateType(val)}
        onDelete={() => {}}
      />
      <Button onClick={() => submitAttributeTemplate()}>
        {" "}
        Attribute hinzufügen
      </Button>
    </div>
  );
}
