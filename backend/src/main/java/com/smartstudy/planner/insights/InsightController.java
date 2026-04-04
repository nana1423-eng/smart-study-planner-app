package com.smartstudy.planner.insights;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightService insightService;
    private final UserRepository userRepository;

    public InsightController(InsightService insightService, UserRepository userRepository) {
        this.insightService = insightService;
        this.userRepository = userRepository;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<InsightDTO>> getInsights(Authentication auth) {
        return ResponseEntity.ok(insightService.generateInsights(getUser(auth)));
    }
}
