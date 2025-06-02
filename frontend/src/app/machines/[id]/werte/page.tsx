"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { MachineAttribute } from "@/types/machineAttribute";
import { AttributeValue } from "@/types/AttributeValue";
import { useMachineAttributesByMachineId } from "@/hook/useMachineAttributeByMachineId";

export default function WertePage() {
  const { id } = useParams();
  const stringId = parseInt(id as string);
  const { attributes } = useMachineAttributesByMachineId(stringId);
  const [years, setYears] = useState<number[]>([]);

  //TODO: hier eine performante page die das effiziente eintragfen der werte erlaubt, wsl in tabellen form

  return (
    <div>
      <h1>Werte für Maschine {id}</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              Attribut
            </th>
            {years.map((year) => (
              <th
                key={year}
                style={{ border: "1px solid #ccc", padding: "0.5rem" }}
              >
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributes.map((attr) => (
            <tr key={attr.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                {attr.attributeName}
              </td>
              {years.map((year) => {
                const value = attr.attributeValues.find(
                  (val) => val.attributeValueYear === year
                );
                return (
                  <td
                    key={year}
                    style={{
                      border: "1px solid #ccc",
                      padding: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    {value ? value.attributeValue : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
