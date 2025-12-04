import React, { useState } from "react";

import Button from "@/shared/components/Buttons/GenericButton";

// für excel export
import * as XLSX from "xlsx";
//für pdf export
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useTemplates } from "@/features/templates/query/useTemplateQueries";
import { useMachines } from "../../../features/machines/query/useMachineQueries";

import GroupedMachineListByTemplate from "../../../features/machines/components-ui/GroupedMachineListByTemplate";
import { Machine } from "../../../shared/types/machine.types";

export default function PrintMachinesView() {
  const { data: templates = [], isLoading, isError } = useTemplates();
  const {
    data: machines = [],
    isLoading: isLoadingMachines,
    isError: isErrorMachines,
  } = useMachines();

  const [checked, setChecked] = useState<{ [machineId: number]: boolean }>(() =>
    Object.fromEntries(machines.map((m) => [m.id!, true]))
  );

  // group machines by tempalte
  //TODO: custom attributes werden noch nicht gedruckt,
  //TODO: export funktionen evtl in utils ausgliedern
  function groupMachinesByTemplate(machines: Machine[]) {
    const uniqueTemplates = Array.from(
      new Map(
        machines
          .filter((m) => m.machineTemplate)
          .map((m) => [m.machineTemplate.id, m.machineTemplate])
      ).values()
    );

    return uniqueTemplates.map((template) => ({
      template,
      machines: machines.filter((m) => m.machineTemplate?.id === template.id),
    }));
  }

  const exportMachinesToPdf = () => {
    const grouped = groupMachinesByTemplate(selectMachines());
    const doc = new jsPDF();

    if (grouped.length === 0) {
      alert("Keine Maschinen ausgewählt oder keine Daten zum Exportieren.");
      return;
    }

    grouped.forEach((group, idx) => {
      if (idx > 0) doc.addPage();

      // Alle Jahre sammeln (über alle Maschinen und Attribute)
      const years = Array.from(
        new Set(
          group.machines.flatMap((m) =>
            (m.attributes || []).flatMap((attr) =>
              (attr.attributeValues || []).map((v) => v.attributeValueYear)
            )
          )
        )
      ).sort();

      // Spalten bauen: Maschinenname, dann für jedes Jahr alle Attribute
      const columns = [
        "Maschinenname",
        ...years.flatMap((year) =>
          (group.template.templateAttributes || []).map(
            (attr) => `${attr.templateAttributeName} (${year})`
          )
        ),
      ];

      // 1. Template-Name-Zeile
      doc.setFontSize(14);
      doc.text(`Template: ${group.template.templateName}`, 10, 15);

      // 2. Zeilen bauen
      const body = group.machines.map((m) => {
        const row: any[] = [m.machineName];
        years.forEach((year) => {
          (group.template.templateAttributes || []).forEach((attr) => {
            const machineAttr = m.attributes?.find(
              (a) => a.attributeName === attr.templateAttributeName
            );
            const value = machineAttr?.attributeValues?.find(
              (v) => v.attributeValueYear === year
            );
            row.push(value ? value.attributeValue : "");
          });
        });
        return row;
      });

      // 3. Tabelle erzeugen
      autoTable(doc, {
        head: [columns],
        body,
        startY: 22,
        styles: { fontSize: 10 },
      });
    });

    doc.save("maschinen.pdf");
  };

  const exportMachinesToExcel = () => {
    const grouped = groupMachinesByTemplate(selectMachines());
    const workbook = XLSX.utils.book_new();

    console.log("machines", machines);
    console.log("checked", checked);
    console.log("grouped", grouped);

    if (grouped.length === 0) {
      alert("Keine Maschinen ausgewählt oder keine Daten zum Exportieren.");
      return;
    }

    grouped.forEach((group) => {
      // Alle Jahre sammeln (über alle Maschinen und Attribute)
      const years = Array.from(
        new Set(
          group.machines.flatMap((m) =>
            (m.attributes || []).flatMap((attr) =>
              (attr.attributeValues || []).map((v) => v.attributeValueYear)
            )
          )
        )
      ).sort();

      // Spalten bauen: Maschinenname, dann für jedes Attribut+Jahr eine Spalte
      const columns = [
        "Maschinenname",
        ...years.flatMap((year) =>
          (group.template.templateAttributes || []).map(
            (attr) => `${attr.templateAttributeName} (${year})`
          )
        ),
      ];

      // 1. Template-Name-Zeile bauen
      const templateNameRow: { [key: string]: string } = {
        Maschinenname: `Template: ${group.template.templateName}`,
      };
      columns.slice(1).forEach((col) => {
        templateNameRow[col] = "";
      });

      // 2. Zeilen bauen wie gehabt
      const rows = group.machines.map((m) => {
        const row: any = {
          Maschinenname: m.machineName,
        };
        years.forEach((year) => {
          (group.template.templateAttributes || []).forEach((attr) => {
            const machineAttr = m.attributes?.find(
              (a) => a.attributeName === attr.templateAttributeName
            );
            const value = machineAttr?.attributeValues?.find(
              (v) => v.attributeValueYear === year
            );
            row[`${attr.templateAttributeName} (${year})`] = value
              ? value.attributeValue
              : "";
          });
        });
        return row;
      });

      // 3. Template-Name-Zeile und Maschinenzeilen zusammenführen
      const allRows = [templateNameRow, ...rows];

      const worksheet = XLSX.utils.json_to_sheet(allRows, { header: columns });
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        group.template.templateName || "Template"
      );
    });

    XLSX.writeFile(workbook, "maschinen.xlsx");
  };

  const selectMachines = (): Machine[] => {
    console.log("checked", checked);
    return machines.filter((m) => checked[m.id!]);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <h3>PrintMachinesView</h3>
      <GroupedMachineListByTemplate
        machines={machines}
        checked={checked}
        setChecked={setChecked}
      />
      <Button onClick={() => exportMachinesToPdf()}>Print PDF</Button>
      <Button onClick={() => exportMachinesToExcel()}>Print Excel</Button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button to="/machine-templates">→ Zu den Machine Templates</Button>
        <Button to="/">→ Zurück zur Startseite</Button>
      </div>
    </div>
  );
}
