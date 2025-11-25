import style from "./SaveButton.module.css";

interface SaveButtonProps {
    onClick: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
}

export function SaveButton({ onClick, children, disabled }: SaveButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={style.saveButton}
            title="Speichern"
            disabled={disabled}
        >
            {children || "Speichern"}
        </button>
    );
}