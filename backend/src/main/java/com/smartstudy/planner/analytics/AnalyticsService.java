package com.smartstudy.planner.analytics;

import com.smartstudy.planner.assignment.Assignment;
import com.smartstudy.planner.assignment.AssignmentRepository;
import com.smartstudy.planner.session.StudySession;
import com.smartstudy.planner.session.StudySessionRepository;
import com.smartstudy.planner.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final StudySessionRepository studySessionRepository;
    private final AssignmentRepository assignmentRepository;

    public AnalyticsService(StudySessionRepository studySessionRepository, AssignmentRepository assignmentRepository) {
        this.studySessionRepository = studySessionRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public SummaryDTO getSummary(User user) {
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(user.getId(), "COMPLETED");
        
        double totalHours = sessions.stream()
                .filter(s -> "STUDY".equals(s.getType()))
                .mapToInt(s -> s.getDurationMinutes() != null ? s.getDurationMinutes() : 0)
                .sum() / 60.0;
                
        int totalSessions = (int) sessions.stream().filter(s -> "STUDY".equals(s.getType())).count();

        List<Assignment> assignments = assignmentRepository.findByUserId(user.getId());
        long completedTasks = assignments.stream().filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus())).count();
        int completionRate = assignments.isEmpty() ? 0 : (int) ((completedTasks * 100) / assignments.size());

        int safePoints = user.getPoints() != null ? user.getPoints() : 0;
        int safeStreak = user.getStreak() != null ? user.getStreak() : 0;

        return new SummaryDTO(totalHours, totalSessions, completionRate, safePoints, safeStreak);
    }

    public List<WeeklyTrendDTO> getWeeklyTrend(User user) {
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(user.getId(), "COMPLETED");
        
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);
        
        Map<LocalDate, Double> dailyHours = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            dailyHours.put(weekAgo.plusDays(i), 0.0);
        }

        sessions.stream()
            .filter(s -> "STUDY".equals(s.getType()) && s.getStartTime() != null)
            .forEach(s -> {
                LocalDate sessionDate = s.getStartTime().toLocalDate();
                if (!sessionDate.isBefore(weekAgo) && !sessionDate.isAfter(today)) {
                    double hours = (s.getDurationMinutes() != null ? s.getDurationMinutes() : 0) / 60.0;
                    dailyHours.put(sessionDate, dailyHours.get(sessionDate) + hours);
                }
            });

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE"); // Mon, Tue, etc.
        List<WeeklyTrendDTO> trends = new ArrayList<>();
        for (Map.Entry<LocalDate, Double> entry : dailyHours.entrySet()) {
            trends.add(new WeeklyTrendDTO(entry.getKey().format(formatter), entry.getValue()));
        }
        return trends;
    }

    public List<SubjectStatsDTO> getSubjectStats(User user) {
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(user.getId(), "COMPLETED");
        
        Map<String, Double> subjectHours = new HashMap<>();
        
        sessions.stream()
            .filter(s -> "STUDY".equals(s.getType()) && s.getSubject() != null)
            .forEach(s -> {
                String subjectName = s.getSubject().getName();
                double hours = (s.getDurationMinutes() != null ? s.getDurationMinutes() : 0) / 60.0;
                subjectHours.put(subjectName, subjectHours.getOrDefault(subjectName, 0.0) + hours);
            });

        return subjectHours.entrySet().stream()
                .map(e -> new SubjectStatsDTO(e.getKey(), e.getValue()))
                .sorted((a, b) -> Double.compare(b.getStudyHours(), a.getStudyHours())) // Sort descending
                .collect(Collectors.toList());
    }
}
