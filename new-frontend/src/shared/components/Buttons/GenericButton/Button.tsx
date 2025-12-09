import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = (
  | ({ to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>)
) & {
  className?: string;
  icon?: ReactNode; // SVG oder Icon-Component
  iconPosition?: "left" | "right"; // Standard: left
};

export default function Button({
  className,
  icon,
  iconPosition = "left",
  ...props
}: Props) {
  const combinedClassName = className ? `btn ${className}` : "btn";

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {props.children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if ("to" in props) {
    return (
      <Link to={props.to} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={combinedClassName}>
      {content}
    </button>
  );
}
