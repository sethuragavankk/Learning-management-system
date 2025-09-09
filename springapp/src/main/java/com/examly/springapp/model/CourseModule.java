package com.examly.springapp.model;

import javax.persistence.*;
import java.util.*;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
public class CourseModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @ElementCollection
    private List<String> quizQuestions = new ArrayList<>();
    @ElementCollection
    private List<String> enrolledStudents = new ArrayList<>();
    @ElementCollection
    @MapKeyColumn(name = "student")
    @Column(name = "progress")
    // @Schema(example = "{\"prop1\":0}")
    private Map<String, Integer> progress = new HashMap<>();
    @ElementCollection
    @MapKeyColumn(name = "student")
    @Column(name = "score")
    // @Schema(example = "{\"prop1\":0}")
    private Map<String, Integer> scores = new HashMap<>();
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getQuizQuestions() { return quizQuestions; }
    public void setQuizQuestions(List<String> quizQuestions) { this.quizQuestions = quizQuestions; }
    public List<String> getEnrolledStudents() { return enrolledStudents; }
    public void setEnrolledStudents(List<String> enrolledStudents) { this.enrolledStudents = enrolledStudents; }
    public Map<String, Integer> getProgress() { return progress; }
    public void setProgress(Map<String, Integer> progress) { this.progress = progress; }
    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }

}