-- Add audit columns to machine table
ALTER TABLE machine ADD COLUMN created_by INTEGER;
ALTER TABLE machine ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE machine ADD COLUMN modified_by INTEGER;
ALTER TABLE machine ADD COLUMN modified_at TIMESTAMP;

-- Add audit columns to machine_attribute table
ALTER TABLE machine_attribute ADD COLUMN created_by INTEGER;
ALTER TABLE machine_attribute ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE machine_attribute ADD COLUMN modified_by INTEGER;
ALTER TABLE machine_attribute ADD COLUMN modified_at TIMESTAMP;

-- Add audit columns to attribute_value table
ALTER TABLE attribute_value ADD COLUMN created_by INTEGER;
ALTER TABLE attribute_value ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE attribute_value ADD COLUMN modified_by INTEGER;
ALTER TABLE attribute_value ADD COLUMN modified_at TIMESTAMP;

-- Add audit columns to machine_template table
ALTER TABLE machine_template ADD COLUMN created_by INTEGER;
ALTER TABLE machine_template ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE machine_template ADD COLUMN modified_by INTEGER;
ALTER TABLE machine_template ADD COLUMN modified_at TIMESTAMP;

-- Add audit columns to template_attribute table
ALTER TABLE template_attribute ADD COLUMN created_by INTEGER;
ALTER TABLE template_attribute ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE template_attribute ADD COLUMN modified_by INTEGER;
ALTER TABLE template_attribute ADD COLUMN modified_at TIMESTAMP;

-- Set created_by for all existing records to admin user (id=1)
UPDATE machine SET created_by = 1 WHERE created_by IS NULL;
UPDATE machine_attribute SET created_by = 1 WHERE created_by IS NULL;
UPDATE attribute_value SET created_by = 1 WHERE created_by IS NULL;
UPDATE machine_template SET created_by = 1 WHERE created_by IS NULL;
UPDATE template_attribute SET created_by = 1 WHERE created_by IS NULL;

-- Make created_by columns NOT NULL
ALTER TABLE machine ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE machine_attribute ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE attribute_value ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE machine_template ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE template_attribute ALTER COLUMN created_by SET NOT NULL;
