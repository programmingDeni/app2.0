import style from "./Buttons.module.css"

interface CancelButtonProps {
    onClick: () => void;
    children?: React.ReactNode;
}

export function CancelButton({ onClick, children }: CancelButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={style.cancelButton}
            title="Abbrechen"
        >
            {children || "Abbrechen"}
        </button>
    );
}