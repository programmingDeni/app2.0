package com.example.machine_management.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.machine_management.models.user.User;
import com.example.machine_management.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // User Erstellen
    public User createUser(String email, String password) {
        // check email
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // user erstellen
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);

        // created bby setzen
        // savedUser.setCreatedBy(savedUser.getId());

        return savedUser;
    }

    // User nach email suchen
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // User nach id suchen
    public User findById(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    // check password
    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

}
