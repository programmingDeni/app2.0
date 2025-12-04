package com.example.machine_management.services.templates;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.machine_management.dto.AttributeInTemplate.TemplateAttributeDto;
import com.example.machine_management.dto.MachineTemplates.CreateMachineTemplateWithAttributesDto;
import com.example.machine_management.dto.MachineTemplates.MachineTemplateDto;
import com.example.machine_management.models.template.MachineTemplate;
import com.example.machine_management.models.template.TemplateAttribute;
import com.example.machine_management.repository.MachineTemplateRepository;
import com.example.machine_management.services.abstracts.CrudService;
import com.example.machine_management.util.SecurityUtils;
import com.example.machine_management.mapper.MachineTemplateMapper;

@Service
public class MachineTemplateService extends CrudService<MachineTemplate, Integer, MachineTemplateDto> {

        //repo 
        private final MachineTemplateRepository machineTemplateRepository;

        @Autowired
        public MachineTemplateService(
                        MachineTemplateRepository machineTemplateRepository,
                        MachineTemplateMapper machineTemplateMapper) {
                super(machineTemplateRepository, machineTemplateMapper);
                this.machineTemplateRepository = machineTemplateRepository;
        }

        // Template CRUD

        @Override
        protected Optional<MachineTemplate> userFindByIdLazy(Integer id, Integer userId) {
                return machineTemplateRepository.findByIdAndUserId(id, userId);
        }

        @Override
        protected Optional<MachineTemplate> userFindByIdEager(Integer id, Integer userId) {
                return machineTemplateRepository.findByIdWithAttributesAndUserId(id, userId);
        }

        @Override
        protected Optional<MachineTemplate> adminFindByIdEager(Integer id) {
                // TODO Auto-generated method stub
                throw new UnsupportedOperationException("Unimplemented method 'adminFindByIdEager'");
        }

        @Override
        protected List<MachineTemplate> adminFindAllEager() {
                // TODO Auto-generated method stub
                throw new UnsupportedOperationException("Unimplemented method 'adminFindAllEager'");
        }



        @Override
        protected MachineTemplate createEntity(MachineTemplateDto dto) {
                validateTemplateDto(dto);
                //die attribute werden in speziellem service verwaltet
                return new MachineTemplate(dto.templateName);
        }

        @Override
        protected List<MachineTemplate> eagerGetAllUserEntities(Integer userId) {
                return machineTemplateRepository.findAllWithAttributeTemplatesByUserId(userId);
        }
        

        @Override
        protected List<MachineTemplate> lazyGetAllUserEntities(Integer userId) {               
                return machineTemplateRepository.findAllByUserId(userId);
        }


        @Override
        protected MachineTemplate updateEntity(MachineTemplate existingEntity, MachineTemplateDto dto) {
                validateTemplateDto(dto);
                //die attribtue werden in speziellem serivce verwaltet
                existingEntity.setTemplateName(dto.templateName);
                return existingEntity; 
        }


        public MachineTemplate createTemplateWithAttribtues(CreateMachineTemplateWithAttributesDto dto){                
                Integer userId = SecurityUtils.getCurrentUserId();

                //validation ins dto verschieben / verschoben
                MachineTemplate created = new MachineTemplate(dto.templateName);
                created.setUserId(userId);

                for (TemplateAttributeDto templateAttributeDto : dto.attributeTemplates) {
                        TemplateAttribute templateAttribute = new TemplateAttribute();
                        templateAttribute.setAttributeInTemplateName(templateAttributeDto.templateAttributeName);
                        templateAttribute.setType(templateAttributeDto.templateAttributeType);
                        templateAttribute.setMachineTemplate(created);
                        templateAttribute.setUserId(userId);
                        created.addAttribute(templateAttribute);
                }

                return machineTemplateRepository.save(created);
        }



        //HELPER
        private void validateTemplateDto(MachineTemplateDto dto){
                if (dto == null) {
                        throw new IllegalArgumentException("DTO darf nicht null sein");
                }

                if (dto.templateName == null || dto.templateName.trim().isEmpty()) {
                        throw new IllegalArgumentException("TemplateName darf nicht leer sein");
                }

        }
}