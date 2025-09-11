package com.examly.springapp.controller;

import com.examly.springapp.model.CourseModule;
import com.examly.springapp.service.CourseModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:8081",
"https://8081-acfdaebeabbdafadabdcfaceddbbabeaeefcea.premiumproject.examly.io"})
public class CourseModuleController {
    
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
    public CourseModule enrollStudent(@PathVariable Long id, @RequestParam String student) {
        return service.enrollStudent(id, student);
    }
       @PutMapping("/{id}/progress")
    public CourseModule updateProgress(@PathVariable Long id,
            @RequestParam String student,
            @RequestParam int progress) {
        return service.updateProgress(id, student, progress);
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
}