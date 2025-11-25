import { Machine } from "../../types/machine.types";
import cardsStyle from "./Cards.module.css"

interface MachineCardProps{
    machine: Machine,
}

export function MachineCard({machine}: MachineCardProps){
    return(
        <div className = {cardsStyle.machineCard}>
            <div className ={cardsStyle.name}>{machine.machineName}</div>
            <div className={cardsStyle.templateNameInMachine}>{machine.machineTemplate.templateName}</div>
        </div>
    )
}