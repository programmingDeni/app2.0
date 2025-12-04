// src/components/ToggleableSection.tsx
import { ReactNode } from "react";
import Button from "../Buttons/GenericButton";

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
  <div className="container container--narrow mt-auto stack stack--md">
    <div className="flex-center">
      <Button className="btn btn--primary" onClick={handleToggle}>
        {open ? toggleLabelActive ?? "Schließen" : toggleLabel}
      </Button>
    </div>
    {open && <>{children}</>}
  </div>
);
}
