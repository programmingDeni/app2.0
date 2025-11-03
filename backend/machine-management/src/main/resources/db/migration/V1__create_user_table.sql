-- Create user table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_by INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by INTEGER,
    modified_at TIMESTAMP
);

-- Create default admin user for migration purposes
-- Password is 'admin123' hashed with BCrypt (strength 10)
INSERT INTO "user" (email, password, first_name, last_name, created_at)
VALUES ('admin@example.com', '$2a$10$rB.nLq8Gx0S0wGOzPJfbJeVWJqX0p9UXZHqKXxPx8KqKQZHx9x9x9', 
'Admin', 'User', CURRENT_TIMESTAMP);
