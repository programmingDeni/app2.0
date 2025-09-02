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
        {template.attributes && template.attributes.length > 0 ? (
          template.attributes.slice(0, 3).map((attr) => (
            <div key={attr.id}>
              Attribut Name {attr.attributeName}, Attribut Typ{" "}
              {attr.attributeType}
            </div>
          ))
        ) : (
          <div>Keine Attribute vorhanden</div>
        )}
      </div>
    </div>
  );
}
