package com.examly.springapp.controller;

import com.examly.springapp.model.CourseModule;
import com.examly.springapp.service.CourseModuleService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<CourseModule> getAllCourses() {
        return service.getAllCourses();
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
}