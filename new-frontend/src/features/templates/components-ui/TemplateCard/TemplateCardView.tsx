//importiere die UI
import TemplateCardUi from "./TemplateCardUI";

//importiere den presenter
import useTemplateCardPresenter from "./useMachineTemplateCard";

export default function TemplateCardView() {
  const { machineTemplates } = useTemplateCardPresenter();

  return (
    <div>
      {/* hier muss der presenter ausgeführt werden und die machineTemplates ausgegeben werden*/}
      {machineTemplates.map((machineTemplate) => (
        <TemplateCardUi
          key={machineTemplate.id}
          machineTemplate={machineTemplate}
        />
      ))}
    </div>
  );
}
