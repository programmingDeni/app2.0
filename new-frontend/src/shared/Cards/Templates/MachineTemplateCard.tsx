import cardsStyle from "./Cards.module.css"

interface MachineTemplateCardProps{
    machineTemplateName: string
}

export function MachineTemplateCard({machineTemplateName}: MachineTemplateCardProps){
    return(
        <div className={cardsStyle.name}>{machineTemplateName}</div>
    )
}