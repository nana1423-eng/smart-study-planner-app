package com.smartstudy.planner.scheduler;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ScheduledSessionRepository extends JpaRepository<ScheduledSession, Long> {
    
    List<ScheduledSession> findByUserIdOrderByScheduledDateAsc(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ScheduledSession s WHERE s.user.id = :userId AND s.status IN ('PENDING', 'MISSED')")
    void deletePendingAndMissedByUserId(Long userId);
}
