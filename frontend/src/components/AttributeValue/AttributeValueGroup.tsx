"use client";
import React from "react";
import { AttributeValue } from "@/types/AttributeValue";
import AddAttributeValueForm from "./AddAttributeValueForm";
import AttributeValueList from "./AttributeValueList";

interface Props {
  machineAttributeId: number;
  attributeValues: AttributeValue[];
  onValueAdded: (newValue: AttributeValue) => void;
}

export default function AttributeValueGroup({
  machineAttributeId,
  attributeValues,
  onValueAdded,
}: Props) {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <AttributeValueList values={attributeValues} />
      <AddAttributeValueForm
        machineAttributeId={machineAttributeId}
        onValueAdded={onValueAdded}
      />
    </div>
  );
}
