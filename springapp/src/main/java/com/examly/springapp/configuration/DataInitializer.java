package com.examly.springapp.configuration;

import com.examly.springapp.model.ERole;
import com.examly.springapp.model.Role;
import com.examly.springapp.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Insert roles if they don't exist
        createRoleIfNotFound(ERole.ROLE_STUDENT);
        createRoleIfNotFound(ERole.ROLE_INSTRUCTOR);
        createRoleIfNotFound(ERole.ROLE_ADMIN);
    }

    private void createRoleIfNotFound(ERole roleName) {
        Role role = roleRepository.findByName(roleName).orElse(null);
        if (role == null) {
            role = new Role(roleName);
            roleRepository.save(role);
            System.out.println("Created role: " + roleName);
        }
    }
}