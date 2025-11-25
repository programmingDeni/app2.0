import MachineAttributeCard from "../../components-ui/MachineAttributeCard";
import { MachineAttribute } from "../../../../shared/types/machine.types";

interface Props{
    machineAttributes: MachineAttribute[];
    allowEdit?: boolean;
    onDelete?: (machineAttributeId: number) => void;
}

export function MachineAttributeListUI(props: Props){
    const {machineAttributes, allowEdit, onDelete} = props;
    return (
        <div>
            {machineAttributes.map((machineAttribute)=>
                <div key={machineAttribute.id}>
                    <MachineAttributeCard attribute={machineAttribute} editable={false}/>
                </div>
            )}
        </div>
    )
}