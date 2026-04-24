package com.cse435.resumescreening.controller;

import com.cse435.resumescreening.entity.Resume;
import com.cse435.resumescreening.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Resume> uploadResume(@RequestParam("file") MultipartFile file,
                                            @RequestParam("title") String title,
                                            Authentication authentication) {
        try {
            Resume resume = resumeService.uploadResume(file, title, authentication.getName());
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<Resume>> getMyResumes(Authentication authentication) {
        List<Resume> resumes = resumeService.getResumesByUser(authentication.getName());
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id, Authentication authentication) {
        Optional<Resume> resume = resumeService.getResumeById(id, authentication.getName(), authentication.getAuthorities());
        return resume.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id,
                                             @RequestBody Resume resumeDetails,
                                             Authentication authentication) {
        try {
            Resume updatedResume = resumeService.updateResume(id, resumeDetails, authentication.getName());
            return ResponseEntity.ok(updatedResume);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id, Authentication authentication) {
        try {
            resumeService.deleteResume(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<Resume>> searchResumes(@RequestParam(required = false) String skill,
                                                    @RequestParam(required = false) String experience) {
        List<Resume> resumes = resumeService.searchResumes(skill, experience);
        return ResponseEntity.ok(resumes);
    }

    @PostMapping("/{id}/process")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('ADMIN')")
    public ResponseEntity<Resume> processResume(@PathVariable Long id, Authentication authentication) {
        try {
            Resume processedResume = resumeService.processResume(id, authentication.getName());
            return ResponseEntity.ok(processedResume);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
