package com.cse435.resumescreening.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_matches")
@EntityListeners(AuditingEntityListener.class)
public class JobMatch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "DECIMAL(5,2)")
    private Double matchScore;
    
    @Column(columnDefinition = "TEXT")
    private String matchDetails;
    
    @Column(columnDefinition = "TEXT")
    private String skillMatchAnalysis;
    
    @Column(columnDefinition = "TEXT")
    private String experienceMatchAnalysis;
    
    @Column(columnDefinition = "TEXT")
    private String educationMatchAnalysis;
    
    @Enumerated(EnumType.STRING)
    private MatchStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum MatchStatus {
        PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED
    }
    
    public JobMatch() {}
    
    public JobMatch(Double matchScore, String matchDetails, Resume resume, Job job) {
        this.matchScore = matchScore;
        this.matchDetails = matchDetails;
        this.resume = resume;
        this.job = job;
        this.status = MatchStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
    
    public String getMatchDetails() { return matchDetails; }
    public void setMatchDetails(String matchDetails) { this.matchDetails = matchDetails; }
    
    public String getSkillMatchAnalysis() { return skillMatchAnalysis; }
    public void setSkillMatchAnalysis(String skillMatchAnalysis) { this.skillMatchAnalysis = skillMatchAnalysis; }
    
    public String getExperienceMatchAnalysis() { return experienceMatchAnalysis; }
    public void setExperienceMatchAnalysis(String experienceMatchAnalysis) { this.experienceMatchAnalysis = experienceMatchAnalysis; }
    
    public String getEducationMatchAnalysis() { return educationMatchAnalysis; }
    public void setEducationMatchAnalysis(String educationMatchAnalysis) { this.educationMatchAnalysis = educationMatchAnalysis; }
    
    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
    
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    
    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
