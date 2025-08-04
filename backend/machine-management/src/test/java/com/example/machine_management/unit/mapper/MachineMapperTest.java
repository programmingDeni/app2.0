package com.example.machine_management.unit.mapper;

import static org.junit.jupiter.api.Assertions.*;

import com.example.machine_management.dto.Machine.LazyMachineDto;
import com.example.machine_management.dto.Machine.MachineDto;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.AttributeType;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.AttributeTemplateRepository;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.repository.MachineTemplateRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.text.AttributedCharacterIterator.Attribute;
import java.util.List;

@SpringBootTest
@ActiveProfiles("test")
class MachineMapperTest {

    @Autowired
    MachineRepository machineRepository;

    @Autowired
    MachineTemplateRepository machineTemplateRepository;

    @Test
    void testToDto() {
        // der test soll die volle funktionalität des mappers testen
        /*
         * 
         * public static MachineDto toDto(Machine machine) {
         * MachineTemplateDto templateDto = machine.getMachineTemplate() != null
         * ? MachineTemplateMapper.toDto(machine.getMachineTemplate())
         * : null;
         * 
         * return new MachineDto(
         * machine.getId(),
         * machine.getMachineName(),
         * machine.getMachineTemplate() != null ? machine.getMachineTemplate().getId() :
         * null,
         * MachineAttributeMapper.toDtoList(machine.getMachineAttributes()));
         * }
         */
        // repo import
        MachineTemplate template = new MachineTemplate("Testtemplate");
        AttributeInTemplate attr = new AttributeInTemplate("TestAttribute", AttributeType.STRING, template);
        template.setAttributeTemplates(List.of(attr));

        machineTemplateRepository.save(template);

        Machine machine = new Machine("Testmaschine");

        machine.setMachineTemplate(template);
        machineRepository.save(machine);

        // Act
        MachineDto dto = MachineMapper.toDto(machine);

        // Assert
        assertEquals("Testmaschine", dto.machineName);
        assertEquals(1, dto.id);
        // assertEquals("Spannung", dto.attributes.attributeName);
        assertEquals("Testtemplate", dto.machineTemplateDto.templateName);

    }
}
