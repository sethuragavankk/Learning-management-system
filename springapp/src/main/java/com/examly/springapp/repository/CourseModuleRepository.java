package com.examly.springapp.repository;

import com.examly.springapp.model.CourseModule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
    
    Page<CourseModule> findByCourseType(String courseType, Pageable pageable);
    
    Page<CourseModule> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    @Query("SELECT DISTINCT c.courseType FROM CourseModule c WHERE c.courseType IS NOT NULL")
    List<String> findDistinctCourseTypes();
    
    // New method to find courses by enrolled student
    @Query(
    "SELECT c FROM CourseModule c JOIN c.enrolledStudents s WHERE s = :studentEmail"
    )
    List<CourseModule> findEnrolledCourses(
    @Param("studentEmail")
    String studentEmail
    );
}