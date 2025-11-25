import { MachineAttribute } from "../../types/machine.types";
import cardsStyle from "./Cards.module.css"

interface MachineAttributeCardProps{
    attribute: MachineAttribute,
}

export function MachineAttributeCard({attribute}:MachineAttributeCardProps){
    return(
        <div className={cardsStyle.machineAttributeCard}>
            <div className={cardsStyle.name}>{attribute.attributeName}</div>
            <div className={cardsStyle.attributeType}>{attribute.attributeType}</div>
        </div>
    )
}