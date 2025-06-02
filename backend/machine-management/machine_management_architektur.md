
# 📘 Machine Management Projekt – Architekturübersicht

## 🧱 Entity-Methodenübersicht

### `Machine`
```
+ addAttribute(attribute: MachineAttribute): void
+ removeAttribute(attribute: MachineAttribute): void
+ assignTemplate(template: MachineTemplate): void
+ removeTemplate(): void
```

### `MachineAttribute`
```
+ addAttributeValue(value: AttributeValue): void
+ setAttributeValues(values: List<AttributeValue>): void
+ clearAttributeValues(): void
```

### `AttributeValue`
```
(nur Datenobjekt, keine Verwaltungslogik notwendig)
```

### `MachineTemplate`
```
+ createMachine(name: String): Machine
```

### `AttributeInTemplate`
```
(nur Strukturträger – keine eigene Funktionalität notwendig)
```

---

## ⚙️ Service-Methodenübersicht

### `MachineService`
```
+ getAllMachines(): List<MachineDto>
+ getMachineById(id: int): Optional<MachineDto>
+ createMachine(dto: MachineDto): MachineDto
+ createFromTemplate(dto: CreateMachineFromTemplateDto): MachineDto
+ updateMachine(id: int, dto: MachineDto): MachineDto
+ deleteMachine(id: int): void
```

### `MachineAttributeService`
```
+ getAllAttributes(): List<MachineAttributeDto>
+ getById(id: int): Optional<MachineAttributeDto>
+ createAttribute(dto: MachineAttributeDto): MachineAttributeDto
+ updateAttribute(id: int, dto: MachineAttributeDto): Optional<MachineAttributeDto>
+ deleteAttribute(id: int): void
```

### `AttributeValueService`
```
+ createOrUpdateValue(dto: AttributeValueDto): AttributeValueDto
+ deleteValue(attributeId: int, year: int): void
+ getValuesByAttribute(attributeId: int): List<AttributeValueDto>
+ getValueByAttributeAndYear(attributeId: int, year: int): Optional<AttributeValueDto>
```

### `MachineTemplateService`
```
+ getAllTemplates(): List<MachineTemplateDto>
+ getById(id: int): Optional<MachineTemplateDto>
+ createTemplate(dto: MachineTemplateDto): MachineTemplateDto
+ deleteTemplate(id: int): void
```

---

## 🔁 Mapper-Klassen
Alle Mapper enthalten:
```
+ toDto(entity): Dto
+ toEntity(dto): Entity
```

---

## 🧠 Hinweise
- Templates geben die Struktur vor (AttributeInTemplate)
- Maschinen nutzen Templates, erzeugen Attribute aus ihnen
- Werte (`AttributeValue`) werden unabhängig vom Template gespeichert
- Controller delegieren an Service-Schichten
