package com.examly.springapp.controller;

import com.examly.springapp.model.ERole;
import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.Payload.request.LoginRequest;
import com.examly.springapp.Payload.request.SignupRequest;
import com.examly.springapp.Payload.response.JwtResponse;
import com.examly.springapp.Payload.response.MessageResponse;
import com.examly.springapp.repository.RoleRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.jwt.JwtUtils;
import com.examly.springapp.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
      
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();        
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,  userDetails.getId(),  userDetails.getName(),  userDetails.getEmail(), roles));
    }
    @PostMapping("/signup")
public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getName(), 
                         signUpRequest.getEmail(),
                         encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
        Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(studentRole);
    } else {
        strRoles.forEach(role -> {
            ERole roleEnum;
            switch (role.toLowerCase()) {
                case "admin":
                    roleEnum = ERole.ROLE_ADMIN;
                    break;
                case "instructor":
                    roleEnum = ERole.ROLE_INSTRUCTOR;
                    break;
                case "student":
                default:
                    roleEnum = ERole.ROLE_STUDENT;
                    break;
            }
            
            Role dbRole = roleRepository.findByName(roleEnum)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(dbRole);
        });
    }
    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
}
   
}