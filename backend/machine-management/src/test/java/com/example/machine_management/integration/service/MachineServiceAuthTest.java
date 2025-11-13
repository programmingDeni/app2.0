package com.example.machine_management.integration.service;

import com.example.machine_management.models.machine.Machine;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.security.WithMockUserPrincipal;
import com.example.machine_management.services.machine.MachineService;
import com.example.machine_management.util.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration Test für MachineService mit Multi-User Authorization.
 *
 * Testet ob die userId-Filterung korrekt funktioniert.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class MachineServiceAuthTest {

    @Autowired
    private MachineService machineService;

    @Autowired
    private MachineRepository machineRepository;

    /**
     * Test: User 1 kann nur seine eigenen Maschinen sehen
     */
    @Test
    @WithMockUserPrincipal(userId = 1, email = "user1@example.com")
    void testFindAll_AsUser1_OnlySeesOwnMachines() {
        // Arrange: Erstelle Maschinen für User 1
        Machine machine1 = new Machine("User1 Machine 1");
        machine1.setUserId(1);
        machineRepository.save(machine1);

        Machine machine2 = new Machine("User1 Machine 2");
        machine2.setUserId(1);
        machineRepository.save(machine2);

        // Erstelle Maschine für User 2 (sollte NICHT sichtbar sein)
        Machine machine3 = new Machine("User2 Machine");
        machine3.setUserId(2);
        machineRepository.save(machine3);

        // Act: Hole alle Maschinen als User 1
        List<Machine> machines = machineService.userFindAllLazy(2);

        // Assert: User 1 sieht nur seine 2 Maschinen
        assertEquals(2, machines.size());
        assertTrue(machines.stream().allMatch(m -> m.getUserId().equals(1)));

        // Verify: SecurityUtils gibt userId 1 zurück
        assertEquals(1, SecurityUtils.getCurrentUserId());
    }

    /**
     * Test: User 2 kann nur seine eigenen Maschinen sehen
     */
    @Test
    @WithMockUserPrincipal(userId = 2, email = "user2@example.com")
    void testFindAll_AsUser2_OnlySeesOwnMachines() {
        // Arrange: Erstelle Maschinen für User 1
        Machine machine1 = new Machine("User1 Machine");
        machine1.setUserId(1);
        machineRepository.save(machine1);

        // Erstelle Maschine für User 2
        Machine machine2 = new Machine("User2 Machine");
        machine2.setUserId(2);
        machineRepository.save(machine2);

        // Act: Hole alle Maschinen als User 2
        List<Machine> machines = machineService.userFindAllLazy(2);

        // Assert: User 2 sieht nur seine 1 Maschine
        assertEquals(1, machines.size());
        assertEquals(2, machines.get(0).getUserId());

        // Verify: SecurityUtils gibt userId 2 zurück
        assertEquals(2, SecurityUtils.getCurrentUserId());
    }

    /**
     * Test: User kann keine fremde Maschine lesen
     */
    @Test
    @WithMockUserPrincipal(userId = 1, email = "user1@example.com")
    void testFindById_CannotAccessOtherUsersMachine() {
        // Arrange: Erstelle Maschine für User 2
        Machine machine = new Machine("User2 Machine");
        machine.setUserId(2);
        Machine saved = machineRepository.save(machine);

        // Act & Assert: User 1 versucht Machine von User 2 zu lesen
        assertThrows(Exception.class, () -> {
            machineService.userFindById(saved.getId(),false);
        });
    }

    /**
     * Test: Neue Maschine bekommt automatisch userId gesetzt
     */
    @Test
    @WithMockUserPrincipal(userId = 3, email = "user3@example.com")
    void testCreate_AutomaticallyAssignsUserId() {
        // Act: Erstelle Maschine als User 3
        Machine machine = new Machine("New Machine");
        Machine saved = machineRepository.save(machine);

        // Assert: userId wurde automatisch auf 3 gesetzt
        assertEquals(3, saved.getUserId());
    }
}
