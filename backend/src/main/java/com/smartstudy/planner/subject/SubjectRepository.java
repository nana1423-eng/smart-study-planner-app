package com.smartstudy.planner.subject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByUserId(Long userId);

    @Query("SELECT s FROM Subject s WHERE s.user.id = :userId AND LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Subject> searchByQueryAndUserId(@Param("query") String query, @Param("userId") Long userId);
}
