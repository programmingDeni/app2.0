// src/components/ToggleableSection.tsx
import { ReactNode, useState } from "react";
import Button from "../Button";

type Props = {
  toggleLabel: string;
  toggleLabelActive?: string;
  children: ReactNode;
};

export default function ToggleableSection({
  toggleLabel,
  toggleLabelActive,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="space-y-2">
      <Button onClick={toggle}>
        {open ? toggleLabelActive ?? "Schließen" : toggleLabel}
      </Button>
      {open && <div>{children}</div>}
    </div>
  );
}
