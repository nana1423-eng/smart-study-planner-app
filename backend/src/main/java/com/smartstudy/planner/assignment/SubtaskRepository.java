package com.smartstudy.planner.assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
    List<Subtask> findByAssignmentIdOrderByOrderIndexAsc(Long assignmentId);

    @Query("SELECT s FROM Subtask s WHERE s.assignment.user.id = :userId AND LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Subtask> searchByQueryAndUserId(@Param("query") String query, @Param("userId") Long userId);
}
