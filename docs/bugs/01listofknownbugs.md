# MachineAttributeValuesView Refactoring - Implementierungs-Roadmap

## Problem
Die `MachineAttributeValuesView` hat aktuell Probleme mit der Darstellung der Attribute:
- 2 separate Queries (ineffizient)
- Template Attributes werden nicht korrekt angezeigt
- Prüfungsintervall-Änderungen können zu Datenverlust führen

## Ziel
Eine vollständige Machine-Ansicht mit:
- ✅ Eager Fetch aller Daten (Machine + Custom Attributes + Template Attributes)
- ✅ Vereinfachte UI mit einer Tabelle für alle Attribute
- ✅ Prüfungsintervall-Verwaltung ohne Datenverlust
- ✅ Wiederverwendbare Components

---

## Phase 1: Backend - Eager Fetch Endpoint

### Aufgaben:
- [ ] Neuen Endpoint in `MachineController.java` erstellen
- [ ] JOIN FETCH für machineTemplate und machineAttributes implementieren
- [ ] Testen mit Postman/curl

### Technische Details:

**Datei:** `backend/machine-management/src/main/java/com/example/machine_management/controller/machines/MachineController.java`

```java
@GetMapping("/machines/{id}/complete")
public ResponseEntity<Machine> getMachineComplete(@PathVariable Integer id) {
    // Repository Query mit JOIN FETCH:
    // SELECT m FROM Machine m
    // LEFT JOIN FETCH m.machineTemplate t
    // LEFT JOIN FETCH m.machineAttributes
    // LEFT JOIN FETCH t.templateAttributes
    // WHERE m.id = :id

    Machine machine = machineRepository.findByIdWithAllRelations(id);
    return ResponseEntity.ok(machine);
}
```

**Optional:** MachineRepository erweitern:
```java
@Query("SELECT m FROM Machine m " +
       "LEFT JOIN FETCH m.machineTemplate t " +
       "LEFT JOIN FETCH m.machineAttributes " +
       "WHERE m.id = :id")
Optional<Machine> findByIdWithAllRelations(@Param("id") Integer id);
```

### Akzeptanzkriterien:
- Endpoint gibt Machine mit allen Relationen zurück
- Keine N+1 Queries (prüfen mit Hibernate SQL logging)
- Template Attributes sind im Response enthalten

---

## Phase 2: Frontend - Service Layer

### Aufgaben:
- [ ] Neuen Service in `machineService.ts` erstellen
- [ ] Neuen Hook `useMachineComplete` in `useMachineQueries.ts` erstellen
- [ ] Bestehende Hooks NICHT ändern (keine Breaking Changes)

### Technische Details:

**Datei:** `new-frontend/src/features/machines/services/machineService.ts`

```typescript
export const fetchMachineCompleteService = async (
  machineId: number
): Promise<Machine> => {
  const response = await fetch(
    `${API_BASE_URL}/machines/${machineId}/complete`,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch machine: ${response.statusText}`);
  }

  return response.json();
};
```

**Datei:** `new-frontend/src/features/machines/query/useMachineQueries.ts`

```typescript
export function useMachineComplete(machineId: number) {
  return useQuery<Machine>({
    queryKey: ["machine-complete", machineId],
    queryFn: () => fetchMachineCompleteService(machineId),
    enabled: machineId >= 0,
    staleTime: 5 * 60 * 1000, // 5 Minuten Cache
  });
}
```

### Akzeptanzkriterien:
- Hook lädt Machine mit allen Relationen
- Cache funktioniert (zweiter Aufruf nutzt Cache)
- Loading und Error States funktionieren

---

## Phase 3: Frontend - Data Transformation

### Aufgaben:
- [ ] Neue Utility-Datei `machineAttributeUtils.ts` erstellen
- [ ] `combineAttributes` Funktion implementieren
- [ ] Type-Definitionen erweitern

### Technische Details:

**Neue Datei:** `new-frontend/src/features/machines/utils/machineAttributeUtils.ts`

```typescript
import { Machine, MachineAttribute } from "../types/machine.types";

export interface CombinedAttribute extends MachineAttribute {
  source: 'custom' | 'template';
}

/**
 * Kombiniert Custom und Template Attributes einer Machine
 * Template Attributes haben fromTemplate=true
 */
