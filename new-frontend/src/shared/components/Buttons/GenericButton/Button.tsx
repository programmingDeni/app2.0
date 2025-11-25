// components/Button.tsx
import React from "react";
import { Link } from "react-router-dom";
import style from "./GenericButton.module.css"; // Wichtig!

type Props =
  | ({ to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export default function Button(props: Props) {
  if ("to" in props) {
    return (
      <Link to={props.to} className={style.button}>
        {props.children}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={style.button}>
      {props.children}
    </button>
  );
}
