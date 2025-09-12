package com.examly.springapp.controller;

import com.examly.springapp.model.CourseModule;
import com.examly.springapp.service.CourseModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:8081",
"https://8081-acfdaebeabbdafadabdcfaceddbbabeaeefcea.premiumproject.examly.io"})
public class CourseModuleController {
     private static final Logger logger = LoggerFactory.getLogger(CourseModuleController.class);
    @Autowired
    private CourseModuleService service;
    
    @GetMapping
    public Map<String, Object> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String courseType,
            @RequestParam(required = false) String search) {
        
        Pageable paging = PageRequest.of(page, size, Sort.by("title"));
        Page<CourseModule> pageCourses;
        
        if (courseType != null && !courseType.isEmpty()) {
            pageCourses = service.findByCourseType(courseType, paging);
        } else if (search != null && !search.isEmpty()) {
            pageCourses = service.findByTitleContaining(search, paging);
        } else {
            pageCourses = service.getAllCourses(paging);
        }
        
        List<CourseModule> courses = pageCourses.getContent();
        
        Map<String, Object> response = new HashMap<>();
        response.put("courses", courses);
        response.put("currentPage", pageCourses.getNumber());
        response.put("totalItems", pageCourses.getTotalElements());
        response.put("totalPages", pageCourses.getTotalPages());
        
        return response;
    }
    
    @PostMapping
    public CourseModule addCourse(@RequestBody CourseModule course) {
        return service.addCourse(course);
    }
@PutMapping("/{id}/enroll")
public ResponseEntity<?> enrollStudent(@PathVariable Long id, @RequestParam String student) {
    try {
        CourseModule enrolledCourse = service.enrollStudent(id, student);
        return ResponseEntity.ok(enrolledCourse);
    } catch (RuntimeException e) {
        // Log the error
        logger.error("Enrollment failed for course {} and student {}: {}", id, student, e.getMessage());
        
        // Return detailed error response
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", e.getMessage());
        errorResponse.put("courseId", id);
        errorResponse.put("studentEmail", student);
        errorResponse.put("timestamp", new Date());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}

// Add debug endpoint
@GetMapping("/{id}/enrollment-debug")
public ResponseEntity<?> debugEnrollment(@PathVariable Long id, @RequestParam String student) {
    Map<String, Object> status = service.getEnrollmentStatus(id, student);
    return ResponseEntity.ok(status);
}
    
    @PutMapping("/{id}/progress")
    public ResponseEntity<?> updateProgress(@PathVariable Long id,
            @RequestParam String student,
            @RequestParam int progress) {
        try {
            CourseModule updatedCourse = service.updateProgress(id, student, progress);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/quiz")
    public List<String> getQuiz(@PathVariable Long id) {
        return service.getQuiz(id);
    }
    
    @PostMapping("/{id}/quiz")
    public String submitQuiz(@PathVariable Long id,
            @RequestParam String student,
            @RequestParam int score) {
        return service.submitQuiz(id, student, score);
    }
    
    @GetMapping("/types")
    public List<String> getCourseTypes() {
        return service.getDistinctCourseTypes();
    }
    
    // New endpoint to get enrolled courses for a student
    @GetMapping("/enrolled")
    public List<CourseModule> getEnrolledCourses(@RequestParam String studentEmail) {
        return service.getEnrolledCourses(studentEmail);
    }
    
    // New endpoint to check enrollment status
    @GetMapping("/{id}/enrollment-status")
    public Map<String, Boolean> checkEnrollmentStatus(@PathVariable Long id, @RequestParam String studentEmail) {
        boolean isEnrolled = service.isStudentEnrolled(id, studentEmail);
        return Map.of("enrolled", isEnrolled);
    }
}