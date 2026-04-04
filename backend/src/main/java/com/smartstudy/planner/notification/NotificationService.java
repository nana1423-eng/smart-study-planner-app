package com.smartstudy.planner.notification;

import com.smartstudy.planner.assignment.Assignment;
import com.smartstudy.planner.assignment.AssignmentRepository;
import com.smartstudy.planner.session.StudySession;
import com.smartstudy.planner.session.StudySessionRepository;
import com.smartstudy.planner.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudySessionRepository studySessionRepository;

    public NotificationService(NotificationRepository notificationRepository, 
                               AssignmentRepository assignmentRepository, 
                               StudySessionRepository studySessionRepository) {
        this.notificationRepository = notificationRepository;
        this.assignmentRepository = assignmentRepository;
        this.studySessionRepository = studySessionRepository;
    }

    public List<Notification> generateIntelligentNotifications(User user) {
        LocalDateTime now = LocalDateTime.now();
        List<Notification> recentNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        // 1. Deadline checks (Assignments due within 48h)
        List<Assignment> assignments = assignmentRepository.findByUserId(user.getId());
        for (Assignment assignment : assignments) {
            if (!"COMPLETED".equalsIgnoreCase(assignment.getStatus()) && assignment.getDeadline() != null) {
                long hoursUntil = ChronoUnit.HOURS.between(now, assignment.getDeadline());
                if (hoursUntil > 0 && hoursUntil <= 48) {
                    // Check if we already alerted them recently about this specific assignment
                    String msg = "Approaching deadline: " + assignment.getTitle() + " is due in " + hoursUntil + " hours.";
                    boolean alreadyAlerted = recentNotifications.stream()
                            .anyMatch(n -> "DEADLINE".equals(n.getType()) && n.getMessage().equals(msg) && ChronoUnit.HOURS.between(n.getCreatedAt(), now) < 24);
                    
                    if (!alreadyAlerted) {
                        createNotification(user, msg, "DEADLINE");
                        recentNotifications.add(new Notification(null, user, msg, "DEADLINE", false, now));
                    }
                }
            }
        }

        // 2. Inactivity detection (No study sessions in 3 days)
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(user.getId(), "COMPLETED");
        if (sessions.isEmpty() || ChronoUnit.DAYS.between(sessions.get(0).getStartTime(), now) >= 3) {
            boolean alreadyAlerted = recentNotifications.stream()
                            .anyMatch(n -> "INACTIVITY".equals(n.getType()) && ChronoUnit.HOURS.between(n.getCreatedAt(), now) < 24);
            if (!alreadyAlerted) {
                createNotification(user, "You haven't studied in a few days. Don't break your momentum! Start a quick 25-minute Pomodoro session.", "INACTIVITY");
            }
        }

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    private void createNotification(User user, String message, String type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setType(type);
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }
}
