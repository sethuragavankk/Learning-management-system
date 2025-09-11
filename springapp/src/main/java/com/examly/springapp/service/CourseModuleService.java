package com.examly.springapp.service;

import com.examly.springapp.model.CourseModule;
import com.examly.springapp.repository.CourseModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CourseModuleService {
    
    @Autowired
    private CourseModuleRepository repo;
    
    public Page<CourseModule> getAllCourses(Pageable pageable) {
        return repo.findAll(pageable);
    }
    
    public Page<CourseModule> findByCourseType(String courseType, Pageable pageable) {
        return repo.findByCourseType(courseType, pageable);
    }
    
    public Page<CourseModule> findByTitleContaining(String title, Pageable pageable) {
        return repo.findByTitleContainingIgnoreCase(title, pageable);
    }
    
    public CourseModule addCourse(CourseModule course) {
        return repo.save(course);
    }
    
    public CourseModule enrollStudent(Long id, String student) {
        CourseModule course = repo.findById(id).orElseThrow();
        if (!course.getEnrolledStudents().contains(student)) {
            course.getEnrolledStudents().add(student);
        }
        return repo.save(course);
    }
    
    public CourseModule updateProgress(Long id, String student, int progress) {
        CourseModule course = repo.findById(id).orElseThrow();
        course.getProgress().put(student, progress);
        return repo.save(course);
    }
    
    public List<String> getQuiz(Long id) {
        return repo.findById(id).orElseThrow().getQuizQuestions();
    }
    
    public String submitQuiz(Long id, String student, int score) {
        CourseModule course = repo.findById(id).orElseThrow();
        course.getScores().put(student, score);
        repo.save(course);
        return "Score submitted!";
    }
    
    public List<String> getDistinctCourseTypes() {
        return repo.findDistinctCourseTypes();
    }
}