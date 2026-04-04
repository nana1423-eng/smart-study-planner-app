package com.smartstudy.planner.analytics;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public AnalyticsController(AnalyticsService analyticsService, UserRepository userRepository) {
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryDTO> getSummary(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getSummary(getUser(auth)));
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<WeeklyTrendDTO>> getWeeklyTrend(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getWeeklyTrend(getUser(auth)));
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectStatsDTO>> getSubjectStats(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getSubjectStats(getUser(auth)));
    }
}
