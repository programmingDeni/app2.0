-- V6__make_user_created_by_nullable.sql
ALTER TABLE "user" 
ALTER COLUMN created_by DROP NOT NULL;