package com.smartstudy.planner.insights;

import com.smartstudy.planner.assignment.Assignment;
import com.smartstudy.planner.assignment.AssignmentRepository;
import com.smartstudy.planner.session.StudySession;
import com.smartstudy.planner.session.StudySessionRepository;
import com.smartstudy.planner.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InsightService {

    private final StudySessionRepository studySessionRepository;
    private final AssignmentRepository assignmentRepository;

    public InsightService(StudySessionRepository studySessionRepository, AssignmentRepository assignmentRepository) {
        this.studySessionRepository = studySessionRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<InsightDTO> generateInsights(User user) {
        List<InsightDTO> insights = new ArrayList<>();
        
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(user.getId(), "COMPLETED");
        List<Assignment> assignments = assignmentRepository.findByUserId(user.getId());

        if (sessions.size() < 3) {
            insights.add(new InsightDTO(
                "Not Enough Data", 
                "Complete a few more study sessions to unlock personalized AI insights into your habits.", 
                "NEUTRAL", 
                "TIME"
            ));
            return insights;
        }

        insights.add(generateBestStudyTimeInsight(sessions));
        insights.add(generateWeakSubjectInsight(sessions, assignments));
        insights.add(generateConsistencyInsight(sessions));
        insights.add(generateProductivityTrendInsight(sessions));

        // Filter out any nulls if an insight couldn't be cleanly generated
        return insights.stream().filter(Objects::nonNull).collect(Collectors.toList());
    }

    private InsightDTO generateBestStudyTimeInsight(List<StudySession> sessions) {
        int morning = 0;   // 5 - 11
        int afternoon = 0; // 12 - 16
        int evening = 0;   // 17 - 20
        int night = 0;     // 21 - 4

        for (StudySession s : sessions) {
            if (s.getStartTime() == null) continue;
            int hour = s.getStartTime().getHour();
            if (hour >= 5 && hour < 12) morning++;
            else if (hour >= 12 && hour < 17) afternoon++;
            else if (hour >= 17 && hour < 21) evening++;
            else night++;
        }

        Map<String, Integer> counts = new HashMap<>();
        counts.put("Morning (5am - 12pm)", morning);
        counts.put("Afternoon (12pm - 5pm)", afternoon);
        counts.put("Evening (5pm - 9pm)", evening);
        counts.put("Night (9pm - 5am)", night);

        String bestTime = Collections.max(counts.entrySet(), Map.Entry.comparingByValue()).getKey();

        return new InsightDTO(
            "Optimal Focus Window",
            "You complete most of your sessions in the " + bestTime + ". Try scheduling difficult tasks during this window.",
            "POSITIVE",
            "TIME"
        );
    }

    private InsightDTO generateWeakSubjectInsight(List<StudySession> sessions, List<Assignment> assignments) {
        Map<String, Integer> pendingBySubject = new HashMap<>();
        
        for (Assignment a : assignments) {
            if (!"COMPLETED".equalsIgnoreCase(a.getStatus()) && a.getSubject() != null) {
                String subName = a.getSubject().getName();
                pendingBySubject.put(subName, pendingBySubject.getOrDefault(subName, 0) + 1);
            }
        }

        if (!pendingBySubject.isEmpty()) {
            String weakest = Collections.max(pendingBySubject.entrySet(), Map.Entry.comparingByValue()).getKey();
            int incompleteCount = pendingBySubject.get(weakest);
            
            if (incompleteCount > 2) {
                return new InsightDTO(
                    "Backlog Warning: " + weakest,
                    "You have " + incompleteCount + " pending assignments for " + weakest + ". Consider making this your next study priority.",
                    "WARNING",
                    "ALERT"
                );
            }
        }

        // Fallback: check lowest study time if no backlog warning was fired
        Map<String, Double> hoursBySub = new HashMap<>();
        for (StudySession s : sessions) {
            if (s.getSubject() != null && "STUDY".equals(s.getType())) {
                String sub = s.getSubject().getName();
                hoursBySub.put(sub, hoursBySub.getOrDefault(sub, 0.0) + (s.getDurationMinutes() != null ? s.getDurationMinutes() : 0));
            }
        }
        
        if (!hoursBySub.isEmpty()) {
            String lowest = Collections.min(hoursBySub.entrySet(), Map.Entry.comparingByValue()).getKey();
            return new InsightDTO(
                "Subject Focus: " + lowest,
                "You've spent the least amount of time studying " + lowest + " recently. Make sure you aren't ignoring it!",
                "INFO",
                "CALENDAR"
            );
        }

        return new InsightDTO("All Caught Up", "You have a balanced track record across your active subjects.", "POSITIVE", "CALENDAR");
    }

    private InsightDTO generateConsistencyInsight(List<StudySession> sessions) {
        LocalDate today = LocalDate.now();
        Set<LocalDate> studyDays = sessions.stream()
            .filter(s -> s.getStartTime() != null)
            .map(s -> s.getStartTime().toLocalDate())
            .filter(d -> ChronoUnit.DAYS.between(d, today) <= 14)
            .collect(Collectors.toSet());

        if (studyDays.size() >= 10) {
            return new InsightDTO(
                "Elite Consistency",
                "You've studied on " + studyDays.size() + " of the last 14 days. This daily consistency is the key to deep retention.",
                "POSITIVE",
                "TREND_UP"
            );
        } else if (studyDays.size() <= 4) {
            return new InsightDTO(
                "Binge Studying Detected",
                "You've only studied on " + studyDays.size() + " of the last 14 days. Try shorter, daily sessions to prevent burnout and improve memory.",
                "WARNING",
                "ALERT"
            );
        }

        return new InsightDTO(
            "Steady Pace",
            "You are maintaining a moderately consistent study rhythm. Try inserting 25-minute Pomodoro sessions on your off days.",
            "INFO",
            "CALENDAR"
        );
    }

    private InsightDTO generateProductivityTrendInsight(List<StudySession> sessions) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekAgo = now.minusDays(7);
        LocalDateTime twoWeeksAgo = now.minusDays(14);

        int currentWeekMins = 0;
        int lastWeekMins = 0;

        for (StudySession s : sessions) {
            if (s.getStartTime() == null || s.getDurationMinutes() == null || !"STUDY".equals(s.getType())) continue;
            
            if (s.getStartTime().isAfter(oneWeekAgo)) {
                currentWeekMins += s.getDurationMinutes();
            } else if (s.getStartTime().isAfter(twoWeeksAgo) && s.getStartTime().isBefore(oneWeekAgo)) {
                lastWeekMins += s.getDurationMinutes();
            }
        }

        if (lastWeekMins == 0 && currentWeekMins > 0) {
             return new InsightDTO("Great Start!", "You logged " + (currentWeekMins / 60.0 > 1 ? String.format("%.1f", currentWeekMins / 60.0) + " hours" : currentWeekMins + " minutes") + " this week. Keep establishing the baseline.", "POSITIVE", "TREND_UP");
        }
        
        if (lastWeekMins == 0) return null;

        double change = ((double)(currentWeekMins - lastWeekMins) / lastWeekMins) * 100;

        if (change > 15) {
            return new InsightDTO(
                "Productivity Spike",
                String.format("You've studied %.1f%% more this week compared to last week. Incredible momentum!", change),
                "POSITIVE",
                "TREND_UP"
            );
        } else if (change < -15) {
            return new InsightDTO(
                "Slight Dip in Volume",
                String.format("Your study hours are down %.1f%% this week. If you're recovering from exams, take the rest. Otherwise, time to gear up!", Math.abs(change)),
                "INFO",
                "TREND_DOWN"
            );
        }

        return new InsightDTO(
            "Stable Output",
            "Your weekly study volume matches last week perfectly. You've found a sustainable equilibrium.",
            "POSITIVE",
            "TREND_UP"
        );
    }
}
