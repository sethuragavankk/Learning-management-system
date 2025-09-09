package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.examly.springapp.model.CourseModule;
@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {

}
