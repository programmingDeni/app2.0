package com.example.machine_management.controller;

// 📦 MODELLE
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;

// 📦 DTOs
import com.example.machine_management.dto.Machine.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.Machine.LazyMachineDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.dto.MachineStructureDto;
import com.example.machine_management.dto.MachineAttributes.MachineAttributeDto;

// 🔁 MAPPER
import com.example.machine_management.mapper.LazyMachineMapper;
import com.example.machine_management.mapper.MachineAttributeMapper;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.mapper.MachineStructureMapper;

// 💾 REPOSITORIES

// 🧠 SERVICES
import com.example.machine_management.services.MachineAttributeService;
import com.example.machine_management.services.MachineService;

// 🔧 JAVA / UTILS
import java.util.List;
import java.util.stream.Collectors;

// 🌐 SPRING FRAMEWORK
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    @Autowired
    private MachineService machineService;

    @Autowired
    private MachineAttributeService attributeService;

    // POST
    @PostMapping
    public ResponseEntity<MachineDto> createMachine(@RequestBody MachineDto dto) {
        // 1. Validate
        if (dto == null || !isValidMachineDto(dto)) {
            throw new IllegalArgumentException("Invalid machine data");
        }

        // 2. Call service & get entity
        Machine created = machineService.createMachine(dto);

        // 3. Map to DTO and return
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(MachineMapper.toDto(created));
    }

    // POST /from-template
    @PostMapping("/from-template")
    public ResponseEntity<MachineDto> createMachineFromTemplate(
            @RequestBody CreateMachineFromTemplateDto dto) {
        // 1. Validate
        if (dto == null || !isValidTemplateDto(dto)) {
            throw new IllegalArgumentException("Invalid template data");
        }

        // 2. Call service & get entity
        Machine created = machineService.createMachineFromTemplate(dto);

        // 3. Map to DTO and return
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(MachineMapper.toDto(created));
    }

    // POST fügt Machine ein Attribute hinzu
    @PostMapping("/{id}/attributes")
    public ResponseEntity<MachineAttributeDto> createAttribute(@PathVariable Integer id,
            @RequestBody MachineAttributeDto dto) {
        // 1. Validate
        if (dto == null || !isValidAttributeDto(dto)) {
            throw new IllegalArgumentException("Invalid attribute data");
        }
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Create entity
        MachineAttribute created = attributeService.createMachineAttribute(dto);

        // 3. Map and return
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(MachineAttributeMapper.toDto(created));
    }

    // Lazy Get
    @GetMapping("/lazy")
    public ResponseEntity<List<LazyMachineDto>> getAllMachinesLazy() {
        // 1. Get entities from service
        List<Machine> machines = machineService.getAllMachines();

        // 2. Map to DTOs and return
        List<LazyMachineDto> dtos = LazyMachineMapper.toDtoList(machines);

        // returnen
        return ResponseEntity.ok(dtos);

    }

    // EAGER GET !!
    // GET all => alle machinen MIT ihren Attributen UND AttributeValues
    // das dto format / der mapper entscheidet ob lazy oder eager geladen wird
    // das heißt ob die verknüpften relationen mit übergeben werden
    // hier werden die Attribute mit übergeben
    // auch der MachineAttribut mapper ruft den MachineAttributeValues auf, auch
    // diese werden mit übergeben
    @GetMapping
    public ResponseEntity<List<MachineDto>> getAllMachines() {
        // 1. Get entities from service
        List<Machine> machines = machineService.getAllMachines();

        // 2. Map to DTOs and return
        List<MachineDto> dtos = machines.stream()
                .map(MachineMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // Eager Loading Machines, Attribtue und Values
    @GetMapping("/{id}")
    public ResponseEntity<MachineDto> getMachine(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity from service
        Machine machine = machineService.getMachineById(id);

        // 3. Map to DTO and return
        return ResponseEntity.ok(MachineMapper.toDto(machine));
    }

    // hier jetzt eager die attribute aber lazy die values
    @GetMapping("/{id}/structure")
    public ResponseEntity<MachineStructureDto> getMachineStructure(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Get entity from service
        Machine machine = machineService.getMachineById(id);

        // 3. Map to DTO and return
        return ResponseEntity.ok(MachineStructureMapper.toDto(machine));
    }

    // update name
    @PutMapping("/{id}")
    public ResponseEntity<MachineDto> updateMachine(
            @PathVariable Integer id,
            @RequestBody MachineDto dto) {
        // 1. Validate
        if (id == null || id <= 0 || dto == null || !isValidMachineDto(dto)) {
            throw new IllegalArgumentException("Invalid update data");
        }

        // 2. Update via service & get entity
        Machine updated = machineService.updateMachine(id, dto);

        // 3. Map to DTO and return
        return ResponseEntity.ok(MachineMapper.toDto(updated));
    }

    @PutMapping("/{id}/template/{templateId}")
    public ResponseEntity<MachineDto> assignTemplateToMachine(
            @PathVariable("id") Integer machineId,
            @PathVariable Integer templateId) {
        // 1. Validate
        if (machineId == null || machineId <= 0 || templateId == null || templateId <= 0) {
            throw new IllegalArgumentException("Invalid update data");
        }
        machineService.assignTemplate(machineId, templateId);
        return ResponseEntity.ok(MachineMapper.toDto(machineService.getMachineById(machineId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Integer id) {
        // 1. Validate
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        // 2. Delete via service
        machineService.deleteMachine(id);

        // 3. Return success response
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/template")
    public ResponseEntity<Void> removeTemplateFromMachine(@PathVariable("id") Integer machineId) {
        // 1. Validate nur form, logic wirtd im service gecheckt;
        if (machineId == null || machineId <= 0) {
            throw new IllegalArgumentException("Invalid ID");
        }

        machineService.removeTemplateFromMachine(machineId);

        return ResponseEntity.noContent().build();
    }

    private boolean isValidMachineDto(MachineDto dto) {
        return dto.name != null && !dto.name.trim().isEmpty();
    }

    private boolean isValidTemplateDto(CreateMachineFromTemplateDto dto) {
        return dto != null &&
                dto.machineName != null &&
                !dto.machineName.trim().isEmpty() &&
                dto.machineTemplateId != null &&
                dto.machineTemplateId > 0;
    }

    private boolean isValidAttributeDto(MachineAttributeDto dto) {
        return dto.attributeName != null &&
                !dto.attributeName.trim().isEmpty() &&
                dto.attributeType != null &&
                dto.machineId > 0;
    }
}