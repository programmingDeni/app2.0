-- 1. Tabelle umbenennen (falls nötig)
ALTER TABLE attribute_in_template RENAME TO template_attribute;

-- Add user_id column to machine table
ALTER TABLE machine ADD COLUMN user_id INTEGER;

-- Add user_id column to machine_attribute table
ALTER TABLE machine_attribute ADD COLUMN user_id INTEGER;

-- Add user_id column to attribute_value table
ALTER TABLE attribute_value ADD COLUMN user_id INTEGER;

-- Add user_id column to machine_template table
ALTER TABLE machine_template ADD COLUMN user_id INTEGER;

-- Add user_id column to template_attribute table
ALTER TABLE template_attribute ADD COLUMN user_id INTEGER;

-- Set default admin user (id=1) for all existing records
UPDATE machine SET user_id = 1 WHERE user_id IS NULL;
UPDATE machine_attribute SET user_id = 1 WHERE user_id IS NULL;
UPDATE attribute_value SET user_id = 1 WHERE user_id IS NULL;
UPDATE machine_template SET user_id = 1 WHERE user_id IS NULL;
UPDATE template_attribute SET user_id = 1 WHERE user_id IS NULL;

-- Make user_id columns NOT NULL after setting default values
ALTER TABLE machine ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE machine_attribute ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE attribute_value ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE machine_template ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE template_attribute ALTER COLUMN user_id SET NOT NULL;
