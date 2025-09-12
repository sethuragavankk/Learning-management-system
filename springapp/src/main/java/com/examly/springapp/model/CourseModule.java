package com.examly.springapp.model;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "course_modules")
public class CourseModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String courseType;
    
    private String instructor;
    
    private Double price;
    
    private Integer duration; // in hours
    
    private String difficultyLevel; // Beginner, Intermediate, Advanced
    
    @Column(name = "max_capacity")
    private Integer maxCapacity;
    
    private Boolean isActive = true;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;
    
    @ElementCollection
    @CollectionTable(name = "course_quiz_questions", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "question")
    private List<String> quizQuestions = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "course_enrolled_students", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "student_email")
    private List<String> enrolledStudents = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "course_progress", joinColumns = @JoinColumn(name = "course_id"))
    @MapKeyColumn(name = "student_email")
    @Column(name = "progress_percentage")
    private Map<String, Integer> progress = new HashMap<>();
    
    @ElementCollection
    @CollectionTable(name = "course_scores", joinColumns = @JoinColumn(name = "course_id"))
    @MapKeyColumn(name = "student_email")
    @Column(name = "quiz_score")
    private Map<String, Integer> scores = new HashMap<>();
    
    // PrePersist and PreUpdate methods
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
    
    // Constructors
    public CourseModule() {}
    
    public CourseModule(String title, String description, String courseType) {
        this.title = title;
        this.description = description;
        this.courseType = courseType;
    }
         // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCourseType() { return courseType; }
    public void setCourseType(String courseType) { this.courseType = courseType; }
    
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    
    public List<String> getQuizQuestions() { return quizQuestions; }
    public void setQuizQuestions(List<String> quizQuestions) { this.quizQuestions = quizQuestions; }
    
    public List<String> getEnrolledStudents() { return enrolledStudents; }
    public void setEnrolledStudents(List<String> enrolledStudents) { this.enrolledStudents = enrolledStudents; }
    
    public Map<String, Integer> getProgress() { return progress; }
    public void setProgress(Map<String, Integer> progress) { this.progress = progress; }
    
    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }
    
    // Helper methods
    public boolean isFull() {
        return maxCapacity != null && enrolledStudents.size() >= maxCapacity;
    }
       public int getEnrollmentCount() {
        return enrolledStudents.size();
    }
    
    public boolean isStudentEnrolled(String studentEmail) {
        return enrolledStudents.contains(studentEmail);
    }
    
    public Integer getStudentProgress(String studentEmail) {
        return progress.getOrDefault(studentEmail, 0);
    }
    
    public Integer getStudentScore(String studentEmail) {
        return scores.getOrDefault(studentEmail, 0);
    }
}