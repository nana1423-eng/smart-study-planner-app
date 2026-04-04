package com.smartstudy.planner.goal;

import com.smartstudy.planner.session.StudySession;
import com.smartstudy.planner.session.StudySessionRepository;
import com.smartstudy.planner.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.time.DayOfWeek;
import java.time.temporal.TemporalAdjusters;

@Service
public class GoalService {
    
    private final GoalRepository goalRepository;
    private final StudySessionRepository studySessionRepository;

    public GoalService(GoalRepository goalRepository, StudySessionRepository studySessionRepository) {
        this.goalRepository = goalRepository;
        this.studySessionRepository = studySessionRepository;
    }

    public Goal createGoal(User user, GoalRequest request) {
        Goal goal = new Goal();
        goal.setUser(user);
        goal.setType(request.getType());
        goal.setPeriod(request.getPeriod());
        goal.setTargetValue(request.getTargetValue());
        goal.setSubjectId(request.getSubjectId());
        return goalRepository.save(goal);
    }

    public List<Goal> getGoals(User user) {
        return goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public List<GoalProgressDTO> getGoalsProgress(User user) {
        List<Goal> goals = goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(user.getId(), "COMPLETED");
        
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        List<GoalProgressDTO> progressList = new ArrayList<>();
        
        for (Goal goal : goals) {
            int currentMins = 0;
            
            for (StudySession s : sessions) {
                if (s.getDurationMinutes() == null || !"STUDY".equals(s.getType())) continue;
                if (s.getStartTime() == null) continue;

                LocalDate sessionDate = s.getStartTime().toLocalDate();
                boolean matchesPeriod = false;

                if ("DAILY".equalsIgnoreCase(goal.getPeriod())) {
                    matchesPeriod = sessionDate.isEqual(today);
                } else if ("WEEKLY".equalsIgnoreCase(goal.getPeriod())) {
                    matchesPeriod = !sessionDate.isBefore(startOfWeek) && !sessionDate.isAfter(today);
                }

                if (matchesPeriod) {
                    // Check if there is a subject filter
                    if (goal.getSubjectId() != null) {
                        if (s.getSubject() != null && s.getSubject().getId().equals(goal.getSubjectId())) {
                            currentMins += s.getDurationMinutes();
                        }
                    } else {
                        currentMins += s.getDurationMinutes();
                    }
                }
            }

            int percentage = 0;
            if (goal.getTargetValue() != null && goal.getTargetValue() > 0) {
                percentage = (int) Math.round((currentMins * 100.0) / goal.getTargetValue());
            }

            progressList.add(new GoalProgressDTO(
                goal.getId(), 
                goal.getType(), 
                goal.getPeriod(), 
                goal.getTargetValue(), 
                currentMins, 
                percentage, 
                goal.getSubjectId()
            ));
        }

        return progressList;
    }
}
