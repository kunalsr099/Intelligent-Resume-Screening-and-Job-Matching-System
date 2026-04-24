package com.cse435.resumescreening.controller;

import com.cse435.resumescreening.entity.JobMatch;
import com.cse435.resumescreening.service.JobMatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobMatchController {

    @Autowired
    private JobMatchService jobMatchService;

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<JobMatch>> getMatchesForJob(@PathVariable Long jobId, 
                                                         @RequestParam(defaultValue = "PENDING") String status,
                                                         Authentication authentication) {
        try {
            JobMatch.MatchStatus matchStatus = JobMatch.MatchStatus.valueOf(status.toUpperCase());
            List<JobMatch> matches = jobMatchService.getMatchesForJob(jobId, matchStatus, authentication.getName());
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/resume/{resumeId}")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('ADMIN')")
    public ResponseEntity<List<JobMatch>> getMatchesForResume(@PathVariable Long resumeId,
                                                           @RequestParam(defaultValue = "PENDING") String status,
                                                           Authentication authentication) {
        try {
            JobMatch.MatchStatus matchStatus = JobMatch.MatchStatus.valueOf(status.toUpperCase());
            List<JobMatch> matches = jobMatchService.getMatchesForResume(resumeId, matchStatus, authentication.getName());
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('CANDIDATE') or hasRole('ADMIN')")
    public ResponseEntity<List<JobMatch>> getMyMatches(@RequestParam(defaultValue = "PENDING") String status,
                                                      Authentication authentication) {
        try {
            JobMatch.MatchStatus matchStatus = JobMatch.MatchStatus.valueOf(status.toUpperCase());
            List<JobMatch> matches = jobMatchService.getMatchesForUser(matchStatus, authentication.getName());
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{matchId}/status")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobMatch> updateMatchStatus(@PathVariable Long matchId,
                                                    @RequestParam String status,
                                                    Authentication authentication) {
        try {
            JobMatch.MatchStatus newStatus = JobMatch.MatchStatus.valueOf(status.toUpperCase());
            JobMatch updatedMatch = jobMatchService.updateMatchStatus(matchId, newStatus, authentication.getName());
            return ResponseEntity.ok(updatedMatch);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/top/{jobId}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<JobMatch>> getTopMatchesForJob(@PathVariable Long jobId,
                                                             @RequestParam(defaultValue = "10") int limit,
                                                             Authentication authentication) {
        try {
            List<JobMatch> matches = jobMatchService.getTopMatchesForJob(jobId, limit, authentication.getName());
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{matchId}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long matchId, Authentication authentication) {
        try {
            jobMatchService.deleteMatch(matchId, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
