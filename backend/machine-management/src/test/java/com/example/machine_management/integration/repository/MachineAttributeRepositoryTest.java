package com.example.machine_management.integration.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeType;
//import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.repository.MachineAttributeRepository;

@DataJpaTest
class MachineAttributeRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MachineAttributeRepository attributeRepository;

    private Machine testMachine;

    @BeforeEach
    void setUp() {
        testMachine = new Machine("TestMachine");
        entityManager.persist(testMachine);
    }
    
    @Test
    void whenSaveAttribute_thenFindByMachine() {
        // given
        MachineAttribute attr = new MachineAttribute(testMachine, "TestAttr");
        attr.setType(AttributeType.STRING);
        attributeRepository.save(attr);

        // when
        List<MachineAttribute> found = attributeRepository.findByMachine(testMachine);

        // then
        assertFalse(found.isEmpty(), "Liste sollte nicht leer sein");
        assertEquals(1, found.size(), "Liste sollte genau ein Attribut enthalten");
        assertEquals("TestAttr", found.get(0).getAttributeName(), "Attributname sollte übereinstimmen");
        assertEquals(testMachine, found.get(0).getMachine(), "Machine sollte übereinstimmen");
    }

    @Test
    void whenFindByMachineWithNoAttributes_thenReturnEmptyList() {
        List<MachineAttribute> found = attributeRepository.findByMachine(testMachine);
        assertTrue(found.isEmpty(), "Liste sollte leer sein");
    }

    @Test
    void whenDeleteAttribute_thenNotFound() {
        MachineAttribute attr = new MachineAttribute(testMachine, "TestAttr");
        attr.setType(AttributeType.STRING);
        entityManager.persist(attr);
        Integer id = attr.getId();

        attributeRepository.deleteById(id);

        Optional<MachineAttribute> found = attributeRepository.findById(id);
        assertTrue(found.isEmpty(), "Attribut sollte gelöscht sein");
    }

    @Test
    void whenUpdateAttribute_thenFindUpdated() {
        MachineAttribute attr = new MachineAttribute(testMachine, "TestAttr");
        attr.setType(AttributeType.STRING);
        entityManager.persist(attr);
        
        attr.setAttributeName("UpdatedName");
        attributeRepository.save(attr);
        
        MachineAttribute found = attributeRepository.findById(attr.getId()).orElse(null);
        assertNotNull(found, "Attribut sollte gefunden werden");
        assertEquals("UpdatedName", found.getAttributeName());
    }

    @Test
    void whenFindAll_thenReturnList() {
        MachineAttribute attr1 = new MachineAttribute(testMachine, "Attr1");
        MachineAttribute attr2 = new MachineAttribute(testMachine, "Attr2");
        attr1.setType(AttributeType.STRING);
        attr2.setType(AttributeType.INTEGER);
        entityManager.persist(attr1);
        entityManager.persist(attr2);
        entityManager.flush();

        List<MachineAttribute> attributes = attributeRepository.findAll();
        assertEquals(2, attributes.size(), "Sollte zwei Attribute enthalten");
    }
}