# TODO: GenericCrudService Refactoring

**Status:** In Arbeit
**Branch:** `feature/refactor-attribute-values-view`
**Datum:** 2025-11-08


alle services muessen die neuen userLazyFindById, eager, userLazyFinall, eager 
sowie die neuen admin methoden implementiern
in den services muss die user ueberpruefung stattfinden 
da spaeter hier auch die rollen geprueft werden

auserdem muessen die repos angepasst werden um lazy und eager loading zu unterstuetzen 

ausserdem claude fragen: 
    was fehlt dem CRUD und auch den speziellen services zur professionalitaet

ausserdem alle modelle sollten UserOwned implementieren
    public interface UserOwned {
        void setUserId(Integer userId);
        Integer getUserId();
    }

Service verbesserungen
## Phase 1: KRITISCH (SOFORT machen)
- [ ] Admin-Methoden absichern (@PreAuthorize)
- [ ] UserOwned Interface implementieren
- [ ] Service-Methoden umbenennen (6 Methoden)
- [ ] Fehlende Service-Methoden implementieren (8 Methoden)
- [ ] Fehlende Repository-Queries (5 Queries)

## Phase 2: HOCH (Diese Woche)
- [ ] Logging hinzufügen
- [ ] Validation implementieren
- [ ] Error Handling verbessern
- [ ] JavaDoc vervollständigen

## Phase 3: MITTEL (Nächste Iteration)
- [ ] Transaction Management
- [ ] Pagination
- [ ] Optimistic Locking
- [ ] Soft Delete
---

## ✅ Was bereits fertig ist:

### GenericCrudService.java
- [x] 8 Public Methoden implementiert (User + Admin, LAZY + EAGER, Single + List)
- [x] Korrekte Naming Convention (camelCase)
- [x] CRUD Methoden (create, update, delete) nutzen user-filtered Methoden

### MachineRepository.java
- [x] 4 findById Varianten (LAZY/EAGER × User/Admin)
- [x] JPQL Queries mit `LEFT JOIN FETCH` für nested Relations
- [x] `DISTINCT` zur Vermeidung von Duplikaten
- [x] Lädt: MachineAttributes, AttributeValues, MachineTemplate, TemplateAttributes

---

## ❌ Was noch zu tun ist:

## 1. UserOwned Interface erstellen

**Warum?** Vermeidet Code-Duplikation, typsicher, klarer Contract

**Datei:** `src/main/java/com/example/machine_management/models/UserOwned.java`

```java
package com.example.machine_management.models;

/**
 * Interface für Entities die einem User gehören (Ownership-based Security).
 *
 * Alle Entities die User-Filtering unterstützen müssen dieses Interface implementieren.
 */
public interface UserOwned {
    /**
     * Setzt die User ID für Ownership-Tracking.
     *
     * @param userId User ID
     */
    void setUserId(Integer userId);

    /**
     * Gibt die User ID zurück (für Ownership-Checks).
     *
     * @return User ID
     */
    Integer getUserId();
}
```

---

## 2. GenericCrudService.java anpassen

### 2.1 Abstrakte Methode `setUserId()` ENTFERNEN

**Zeile 171 (circa):**
```java
// LÖSCHEN:
protected abstract void setUserId(E entity, Integer userId);
```

### 2.2 `create()` Methode ändern

**Zeile 127-133 (circa):**

```java
@Transactional
public E create(DTO dto) {
    Integer userId = SecurityUtils.getCurrentUserId();
    E entity = mapper.fromDto(dto);

    // NEU: UserOwned Interface Check
    if (entity instanceof UserOwned) {
        ((UserOwned) entity).setUserId(userId);
    }

    return repo.save(entity);
}
```

### 2.4 TODO-Kommentare für Admin-Methoden hinzufügen

```java
/**
 * ⚠️ SECURITY WARNING: Keine User-Filter!
 * TODO: @PreAuthorize("hasRole('ADMIN')") hinzufügen wenn Rollen implementiert
 */
@Transactional(readOnly = true)
public E adminLazyFindById(ID id){
    // TODO: Security-Check fehlt! Aktuell kann jeder User diese Methode aufrufen!
    return repo.findById(id)
            .orElseThrow(() -> new NotFoundException(
                    String.format("Entity mit ID %s nicht gefunden.", id)));
}
```

### 2.5 Professionelle JavaDoc mit Markdown-Tabellen hinzufügen

**Am Anfang der Klasse (nach Zeile 19):**

