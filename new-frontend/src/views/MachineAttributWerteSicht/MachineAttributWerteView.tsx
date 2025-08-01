import { useMachineWithAttributeValues } from "@/presenters/useMachineWithAttributeValues";
import { useParams } from "react-router-dom";
import { useMachineStructure } from "@/presenters/useMachineStructure";

export default function MachineAttributWerteView() {
  const { id } = useParams<{ id: string }>();
  const machineId = id ? parseInt(id, 10) : null;

  if (machineId === null || isNaN(machineId)) {
    return <div>Ungültige Maschinen-ID</div>;
  }

  const { machineStructure, refetch } = useMachineStructure(machineId);

  if (!machineStructure) return <div>Keine Daten</div>;

  const allYears = Array.from(
    new Set(
      machineStructure.machineAttributes.flatMap((attr) =>
        attr.attributeValues.map((val) => val.attributeValueYear)
      )
    )
  ).sort();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Maschinenattribute für Maschine #{machineId}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Attribut</th>
            {allYears.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {machineStructure.machineAttributes.map((attr) => (
            <tr key={attr.id}>
              <td>{attr.attributeName}</td>
              {allYears.map((year) => {
                const value = attr.attributeValues.find(
                  (val) => val.attributeValueYear === year
                );
                return <td key={year}>{value ? value.attributeValue : "–"}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
