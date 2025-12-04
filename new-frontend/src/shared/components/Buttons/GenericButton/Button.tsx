// components/Button.tsx
import React from "react";
import { Link } from "react-router-dom";

type Props = (
  | ({ to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>)
) & { className?: string };

export default function Button({ className, ...props }: Props) {
  const combinedClassName = className 
    ? `btn ${className}` 
    : "btn";

  if ("to" in props) {
    return (
      <Link to={props.to} className={combinedClassName}>
        {props.children}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={combinedClassName}>
      {props.children}
    </button>
  );
}
