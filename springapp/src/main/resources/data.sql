-- Insert roles if they don't exist
INSERT IGNORE INTO roles (name) VALUES ('ROLE_STUDENT');
INSERT IGNORE INTO roles (name) VALUES ('ROLE_INSTRUCTOR');
INSERT IGNORE INTO roles (name) VALUES ('ROLE_ADMIN');