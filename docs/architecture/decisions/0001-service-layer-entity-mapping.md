# ADR 0001: Service Layer Return Types - Entities vs DTOs

## Status
Accepted

## Context
Im Backend-Service müssen wir entscheiden, ob die Service-Layer:
1. Direkt mit JPA-Entities arbeitet und diese zurückgibt (aktueller Ansatz)
2. Entities innerhalb der Service-Layer zu DTOs mapped

Diese Entscheidung beeinflusst:
- Architektur-Grenzen
- Performance
- Flexibilität
- Wartbarkeit
- Service-zu-Service Kommunikation

## Decision
Wir behalten den aktuellen Ansatz bei: Services arbeiten mit und returnen JPA-Entities. Das Mapping zu DTOs erfolgt in der Controller-Schicht.

## Consequences

### Positive
- **Effiziente Service-Kommunikation**: Services können direkt Entities austauschen ohne DTO-Overhead
  ```java
  // Beispiel: Effiziente interne Kommunikation
  public Machine assignTemplate(Integer machineId, Integer templateId) {
      Machine machine = machineRepository.findWithAllDataById(machineId);
      MachineTemplate template = machineTemplateRepository.findByIdWithAttributes(templateId);
      machine.setMachineTemplate(template);
      return machineRepository.save(machine);
  }
  ```

- **Flexibilität im Controller**: Ein Controller kann verschiedene DTO-Formate aus der gleichen Entity erstellen
  ```java
  // Verschiedene DTOs aus gleicher Entity
  @GetMapping("/{id}")
  public MachineDto getMachine(...) { ... }
  
  @GetMapping("/{id}/summary")
  public MachineSummaryDto getMachineSummary(...) { ... }
  ```

- **Reduzierte Komplexität**: Weniger Mapping-Code in der Service-Schicht
- **Klare Verantwortlichkeiten**: Services fokussieren sich auf Business-Logik

### Negative
- **Vorsicht bei Lazy Loading**: Controller müssen sicherstellen, dass alle benötigten Relations geladen sind
- **Entity Exposure**: Entities "leaken" theoretisch aus der Service-Schicht
- **Mapping-Wiederholung**: Ähnliche Mapping-Logik kann sich in Controllern wiederholen

### Mitigations
1. **Dokumentation der Lazy Loading Garantien**:
   ```java
   /**
    * Lädt eine Machine mit allen benötigten Relations.
    * Garantierte initialized properties:
    * - machine.getMachineAttributes()
    * - machine.getMachineTemplate()
    * - machine.getMachineTemplate().getAttributeTemplates()
    */
   public Machine getMachineById(Integer id) { ... }
   ```

2. **Explizite Fetch-Strategien**:
   ```java
   @Repository
   public interface MachineRepository {
       @Query("SELECT m FROM Machine m " +
              "LEFT JOIN FETCH m.machineAttributes " +
              "LEFT JOIN FETCH m.machineTemplate")
       Optional<Machine> findWithAllDataById(Integer id);
   }
   ```

3. **Zentrale Mapping-Logik**:
   ```java
   @ControllerAdvice
   public abstract class BaseController {
       @Autowired
       protected MachineMapper machineMapper;
       
       protected MachineDto toDto(Machine machine) {
           return machineMapper.toDto(machine);
       }
   }
   ```

## Notes
- Regelmäßig prüfen, ob diese Entscheidung noch zur Projektgröße und den Anforderungen passt
- Bei Performance-Problemen durch übermäßiges Lazy Loading: Fetch Joins oder spezifische DTOs erwägen
- Bei vielen verschiedenen DTO-Formaten: Mapping-Strategie überdenken

## References
- [Martin Fowler - DTO](https://martinfowler.com/eaaCatalog/dataTransferObject.html)
- [Hibernate User Guide - Fetching](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#fetching)