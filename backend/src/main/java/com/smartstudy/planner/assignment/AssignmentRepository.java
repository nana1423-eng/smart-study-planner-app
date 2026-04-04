package com.smartstudy.planner.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByUserId(Long userId);
    List<Assignment> findBySubjectId(Long subjectId);
    void deleteBySubjectId(Long subjectId);

    @Query("SELECT a FROM Assignment a WHERE a.user.id = :userId AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Assignment> searchByQueryAndUserId(@Param("query") String query, @Param("userId") Long userId);
}
