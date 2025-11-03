-- Fix User table: created_by must be NOT NULL (as defined in AuditableEntity)

-- Step 1: Set created_by for existing users (self-reference)
UPDATE "user" 
SET created_by = id 
WHERE created_by IS NULL;

-- Step 2: Make created_by NOT NULL
ALTER TABLE "user" 
ALTER COLUMN created_by SET NOT NULL;

-- Step 3: Add foreign key constraints for data integrity
-- (Consistent with V4 migration for other tables)
ALTER TABLE "user" 
ADD CONSTRAINT fk_user_created_by_self 
FOREIGN KEY (created_by) REFERENCES "user"(id);

ALTER TABLE "user" 
ADD CONSTRAINT fk_user_modified_by_self 
FOREIGN KEY (modified_by) REFERENCES "user"(id);