```java
/**
 * Generischer Base-Service für CRUD-Operationen mit User-Filtering.
 * Arbeitet direkt mit Entities, Mapping zu DTOs erfolgt in Controller-Schicht.
 *
 * ## Methoden-Übersicht:
 *
 * | Methode                    | Loading | Security       | Use Case                           |
 * |----------------------------|---------|----------------|------------------------------------|
 * | userLazyFindById           | LAZY    | User-filtered  | Basis-Daten ohne Relations         |
 * | userEagerFindById          | EAGER   | User-filtered  | Vollständige Daten mit Relations   |
 * | userLazyFindAll            | LAZY    | User-filtered  | Listen ohne Relations              |
 * | userEagerFindAll           | EAGER   | User-filtered  | Listen mit Relations               |
 * | adminLazyFindById          | LAZY    | Admin-only     | Admin: Basis-Daten                 |
 * | adminEagerFindById         | EAGER   | Admin-only     | Admin: Vollständige Daten          |
 * | adminLazyFindAll           | LAZY    | Admin-only     | Admin: Listen ohne Relations       |
 * | adminEagerFindAllAbstract  | EAGER   | Admin-only     | Admin: Listen mit Relations        |
 *
 * ## Security-Modell:
 * - **User-Methods:** Filtern automatisch nach userId (Ownership-based)
 * - **Admin-Methods:** ⚠️ Zugriff auf ALLE Entities (TODO: Role-Check hinzufügen)
 *
 * @param <E>   Entity type (muss UserOwned implementieren)
 * @param <ID>  ID type
 * @param <DTO> DTO type für Input-Validierung und Mapping
 */
```

---

## 3. Machine.java anpassen

**Datei:** `src/main/java/com/example/machine_management/models/Machine.java`

### 3.1 Interface implementieren

```java
@Entity
@Table(name = "machines")
public class Machine implements UserOwned {  // ← NEU

    // ... bestehender Code ...

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    // ... bestehender Code ...

    // ✅ Diese Methoden sind bereits vorhanden (prüfen!)
    @Override
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public Integer getUserId() {
        return userId;
    }
}
```

---

## 4. MachineService.java anpassen

**Datei:** `src/main/java/com/example/machine_management/services/machine/MachineService.java`

### 4.1 `setUserId()` Implementation ENTFERNEN

**Zeile 133-136 (circa):**
```java
// LÖSCHEN:
@Override
protected void setUserId(Machine entity, Integer userId) {
    entity.setUserId(userId);
}
```

### 4.2 Abstrakte Methoden umbenennen (Methoden-Namen anpassen)

**Aktuell (FALSCH):**
```java
@Override
protected List<Machine> findAllEntitiesByUserId(Integer userId) {
    return ((MachineRepository) repo).findAllByUserId(userId);
}

@Override
protected Optional<Machine> findLazyByIdAndUserId(Integer id, Integer userId) {
    return ((MachineRepository) repo).findByIdAndUserId(id, userId);
}

@Override
protected Optional<Machine> findEagerByIdAndUserId(Integer id, Integer userId) {
    return ((MachineRepository) repo).findWithAllDataByIdAndUserId(id, userId);
}
```

**NEU (RICHTIG):**
```java
@Override
protected List<Machine> userLazyFindAllAbstract(Integer userId) {
    return ((MachineRepository) repo).findAllByUserId(userId);
}

@Override
protected Optional<Machine> userLazyFindByIdAndUserIdAbstract(Integer id, Integer userId) {
    return ((MachineRepository) repo).findByIdAndUserId(id, userId);
}

@Override
protected Optional<Machine> userEagerFindByIdAndUserIdAbstract(Integer id, Integer userId) {
    return ((MachineRepository) repo).findWithAllDataByIdAndUserId(id, userId);
}
```

### 4.3 NEUE abstrakte Methoden implementieren

**Hinzufügen:**

```java
@Override
protected List<Machine> userEagerFindAllAbstract(Integer userId) {
    return ((MachineRepository) repo).findAllEagerByUserId(userId);
}

@Override
protected Optional<Machine> adminEagerFindEntityByIdAbstract(Integer id) {
    return ((MachineRepository) repo).findWithAllDataById(id);
}

@Override
public List<Machine> adminEagerFindAllAbstract() {
    return ((MachineRepository) repo).findAllEager();
}
```

---

## 5. MachineRepository.java erweitern

**Datei:** `src/main/java/com/example/machine_management/repository/MachineRepository.java`

### 5.1 Query für User Eager List hinzufügen (falls nicht vorhanden)

