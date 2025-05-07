package com.example.machine_management.controller;

import com.example.machine_management.models.Machine;
import com.example.machine_management.repository.MachineRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "http://localhost:3000")
public class MachineController {
    
    @Autowired
    private MachineRepository machineRepository;

    @GetMapping
    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }
}
