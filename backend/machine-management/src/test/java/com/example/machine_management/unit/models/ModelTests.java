package com.example.machine_management.unit.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;

import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.AttributeType;


public class ModelTests {

    //test übergreifende test machine  
    private Machine testMachine;

    @BeforeEach
    void setUp() {
        testMachine = new Machine("testMachine");
        assertNotNull(testMachine,"Test Machine sollte nach Setup nicht null sein");
    }

    @Test
    void testMachines() {
        // Teste empty constructor 
        Machine leereMachine = new Machine();
        assertNotNull(leereMachine, "Leere Machine sollte nicht null sein");
        assertNull(leereMachine.getName(), "Name sollte initial null sein");
        assertNull(leereMachine.getId(), "ID sollte initial null sein");
        
        // Teste machine mit string initialisiert
        assertEquals("testMachine", testMachine.getName(), "Name sollte korrekt gesetzt sein");

        //getter und setter testen
        Machine testMachine2 = new Machine("testMachine2");
        assertEquals("testMachine2", testMachine2.getName(), "Name sollte korrekt gesetzt sein");

        //set und get name
        testMachine2.setName("testMachine3");
        assertEquals("testMachine3", testMachine2.getName(), "Name sollte korrekt gesetzt sein");
    
        //set und get attributes 
        List<MachineAttribute> attributes = testMachine.getAttributes();
        assertNotNull(attributes, "Attributes sollte nicht null sein");
        assertEquals(0, attributes.size(), "Attributes sollte leer sein");
    }

    @Test
    void testMachineAttributes() {
        // Teste dass Konstruktor ohne Machine nicht möglich ist
        assertThrows(IllegalArgumentException.class, () -> {
            new MachineAttribute(null, "test");
        }, "Konstruktor sollte IllegalArgumentException werfen wenn Machine null ist");

        // Teste dass Konstruktor ohne Namen nicht möglich ist
        assertThrows(IllegalArgumentException.class, () -> {
            new MachineAttribute(testMachine, null);
        }, "Konstruktor sollte IllegalArgumentException werfen wenn Name null ist");

        assertThrows(IllegalArgumentException.class, () -> {
            new MachineAttribute(testMachine, "");
        }, "Konstruktor sollte IllegalArgumentException werfen wenn Name leer ist");

        // Teste korrekten Konstruktor
        String testName = "TestAttribute";
        MachineAttribute attr = new MachineAttribute(testMachine, testName);
        assertNotNull(attr, "Attribut sollte nicht null sein");
        assertEquals(testMachine, attr.getMachine(), "Machine sollte korrekt gesetzt sein");
        assertEquals(testName, attr.getAttributeName(), "Name sollte korrekt gesetzt sein");
        assertTrue(testMachine.getAttributes().contains(attr), 
            "Machine sollte das Attribut in ihrer Liste haben");

        // Teste weitere setter
        attr.setType(AttributeType.STRING);
        assertEquals(AttributeType.STRING, attr.getType(), "AttributeType sollte korrekt gesetzt sein");

        String testValue = "TestValue";
        attr.setAttributeValue(testValue);
        assertEquals(testValue, attr.getAttributeValue(), "AttributeValue sollte korrekt gesetzt sein");
        // Teste Setter Validierungen
        assertThrows(IllegalArgumentException.class, () -> {
            attr.setAttributeName(null);
        }, "setAttributeName sollte IllegalArgumentException werfen wenn null");

        assertThrows(IllegalArgumentException.class, () -> {
            attr.setAttributeName("");
        }, "setAttributeName sollte IllegalArgumentException werfen wenn leer");

        assertThrows(IllegalArgumentException.class, () -> {
            attr.setMachine(null);
        }, "setMachine sollte IllegalArgumentException werfen wenn null");

        assertThrows(IllegalArgumentException.class, () -> {
            attr.setType(null);
        }, "setType sollte IllegalArgumentException werfen wenn null");
        // Teste dass null für attributeValue erlaubt ist
        attr.setAttributeValue(null);
        assertNull(attr.getAttributeValue(), "AttributeValue sollte null sein können");
    }

    @Test
    void testMachineAttributeSetMachine() {
        // Erstelle Test-Setup
        Machine machine1 = new Machine("Machine1");
        Machine machine2 = new Machine("Machine2");
        MachineAttribute attr = new MachineAttribute(machine1, "TestAttr");
        
        // Prüfe initiale Zuordnung
        assertTrue(machine1.getAttributes().contains(attr), 
            "Attribut sollte in Machine1's Liste sein");
        assertEquals(1, machine1.getAttributes().size(), 
            "Machine1 sollte genau ein Attribut haben");
        
        // Ändere Machine
        attr.setMachine(machine2);
        
        // Prüfe ob Attribut von alter Machine entfernt wurde
        assertFalse(machine1.getAttributes().contains(attr), 
            "Attribut sollte nicht mehr in Machine1's Liste sein");
        assertEquals(0, machine1.getAttributes().size(), 
            "Machine1 sollte keine Attribute mehr haben");
        
        // Prüfe ob Attribut zu neuer Machine hinzugefügt wurde
        assertTrue(machine2.getAttributes().contains(attr), 
            "Attribut sollte in Machine2's Liste sein");
        assertEquals(1, machine2.getAttributes().size(), 
            "Machine2 sollte genau ein Attribut haben");
        
        // Prüfe ob Machine korrekt gesetzt wurde
        assertEquals(machine2, attr.getMachine(), 
            "Machine-Referenz sollte auf Machine2 zeigen");
    }

    @Test
    void testAttributeValueValidation() {
        MachineAttribute attr = new MachineAttribute(testMachine, "test");
        
        // Test INTEGER validation
        attr.setType(AttributeType.INTEGER);
        attr.setAttributeValue("123"); // should work
        assertThrows(IllegalArgumentException.class, () -> {
            attr.setAttributeValue("not a number");
        }, "Nicht-numerischer Wert sollte für INTEGER Type nicht erlaubt sein");
            
        // Test BOOLEAN validation
        attr.setType(AttributeType.BOOLEAN);
        attr.setAttributeValue("true"); // should work
        attr.setAttributeValue("false"); // should work
        assertThrows(IllegalArgumentException.class, () -> {
            attr.setAttributeValue("not a boolean");
        }, "Nicht-boolean Wert sollte für BOOLEAN Type nicht erlaubt sein");
        
        // Test STRING validation (should accept any non-empty string)
        attr.setType(AttributeType.STRING);
        attr.setAttributeValue("any string"); // should work
        assertThrows(IllegalArgumentException.class, () -> {
            attr.setAttributeValue("");
        }, "Leerer String sollte nicht erlaubt sein");
    }
}
