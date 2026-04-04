package com.smartstudy.planner.goal;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;
    private final UserRepository userRepository;

    public GoalController(GoalService goalService, UserRepository userRepository) {
        this.goalService = goalService;
        this.userRepository = userRepository;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody GoalRequest req, Authentication auth) {
        return ResponseEntity.ok(goalService.createGoal(getUser(auth), req));
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getGoals(Authentication auth) {
        return ResponseEntity.ok(goalService.getGoals(getUser(auth)));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<GoalProgressDTO>> getGoalsProgress(Authentication auth) {
        return ResponseEntity.ok(goalService.getGoalsProgress(getUser(auth)));
    }
}
