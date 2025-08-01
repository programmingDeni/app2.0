package com.example.machine_management.integration.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.example.machine_management.models.Machine;
import com.example.machine_management.repository.MachineRepository;

@DataJpaTest
class MachineRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MachineRepository machineRepository;

    @Test
    void whenFindByName_thenReturnMachine() {
        // given
        Machine testMachine = new Machine("TestMachine");
        entityManager.persist(testMachine);
        entityManager.flush();

        // when
        Machine found = machineRepository.findByMachineName("TestMachine").orElse(null);

        // then
        assertNotNull(found, "Machine sollte gefunden werden");
        assertEquals("TestMachine", found.getMachineName());
    }

    @Test
    void whenSaveMachine_thenIdIsGenerated() {
        // given
        Machine testMachine = new Machine("TestMachine");

        // when
        Machine saved = machineRepository.save(testMachine);

        // then
        assertNotNull(saved.getId(), "ID sollte generiert worden sein");
    }

     @Test
    void whenFindByNameNotExists_thenReturnEmpty() {
        Optional<Machine> found = machineRepository.findByMachineName("NonExistent");
        assertTrue(found.isEmpty(), "Sollte leeres Optional zurückgeben");
    }

    @Test
    void whenFindById_thenReturnMachine() {
        Machine testMachine = new Machine("TestMachine");
        entityManager.persist(testMachine);
        entityManager.flush();

        Machine found = machineRepository.findById(testMachine.getId()).orElse(null);
        assertNotNull(found, "Machine sollte gefunden werden");
        assertEquals(testMachine.getMachineName(), found.getMachineName());
    }

    @Test
    void whenDeleteMachine_thenNotFound() {
        Machine testMachine = new Machine("TestMachine");
        entityManager.persist(testMachine);
        Integer id = testMachine.getId();
        
        machineRepository.deleteById(id);
        
        Optional<Machine> found = machineRepository.findById(id);
        assertTrue(found.isEmpty(), "Machine sollte gelöscht sein");
    }

        @Test
        void whenFindAll_thenReturnList() {
            Machine machine1 = new Machine("Machine1");
            Machine machine2 = new Machine("Machine2");
            entityManager.persist(machine1);
            entityManager.persist(machine2);
            entityManager.flush();

            List<Machine> machines = machineRepository.findAll();
            assertEquals(2, machines.size(), "Sollte zwei Maschinen enthalten");
        }
}