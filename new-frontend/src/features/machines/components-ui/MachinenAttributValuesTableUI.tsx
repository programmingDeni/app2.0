import { useEffect, useState } from "react";
import { MachineAttribute, AttributeValue } from "../types/machine.types";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface Props {
  attributes: MachineAttribute[];
  onAttributeValueAdded: (
    attributeId: number,
    attributeValue: string,
    year: number
  ) => void;
}

export default function MachinenAttributValuesTableUI({
  attributes,
  onAttributeValueAdded,
}: Props) {
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    //Jahre holen
    const uniqueYears = Array.from(
      new Set(
        attributes.flatMap((attr) =>
          attr.attributeValues.map((value) =>
            value.attributeValueYear.toString()
          )
        )
      )
    ).sort();

    setYears(uniqueYears);
  }, [attributes]);

  // Button zum Hinzufügen eines Jahres
  const addYear = (newYear: string) => {
    if (!years.includes(newYear)) {
      setYears((prev) => [...prev, newYear]);
    }
  };
  //Jahrspalte hinzufüügen können
  const addColumn: GridColDef = {
    field: "addYear",
    headerName: "+ Jahr",
    width: 100,
    sortable: false,
    filterable: false,
    renderHeader: () => (
      <button
        style={{ fontWeight: "bold", cursor: "pointer" }}
        onClick={() => {
          const year = prompt("Neues Jahr eingeben (z. B. 2026):");
          if (year && /^\d{4}$/.test(year) && !years.includes(year)) {
            setYears((prev) => [...prev, year]);
          } else {
            alert("Ungültiges oder bereits vorhandenes Jahr.");
          }
        }}
      >
        ＋
      </button>
    ),
    renderCell: () => null, // Inhalt der Zellen leer lassen
  };

  //Spalten definieren
  const columns: GridColDef[] = [
    {
      field: "attributeName",
      headerName: "Attributname",
      width: 200,
      editable: false,
    },
    { field: "attributeType", headerName: "Typ", width: 100, editable: false },
    ...years.map((year) => ({
      field: year,
      headerName: year,
      width: 100,
      editable: true,
    })),
    addColumn,
  ];

  //Zeilen definieren
  const rows: GridRowsProp = attributes.map((attr) => {
    const row: any = {
      id: attr.id,
      attributeName: attr.attributeName,
      attributeType: attr.attributeType,
    };
    attr.attributeValues.forEach((value) => {
      row[value.attributeValueYear] = value.attributeValue;
    });
    return row;
  });

  //werteäönderung
  const handleEdit = (newRow: any, oldRow: any) => {
    const id = newRow.id;

    // Vergleich: welche Spalte wurde geändert
    const changedField = Object.keys(newRow).find(
      (key) => newRow[key] !== oldRow[key]
    );

    if (!changedField) return newRow;

    const year = parseInt(changedField);
    const value = newRow[changedField];

    console.log(
      `Wert für Attribut ID ${id}, Jahr ${year} wurde geändert zu: ${value}`
    );

    //Api Call, hier ueber View => Presenter
    onAttributeValueAdded(id, value, year);

    // ➕ Hier kannst du API call oder State update machen

    return newRow; // wichtig: immer zurückgeben!
  };

  return (
    <div>
      <h2>Maschinen-Attributwerte</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        processRowUpdate={(newRow, oldRow) => handleEdit(newRow, oldRow)}
      />
    </div>
  );
}
