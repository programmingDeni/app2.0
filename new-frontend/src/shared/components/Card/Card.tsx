import Button from "../Buttons/GenericButton";

interface Props<T extends {id?: number}>{
    specificCardImplementation: React.ReactNode,
    showActions?: boolean,
    editPagePath?: string,
    onDelete?: (id: number) => void,
}

export function Card<T extends {id?: number}>(props: Props<T>){
    const {specificCardImplementation, showActions, editPagePath, onDelete} = props;

    //display card specific content here
    return(
        <div className="card">
            {specificCardImplementation}
            {showActions && (
                <div className="card-actions">
                    {editPagePath && <Button to={editPagePath}/>}
                    {onDelete && <Button onClick={() => onDelete}>Delete</Button>}
                </div>
            )}
        </div>
    )
}