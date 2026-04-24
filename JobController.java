package com.cse435.resumescreening.controller;

import com.cse435.resumescreening.entity.Job;
import com.cse435.resumescreening.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Job> createJob(@RequestBody Job job, Authentication authentication) {
        try {
            Job createdJob = jobService.createJob(job, authentication.getName());
            return ResponseEntity.ok(createdJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<Job>> getAllJobs(@RequestParam(required = false) String location,
                                            @RequestParam(required = false) String jobType,
                                            @RequestParam(required = false) String skill) {
        List<Job> jobs = jobService.searchJobs(location, jobType, skill);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<Job>> getMyJobs(Authentication authentication) {
        List<Job> jobs = jobService.getJobsByRecruiter(authentication.getName());
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Job> updateJob(@PathVariable Long id,
                                     @RequestBody Job jobDetails,
                                     Authentication authentication) {
        try {
            Job updatedJob = jobService.updateJob(id, jobDetails, authentication.getName());
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication authentication) {
        try {
            jobService.deleteJob(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/match")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<?> findMatchesForJob(@PathVariable Long id, Authentication authentication) {
        try {
            jobService.findMatchesForJob(id, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
