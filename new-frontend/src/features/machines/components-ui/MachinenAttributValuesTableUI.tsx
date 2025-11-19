import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowModel,
  useGridApiContext,
  GridRenderEditCellParams,
  GridValueFormatter,
  GridCellParams,
} from "@mui/x-data-grid";
import { TextField, Checkbox, MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

// ---- Types aus deinem Projekt ----
import { MachineAttribute } from "../types/machine.types";

interface Props {
  attributes: MachineAttribute[];
  onAttributeValueAdded: (
    attributeId: number,
    attributeValue: string,
    year: number
  ) => void;
  onPruefungsIntervallChanged: (
    attributeId: number,
    pruefungsIntervall: number
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
  onPruefungsIntervallChanged,
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
        pruefungsIntervall: attr.pruefungsIntervall,
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

  //PrüfunsIntervall Code
  const intervallOptions = [
    { label: "1 Monat", value: 30 },
    { label: "2 Monate", value: 60 },
    { label: "3 Monate", value: 90 },
    { label: "4 Monate", value: 120 },
    { label: "6 Monate", value: 180 },
    { label: "1 Jahr", value: 365 },
    { label: "2 Jahre", value: 730 },
  ];

  function IntervallEditCell(params: GridRenderEditCellParams) {
    const apiRef = useGridApiContext();
    const { id, field, value } = params;

    const handleChange = (event: SelectChangeEvent<any>) => {
      const newValue = event.target.value;
      apiRef.current.setEditCellValue({ id, field, value: newValue }, event);
    };

    return (
      <Select
        value={value ?? ""}
        onChange={handleChange}
        autoFocus
        variant="standard"
        fullWidth
      >
        {intervallOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }

  // Spalten
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "attributeName",
        headerName: "Attributname",
        flex: 1,
        minWidth: 400,
        editable: false,
      },
      {
        field: "attributeType",
        headerName: "Typ",
        width: 120,
        editable: false,
      },
      {
        field: "pruefungsIntervall",
        headerName: "Prüfungsintervall",
        width: 120,
        editable: true,
        renderEditCell: (params) => <IntervallEditCell {...params} />,
        valueFormatter: (params: GridCellParams) => {
          const match = intervallOptions.find(
            (opt) => opt.value === params.value
          );
          return match ? match.label : params.value;
        },
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

    const id = newRow.id as number;

    // Nur echte Jahresfelder berücksichtigen
    if (/^\d{4}$/.test(changedField)) {
      const year = parseInt(changedField, 10);
      let value = newRow[changedField];

      // Wert konsistent als STRING an den Callback geben
      if (typeof value === "boolean") value = value ? "true" : "false";
      else if (typeof value === "number") value = String(value);
      else if (value == null) value = ""; // leeres Feld

      // Optimistisch UI updaten
      setRows((prev: GridRowsProp) =>
        prev.map((r: GridRowModel) => (r.id === id ? newRow : r))
      );

      // Presenter/API anstoßen
      onAttributeValueAdded(id, value as string, year);

      return newRow;
    }
    // ✅ Behandlung für pruefungsIntervall
    if (changedField === "pruefungsIntervall") {
      // Hier müsstest du ggf. einen eigenen Callback anbieten, z.B. `onPruefungsIntervallChanged`
      console.log(
        `Prüfungsintervall geändert für Attribut-ID ${id}:`,
        newRow[changedField]
      );
      setRows((prev: GridRowsProp) =>
        prev.map((r: GridRowModel) => (r.id === id ? newRow : r))
      );

      //backend call to update pruefungsIntervall
      onPruefungsIntervallChanged(id, newRow[changedField]);

      return newRow;
    }

    return newRow;
  };

    console.log("MachineAttributeValuesTableUI attributes: ",attributes)


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
