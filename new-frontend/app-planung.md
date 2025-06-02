# ✨ Frontend Views & API-Routen Mapping

Dieses Dokument beschreibt die geplanten Views der Benutzeroberfläche sowie die zugehörigen Backend-API-Endpunkte und erwarteten DTOs.

---

## 1. MachineStructureView

### Zweck:

Anzeige und Bearbeitung der Struktur einer Maschine, d. h. ihres Namens, Templates und MachineAttributes (Name + Typ).

### Verwendete API-Routen:

- `GET    /machines/{machineId}`
  → Gibt MachineStructureDto zurück (Name, Template, Attribute) OHNE Values

- `PATCH  /machines/{machineId}/template`
  → Zuweisung oder Entfernung eines Templates

- `GET    /machine-attributes/by-machine/{machineId}`
  → Gibt alle aktuellen MachineAttributes zurück

- `POST   /machine-attributes`
  → Fügt ein neues MachineAttribute hinzu

- `DELETE /machine-attributes/{id}`
  → Löscht ein einzelnes MachineAttribute

### Erwartete DTOs:

```ts
MachineStructureDto {
  machineId: number;
  name: string;
  machineTemplateId: number | null;
  machineAttributes: MachineAttributeDto[];
}

MachineAttributeDto {
  id: number;
  attributeName: string;
  type: AttributeType;
}
```

---

## 2. AttributeValuesTable

### Zweck:

Bearbeitung von Attributwerten für eine Maschine über ein ganzes Jahr. Jedes Attribut kann mehrere Werte (z. B. zeitbasiert) besitzen.

### Verwendete API-Routen:

- `GET  /machine-attribute-values/by-machine/{machineId}`
  → Gibt alle Attribute einer Maschine mit deren Werten zurück

- `POST /attribute-values/bulk`
  → Massenhaftes Hinzufügen/Updaten von Werten für mehrere Attribute

### Erwartete DTOs:

```ts
MachineAttributeWithValuesDto {
  id: number;
  attributeName: string;
  type: AttributeType;
  attributeValues: AttributeValueDto[];
}

AttributeValueDto {
  id: number;
  year: number;
  value: string;
}
```

---

## 3. MachineTemplateOverview

### Zweck:

Übersicht über alle bestehenden MachineTemplates und Anlegen neuer Templates.

### Verwendete API-Routen:

- `GET  /machine-templates`
- `POST /machine-templates`

### Erwartete DTOs:

```ts
MachineTemplateDto {
  id: number;
  templateName: string;
}
```

---

## 4. MachineTemplateForm

### Zweck:

Bearbeiten eines spezifischen MachineTemplates (z. B. Name ändern)

### Verwendete API-Routen:

- `GET    /machine-templates/{id}`
- `PUT    /machine-templates/{id}`
- `DELETE /machine-templates/{id}`

---

## 5. AttributeTemplateForm

### Zweck:

Bearbeitung der AttributeInTemplate eines MachineTemplates

### Verwendete API-Routen:

- `GET    /attribute-templates/by-template/{machineTemplateId}`
  → List<AttributeTemplateDto>
- `GET    /attribute-templates/{id}`
- `PUT    /attribute-templates/{id}`
- `POST   /attribute-templates`
- `DELETE /attribute-templates/{id}`

### Erwartete DTOs:

```ts
AttributeTemplateDto {
  id: number;
  attributeInTemplateName: string;
  attributeInTemplateType: AttributeType;
  machineTemplateId: number;
}
```

---

## 📀 Gemeinsame Enums

```ts
enum AttributeType {
  STRING,
  INTEGER,
  FLOAT,
  BOOLEAN,
}
```

---

## 📌 Hinweise:

- Keine globale Route `/machine-attributes` nötig.
- Jede View hat genau die Routen, die sie braucht.
- Struktur- und Werte-Daten sind klar getrennt.
