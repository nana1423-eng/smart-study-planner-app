package com.smartstudy.planner.scheduler;

import com.smartstudy.planner.assignment.Assignment;
import com.smartstudy.planner.assignment.AssignmentRepository;
import com.smartstudy.planner.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SchedulerService {

    private final ScheduledSessionRepository scheduledSessionRepository;
    private final AssignmentRepository assignmentRepository;

    private static final int DAILY_CAPACITY_MINUTES = 240; // Max 4 hours per day

    public SchedulerService(ScheduledSessionRepository scheduledSessionRepository, 
                            AssignmentRepository assignmentRepository) {
        this.scheduledSessionRepository = scheduledSessionRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<ScheduledSession> getSchedule(User user) {
        // Automatically mark past PENDING sessions as MISSED before returning
        List<ScheduledSession> sessions = scheduledSessionRepository.findByUserIdOrderByScheduledDateAsc(user.getId());
        LocalDate today = LocalDate.now();
        boolean changed = false;
        
        for (ScheduledSession s : sessions) {
            if ("PENDING".equals(s.getStatus()) && s.getScheduledDate().isBefore(today)) {
                s.setStatus("MISSED");
                changed = true;
            }
        }
        if (changed && sessions != null) {
            scheduledSessionRepository.saveAll(sessions);
        }
        return sessions;
    }

    @Transactional
    public List<ScheduledSession> generateSchedule(User user) {
        // 1. Clear out all future blocks that are still pending/missed to rebuild
        scheduledSessionRepository.deletePendingAndMissedByUserId(user.getId());

        // 2. Load all incomplete assignments
        List<Assignment> pendingAssignments = assignmentRepository.findByUserId(user.getId()).stream()
                .filter(a -> !"COMPLETED".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());

        if (pendingAssignments.isEmpty()) {
            return Collections.emptyList();
        }

        // 3. Sort logic: Closest deadline first. If same deadline, highest (Priority + Difficulty) first.
        pendingAssignments.sort((a, b) -> {
            if (a.getDeadline() != null && b.getDeadline() != null) {
                int dateCompare = a.getDeadline().toLocalDate().compareTo(b.getDeadline().toLocalDate());
                if (dateCompare != 0) return dateCompare;
            } else if (a.getDeadline() != null) {
                return -1;
            } else if (b.getDeadline() != null) {
                return 1;
            }

            int weightA = getPriorityWeight(a.getPriority()) + (a.getDifficulty() != null ? a.getDifficulty() : 1);
            int weightB = getPriorityWeight(b.getPriority()) + (b.getDifficulty() != null ? b.getDifficulty() : 1);
            return Integer.compare(weightB, weightA); // Descending weight
        });

        // 3. Determine daily capacity from user preferences (default to 4 hours)
        int dailyCapacityMinutes = (user.getDailyHours() != null && user.getDailyHours() > 0) 
                ? user.getDailyHours() * 60 
                : DAILY_CAPACITY_MINUTES;

        List<ScheduledSession> newSchedule = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        int currentDayLoad = 0;
        java.time.LocalTime currentStartTime = java.time.LocalTime.of(9, 0); 
        
        for (Assignment assignment : pendingAssignments) {
            int difficulty = assignment.getDifficulty() != null ? Math.max(1, assignment.getDifficulty()) : 2;
            int remainingMinutesNeeded = difficulty * 45; 

            while (remainingMinutesNeeded > 0) {
                int blockDuration = Math.min(Math.min(remainingMinutesNeeded, 90), dailyCapacityMinutes - currentDayLoad);

                if (blockDuration <= 0) {
                    // This day is completely full, move to next day
                    currentDate = currentDate.plusDays(1);
                    currentDayLoad = 0;
                    currentStartTime = java.time.LocalTime.of(9, 0);
                    continue; // Re-evaluate loop with new day
                }

                ScheduledSession session = new ScheduledSession();
                session.setUser(user);
                session.setAssignment(assignment);
                session.setSubject(assignment.getSubject());
                session.setDurationMinutes(blockDuration);
                session.setScheduledDate(currentDate);
                session.setStartTime(currentStartTime);
                session.setEndTime(currentStartTime.plusMinutes(blockDuration));
                session.setStatus("PENDING");
                
                newSchedule.add(session);
                currentDayLoad += blockDuration;
                remainingMinutesNeeded -= blockDuration;
                
                // Add 15 minute break mapping forward
                currentStartTime = currentStartTime.plusMinutes(blockDuration + 15);
            }
        }

        return scheduledSessionRepository.saveAll(newSchedule);
    }

    private int getPriorityWeight(String priority) {
        if (priority == null) return 1;
        switch (priority.toUpperCase()) {
            case "HIGH": return 3;
            case "MEDIUM": return 2;
            case "LOW": return 1;
            default: return 1;
        }
    }

    @Transactional
    public ScheduledSession moveSession(Long sessionId, User user, LocalDate newDate, java.time.LocalTime newStart) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID must not be null");
        }
        ScheduledSession session = scheduledSessionRepository.findById(sessionId).orElseThrow();
        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized modification");
        }
        
        session.setScheduledDate(newDate);
        if (newStart != null) {
            session.setStartTime(newStart);
            session.setEndTime(newStart.plusMinutes(session.getDurationMinutes()));
        }
        
        return scheduledSessionRepository.save(session);
    }
}