export function combineAttributes(machine: Machine): CombinedAttribute[] {
  if (!machine?.machineAttributes) return [];

  return machine.machineAttributes.map(attr => ({
    ...attr,
    source: attr.fromTemplate ? 'template' as const : 'custom' as const
  }));
}

/**
 * Berechnet das nächste Prüfungsdatum basierend auf Intervall
 */
export function calculateNextPruefung(
  zuletztGeprueft: string | undefined,
  intervallTage: number
): Date | null {
  if (!zuletztGeprueft) return null;

  const lastCheck = new Date(zuletztGeprueft);
  const nextCheck = new Date(lastCheck);
  nextCheck.setDate(nextCheck.getDate() + intervallTage);

  return nextCheck;
}
```

### Akzeptanzkriterien:
- Custom und Template Attributes werden korrekt kombiniert
- Funktion ist type-safe
- Unit Tests bestehen (optional)

---

## Phase 4: UI Component - Interval Manager

### Aufgaben:
- [ ] Neue Komponente `PruefungsIntervallManager.tsx` erstellen
- [ ] Edit-Modus mit Validation implementieren
- [ ] Nächstes Prüfungsdatum anzeigen

### Technische Details:

**Neue Datei:** `new-frontend/src/features/machines/components/PruefungsIntervallManager.tsx`

```typescript
import React, { useState } from 'react';

interface PruefungsIntervallManagerProps {
  attributeId: number;
  currentIntervall: number;
  zuletztGeprueft?: string;
  onIntervallChange: (attributeId: number, newIntervall: number) => void;
}

