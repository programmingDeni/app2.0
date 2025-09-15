import react, { useState } from "react";
import { Machine } from "../../types/machine.types";
import Button from "@/components/Button";

interface Props {
  machines: Machine[];
  checked: { [machineId: number]: boolean };
  setChecked: React.Dispatch<
    React.SetStateAction<{ [machineId: number]: boolean }>
  >;
}

export default function GroupedMachineListByTemplate({
  machines,
  checked,
  setChecked,
}: Props) {
  // Alle Templates extrahieren und eindeutige Templates bestimmen
  const uniqueTemplates = Array.from(
    new Map(
      machines
        .filter((m) => m.machineTemplate)
        .map((m) => [m.machineTemplate.id, m.machineTemplate])
    ).values()
  );

  // Maschinen nach Template-ID gruppieren
  const grouped = uniqueTemplates.map((template) => ({
    template,
    machines: machines.filter((m) => m.machineTemplate?.id === template.id),
  }));

  const handleCheckboxChange = (machineId: number) => {
    setChecked((prev) => ({
      ...prev,
      [machineId]: !prev[machineId],
    }));
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {grouped.map((group) => (
        <div key={group.template.id} style={{ marginBottom: "2rem" }}>
          <h3>Template: {group.template.templateName}</h3>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginBottom: "1rem",
              background: "#343434ff",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Aktiv
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Maschinenname
                </th>
                {group.template.templateAttributes?.map((attr) => (
                  <th
                    key={attr.id}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {attr.templateAttributeName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.machines.map((machine) => (
                <tr key={machine.id}>
                  <td style={{ border: "1px solid #ccc", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={!!checked[machine.id!]}
                      onChange={() => handleCheckboxChange(machine.id!)}
                    />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {machine.machineName}
                  </td>
                  {group.template.templateAttributes?.map((attr) => {
                    const value = machine.attributes?.find(
                      (a) => a.attributeName === attr.templateAttributeName
                    );
                    return (
                      <td
                        key={attr.id}
                        style={{ border: "1px solid #ccc", padding: "8px" }}
                      >
                        {value
                          ? value.attributeValues
                              ?.map((v) => v.attributeValue)
                              .join(", ")
                          : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
