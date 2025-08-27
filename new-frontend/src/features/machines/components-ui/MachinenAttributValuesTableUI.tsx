import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowModel,
  useGridApiContext,
  GridRenderEditCellParams,
  GridValueFormatter,
} from "@mui/x-data-grid";
import { TextField, Checkbox } from "@mui/material";

// ---- Types aus deinem Projekt ----
import { MachineAttribute } from "../types/machine.types";

interface Props {
  attributes: MachineAttribute[];
  onAttributeValueAdded: (
    attributeId: number,
    attributeValue: string,
    year: number
  ) => void;
}

/**
 * Edit-Cell für Jahres-Spalten.
 * Entscheidet anhand von row.attributeType, welcher Editor gerendert wird:
 * - BOOLEAN: Checkbox
 * - INTEGER/FLOAT: Number-TextField
 * - STRING: normales TextField
 */
function YearEditCell(params: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();

  // Welcher Feldname (ist das Jahr als string) wird gerade editiert?
  const { id, field, value, row } = params;

  // Attributtyp der Zeile (STRING | INTEGER | FLOAT | BOOLEAN)
  const attrType = row?.attributeType as string;

  const setValue = (v: any) => {
    apiRef.current.setEditCellValue({ id, field, value: v }, event);
  };

  if (attrType === "BOOLEAN") {
    const checked = value === true || value === "true";
    return (
      <Checkbox
        checked={!!checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.checked)
        }
        autoFocus
      />
    );
  }

  if (attrType === "INTEGER") {
    return (
      <TextField
        type="number"
        value={value ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          // Nur Ganzzahlen erlauben (leerer Wert bleibt "")
          const raw = e.target.value;
          if (raw === "") setValue("");
          else {
            const parsed = Number.parseInt(raw, 10);
            if (!Number.isNaN(parsed)) setValue(parsed);
          }
        }}
        autoFocus
        fullWidth
        size="small"
        variant="standard"
        inputProps={{ step: 1 }}
      />
    );
  }

  if (attrType === "FLOAT") {
    return (
      <TextField
        type="number"
        value={value ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value;
          if (raw === "") setValue("");
          else {
            const parsed = Number.parseFloat(raw);
            if (!Number.isNaN(parsed)) setValue(parsed);
          }
        }}
        autoFocus
        fullWidth
        size="small"
        variant="standard"
      />
    );
  }

  // Default: STRING
  return (
    <TextField
      value={value ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)
      }
      autoFocus
      fullWidth
      size="small"
      variant="standard"
    />
  );
}

export default function MachinenAttributValuesTableUI({
  attributes,
  onAttributeValueAdded,
}: Props) {
  const [years, setYears] = useState<string[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);

  // Jahre aus Props holen
  useEffect(() => {
    const uniqueYears = Array.from(
      new Set(
        attributes.flatMap((attr) =>
          attr.attributeValues.map((v) => v.attributeValueYear.toString())
        )
      )
    ).sort();
    setYears(uniqueYears);
  }, [attributes]);

  // Rows aus Props ableiten (wenn attributes neu kommen)
  useEffect(() => {
    const next: GridRowsProp = attributes.map((attr) => {
      const row: any = {
        id: attr.id,
        attributeName: attr.attributeName,
        attributeType: attr.attributeType, // wichtig für YearEditCell
      };
      attr.attributeValues.forEach((v) => {
        row[v.attributeValueYear] = v.attributeValue;
      });
      return row;
    });
    setRows(next);
  }, [attributes]);

  // + Jahr Button
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
            // Leere Werte für neue Spalte in allen Rows setzen
            setRows((prev: GridRowsProp) =>
              prev.map((r: GridRowModel) => ({ ...r, [year]: r[year] ?? "" }))
            );
          } else {
            alert("Ungültiges oder bereits vorhandenes Jahr.");
          }
        }}
      >
        ＋
      </button>
    ),
  };

  // Für Anzeige (z. B. Boolean hübscher anzeigen)
  const boolFormatter: GridValueFormatter<any, any> = (value, row) => {
    const t = (row as any)?.attributeType as string;
    if (t === "BOOLEAN") return value === true || value === "true" ? "✓" : "✗";
    return value ?? "";
  };

  // Spalten
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "attributeName",
        headerName: "Attributname",
        width: 220,
        editable: false,
      },
      {
        field: "attributeType",
        headerName: "Typ",
        width: 120,
        editable: false,
      },
      ...years.map((year) => ({
        field: year,
        headerName: year,
        width: 140,
        editable: true,
        // Für Anzeige (z. B. Boolean hübscher anzeigen)
        valueFormatter: boolFormatter,
        // Für das Editieren je nach Typ die passende Zelle
        renderEditCell: (p: GridRenderEditCellParams) => (
          <YearEditCell {...p} />
        ),
      })),
      addColumn,
    ],
    [years]
  );

  // Edits verarbeiten (optimistisch + Callback)
  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const changedField = Object.keys(newRow).find(
      (k) => newRow[k] !== oldRow[k]
    );
    if (!changedField) return newRow;

    // Nur echte Jahresfelder berücksichtigen
    if (!/^\d{4}$/.test(changedField)) return newRow;

    const year = parseInt(changedField, 10);
    let value = newRow[changedField];

    // Wert konsistent als STRING an den Callback geben
    if (typeof value === "boolean") value = value ? "true" : "false";
    else if (typeof value === "number") value = String(value);
    else if (value == null) value = ""; // leeres Feld

    const id = newRow.id as number;

    // Optimistisch UI updaten
    setRows((prev: GridRowsProp) =>
      prev.map((r: GridRowModel) => (r.id === id ? newRow : r))
    );

    // Presenter/API anstoßen
    onAttributeValueAdded(id, value as string, year);

    return newRow;
  };

  return (
    <div>
      <h2>Maschinen-Attributwerte</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="cell"
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(e: React.ChangeEvent<HTMLInputElement>) =>
          console.error(e)
        }
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
      />
    </div>
  );
}
