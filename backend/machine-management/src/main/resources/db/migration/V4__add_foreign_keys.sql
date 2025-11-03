-- Add foreign key constraints for user_id columns
ALTER TABLE machine
    ADD CONSTRAINT fk_machine_user
    FOREIGN KEY (user_id)
    REFERENCES "user"(id)
    ON DELETE CASCADE;

ALTER TABLE machine_attribute
    ADD CONSTRAINT fk_machine_attribute_user
    FOREIGN KEY (user_id)
    REFERENCES "user"(id)
    ON DELETE CASCADE;

ALTER TABLE attribute_value
    ADD CONSTRAINT fk_attribute_value_user
    FOREIGN KEY (user_id)
    REFERENCES "user"(id)
    ON DELETE CASCADE;

ALTER TABLE machine_template
    ADD CONSTRAINT fk_machine_template_user
    FOREIGN KEY (user_id)
    REFERENCES "user"(id)
    ON DELETE CASCADE;

ALTER TABLE template_attribute
    ADD CONSTRAINT fk_template_attribute_user
    FOREIGN KEY (user_id)
    REFERENCES "user"(id)
    ON DELETE CASCADE;

-- Add foreign key constraints for audit columns (created_by, modified_by)
ALTER TABLE "user"
    ADD CONSTRAINT fk_user_created_by
    FOREIGN KEY (created_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE "user"
    ADD CONSTRAINT fk_user_modified_by
    FOREIGN KEY (modified_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE machine
    ADD CONSTRAINT fk_machine_created_by
    FOREIGN KEY (created_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE machine
    ADD CONSTRAINT fk_machine_modified_by
    FOREIGN KEY (modified_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE machine_attribute
    ADD CONSTRAINT fk_machine_attribute_created_by
    FOREIGN KEY (created_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE machine_attribute
    ADD CONSTRAINT fk_machine_attribute_modified_by
    FOREIGN KEY (modified_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE attribute_value
    ADD CONSTRAINT fk_attribute_value_created_by
    FOREIGN KEY (created_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE attribute_value
    ADD CONSTRAINT fk_attribute_value_modified_by
    FOREIGN KEY (modified_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE machine_template
    ADD CONSTRAINT fk_machine_template_created_by
    FOREIGN KEY (created_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE machine_template
    ADD CONSTRAINT fk_machine_template_modified_by
    FOREIGN KEY (modified_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE template_attribute
    ADD CONSTRAINT fk_template_attribute_created_by
    FOREIGN KEY (created_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;

ALTER TABLE template_attribute
    ADD CONSTRAINT fk_template_attribute_modified_by
    FOREIGN KEY (modified_by)
    REFERENCES "user"(id)
    ON DELETE SET NULL;
