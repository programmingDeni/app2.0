package com.example.machine_management.services;

import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machine_management.repository.AttributeValueRepository;
import com.example.machine_management.services.abstracts.ParentManagementService;
import com.example.machine_management.services.machine.MachineAttributeOperationsService;
import com.example.machine_management.dto.AttributeValue.AttributeValueDto;
import com.example.machine_management.dto.AttributeValue.CreateAttributeValueDto;
import com.example.machine_management.mapper.AttributeValueMapper;
import com.example.machine_management.models.machine.AttributeValue;
import com.example.machine_management.models.machine.MachineAttribute;

@Service
public class AttributeValueService extends ParentManagementService<AttributeValue, Integer, AttributeValueDto, CreateAttributeValueDto, MachineAttribute, Integer>  {

    private final AttributeValueRepository attributeValueRepository;

    private final MachineAttributeOperationsService machineAttributeService;

    @Autowired
    public AttributeValueService(
            AttributeValueRepository attributeValueRepository,
            AttributeValueMapper mapper,
            MachineAttributeOperationsService machineAttributeService) {
        super(attributeValueRepository);
        this.attributeValueRepository = attributeValueRepository;
        this.machineAttributeService = machineAttributeService;
    }

    private void validateAttributeValueDto(AttributeValueDto dto){
        if(dto.attributeValueYear == 0 || dto.attributeValueYear <= 1800){
            throw new IllegalArgumentException("AttributeValueYear problem");
        }
        if(dto.attributeValue == null){
            throw new IllegalArgumentException("AttributeValue darf nicht fehlen");
        }
        if(dto.machineAttributeId == null){
            throw new IllegalArgumentException("Atrtibute id darf nciht fehlen");
        }
            /**
             *  FELDER DIE ICH JETZT NICHT BEHANDELT HABE 
            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
            public LocalDateTime zuletztGeprueft;

            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
            public LocalDateTime zuletztGetauscht;
            */
    }

    @Override
    protected MachineAttribute eagerFindParentById(Integer parentID) {
        return machineAttributeService.userFindById(parentID, true);
    }

    @Override
    protected MachineAttribute lazyFindParentById(Integer parentId) {
        return machineAttributeService.userFindById(parentId, false);
    }

    //brauche glaub die struktur des parent findens nicht 
    // ich kann ja das eager load vom parent einfach rufen?
    @Override
    protected List<AttributeValue> eagerFindEntitiesByParentId(Integer parentId) {
        //Integer userId = SecurityUtils.getCurrentUserId();
        //return this.attributeValueRepository.lazyFindByMachineAttributeIdAndUserId(parentId, userId);
        //throw new UnsupportedOperationException("Unimplemented method 'eagerFindEntitiesByParentId'");
        //TODO: was ist damit?
        return null;
    }

    @Override
    protected List<AttributeValue> lazyFindEntitiesByParentId(Integer parentId) {
        //Integer userId = SecurityUtils.getCurrentUserId();
        //return this.attributeValueRepository.eagerFindByMachineAttributeIdAndUserId(parentId,userId);
        //TODO: was ist hiermit
        return null;
    }

    @Override
    protected void removeEntityFromParent(Integer parentId, AttributeValue entity) {
        MachineAttribute parent = lazyFindParentById(parentId);
        parent.removeAttributeValue(entity);
    }

    @Override
    protected AttributeValue createEntity(CreateAttributeValueDto dto, MachineAttribute parent) {
        AttributeValueDto attributeValueDto = new AttributeValueDto(dto.attributeValueYear,dto.attributeId, dto.attributeValue);
        validateAttributeValueDto(attributeValueDto);
        return new AttributeValue(
            parent,
            attributeValueDto.attributeValueYear,
            attributeValueDto.attributeValue
            );
    }

    @Override
    protected AttributeValue updateEntity(AttributeValue existingEntity, AttributeValueDto updateDto) {
        validateAttributeValueDto(updateDto);
        existingEntity.setAttributeValue(updateDto.attributeValue);
        existingEntity.setAttributeValueYear(updateDto.attributeValueYear);
        return existingEntity;
    }

    @Override
    protected void addEntityToParent(MachineAttribute parent, AttributeValue entity) {
        parent.addAttributeValue(entity);
    }

    @Override
    protected Optional<AttributeValue> userFindByIdLazy(Integer id, Integer userId) {
        return attributeValueRepository.findByIdAndUserId(id, userId);
    }

    @Override
    protected Optional<AttributeValue> userFindByIdEager(Integer id, Integer userId) {
        // diese methode wird nicht gebraucht es hat noch keine children
        //throw new UnsupportedOperationException("Unimplemented method 'userFindByIdEager'");
        //TODO: was ist hiermit?
        return null;
    }

    @Override
    protected Optional<AttributeValue> adminFindByIdEager(Integer id) {
        return attributeValueRepository.findById(id);
    }

    @Override
    protected List<AttributeValue> adminFindAllEager() {
        return attributeValueRepository.findAll();
    }



}