```java
/**
 * Findet alle Maschinen eines Users mit EAGER Loading.
 * Lädt: Machine, MachineAttributes, AttributeValues, MachineTemplate, TemplateAttributes
 */
@Query("SELECT DISTINCT m FROM Machine m " +
       "LEFT JOIN FETCH m.machineAttributes ma " +
       "LEFT JOIN FETCH ma.attributeValues " +
       "LEFT JOIN FETCH m.machineTemplate t " +
       "LEFT JOIN FETCH t.templateAttributes " +
       "WHERE m.userId = :userId")
List<Machine> findAllEagerByUserId(@Param("userId") Integer userId);
```

### 5.2 Query für Admin Eager List hinzufügen

```java
/**
 * Findet ALLE Maschinen mit EAGER Loading - OHNE User-Filter.
 * ⚠️ NUR für Admin-Operationen!
 */
@Query("SELECT DISTINCT m FROM Machine m " +
       "LEFT JOIN FETCH m.machineAttributes ma " +
       "LEFT JOIN FETCH ma.attributeValues " +
       "LEFT JOIN FETCH m.machineTemplate t " +
       "LEFT JOIN FETCH t.templateAttributes")
List<Machine> findAllEager();
```

---

## 6. MachineController.java anpassen (Optional)

**Datei:** `src/main/java/com/example/machine_management/controller/machines/MachineController.java`

### Zeile 102 - Methode umbenennen

**Aktuell:**
```java
Machine machine = machineService.getWithAllDataByMachineIdAndUserId(id);
```

**Vorschlag (konsistenter):**
```java
Machine machine = machineService.userEagerFindById(id);
```

**Oder:** `getWithAllDataByMachineIdAndUserId()` Methode in MachineService löschen (ist Duplikat)

---

## 7. Weitere Entities anpassen (später)

**Wenn GenericCrudService läuft, alle anderen Entities anpassen:**

- [ ] `MachineTemplate.java` → `implements UserOwned`
- [ ] `MachineAttribute.java` → `implements UserOwned`
- [ ] `AttributeValue.java` → `implements UserOwned` (falls nötig)
- [ ] `TemplateAttribute.java` → `implements UserOwned` (falls nötig)

**Und entsprechende Services:**
- [ ] `MachineTemplateService.java`
- [ ] `MachineAttributeService.java` (falls vorhanden)

---

## Reihenfolge der Umsetzung:

1. ✅ **UserOwned Interface** erstellen
2. ✅ **Machine.java** - `implements UserOwned` hinzufügen
3. ✅ **GenericCrudService.java** - `setUserId()` abstrakt entfernen, `create()` ändern
4. ✅ **GenericCrudService.java** - `@Transactional(readOnly = true)` hinzufügen
5. ✅ **GenericCrudService.java** - JavaDoc mit Tabellen hinzufügen
6. ✅ **MachineService.java** - `setUserId()` Implementation löschen
7. ✅ **MachineService.java** - 3 bestehende Methoden umbenennen
8. ✅ **MachineService.java** - 3 neue Methoden implementieren
9. ✅ **MachineRepository.java** - 2 neue Queries hinzufügen
10. ✅ **Kompilieren & Testen** mit Docker
11. ⚠️ **MachineController.java** - Optional: Methode umbenennen

---

## Kompilieren nach Änderungen:

```bash
# In Docker kompilieren (wegen Java 21)
docker-compose run backend mvn clean install

# Oder Backend neu starten
docker-compose restart backend

# Logs checken
docker-compose logs -f backend
```

---

## Offene Fragen / Entscheidungen:

- [ ] Soll `getWithAllDataByMachineIdAndUserId()` gelöscht werden? (Ist Duplikat von `userEagerFindById()`)
- [ ] Soll `findById()` in MachineService gelöscht werden? (Überschreibt GenericCrudService aktuell)
- [ ] Admin-Methoden: Wann werden Rollen implementiert?
- [ ] Logging: Soll `@Slf4j` zu GenericCrudService hinzugefügt werden?

---

## Notizen:

- Alle Repository-Queries mit `LEFT JOIN FETCH` nutzen `DISTINCT` um Duplikate zu vermeiden
- `@Transactional(readOnly = true)` nur bei PUBLIC Methoden, NICHT bei abstrakten!
- UserOwned Interface macht Code cleaner als abstrakte `setUserId()` Methode
- Admin-Methoden brauchen später `@PreAuthorize("hasRole('ADMIN')")`
