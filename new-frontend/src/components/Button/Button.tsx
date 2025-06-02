// components/Button.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Button.css"; // Wichtig!

type Props =
  | ({ to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export default function Button(props: Props) {
  const className = "button";

  if ("to" in props) {
    return (
      <Link to={props.to} className={className}>
        {props.children}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={className}>
      {props.children}
    </button>
  );
}
