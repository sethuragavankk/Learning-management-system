package com.examly.springapp.service;

import com.examly.springapp.model.CourseModule;
import com.examly.springapp.model.User;
import com.examly.springapp.model.ERole;
import com.examly.springapp.repository.CourseModuleRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CourseModuleService {
    
    @Autowired
    private CourseModuleRepository repo;
    
    @Autowired
    private UserRepository userRepository;
    
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
        @Transactional
    public CourseModule enrollStudent(Long id, String studentEmail) {
        CourseModule course = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Check if student exists and has STUDENT role
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + studentEmail));
        
        // Check if user has STUDENT role
        boolean isStudent = student.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_STUDENT);
        
        if (!isStudent) {
            throw new RuntimeException("User is not a student: " + studentEmail);
        }
        
        // Check if student is already enrolled
        if (course.getEnrolledStudents() != null && 
            course.getEnrolledStudents().contains(studentEmail)) {
            throw new RuntimeException("Student already enrolled in this course");
        }
        
        // Check course capacity
        if (course.getMaxCapacity() != null && 
            course.getEnrolledStudents() != null &&
            course.getEnrolledStudents().size() >= course.getMaxCapacity()) {
            throw new RuntimeException("Course is full. Cannot enroll more students");
        }
        
        // Initialize collections if null (important!)
        if (course.getEnrolledStudents() == null) {
            course.setEnrolledStudents(new ArrayList<>());
        }
        if (course.getProgress() == null) {
            course.setProgress(new HashMap<>());
        }
        if (course.getScores() == null) {
            course.setScores(new HashMap<>());
        }
        
        // Enroll student
        course.getEnrolledStudents().add(studentEmail);
        
        // Initialize progress for the student
        course.getProgress().put(studentEmail, 0);
        
        // Initialize score if needed
        course.getScores().putIfAbsent(studentEmail, 0);
        
        return repo.save(course);
    }
    
    public CourseModule updateProgress(Long id, String student, int progress) {
        CourseModule course = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        // Validate progress value
        if (progress < 0 || progress > 100) {
            throw new RuntimeException("Progress must be between 0 and 100");
        }
               // Ensure progress map is initialized
        if (course.getProgress() == null) {
            course.setProgress(new HashMap<>());
        }
        
        course.getProgress().put(student, progress);
        return repo.save(course);
    }
    
    public List<String> getQuiz(Long id) {
        CourseModule course = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        if (course.getQuizQuestions() == null) {
            return Collections.emptyList();
        }
        
        return course.getQuizQuestions();
    }
    
    public String submitQuiz(Long id, String student, int score) {
        CourseModule course = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Ensure scores map is initialized
        if (course.getScores() == null) {
            course.setScores(new HashMap<>());
        }
        
        course.getScores().put(student, score);
        repo.save(course);
        return "Score submitted!";
    }
    
    public List<String> getDistinctCourseTypes() {
        return repo.findDistinctCourseTypes();
    }
    
    // New method to get enrolled courses for a student
    public List<CourseModule> getEnrolledCourses(String studentEmail) {
        return repo.findEnrolledCourses(studentEmail);
    }
    
    // New method to check enrollment status
    public boolean isStudentEnrolled(Long courseId, String studentEmail) {
        Optional<CourseModule> course = repo.findById(courseId);
        return course.map(c -> 
            c.getEnrolledStudents() != null && 
            c.getEnrolledStudents().contains(studentEmail)
        ).orElse(false);
    }
    
    // Debug method to check course enrollment status
    public Map<String, Object> getEnrollmentStatus(Long courseId, String studentEmail) {
        Optional<CourseModule> courseOpt = repo.findById(courseId);
        
        if (!courseOpt.isPresent()) {
            return Map.of("error", "Course not found");
        }
              CourseModule course = courseOpt.get();
        boolean userExists = userRepository.findByEmail(studentEmail).isPresent();
        boolean isEnrolled = course.getEnrolledStudents() != null && 
                            course.getEnrolledStudents().contains(studentEmail);
        int currentEnrollment = course.getEnrolledStudents() != null ? 
                               course.getEnrolledStudents().size() : 0;
        boolean isFull = course.getMaxCapacity() != null && 
                        currentEnrollment >= course.getMaxCapacity();
        
        return Map.of(
            "courseExists", true,
            "userExists", userExists,
            "isEnrolled", isEnrolled,
            "currentEnrollment", currentEnrollment,
            "maxCapacity", course.getMaxCapacity(),
            "isFull", isFull
        );
    }
}