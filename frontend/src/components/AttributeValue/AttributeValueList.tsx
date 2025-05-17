"use client";
import React from "react";
import { AttributeValue } from "@/types/AttributeValue";

interface Props {
  values: AttributeValue[];
}

export default function AttributeValueList({ values }: Props) {
  if (!values.length)
    return <div style={{ fontStyle: "italic" }}>Keine Werte vorhanden.</div>;

  return (
    <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
      {values.map((val) => (
        <li key={val.id}>
          {val.attributeValueYear}: <strong>{val.attributeValue}</strong>
        </li>
      ))}
    </ul>
  );
}
