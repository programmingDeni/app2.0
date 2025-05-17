package com.example.machine_management.services;

import com.example.machine_management.dto.CreateMachineFromTemplateDto;
import com.example.machine_management.dto.MachineDto;
import com.example.machine_management.exceptions.NotFoundException;
import com.example.machine_management.mapper.MachineMapper;
import com.example.machine_management.models.AttributeInTemplate;
import com.example.machine_management.models.Machine;
import com.example.machine_management.models.MachineAttribute;
import com.example.machine_management.models.MachineTemplate;
import com.example.machine_management.repository.MachineRepository;
import com.example.machine_management.repository.MachineTemplateRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MachineService {

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private MachineTemplateRepository machineTemplateRepository;

    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    public Machine getMachineById(Integer id) {
        Machine machine = machineRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Maschine mit ID " + id + " nicht gefunden."));
        return machine;
    }

    public Machine createMachine(MachineDto machineDto) {
        if (machineDto.name == null || machineDto.name.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }
        
        Machine machine = new Machine(machineDto.name);
        Machine saved = machineRepository.save(machine);
        return saved;
    }

    public Machine createMachineFromTemplate(CreateMachineFromTemplateDto dto) {
        //TODO: machine erstellen mit template

        //template finden oder fehler werfen
        MachineTemplate template = machineTemplateRepository.findById(dto.machineTemplateId).orElseThrow(() 
        -> new NotFoundException("Template mit ID " + dto.machineTemplateId + " nicht gefunden."));
        //Machine erstellen, template setzen
        Machine machine = new Machine(dto.machineName, template);

        for (AttributeInTemplate t : template.getAttributeTemplates()) {
            MachineAttribute attr = new MachineAttribute(machine, t.getAttributeInTemplateName(),t.getType());
            machine.addAttribute(attr);
        }

        Machine saved = machineRepository.save(machine);
        
        return saved;
        
    }

    public Machine updateMachine(Integer id, MachineDto machineDto) {
        if (machineDto.name == null || machineDto.name.trim().isEmpty()) {
            throw new IllegalArgumentException("Maschinenname darf nicht leer sein.");
        }

        Machine machine = machineRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Maschine mit ID " + id + " nicht gefunden."));
        
        machine.setName(machineDto.name);
        Machine saved = machineRepository.save(machine);
        return saved;
    }

    public void deleteMachine(Integer id) {
        if (!machineRepository.existsById(id)) {
            throw new NotFoundException("Maschine mit ID " + id + " nicht gefunden.");
        }
        machineRepository.deleteById(id);
    }
}