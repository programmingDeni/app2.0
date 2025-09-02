// bekommt eine Liste von templates und zeiogt sie an

//Button import
import Button from "@/components/Button";

//Type
import { Template } from "../../types/template.types";

interface Props {
  template: Template;
}

export default function TemplateCardLazyList({ template }: Props) {
  return (
    <div>
      <div>
        <h3> Template Name {template.templateName} </h3>
        <h4> Attribute Templates: </h4>
        {template.templateAttributes &&
        template.templateAttributes.length > 0 ? (
          template.templateAttributes.slice(0, 3).map((attr) => (
            <div key={attr.id}>
              Attribut Name {attr.templateAttributeName}, Attribut Typ{" "}
              {attr.templateAttributeType}
            </div>
          ))
        ) : (
          <div>Keine Attribute vorhanden</div>
        )}
      </div>
    </div>
  );
}
