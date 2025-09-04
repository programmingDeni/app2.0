// src/components/ToggleableSection.tsx
import { ReactNode } from "react";
import Button from "../Button";

type Props = {
  toggleLabel: string;
  toggleLabelActive?: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function ToggleableSection({
  toggleLabel,
  toggleLabelActive,
  children,
  open,
  onClose,
  onOpen,
}: Props) {
  const handleToggle = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleToggle}>
        {open ? toggleLabelActive ?? "Schließen" : toggleLabel}
      </Button>
      {open && <div>{children}</div>}
    </div>
  );
}
