package com.smartstudy.planner.scheduler;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduler")
public class SchedulerController {

    private final SchedulerService schedulerService;
    private final UserRepository userRepository;

    public SchedulerController(SchedulerService schedulerService, UserRepository userRepository) {
        this.schedulerService = schedulerService;
        this.userRepository = userRepository;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<ScheduledSession>> getSchedule(Authentication auth) {
        return ResponseEntity.ok(schedulerService.getSchedule(getUser(auth)));
    }

    @PostMapping("/generate")
    public ResponseEntity<List<ScheduledSession>> generateSchedule(Authentication auth) {
        return ResponseEntity.ok(schedulerService.generateSchedule(getUser(auth)));
    }

    public static class MoveRequest {
        public java.time.LocalDate date;
        public java.time.LocalTime startTime;
    }

    @PutMapping("/{id}/move")
    public ResponseEntity<ScheduledSession> moveSession(@PathVariable Long id, @RequestBody MoveRequest req, Authentication auth) {
        return ResponseEntity.ok(schedulerService.moveSession(id, getUser(auth), req.date, req.startTime));
    }
}
