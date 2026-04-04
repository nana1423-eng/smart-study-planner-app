package com.smartstudy.planner.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = true)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(nullable = false)
    private String passwordHash;

    @Column(name = "preferences", columnDefinition = "TEXT")
    private String preferences;

    private Integer dailyHours;
    
    // morning, evening, night
    private String preferredTime;

    private Integer points = 0;
    private Integer streak = 0;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "is_email_verified", columnDefinition = "boolean default false")
    private boolean isEmailVerified = false;
}
