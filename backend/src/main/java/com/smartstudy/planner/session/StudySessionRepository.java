package com.smartstudy.planner.session;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserId(Long userId);
    List<StudySession> findByUserIdOrderByStartTimeDesc(Long userId);
    List<StudySession> findByUserIdAndStatusOrderByStartTimeDesc(Long userId, String status);
}
