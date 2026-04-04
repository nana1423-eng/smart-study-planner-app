package com.smartstudy.planner.user;

import org.springframework.http.ResponseEntity;
import java.util.Objects;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;


@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Securely fetches the authenticated user's full entity
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Handles the frontend put request securely mapping fields
    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<User> updateUserProfile(@RequestBody ProfileUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .map(user -> {
                    // Update the custom fields mapping
                    if (request.getPreferences() != null) user.setPreferences(request.getPreferences());
                    if (request.getPreferredTime() != null) user.setPreferredTime(request.getPreferredTime());
                    if (request.getDailyHours() != null) user.setDailyHours(request.getDailyHours());
                    
                    User savedUser = Objects.requireNonNull(userRepository.save(user));
                    return ResponseEntity.ok(savedUser);
                })
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "User not found"));
    }

    public static class ProfileUpdateRequest {
        private String preferences;
        private String preferredTime;
        private Integer dailyHours;

        public String getPreferences() { return preferences; }
        public void setPreferences(String preferences) { this.preferences = preferences; }

        public String getPreferredTime() { return preferredTime; }
        public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }

        public Integer getDailyHours() { return dailyHours; }
        public void setDailyHours(Integer dailyHours) { this.dailyHours = dailyHours; }
    }
}

