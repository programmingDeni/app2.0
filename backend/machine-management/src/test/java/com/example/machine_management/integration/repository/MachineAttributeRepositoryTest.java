package com.example.machine_management.integration.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.example.machine_management.models.enums.AttributeType;
import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.models.machine.MachineAttribute;
//import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.repository.MachineAttributeRepository;
import com.example.machine_management.util.SecurityUtils;

@DataJpaTest
class MachineAttributeRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MachineAttributeRepository attributeRepository;

    @Autowired

    private Machine testMachine;

    @BeforeEach
    void setUp() {
        testMachine = new Machine("TestMachine");
        entityManager.persist(testMachine);
    }

    @Test
    void whenSaveAttribute_thenFindByMachine() {
        // given
        MachineAttribute attr = new MachineAttribute();
        attr.setAttributeName("testAttribut");
        attr.setAttributeType(AttributeType.STRING);
        attr.setMachine(testMachine);
        attributeRepository.save(attr);

        Integer userId = SecurityUtils.getCurrentUserId();

        // when
        List<MachineAttribute> found = attributeRepository.eagerFindByMachineIdAndUserId(testMachine.getId(), userId);

        // then
        assertFalse(found.isEmpty(), "Liste sollte nicht leer sein");
        assertEquals(1, found.size(), "Liste sollte genau ein Attribut enthalten");
        assertEquals("testAttribut", found.get(0).getAttributeName(), "Attributname sollte übereinstimmen");
        assertEquals(testMachine.getId(), found.get(0).getMachine().getId(), "Machine sollte übereinstimmen");
    }

    @Test
    void whenFindByMachineWithNoAttributes_thenReturnEmptyList() {
        Integer userId = SecurityUtils.getCurrentUserId();
        List<MachineAttribute> found = attributeRepository.eagerFindByMachineIdAndUserId(testMachine.getId(), userId);
        assertTrue(found.isEmpty(), "Liste sollte leer sein");
    }

    @Test
    void whenDeleteAttribute_thenNotFound() {
        MachineAttribute attr = new MachineAttribute();
        attr.setMachine(testMachine);
        attr.setAttributeName("test");
        attr.setAttributeType(AttributeType.STRING);
        entityManager.persist(attr);
        Integer id = attr.getId();

        attributeRepository.deleteById(id);

        Optional<MachineAttribute> found = attributeRepository.findById(id);
        assertTrue(found.isEmpty(), "Attribut sollte gelöscht sein");
    }

    @Test
    void whenUpdateAttribute_thenFindUpdated() {
        MachineAttribute attr = new MachineAttribute();
        attr.setAttributeName("TestAttr");
        attr.setAttributeType(AttributeType.STRING);
        entityManager.persist(attr);

        attr.setAttributeName("UpdatedName");
        attributeRepository.save(attr);

        MachineAttribute found = attributeRepository.findById(attr.getId()).orElse(null);
        assertNotNull(found, "Attribut sollte gefunden werden");
        assertEquals("UpdatedName", found.getAttributeName());
    }

    @Test
    void whenFindAll_thenReturnList() {
        MachineAttribute attr1 = new MachineAttribute();
        attr1.setAttributeName("Attr1");
        attr1.setMachine(testMachine);
        MachineAttribute attr2 = new MachineAttribute();
        attr2.setMachine(testMachine);
        attr2.setAttributeName("Attr2");
        attr1.setAttributeType(AttributeType.STRING);
        attr2.setAttributeType(AttributeType.INTEGER);
        entityManager.persist(attr1);
        entityManager.persist(attr2);
        entityManager.flush();

        List<MachineAttribute> attributes = attributeRepository.findAll();
        assertEquals(2, attributes.size(), "Sollte zwei Attribute enthalten");
    }
}