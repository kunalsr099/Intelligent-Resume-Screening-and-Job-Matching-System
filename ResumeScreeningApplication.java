package com.cse435.resumescreening;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ResumeScreeningApplication {
    public static void main(String[] args) {
        SpringApplication.run(ResumeScreeningApplication.class, args);
    }
}