export function PruefungsIntervallManager({
  attributeId,
  currentIntervall,
  zuletztGeprueft,
  onIntervallChange,
}: PruefungsIntervallManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentIntervall);

  const nextPruefung = calculateNextPruefung(zuletztGeprueft, currentIntervall);

  const handleSave = () => {
    if (value > 0) {
      onIntervallChange(attributeId, value);
      setIsEditing(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            min="1"
          />
          <button onClick={handleSave}>✓</button>
          <button onClick={() => setIsEditing(false)}>✗</button>
        </>
      ) : (
        <>
          <span>{currentIntervall} Tage</span>
          <button onClick={() => setIsEditing(true)}>✏️</button>
          {nextPruefung && (
            <div className="next-check">
              Nächste Prüfung: {nextPruefung.toLocaleDateString('de-DE')}
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### Akzeptanzkriterien:
- Component ist wiederverwendbar
- Validation funktioniert (nur positive Zahlen)
- Nächstes Prüfungsdatum wird korrekt berechnet

---

## Phase 5: View Refactoring

### Aufgaben:
- [ ] `MachineAttributeValuesView.tsx` vereinfachen
- [ ] `useMachineComplete` Hook verwenden
- [ ] Alte Queries entfernen
- [ ] Neue AttributeTable Component verwenden

### Technische Details:

**Datei:** `new-frontend/src/features/machines/views/MachineAttributeValuesView.tsx`

```typescript
export default function MachineAttributeValuesView() {
  const { id } = useParams();
  const machineId = id ? parseInt(id) : -1;

  // ✨ NUR NOCH EIN QUERY!
  const {
    data: machine,
    isLoading,
    error,
  } = useMachineComplete(machineId);

  const useAddAttributeValueMutation = useAddAttributeValue();
  const useEditIntervallMutation = useEditCustomAttribute();

  if (machineId < 0) return <div>Keine Maschine gefunden</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!machine) return <div>Maschine nicht gefunden</div>;

  // Attribute kombinieren
  const combinedAttributes = combineAttributes(machine);

  const handleAddAttributeValue = (
    attributeId: number,
    attributeValue: string,
    year: number
  ) => {
    useAddAttributeValueMutation.mutate({
      machineId,
      machineAttributeId: attributeId,
      attributeValue,
      attributeValueYear: year,
    });
  };

  const handleIntervallChange = (attributeId: number, newIntervall: number) => {
    useEditIntervallMutation.mutate({
      id: attributeId,
      machineId,
      pruefungsIntervall: newIntervall,
    });
  };

  return (
    <div>
      <h1>Maschine: {machine.machineName}</h1>

      {/* Template Info */}
      {machine.machineTemplate && (
        <div className="template-info">
          Template: {machine.machineTemplate.name}
        </div>
      )}

      {/* EINE Tabelle für ALLE Attribute */}
      <AttributeTable
        attributes={combinedAttributes}
        onAttributeValueAdded={handleAddAttributeValue}
        onIntervallChanged={handleIntervallChange}
      />

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button to={`/machines/${machineId}`}>
          → Maschine #{machineId} Struktur bearbeiten
        </Button>
        <Button to="/">→ Zurück zur Startseite</Button>
      </div>
    </div>
  );
}
```

### Akzeptanzkriterien:
- View nutzt nur noch `useMachineComplete`
- Alte Queries sind entfernt
- Code ist deutlich kürzer und klarer
- Alle Features funktionieren weiterhin

---

## Phase 6: Backend - PATCH Endpoint für Intervall

### Aufgaben:
- [ ] PATCH Endpoint in `MachineController.java` erstellen
- [ ] Nur Prüfungsintervall updaten (keine Values!)
- [ ] Validation implementieren

### Technische Details:

**Datei:** `backend/machine-management/src/main/java/com/example/machine_management/controller/machines/MachineController.java`

```java
@PatchMapping("/attributes/{id}/pruefungsintervall")
public ResponseEntity<MachineAttribute> updatePruefungsIntervall(
    @PathVariable Integer id,
    @RequestBody Map<String, Integer> body
) {
    Integer newIntervall = body.get("pruefungsIntervall");

    if (newIntervall == null || newIntervall <= 0) {
        return ResponseEntity.badRequest().build();
    }

    MachineAttribute attribute = attributeRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Attribute not found"));

    // NUR Intervall updaten - Values bleiben erhalten!
    attribute.setPruefungsIntervall(newIntervall);

    MachineAttribute updated = attributeRepository.save(attribute);
    return ResponseEntity.ok(updated);
}
```

**Frontend Service:**
```typescript
export const updatePruefungsIntervallService = async (
  attributeId: number,
  newIntervall: number
): Promise<MachineAttribute> => {
  const response = await fetch(
    `${API_BASE_URL}/attributes/${attributeId}/pruefungsintervall`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ pruefungsIntervall: newIntervall }),
    }
  );

  return response.json();
};
```

### Akzeptanzkriterien:
- PATCH Endpoint funktioniert
- AttributeValues bleiben unverändert
- Validation schlägt bei negativen Werten fehl
- Frontend invalidiert Query Cache nach Update

---

## Zusätzliche Optimierungen (Optional)

### Nice-to-have Features:
- [ ] Optimistic Updates für besseres UX
- [ ] Error Boundaries um die View
- [ ] Skeleton UI während Loading
- [ ] Undo/Redo für Intervall-Änderungen
- [ ] Bulk-Edit für mehrere Attribute gleichzeitig

### Performance:
- [ ] React.memo für AttributeTable
- [ ] useMemo für combineAttributes
- [ ] Virtualized List bei vielen Attributes (react-window)

---

## Testing Checklist

### Backend Tests:
- [ ] Unit Test für eager fetch Query
- [ ] Integration Test für `/machines/{id}/complete`
- [ ] Test für PATCH Intervall Endpoint
- [ ] Test: N+1 Queries werden vermieden

### Frontend Tests:
- [ ] Unit Test für `combineAttributes`
- [ ] Unit Test für `calculateNextPruefung`
- [ ] Component Test für `PruefungsIntervallManager`
- [ ] Integration Test für `MachineAttributeValuesView`

---

## Geschätzte Zeit: 4-6 Stunden

- Phase 1: 1h
- Phase 2: 0.5h
- Phase 3: 0.5h
- Phase 4: 1h
- Phase 5: 1h
- Phase 6: 1h

---

## Notizen

### Wichtige Entscheidungen:
1. **Eager Fetch statt Lazy Loading** - Performance-Tradeoff akzeptabel für diese View
2. **fromTemplate Boolean** - Bereits in DB vorhanden, kein Schema-Change nötig
3. **PATCH statt PUT** - Partial Updates verhindern Datenverlust
4. **Separate Queries behalten** - Keine Breaking Changes für andere Views

### Offene Fragen:
- [ ] Sollen Template-Änderungen automatisch auf Maschinen propagiert werden?
- [ ] Brauchen wir eine Historie der Intervall-Änderungen?
- [ ] Cache-Strategie: Wie lange soll machine-complete gecached werden?
