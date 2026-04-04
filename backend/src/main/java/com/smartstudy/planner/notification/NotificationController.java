package com.smartstudy.planner.notification;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, 
                                  NotificationRepository notificationRepository, 
                                  UserRepository userRepository) {
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication auth) {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(getUser(auth).getId()));
    }

    @PostMapping("/generate")
    public ResponseEntity<List<Notification>> generateNotifications(Authentication auth) {
        return ResponseEntity.ok(notificationService.generateIntelligentNotifications(getUser(auth)));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<?> markAsRead(@RequestBody Map<String, List<Long>> request, Authentication auth) {
        User user = getUser(auth);
        List<Long> ids = request.get("ids");
        if (ids != null && !ids.isEmpty()) {
            List<Notification> notifications = notificationRepository.findAllById(ids);
            for (Notification n : notifications) {
                if (n.getUser().getId().equals(user.getId())) {
                    n.setRead(true);
                }
            }
            notificationRepository.saveAll(notifications);
        }
        return ResponseEntity.ok().build();
    }
}
