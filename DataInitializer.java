package com.cse435.resumescreening.config;

import com.cse435.resumescreening.entity.User;
import com.cse435.resumescreening.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default users if they don't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                "admin",
                "admin@example.com",
                passwordEncoder.encode("admin123"),
                User.UserRole.ADMIN
            );
            admin.setFirstName("Admin");
            admin.setLastName("User");
            userRepository.save(admin);
            System.out.println("Default admin user created: username=admin, password=admin123");
        }

        if (!userRepository.existsByUsername("recruiter")) {
            User recruiter = new User(
                "recruiter",
                "recruiter@example.com",
                passwordEncoder.encode("recruiter123"),
                User.UserRole.RECRUITER
            );
            recruiter.setFirstName("Recruiter");
            recruiter.setLastName("User");
            userRepository.save(recruiter);
            System.out.println("Default recruiter user created: username=recruiter, password=recruiter123");
        }

        if (!userRepository.existsByUsername("candidate")) {
            User candidate = new User(
                "candidate",
                "candidate@example.com",
                passwordEncoder.encode("candidate123"),
                User.UserRole.CANDIDATE
            );
            candidate.setFirstName("Candidate");
            candidate.setLastName("User");
            userRepository.save(candidate);
            System.out.println("Default candidate user created: username=candidate, password=candidate123");
        }

        if (!userRepository.existsByUsername("Pappu")) {
            User pappu = new User(
                "Pappu",
                "pappu@example.com",
                passwordEncoder.encode("password123"),
                User.UserRole.CANDIDATE
            );
            pappu.setFirstName("Pappu");
            pappu.setLastName("User");
            userRepository.save(pappu);
            System.out.println("Default user Pappu created: username=Pappu, password=password123");
        }
    }
}
